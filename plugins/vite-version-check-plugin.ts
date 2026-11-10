import type { Plugin } from 'vite'

export interface VersionCheckPluginOptions {
	fileName?: string
	/** 每次完成版本检测时在浏览器端触发，参数依次为当前版本和远端版本。 */
	onVersionCheck?: (
		oldVersion: string,
		newVersion: string
	) => void | Promise<void>
}

const VIRTUAL_MODULE_ID = 'virtual:vite-version-check'
const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`

function serializeVersionCheckCallback(
	callback: VersionCheckPluginOptions['onVersionCheck']
): string {
	if (!callback) return 'undefined'

	const callbackSource = callback.toString().trim()
	const isFunctionExpression = /^(async\s+)?function\b/.test(callbackSource)
	const isArrowFunction = /^(async\s+)?(\([^)]*\)|[$\w]+)\s*=>/.test(
		callbackSource
	)
	if (isFunctionExpression || isArrowFunction) return callbackSource

	// 对象方法的 toString 结果不是独立表达式，需要转换成可注入客户端的函数。
	const parameterStartIndex = callbackSource.indexOf('(')
	if (parameterStartIndex === -1) {
		throw new TypeError(
			'[Version Check Plugin] Invalid onVersionCheck callback'
		)
	}
	const asyncPrefix = callbackSource.startsWith('async ') ? 'async ' : ''
	return `${asyncPrefix}function${callbackSource.slice(parameterStartIndex)}`
}

export default function viteVersionCheckPlugin(
	options: VersionCheckPluginOptions = {}
): Plugin {
	const fileName = options.fileName || 'version.json'
	const onVersionCheck = serializeVersionCheckCallback(options.onVersionCheck)
	// 构建产物和运行时模块共用同一版本，避免依赖本地缓存判断页面是否过期。
	const currentVersion = `${Date.now()}-${Math.random().toString(36).slice(2)}`

	return {
		name: 'vite-version-check-plugin',
		apply: 'build',
		resolveId(id) {
			if (id === VIRTUAL_MODULE_ID) return RESOLVED_VIRTUAL_MODULE_ID
		},
		load(id) {
			if (id !== RESOLVED_VIRTUAL_MODULE_ID) return

			return `
const currentVersion = ${JSON.stringify(currentVersion)}
const versionFileName = ${JSON.stringify(fileName)}
const onVersionCheck = ${onVersionCheck}
let checking = false
let reloading = false

// 基于 Vite 的部署基础路径定位版本文件，兼容应用部署在子目录的场景。
const versionUrl = new URL(versionFileName, new URL(import.meta.env.BASE_URL, window.location.href))

const checkVersion = async () => {
	if (checking || reloading) return
	checking = true

	try {
		versionUrl.searchParams.set('t', String(Date.now()))
		const response = await fetch(versionUrl, { cache: 'no-store' })
		if (!response.ok) throw new Error('Version request failed with status ' + response.status)

		const data = await response.json()
		if (typeof data.version !== 'string') throw new Error('Invalid version response')

		// 每次成功读取远端版本都通知业务方，不以版本是否变化作为触发条件。
		if (onVersionCheck) {
			try {
				await onVersionCheck(currentVersion, data.version)
			} catch (error) {
				console.error('[Version Check Plugin] onVersionCheck failed:', error)
			}
		}
		if (data.version === currentVersion) return

		// 标记刷新状态，避免多个检测事件同时触发重复刷新。
		reloading = true
		window.location.reload()
	} catch (error) {
		console.error('[Version Check Plugin] Version check failed:', error)
	} finally {
		checking = false
	}
}

document.addEventListener('visibilitychange', () => {
	if (document.visibilityState === 'visible') checkVersion()
})
window.addEventListener('online', checkVersion)
window.addEventListener('popstate', checkVersion)
window.addEventListener('hashchange', checkVersion)

// Vue Router 通过 History API 切换页面，浏览器不会主动派发 popstate 事件。
for (const method of ['pushState', 'replaceState']) {
	const originalMethod = history[method]
	history[method] = function (...args) {
		const result = originalMethod.apply(this, args)
		checkVersion()
		return result
	}
}

checkVersion()
`
		},
		transformIndexHtml: {
			order: 'pre',
			handler() {
				// 在 Vite 处理 HTML 前注入，使虚拟模块继续进入构建流程。
				return [
					{
						tag: 'script',
						attrs: {
							type: 'module'
						},
						children: `import ${JSON.stringify(VIRTUAL_MODULE_ID)}`,
						injectTo: 'head-prepend'
					}
				]
			}
		},
		generateBundle() {
			const content = JSON.stringify({ version: currentVersion }, null, 2)
			this.emitFile({
				type: 'asset',
				fileName,
				source: content
			})
			console.log(
				`[Version Check Plugin] Created ${fileName}: ${currentVersion}`
			)
		}
	}
}

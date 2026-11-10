import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import postcssPresetEnv from 'postcss-preset-env'
import { resolve } from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import postcsspxtoviewport from 'postcss-px-to-viewport-8-plugin'
import compression from 'vite-plugin-compression'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import viteVersionCheckPlugin from './plugins/vite-version-check-plugin'

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd())
	const isProd = mode === 'prod'
	// 保留图标插件的生成逻辑，仅在加载其虚拟模块时扫描图标目录。
	const svgIconsPlugin = createSvgIconsPlugin({
		// 指定需要缓存的图标文件夹
		iconDirs: [
			resolve(process.cwd(), 'src/assets/icons-h5'),
			resolve(process.cwd(), 'src/assets/icons-pc')
		],
		// 指定symbolId格式
		symbolId: 'icon-[dir]-[name]'
	})
	const loadSvgIcons = svgIconsPlugin.load
	// 插件 2.0.1 会在普通模块的 load 阶段重复扫描，此处提前跳过无关模块。
	svgIconsPlugin.load = function (id, options) {
		if (
			!id.endsWith('virtual:svg-icons-register') &&
			!id.endsWith('virtual:svg-icons-names')
		) {
			return null
		}
		if (typeof loadSvgIcons === 'function') {
			return loadSvgIcons.call(this, id, options)
		}
		return loadSvgIcons?.handler.call(this, id, options)
	}
	return {
		base: env.VITE_BASE_URL,
		resolve: {
			alias: {
				'@': resolve('src')
			}
		},
		plugins: [
			vue(),
			Components({
				dts: 'src/type/components.d.ts',
				resolvers: [VantResolver({ importStyle: false }), ElementPlusResolver()]
			}),
			// 自动导入api
			AutoImport({
				resolvers: [VantResolver(), ElementPlusResolver()],
				imports: ['vue', 'vue-router'],
				dts: 'src/type/auto-imports.d.ts'
			}),
			svgIconsPlugin,
			compression({
				verbose: true,
				disable: false,
				threshold: 10240,
				algorithm: 'gzip',
				ext: '.gz'
			}),
			viteVersionCheckPlugin({
				onVersionCheck: (oldVersion: string, newVersion: string) => {
					console.log(
						`versin-check:【old】:${oldVersion}、【new】:${newVersion}`
					)
				}
			})
		],
		css: {
			postcss: {
				plugins: [
					postcssPresetEnv({
						stage: 3,
						features: {
							'custom-properties': false
						},
						// 由预设内置的 autoprefixer 统一补全前缀，保留原有浏览器和 Grid 兼容配置。
						autoprefixer: {
							overrideBrowserslist: [
								'Android 4.1',
								'iOS 7.1',
								'Chrome > 31',
								'ff > 31',
								'ie >= 10'
							],
							grid: true
						}
					}),
					postcsspxtoviewport({
						unitToConvert: 'px',
						viewportWidth: 375,
						unitPrecision: 5,
						propList: ['*'],
						viewportUnit: 'vw',
						fontViewportUnit: 'vw',
						selectorBlackList: [/\.ifont(?![\w-])/, /\.el-/],
						minPixelValue: 1,
						mediaQuery: true,
						replace: true,
						exclude: [
							/(?:^|[\\/])node_modules[\\/]element-plus[\\/]/,
							/(?:^|[\\/])src[\\/][^\\/]+-pc[\\/]/
						],
						include: undefined,
						landscape: false,
						landscapeUnit: 'vw',
						landscapeWidth: 1920
					})
				]
			},
			preprocessorOptions: {
				less: {
					modifyVars: {},
					javascriptEnabled: true
				}
			}
		},
		server: {
			host: true,
			port: 80,
			open: true,
			proxy: {
				'/api': {
					target: 'http://testoffice.chaoxing.com',
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, '')
				}
			}
		},
		build: {
			chunkSizeWarningLimit: 1000,
			sourcemap: false,
			minify: 'terser',
			assetsDir: 'static',
			assetsInlineLimit: 1024 * 5,
			terserOptions: {
				compress: {
					drop_console: !isProd,
					drop_debugger: !isProd
				}
			},
			rollupOptions: {
				output: {
					manualChunks(id) {
						if (id.indexOf('node_modules') !== -1) {
							return id
								.toString()
								.split('node_modules/')[1]
								.split('/')[0]
								.toString()
						}
					},
					chunkFileNames: (chunkInfo) => {
						const facadeModuleId = chunkInfo.facadeModuleId
							? chunkInfo.facadeModuleId.split('/')
							: []
						const fileName =
							facadeModuleId[facadeModuleId.length - 2] || '[name]'
						return `js/${fileName}/[name].[hash].js`
					}
				}
			}
		}
	}
})

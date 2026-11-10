import { render as renderVNode, Component, App } from 'vue'
import router from '@/router'

// 单个动态组件实例的卸载入口，供主动销毁及路由清理复用。
type DestroyFn = () => void
// 主应用的挂载容器，Vue 在 mount 完成后自动写入所属应用实例。
interface AppContainer extends HTMLElement {
	// Vue 3.5 的挂载标记，用于组件实例之外的命令式渲染获取应用上下文。
	__vue_app__?: App
}
// 所有动态组件共用实例集合，各实例保留独立的卸载入口。
const destroyFns = new Set<DestroyFn>()
// 首次渲染时再注册路由清理，避免模块循环依赖时提前访问 router。
let routeCleanupRegistered = false
// 为指定组件提供独立渲染入口，每次渲染返回该实例的 destroy 方法。
export const useComponentRender = <T extends { onClose?: () => void }>(
	component: Component
) => {
	// 在 setup 内创建时记住所属应用，事件回调渲染时仍可继承其上下文。
	const ownerContext = getCurrentInstance()?.appContext
	// 以传入的属性挂载新实例，组件关闭时自动卸载。
	const render = (props: T) => {
		const appContainer = document.querySelector<AppContainer>('#app')
		// 模块级创建的入口延迟读取主应用，兼容事件回调中没有当前组件实例的情况。
		const appContext =
			ownerContext ??
			getCurrentInstance()?.appContext ??
			appContainer?.__vue_app__?._context
		if (!appContext) {
			throw new Error('请在应用挂载后渲染组件')
		}
		// 所有动态组件共用一次路由清理，切换完成后销毁旧页面实例。
		if (!routeCleanupRegistered) {
			router.afterEach((_to, _from, failure) => {
				// 守卫拦截的导航仍停留在当前页，保留刚打开的确认弹窗。
				if (failure) return
				destroyFns.forEach((destroy) => destroy())
				destroyFns.clear()
			})
			routeCleanupRegistered = true
		}
		const container = document.createElement('div')
		appContainer?.append(container)
		// 注销实例并卸载 Vue 节点，最后移除对应的 DOM 容器。
		const destroy = () => {
			destroyFns.delete(destroy)
			renderVNode(null, container)
			container.parentNode?.removeChild(container)
		}
		destroyFns.add(destroy)
		// 保留组件关闭事件约定，业务回调执行后销毁本次渲染的实例。
		const vnode = h(component, {
			...props,
			onClose: () => {
				props.onClose?.()
				destroy()
			}
		})
		vnode.appContext = appContext
		renderVNode(vnode, container)
		return {
			destroy
		}
	}
	return {
		render
	}
}

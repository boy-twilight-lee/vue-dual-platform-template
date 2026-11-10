import { isObject } from 'lodash-es'

export const getUserAgent = () => navigator.userAgent

export const isAndroid = () => getUserAgent().toLowerCase().includes('android')

export const isHarmony = () =>
	/harmonyos|openharmony|arkweb/.test(getUserAgent().toLowerCase())

export const isIos = () => /\(i[^;]+;( U;)? CPU.+Mac OS X/.test(getUserAgent())

// 判断当前环境是不是学习通客户端
export const isXxt = getUserAgent().includes('ChaoXingStudy')

// 判断是否是学习通移动端
export const isXxtMobile = () => {
	return isXxt && isObject(window.jsBridge)
}

export const setJsBridgeDevice = () => {
	if (!isXxtMobile()) return
	if (isAndroid() || isHarmony()) {
		jsBridge.setDevice('android')
	} else if (isIos()) {
		jsBridge.setDevice('ios')
	}
}

import { useEventListener } from '@vueuse/core'

// 判断设备
export function isDesktopDevice() {
	if (typeof navigator === 'undefined') {
		return true
	}
	const userAgent = navigator.userAgent.toLowerCase()
	const platform = navigator.platform.toLowerCase()
	const maxTouchPoints = navigator.maxTouchPoints || 0
	const isIpadOs = platform === 'macintel' && maxTouchPoints > 1
	const isAppleTablet = /ipad/.test(userAgent) || isIpadOs
	const isApplePhone = /iphone|ipod/.test(userAgent)
	const isWindowsPhone = /windows phone|iemobile|wpdesktop/.test(userAgent)
	const isAndroid = /android|harmonyos/.test(userAgent)
	const isLinuxTouchDevice =
		(/linux/.test(platform) || /x11; linux/.test(userAgent)) &&
		maxTouchPoints > 1
	const isHuaweiTablet =
		/\b(matepad|mediapad|bah[0-9a-z-]*|wgr[0-9a-z-]*|ags[0-9a-z-]*|jdn[0-9a-z-]*|mrx[0-9a-z-]*|scm[0-9a-z-]*|got[0-9a-z-]*|dby[0-9a-z-]*|pal[0-9a-z-]*|vrd[0-9a-z-]*)\b/.test(
			userAgent
		)
	const isTabletKeyword = /tablet|playbook|kindle|silk/.test(userAgent)
	const isCommonAndroidTabletModel =
		/\b(sm-t|lenovo tab|xiaomi pad|redmi pad|oppo pad|vivo pad)\b/.test(
			userAgent
		)
	const isTablet =
		isAppleTablet ||
		isLinuxTouchDevice ||
		isHuaweiTablet ||
		isTabletKeyword ||
		isCommonAndroidTabletModel ||
		(isAndroid && !/mobile/.test(userAgent))
	const isPhone =
		isApplePhone ||
		isWindowsPhone ||
		/blackberry|bb10|webos|opera mini|opera mobi|fennec|mobile|phone/.test(
			userAgent
		) ||
		isAndroid
	if (isTablet || isPhone) {
		return false
	}
	return true
}

// 统一提供当前设备类型，供组件响应式切换桌面和移动端布局。
export const useDevice = () => {
	// 初始值沿用 UA、平台和触摸能力的设备识别规则。
	const isDesktop = ref(isDesktopDevice())
	// 窗口变化时重新判定，监听随调用组件的作用域自动清理。
	useEventListener('resize', () => {
		isDesktop.value = isDesktopDevice()
	})

	return { isDesktop }
}

import { RouteRecordRaw } from 'vue-router'
import { isDesktopDevice } from '@/hooks'

function getRedirect() {
	return isDesktopDevice() ? '/pc-home-list' : '/home-list'
}

export const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		component: () => import('@/layout/index.vue'),
		redirect: getRedirect,
		children: []
	}
]

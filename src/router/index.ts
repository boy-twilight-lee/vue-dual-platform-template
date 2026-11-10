import { isDesktopDevice } from '@/hooks'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

function getRedirect() {
	return isDesktopDevice() ? '/pc-home-list' : '/home-list'
}

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		component: () => import('@/layout/index.vue'),
		redirect: getRedirect,
		children: []
	}
]

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes
})

router.beforeEach(() => {})

export default router

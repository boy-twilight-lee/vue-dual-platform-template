<template>
	<router-view v-if="isDesktop" :key="$route.fullPath" />
	<div v-else class="app-container">
		<router-view v-slot="{ Component }">
			<transition :name="`slide-${diection}`">
				<div class="app-page" :key="$route.fullPath">
					<component :is="Component" />
				</div>
			</transition>
		</router-view>
	</div>
</template>

<script setup lang="ts">
import { useDevice } from '@/hooks'
// 是否pc
const { isDesktop } = useDevice()
// 动画的方向
const diection = ref('')
onBeforeRouteUpdate((to, from) => {
	const toIndex = (to.meta?.index as number) || 0
	const fromIndex = (from.meta?.index as number) || 0
	diection.value = toIndex < fromIndex ? 'left' : 'right'
})
</script>

<style lang="less" scoped>
@import './index.less';
</style>

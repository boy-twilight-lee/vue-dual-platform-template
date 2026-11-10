<template>
	<el-config-provider :locale="zhCn">
		<router-view />
	</el-config-provider>
</template>

<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import VConsole from 'vconsole'
import { useDevice } from './hooks'
// 获取设备类型
const { isDesktop } = useDevice()
// vconsole
onMounted(() => {
	if (
		['prod', 'gray', 'dev'].includes(import.meta.env.MODE) ||
		isDesktop.value
	) {
		return
	}
	new VConsole()
})
</script>

<style lang="less">
html {
	overflow: hidden;
	touch-action: manipulation;
	height: 100%;
	width: 100%;
	body {
		height: 100%;
		width: 100%;
		font-size: 14px;
		font-weight: 400;
		#app {
			height: 100%;
			width: 100%;
		}
	}
}
</style>

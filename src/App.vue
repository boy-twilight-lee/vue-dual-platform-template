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
import { valueToPx, valueToVw } from './utils'
// 获取设备类型
const { isDesktop } = useDevice()
// 虚拟注入节点
let vconsole: VConsole | null = null
// 在根节点自动注入字体大小
watchEffect(() => {
	document.body.style.fontSize = isDesktop.value ? valueToPx(14) : valueToVw(14)
	if (
		['prod', 'gray', 'dev'].includes(import.meta.env.MODE) ||
		isDesktop.value
	) {
		vconsole?.destroy()
	} else {
		vconsole = new VConsole()
	}
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
		font-weight: 400;
		#app {
			height: 100%;
			width: 100%;
		}
	}
}
</style>

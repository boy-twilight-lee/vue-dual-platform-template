<template>
	<svg aria-hidden="true" class="svg-icon">
		<use :xlink:href="symbolId" fill="currentColor" />
	</svg>
</template>

<script lang="ts" setup>
import { isArray, isUndefined } from 'lodash-es'
import { SvgIconProps } from './type'
import { valueToPx, valueToVw } from '@/utils'
import { useDevice } from '@/hooks'
defineOptions({
	name: 'SvgIcon'
})
const props = withDefaults(defineProps<SvgIconProps>(), {
	prefix: 'icon',
	opacity: 1,
	color: 'inherit',
	size: undefined
})
const { size, color, name, prefix } = toRefs(props)
// symbolId
const symbolId = computed(() => `#${prefix.value}-${name.value}`)
// 判断设备
const { isDesktop } = useDevice()
// 宽
const width = computed(() => {
	if (isUndefined(size.value)) return '1em'
	const value = isArray(size.value) ? size.value[0] : size.value
	return isDesktop.value ? valueToPx(value) : valueToVw(value)
})
// 高
const height = computed(() => {
	if (isUndefined(size.value)) return '1em'
	const value = isArray(size.value) ? size.value[1] : size.value
	return isDesktop.value ? valueToPx(value) : valueToVw(value)
})
</script>

<style lang="less" scoped>
.svg-icon {
	display: inline-block;
	overflow: hidden;
	width: v-bind(width);
	height: v-bind(height);
	color: v-bind(color);
}
</style>

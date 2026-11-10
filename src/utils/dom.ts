import { isNumber, isString } from 'lodash-es'

// 将 750 设计稿中的数字、数字字符串或 px 尺寸转为 vw，其他 CSS 单位原样保留。
export const valueToVw = (value: string | number | undefined) => {
	if (
		isNumber(value) ||
		(isString(value) && /^-?\d+(\.\d+)?(px)?$/.test(value))
	) {
		return `${parseFloat(String(value)) / 3.75}vw`
	}
	return value as string
}

// 将value转换px
export const valueToPx = (value: string | number | undefined) => {
	const numberReg = /^-?\d+(\.\d+)?$/
	// 检查是否是数字类型，或者是可以转换为数字的字符串
	if (isNumber(value) || (isString(value) && numberReg.test(value))) {
		return value + 'px'
	}
	return value as string
}

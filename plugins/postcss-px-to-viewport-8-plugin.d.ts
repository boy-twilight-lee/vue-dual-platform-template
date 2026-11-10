// 插件 1.2.5 的声明沿用旧 PostCSS 且遗漏正则选项，按 Vite 使用的接口补齐。
declare module 'postcss-px-to-viewport-8-plugin' {
	import { CSSOptions } from 'vite'
	import { OptionType } from 'postcss-px-to-viewport-8-plugin/lib/types'
	type InlinePostcssOptions = Exclude<CSSOptions['postcss'], string | undefined>
	type PostcssPlugin = Extract<
		NonNullable<InlinePostcssOptions['plugins']>[number],
		{ postcssPlugin: string }
	>
	const postcssPxToViewport: {
		(
			options: Omit<OptionType, 'selectorBlackList'> & {
				selectorBlackList?: (string | RegExp)[]
			}
		): PostcssPlugin
		postcss: boolean
	}
	export default postcssPxToViewport
}

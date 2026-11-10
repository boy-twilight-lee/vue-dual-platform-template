import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import vue from 'eslint-plugin-vue'
import prettier from 'eslint-plugin-prettier/recommended'
import globals from 'globals'

// 沿用原有目录排除范围，避免检查依赖、构建产物和静态资源。
export default [
	{
		ignores: ['**/node_modules/**', 'dist/**', 'public/**', 'src/assets/**']
	},
	js.configs.recommended,
	...typescript.configs['flat/recommended'],
	...vue.configs['flat/essential'],
	prettier,
	{
		files: ['**/*.{vue,js,ts,jsx,tsx}'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: { ...globals.browser, ...globals.node },
			// Vue 文件中的脚本继续交给 TypeScript 解析器处理。
			parserOptions: { parser: typescriptParser }
		},
		// 迁移原有规则，并使用新版规则保留函数类型、装箱类型和空对象的检查约定。
		rules: {
			'vue/multi-word-component-names': 'off',
			'vue/component-name-in-template-casing': [
				'error',
				'kebab-case',
				{ registeredComponentsOnly: false, ignores: [] }
			],
			'@typescript-eslint/no-require-imports': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-empty-object-type': [
				'error',
				{ allowObjectTypes: 'always' }
			],
			'@typescript-eslint/no-unsafe-function-type': 'error',
			'@typescript-eslint/no-wrapper-object-types': 'error',
			'no-undef': 'off',
			'no-debugger': 'off'
		}
	},
	{
		files: ['**/*.{ts,tsx,vue}'],
		// 项目要求异步操作在当前函数捕获错误，允许捕获后继续向调用方抛出。
		rules: { 'no-useless-catch': 'off' }
	}
]

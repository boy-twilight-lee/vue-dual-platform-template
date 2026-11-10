import { App } from 'vue'
import _SvgIcon from './index.vue'
import 'virtual:svg-icons-register'

const SvgIcon = Object.assign(_SvgIcon, {
	install(app: App) {
		app.component(_SvgIcon.name as string, _SvgIcon)
	}
})

declare module 'vue' {
	export interface GlobalComponents {
		SvgIcon: typeof SvgIcon
	}
}

export default SvgIcon

import { isFunction } from 'lodash-es'

export const useTrimmedRef = (
	onGet?: () => string,
	onSet?: (val: string) => void
) => {
	const controlValue = ref('')
	return computed({
		get() {
			return isFunction(onGet) ? onGet() : controlValue.value
		},
		set(val) {
			const tirmValue = val.trim()
			controlValue.value = tirmValue
			onSet?.(tirmValue)
		}
	})
}

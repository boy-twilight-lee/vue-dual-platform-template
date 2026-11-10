import { isUndefined } from 'lodash-es'

// 外部值为 undefined 时使用内部状态，写入后通知调用方。
export const useControlValue = <T>(
	modelValue: Ref<T | undefined>,
	defaultValue: T,
	onSet?: (value: T) => void
) => {
	// 保留泛型值的原始结构，避免深层解包改变 T 的类型。
	const controlValue = ref<T>(defaultValue)
	return computed<T>({
		get() {
			return isUndefined(modelValue.value)
				? controlValue.value
				: modelValue.value
		},
		set(value: T) {
			controlValue.value = value
			onSet?.(value)
		}
	})
}

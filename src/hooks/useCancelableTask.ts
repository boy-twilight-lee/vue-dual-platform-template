// 管理单个在途异步任务，执行与取消逻辑在调用时传入，可跨阶段复用。
export const useCancelableTask = () => {
	// 仅保存当前任务的取消入口，不中止底层请求。
	let cancelPending: ((onCancel?: () => void) => void) | null = null
	// 有在途任务时执行取消回调并以 null 结束等待，回调抛错则拒绝本次任务。
	const cancel = (onCancel?: () => void) => {
		const cancelCurrent = cancelPending
		cancelPending = null
		cancelCurrent?.(onCancel)
	}
	// 竞争任务与取消结果；旧任务结束时不得清除新任务的取消入口。
	const run = async <Result>(
		runTask: () => Promise<Result>
	): Promise<Result | null> => {
		cancel()
		let cancelCurrent: ((onCancel?: () => void) => void) | null = null
		const canceled = new Promise<null>((resolve, reject) => {
			cancelCurrent = (onCancel) => {
				try {
					onCancel?.()
					resolve(null)
				} catch (error) {
					reject(error)
				}
			}
			cancelPending = cancelCurrent
		})
		try {
			return await Promise.race([canceled, runTask()])
		} catch (err) {
			throw err
		} finally {
			cancelPending = cancelPending === cancelCurrent ? null : cancelPending
		}
	}
	// 所属组件卸载时结束等待，避免旧结果回填到已失效的会话。
	onScopeDispose(cancel)
	return { run, cancel }
}

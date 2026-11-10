// 打开weburl
export const openNewWindow = (webUrl: string, title: string) => {
	jsBridge.unbind('CLIENT_OPEN_URL')
	jsBridge.postNotification('CLIENT_OPEN_URL', {
		webUrl,
		toolbarType: 2,
		loadType: 1,
		title
	})
}

// 保存图片到相册
export const saveImageToPhoto = async (file: File) => {
	const image_data = await new Promise<string>((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => {
			if (typeof reader.result !== 'string') {
				reject(new Error('图片读取失败'))
				return
			}
			// 学习通协议只接收 Data URL 逗号后的 Base64 内容
			const separator_index = reader.result.indexOf(',')
			if (separator_index === -1) {
				reject(new Error('图片 Base64 数据格式错误'))
				return
			}
			resolve(reader.result.slice(separator_index + 1))
		}
		reader.onerror = () => reject(reader.error ?? new Error('图片读取失败'))
		reader.onabort = () => reject(new Error('图片读取已取消'))
		reader.readAsDataURL(file)
	})
	jsBridge.unbind('CLIENT_SAVE_IMAGE')
	jsBridge.postNotification('CLIENT_SAVE_IMAGE', {
		imageData: image_data
	})
}

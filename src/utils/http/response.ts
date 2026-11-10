import { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { RequestError, Response } from './type'
import { isUndefined } from 'lodash-es'
// 获取请求的contentType
export const setRequestContentType = (config: InternalAxiosRequestConfig) => {
	if (!isUndefined(config.headers['Content-Type'])) return
	let contentType = ''
	if (config.data) {
		contentType =
			config.data instanceof FormData
				? 'multipart/form-data'
				: 'application/x-www-form-urlencoded'
	} else {
		contentType = 'application/json'
	}
	config.headers.setContentType(contentType)
}
// 是否是jsonBlob
export const isJsonBlob = (data: unknown): data is Blob => {
	return data instanceof Blob && data.type.includes('application/json')
}
// 获取响应data
export const getResponseData = async (data: unknown): Promise<Response> => {
	if (isJsonBlob(data)) {
		return JSON.parse(await data.text()) as Response
	}
	return data as Response
}
// 是否是合法请求响应
export const isValidResponse = (data: Response) => {
	return data.success === true || data.code === 200
}
// 创建请求error
export const createRequestError = async (
	response: AxiosResponse
): Promise<RequestError> => {
	const {
		status,
		config: { url, method }
	} = response
	const { code, message, msg, data } = await getResponseData(response.data)
	handleBusinessCode(code)
	return {
		url,
		method,
		status,
		code,
		message: msg || message || '请求错误！',
		data
	}
}
export const handleBusinessCode = (_code: number) => {}

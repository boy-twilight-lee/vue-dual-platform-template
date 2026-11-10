import axios, { AxiosResponse } from 'axios'
import {
	createRequestError,
	setRequestContentType,
	isJsonBlob,
	isValidResponse
} from './response'
import { HttpInstance, Response } from './type'
// 创建axios实例
const service = axios.create({
	baseURL: import.meta.env.VITE_BASE_API,
	timeout: 15000,
	withCredentials: false
}) as HttpInstance
// axios实例拦截请求
service.interceptors.request.use(
	(config) => {
		setRequestContentType(config)
		return config
	},
	(err) => {
		return Promise.reject(err)
	}
)
// axios实例拦截响应
service.interceptors.response.use(
	async (response): Promise<AxiosResponse> => {
		const responseData = response.data as Response
		if (isJsonBlob(responseData)) {
			const error = await createRequestError(response)
			return Promise.reject(error)
		}
		if (responseData instanceof Blob) {
			return responseData as unknown as AxiosResponse
		}
		if (!isValidResponse(responseData)) {
			const error = await createRequestError(response)
			return Promise.reject(error)
		}
		return responseData as unknown as AxiosResponse
	},
	async (err) => {
		if (err.response) {
			const error = await createRequestError(err.response)
			return Promise.reject(error)
		}
		if (err.request) {
			return Promise.reject({
				message: '网络异常或请求超时',
				isNetworkError: true
			})
		}
		return Promise.reject({
			message: err.message || '请求配置错误',
			isConfigError: true
		})
	}
)
export { service }

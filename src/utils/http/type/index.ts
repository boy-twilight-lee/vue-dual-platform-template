import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export interface Response<T = any> {
	code: number
	message: string
	data: T
	msg?: string
	success?: boolean
}

export interface RequestError {
	code: number
	message: string
	data: Response['data']
	url?: string
	method?: string
	status?: number
}

export interface HttpInstance extends Omit<AxiosInstance, 'request' | 'get' | 'delete' | 'head' | 'options' | 'post' | 'put' | 'patch'> {
	request<T = any, R = Response<T>, D = unknown>(config: AxiosRequestConfig<D>): Promise<R>
	get<T = any, R = Response<T>, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<R>
	delete<T = any, R = Response<T>, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<R>
	head<T = any, R = Response<T>, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<R>
	options<T = any, R = Response<T>, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<R>
	post<T = any, R = Response<T>, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>
	put<T = any, R = Response<T>, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>
	patch<T = any, R = Response<T>, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>
	<T = any, R = Response<T>, D = unknown>(config: AxiosRequestConfig<D>): Promise<R>
	<T = any, R = Response<T>, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<R>
}

export type HttpResponse<T = any> = AxiosResponse<Response<T>, unknown> & {
	config: InternalAxiosRequestConfig
}

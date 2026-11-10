type JSBridgeDevice = 'ios' | 'android'

type JSBridgeUserInfo = Record<string, any>

type JSBridgeCallback<T = JSBridgeUserInfo> = (userInfo: T) => void

interface JSBridgeNotification<T = JSBridgeUserInfo> {
	name: string
	userInfo: T
}

interface JSBridge {
	device: JSBridgeDevice
	callbackDict: Record<string, JSBridgeCallback[]>
	notificationIdCount: number
	notificationDict: Record<number, JSBridgeNotification>
	postNotification<T = JSBridgeUserInfo>(name: string, userInfo: T): void
	popNotificationObject(notificationId: number | string): string
	trigger<T = JSBridgeUserInfo>(name: string, userInfo: T): void
	setDevice(device: JSBridgeDevice): void
	bind<T = JSBridgeUserInfo>(name: string, callback: JSBridgeCallback<T>): void
	unbind<T = JSBridgeUserInfo>(name: string, callback?: JSBridgeCallback<T>): void
}

declare const jsBridge: JSBridge

interface Window {
	jsBridge: JSBridge
}

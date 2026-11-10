// 读取 Cookie
export function getCookie(name: string) {
	if (document.cookie.length > 0) {
		const cookies = document.cookie.split('; ')
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].split('=')
			if (name === cookie[0]) {
				return unescape(cookie[1])
			}
		}
		return ''
	}
}

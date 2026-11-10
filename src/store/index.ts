import { createPinia } from 'pinia'

// 应用共享的 Pinia 实例，由入口统一安装，所有 store 复用该实例。
const pinia = createPinia()

export default pinia

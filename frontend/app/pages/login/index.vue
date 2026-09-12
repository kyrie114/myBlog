<template>
        <div class="flex justify-center mt-52 flex-col items-center">
                <!-- 加载状态 -->
                <div v-if="loading" class="flex flex-col items-center">
                        <a-spin size="large"/>
                        <p class="mx-auto mt-3 text-gray-600">{{ loadingText }}</p>
                </div>
                <!-- 错误状态 -->
                <div v-else-if="error" class="flex flex-col items-center max-w-md mx-auto p-6">
                        <a-result :sub-title="errorMessage" :title="errorTitle" status="error">
                                <template #extra>
                                        <a-button type="primary" @click="retryLogin">重试</a-button>
                                        <a-button @click="goHome">返回首页</a-button>
                                </template>
                        </a-result>
                </div>
        </div>
</template>


<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {useRoute} from 'vue-router'
import {authApi} from '~/api/user/authApi'

// API 响应类型定义
interface ApiResponse<T = any> {
        success: boolean
        data: T
        errorMsg?: string
        code?: number
}

const route = useRoute()
const config = useRuntimeConfig()

// 状态管理
const loading = ref(true)
const loadingText = ref('正在登录...')
const error = ref(false)
const errorTitle = ref('登录失败')
const errorMessage = ref('')

// 存储登录参数，用于重试
const loginParams = ref({
        code: '',
        redirectUrl: '',
        remember: false
})

/**
 * 检测浏览器存储是否可用
 */
const isStorageAvailable = (type: 'localStorage' | 'sessionStorage'): boolean => {
        try {
                const storage = window[type]
                const testKey = '__storage_test__'
                storage.setItem(testKey, 'test')
                storage.removeItem(testKey)
                return true
        } catch (e) {
                console.error(`${type} 不可用:`, e)
                return false
        }
}

/**
 * 显示错误信息
 */
const showError = (title: string, message: string) => {
        error.value = true
        errorTitle.value = title
        errorMessage.value = message
        loading.value = false
}

/**
 * 验证 token 是否正确存储
 */
const validateTokenStorage = (token: string, remember: boolean): { success: boolean; error?: string } => {
        // 检查 storage 是否可用
        const storageType = remember ? 'localStorage' : 'sessionStorage'
        if (!isStorageAvailable(storageType)) {
                return {success: false, error: `${storageType} 存储不可用`}
        }

        // 获取存储的 token
        const storage = window[storageType]
        const storedToken = storage.getItem('token')

        // 验证1: token 是否成功存储
        if (!storedToken) {
                return {success: false, error: 'Token 存储失败，未能写入存储'}
        }

        // 验证2: token 值是否匹配
        if (storedToken !== token) {
                return {
                        success: false,
                        error: `Token 存储值不匹配，预期 ${token.length} 字符，实际 ${storedToken.length} 字符`
                }
        }

        // 验证3: token 长度是否一致
        if (storedToken.length !== token.length) {
                return {success: false, error: 'Token 长度不一致，可能存在编码问题'}
        }

        // 验证4: 重新读取确认（双重确认）
        const reReadToken = storage.getItem('token')
        if (reReadToken !== token) {
                return {success: false, error: 'Token 重新读取不一致'}
        }

        return {success: true}
}

/**
 * 清理所有登录相关存储
 */
const clearAuthStorage = () => {
        try {
                localStorage.removeItem('token')
                sessionStorage.removeItem('token')
                localStorage.removeItem('login_status')
                localStorage.removeItem('session_login_trigger')
                localStorage.removeItem('remember')
        } catch (e) {
                console.error('清理存储失败:', e)
        }
}

/**
 * 检查存储一致性 - 多次验证确保存储稳定
 */
const checkStorageConsistency = async (token: string, remember: boolean): Promise<boolean> => {
        const maxChecks = 3
        const checkDelay = 150

        for (let i = 0; i < maxChecks; i++) {
                await new Promise(resolve => setTimeout(resolve, checkDelay))

                const storage = remember ? localStorage : sessionStorage
                const storedToken = storage.getItem('token')

                if (!storedToken) {
                        console.log(`第 ${i + 1} 次检查：Token 不存在`)
                        return false
                }

                if (storedToken !== token) {
                        console.log(`第 ${i + 1} 次检查：Token 不匹配`)
                        return false
                }

                if (storedToken.length !== token.length) {
                        console.log(`第 ${i + 1} 次检查：Token 长度不一致`)
                        return false
                }

        }

        return true
}

/**
 * 执行登录流程
 */
const performLogin = async (code: string, _redirectUrl: string, remember: boolean) => {
        loading.value = true
        loadingText.value = '正在获取授权...'

        try {
                // 步骤1: 获取 token
                const result = await authApi.getToken(code, remember) as unknown as ApiResponse

                // 校验1: 检查返回结果是否存在
                if (!result) {
                        showError('登录失败', '服务器未返回有效响应，请稍后重试')
                        return false
                }

                // 校验2: 检查返回是否成功
                if (!result.success) {
                        showError('登录失败', result.errorMsg || '授权请求失败')
                        return false
                }

                // 校验3: 检查 data 是否存在
                if (!result.data) {
                        showError('登录失败', '服务器响应数据格式错误')
                        return false
                }

                // 校验4: 检查 token 是否存在且有效
                const token = result.data.token
                if (!token || typeof token !== 'string' || token.trim() === '') {
                        showError('登录失败', '未获取到有效的授权令牌')
                        return false
                }


                // 步骤2: 清理旧存储，准备存储新 token
                clearAuthStorage()

                // 步骤3: 存储 token
                loadingText.value = '正在保存登录状态...'
                const storageType = remember ? 'localStorage' : 'sessionStorage'

                // 优先使用 storage 存储
                if (remember) {
                        localStorage.setItem('token', token)
                } else {
                        sessionStorage.setItem('token', token)
                }
                localStorage.setItem('remember', remember.toString())
                console.log(`Token 已存储到 ${storageType}`)

                // 步骤4: 验证存储是否成功
                loadingText.value = '正在验证登录状态...'

                // 等待存储操作完成
                await new Promise(resolve => setTimeout(resolve, 200))

                // 重试验证，最多尝试3次
                let validation = validateTokenStorage(token, remember)
                let retryCount = 0
                const maxRetries = 3

                while (!validation.success && retryCount < maxRetries) {
                        retryCount++

                        await new Promise(resolve => setTimeout(resolve, 300))

                        // 重新存储
                        if (remember) {
                                localStorage.setItem('token', token)
                        } else {
                                sessionStorage.setItem('token', token)
                        }
                        localStorage.setItem('remember', remember.toString())

                        // 再次验证
                        validation = validateTokenStorage(token, remember)
                }

                if (!validation.success) {

                        clearAuthStorage()
                        showError('登录失败', validation.error || 'Token 存储验证失败')
                        return false
                }


                // 步骤5: 触发登录状态通知
                loadingText.value = '正在完成登录...'
                await new Promise(resolve => setTimeout(resolve, 100))

                try {
                        if (remember) {
                                localStorage.setItem('login_status', Date.now().toString())
                        } else {
                                localStorage.setItem('session_login_trigger', Date.now().toString())
                        }
                } catch (e) {
                        console.warn('触发通知失败（非致命）:', e)
                }

                // 步骤6: 最终验证 - 确保所有数据都已正确存储
                loadingText.value = '登录成功，正在跳转...'

                // 多次确认存储成功
                const finalCheck = await checkStorageConsistency(token, remember)
                if (!finalCheck) {

                        clearAuthStorage()
                        showError('登录失败', '登录状态保存异常，请重试')
                        return false
                }

                return true

        } catch (err) {
                console.error('登录过程发生错误:', err)
                clearAuthStorage()

                let errMsg = '登录过程中发生未知错误'
                if (err instanceof Error) {
                        errMsg = err.message
                        console.error('错误详情:', err.stack)
                }

                showError('登录失败', errMsg)
                return false
        }
}

/**
 * 重试登录
 */
const retryLogin = async () => {
        if (!loginParams.value.code || !loginParams.value.redirectUrl) {
                showError('无法重试', '缺少登录参数，请重新发起登录')
                return
        }

        const success = await performLogin(
            loginParams.value.code,
            loginParams.value.redirectUrl,
            loginParams.value.remember
        )

        if (success) {
                window.location.href = decodeURIComponent(loginParams.value.redirectUrl)
        }
}

/**
 * 返回首页
 */
const goHome = () => {
        window.location.href = '/'
}

onMounted(async () => {
        const code = (route.query.code as string) || ''
        const redirectUrl = (route.query.redirect_url as string) || ''
        const logout = (route.query.logout as string) || ''
        const remember = route.query.remember === 'true'

        // 处理 logout 参数
        if (logout === 'true') {
                loadingText.value = '正在退出登录...'
                clearAuthStorage()
                localStorage.setItem('logout_trigger', Date.now().toString())
                localStorage.removeItem('logout_trigger')
                window.location.href = '/'
                return
        }

        // 处理 back 参数，直接跳转到主页
        if (route.query.back === 'true') {
                window.location.href = '/'
                return
        }

        // 处理登录
        if (code && redirectUrl) {
                // 保存登录参数用于重试
                loginParams.value = {code, redirectUrl, remember}

                const success = await performLogin(code, redirectUrl, remember)

                if (success) {
                        window.location.href = decodeURIComponent(redirectUrl)
                }
                return
        }

        // 没有有效参数，跳转到登录页
        const webBase = config.public.webBase
        window.location.href = `${webBase}/login`
})
</script>


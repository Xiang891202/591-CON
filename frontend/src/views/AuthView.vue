<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../store/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const errorMsg = ref('')

const handleLogin = async () => {
  try {
    await authStore.login(email.value, password.value)
    router.push('/') // 登入成功後跳轉首頁
  } catch (err) {
    errorMsg.value = err.response?.data?.message || '登入失敗'
  }
}
</script>
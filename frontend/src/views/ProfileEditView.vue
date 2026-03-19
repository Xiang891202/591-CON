<template>
  <div class="profile-edit">
    <h2>編輯個人資料</h2>
    <form @submit.prevent="handleSubmit">
      <!-- 姓名（可編輯） -->
      <div class="form-group">
        <label>姓名：</label>
        <input v-model="form.name" type="text" required />
      </div>

      <!-- 電子郵件（唯讀） -->
      <div class="form-group">
        <label>電子郵件：</label>
        <input :value="form.email" type="email" readonly disabled class="readonly-field" />
        <!-- <small class="hint">電子郵件不可變更</small> -->
      </div>

      <!-- 新密碼（可選） -->
      <div class="form-group">
        <label>新密碼：</label>
        <input v-model="form.password" type="password" placeholder="密碼長度至少 6 碼" />
      </div>

      <!-- 確認新密碼 -->
      <div class="form-group" v-if="form.password">
        <label>確認新密碼：</label>
        <input v-model="form.confirmPassword" type="password" />
        <small v-if="passwordMismatch" class="error">兩次輸入的密碼不一致</small>
      </div>

      <div class="actions">
        <button type="submit" :disabled="authStore.loading || !!passwordMismatch">
          {{ authStore.loading ? '儲存中...' : '儲存' }}
        </button>
        <button type="button" @click="$router.push('/profile')" :disabled="authStore.loading">取消</button>
      </div>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const errorMessage = ref('')

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// 密碼不一致檢查
const passwordMismatch = computed(() => {
  if (!form.value.password) return false
  return form.value.password !== form.value.confirmPassword
})

onMounted(() => {
  if (authStore.user) {
    form.value.name = authStore.user.name || ''
    form.value.email = authStore.user.email || ''
  }
})

const handleSubmit = async () => {
  errorMessage.value = ''

  // 構建要傳送的資料（只包含有變更的欄位）
  const updateData = {}
  if (form.value.name !== authStore.user.name) {
    updateData.name = form.value.name
  }
  if (form.value.password && form.value.password.length < 6){
    errorMessage.value = '密碼長度至少 6 碼'
    return
  }
  if (form.value.password) {
    // 若有新密碼，確認一致後才加入
    if (form.value.password !== form.value.confirmPassword) {
      errorMessage.value = '密碼確認不一致'
      return
    }
    updateData.password = form.value.password
  }

  // 如果沒有任何欄位要更新，直接返回
  if (Object.keys(updateData).length === 0) {
    router.push('/profile')
    return
  }

  try {
    await authStore.updateProfile(updateData)
    // 更新成功後登出並導向登入頁（因為可能變更密碼，需重新登入）
    authStore.logout()
    router.push({ name: 'auth', query: { message: '資料已更新，請重新登入' } })
  } catch (error) {
    errorMessage.value = error.response?.data?.message || '更新失敗，請稍後再試'
  }
}
</script>

<style lang="scss" src="@/styles/components/ProfileEditView.scss" scoped></style>
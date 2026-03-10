<!-- src/views/AuthView.vue -->
<template>
  <div class="auth-container">
    <h1>會員專區</h1>
    <div v-if="isLoginMode">
      <h2>登入</h2>
      <form @submit.prevent="handleLogin">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="密碼" required />
        <button type="submit">登入</button>
      </form>
      <p>
        還沒有帳號？
        <a href="#" @click.prevent="toggleMode">立即註冊</a>
      </p>
    </div>
    <div v-else>
      <h2>註冊</h2>
      <form @submit.prevent="handleRegister">
        <input v-model="name" type="text" placeholder="姓名" required />
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="密碼" required />
        <button type="submit">註冊</button>
      </form>
      <p>
        已經有帳號？
        <a href="#" @click.prevent="toggleMode">返回登入</a>
      </p>
    </div>
    <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
// ⚠️ 你需要自行引入 authStore 和 router
import { useAuthStore } from '../store/authStore';
import { useRouter , useRoute } from 'vue-router';

const isLoginMode = ref(true);
const name = ref('');
const email = ref('');
const password = ref('');
const errorMsg = ref('');

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value;
  errorMsg.value = '';
  name.value = '';
  email.value = '';
  password.value = '';
};

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// 表單驗證
const validateForm = () => {
  // 登入模式
  if (isLoginMode.value) {
    if (!email.value) {
      errorMsg.value = '請輸入 Email';
      return false;
    }
    if (!password.value) {
      errorMsg.value = '請輸入密碼';
      return false;
    }
    // 簡單 Email 格式驗證
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      errorMsg.value = 'Email 格式不正確';
      return false;
    }
  } 
  // 註冊模式
  else {
    if (!name.value) {
      errorMsg.value = '請輸入姓名';
      return false;
    }
    if (!email.value) {
      errorMsg.value = '請輸入 Email';
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      errorMsg.value = 'Email 格式不正確';
      return false;
    }
    if (!password.value) {
      errorMsg.value = '請輸入密碼';
      return false;
    }
    if (password.value.length < 6) {
      errorMsg.value = '密碼長度至少 6 碼';
      return false;
    }
  }
  errorMsg.value = ''; // 清空錯誤
  return true;
};

// ⚠️ 你需要自行實作 handleLogin（呼叫 store 的 login）
const handleLogin = async () => {
  // try { await authStore.login(email.value, password.value); 跳轉首頁 }
  if (!validateForm()) {
    return;
  }
  try {
    await authStore.login(email.value, password.value);
    // 取得 redirect 參數，若無則預設跳轉到 '/profile'
    const redirectPath = route.query.redirect || '/profile';
    router.push(redirectPath); // 登入成功後跳轉到指定頁面
  } catch (err) {
    errorMsg.value = '登入失敗，請檢查您的帳號密碼';
  }
  // catch (err) { errorMsg.value = ... }
};


// ⚠️ 你需要自行實作 handleRegister（呼叫 store 的 register）
const handleRegister = async () => {
  if (!validateForm()) {
    return;
  }
  try {
    await authStore.register({ name: name.value, email: email.value, password: password.value });
    // 取得 redirect 參數，若無則預設跳轉到 '/profile'
    const redirectPath = route.query.redirect || '/profile';
    router.push(redirectPath); // 註冊成功後跳轉到指定頁面
  } catch (err) {
    errorMsg.value = '註冊失敗，請稍後再試';
  }
  // 類似 login
};

</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
input {
  padding: 8px;
  font-size: 16px;
}
button {
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
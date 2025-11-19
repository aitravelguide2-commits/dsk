<template>
  <q-page class="login-page">
    <div class="login-background"></div>
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo-container">
            <q-icon name="apartment" size="48px" color="primary" />
          </div>
          <h1 class="login-title">Admin Portal</h1>
          <p class="login-subtitle">Monteurunterkünfte Leipzig</p>
        </div>
        
        <q-form @submit="onSubmit" class="login-form">
          <div class="input-group">
            <q-input 
              v-model="email" 
              type="email" 
              label="E-Mail" 
              outlined 
              required
              bg-color="white"
              class="modern-input"
            >
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
            </q-input>
          </div>
          
          <div class="input-group">
            <q-input 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              label="Passwort" 
              outlined 
              required
              bg-color="white"
              class="modern-input"
            >
              <template v-slot:prepend>
                <q-icon name="lock" />
              </template>
              <template v-slot:append>
                <q-icon 
                  :name="showPassword ? 'visibility_off' : 'visibility'" 
                  class="cursor-pointer"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>
          </div>
          
          <q-btn 
            label="Anmelden" 
            type="submit" 
            color="primary" 
            class="login-btn" 
            :loading="loading" 
            :disable="loading"
            unelevated
            size="lg"
          >
            <template v-slot:loading>
              <q-spinner-dots />
            </template>
          </q-btn>
          
          <q-banner v-if="error" class="error-banner" dense>
            <template v-slot:avatar>
              <q-icon name="error" color="negative" />
            </template>
            {{ error }}
          </q-banner>
        </q-form>
        
        <div class="login-footer">
          <p class="footer-text">© 2024 DSK UG. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../stores/auth.js'
import { useRouter } from 'vue-router'

const auth = useAuth()
const router = useRouter()
const email = ref('admin@site.de')
const password = ref('123456')
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

const onSubmit = async () => {
  error.value = ''
  loading.value = true
  try {
    await auth.login({ email: email.value, password: password.value })
    router.push('/')
  } catch (err) {
    const msg = err?.response?.data?.message || err?.response?.data?.msg || err?.message || 'Login fehlgeschlagen. Bitte erneut versuchen.'
    error.value = msg
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.login-background {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 0;
}

.login-background::before {
  content: '';
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  animation: pulse 15s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.login-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 440px;
  padding: 24px;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 48px 40px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  margin-bottom: 24px;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.logo-container .q-icon {
  color: white !important;
}

.login-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-subtitle {
  font-size: 16px;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.input-group {
  position: relative;
}

.modern-input {
  transition: all 0.3s ease;
}

.modern-input :deep(.q-field__control) {
  border-radius: 12px;
  height: 56px;
}

.modern-input :deep(.q-field__control):hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.modern-input :deep(.q-field__control):focus-within {
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
}

.login-btn {
  height: 56px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  margin-top: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: all 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(102, 126, 234, 0.4);
}

.login-btn:active {
  transform: translateY(0);
}

.error-banner {
  background: #fee2e2;
  color: #991b1b;
  border-radius: 12px;
  border-left: 4px solid #dc2626;
  margin-top: -8px;
}

.login-footer {
  margin-top: 32px;
  text-align: center;
}

.footer-text {
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
}

@media (max-width: 600px) {
  .login-card {
    padding: 32px 24px;
  }
  
  .login-title {
    font-size: 28px;
  }
}
</style>

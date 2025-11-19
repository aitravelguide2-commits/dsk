<template>
  <q-layout view="hHh lpR fFf" class="modern-layout">
    <q-header class="modern-header" elevated>
      <q-toolbar class="toolbar-container">
        <q-btn 
          flat 
          dense 
          round 
          icon="menu" 
          @click="left = !left" 
          class="menu-btn"
        />
        <q-toolbar-title class="toolbar-title">
          <div class="title-container">
            <q-icon name="apartment" size="28px" class="title-icon" />
            <span class="title-text">Admin Portal</span>
          </div>
        </q-toolbar-title>
        <div class="header-actions">
          <q-btn 
            flat 
            dense 
            round 
            icon="notifications" 
            class="action-btn"
          >
            <q-badge color="red" floating>3</q-badge>
          </q-btn>
          <q-separator vertical inset class="q-mx-sm" />
          <div class="user-section">
            <q-avatar 
              size="36px" 
              class="user-avatar"
              color="white"
              text-color="primary"
            >
              {{ auth.user?.name?.[0] || 'A' }}
            </q-avatar>
            <div class="user-info">
              <div class="user-name">{{ auth.user?.name || 'Admin' }}</div>
              <div class="user-role">Administrator</div>
            </div>
            <q-btn 
              flat 
              dense 
              round 
              icon="logout" 
              @click="auth.logout()" 
              class="logout-btn"
            >
              <q-tooltip>Abmelden</q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-toolbar>
    </q-header>
    
    <q-drawer 
      v-model="left" 
      side="left" 
      :width="260"
      class="modern-drawer"
      elevated
    >
      <div class="drawer-header">
        <div class="drawer-logo">
          <q-icon name="apartment" size="32px" />
        </div>
        <div class="drawer-title">Navigation</div>
      </div>
      
      <q-separator class="q-my-md" />
      
      <q-list class="nav-list">
        <q-item 
          v-for="item in menu" 
          :key="item.path" 
          :to="item.path" 
          exact 
          clickable
          v-ripple
          class="nav-item"
          active-class="nav-item-active"
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" size="24px" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="nav-label">{{ item.label }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      
      <div class="drawer-footer">
        <div class="footer-info">
          <q-icon name="info" size="16px" />
          <span>Version 2.0.0</span>
        </div>
      </div>
    </q-drawer>
    
    <q-page-container class="page-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '../stores/auth.js'

const auth = useAuth()
const left = ref(true)

const menu = computed(() => {
  const base = [{ path: '/', label: 'Dashboard', icon: 'dashboard' }]
  if (auth.canEdit) base.push({ path: '/accommodations', label: 'Unterkünfte', icon: 'hotel' })
  base.push({ path: '/bookings', label: 'Buchungen', icon: 'event' })
  if (auth.canEdit) base.push({ path: '/content', label: 'Inhalte', icon: 'edit' })
  return base
})
</script>

<style scoped>
.modern-layout {
  background: #f8fafc;
}

.modern-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

.toolbar-container {
  padding: 8px 16px;
  min-height: 70px;
}

.menu-btn {
  transition: all 0.3s ease;
}

.menu-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: rotate(90deg);
}

.title-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.title-text {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-btn {
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

.user-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.user-section:hover {
  background: rgba(255, 255, 255, 0.15);
}

.user-avatar {
  border: 2px solid rgba(255, 255, 255, 0.3);
  font-weight: 600;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
}

.user-role {
  font-size: 11px;
  opacity: 0.8;
  line-height: 1;
}

.logout-btn {
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(180deg);
}

.modern-drawer {
  background: white;
  border-right: 1px solid #e2e8f0;
}

.drawer-header {
  padding: 24px 20px;
  text-align: center;
}

.drawer-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  margin-bottom: 12px;
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

.drawer-logo .q-icon {
  color: white;
}

.drawer-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.nav-list {
  padding: 0 12px;
}

.nav-item {
  border-radius: 12px;
  margin-bottom: 4px;
  transition: all 0.3s ease;
  color: #64748b;
}

.nav-item:hover {
  background: #f1f5f9;
  color: #667eea;
  transform: translateX(4px);
}

.nav-item-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white !important;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.nav-item-active :deep(.q-icon) {
  color: white;
}

.nav-label {
  font-weight: 600;
  font-size: 14px;
}

.drawer-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  border-top: 1px solid #e2e8f0;
}

.footer-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
  font-size: 12px;
}

.page-container {
  background: #f8fafc;
}

@media (max-width: 1024px) {
  .user-info {
    display: none;
  }
}
</style>
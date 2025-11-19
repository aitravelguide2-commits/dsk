<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>Admin Dashboard</q-toolbar-title>
        <q-btn flat label="Logout" @click="logout" v-if="auth.isAuth" />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
  </template>
<script setup>
import { useAuth } from './stores/auth.js';
const auth = useAuth();
const logout = () => auth.logout();
</script>
<style>
/* Heller Hintergrund und gute Lesbarkeit im gesamten Admin-Bereich */
body,
.q-layout,
.q-page-container,
.q-page {
  background-color: #f9fafb !important; /* sehr helles Grau */
}

/* Optional: Basis-Textfarbe etwas dunkler für Kontrast */
.q-page-container,
.q-page {
  color: #1f2937; /* dunkles Grau */
}
</style>

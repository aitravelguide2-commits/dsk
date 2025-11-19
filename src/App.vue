<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <Header />
    <main>
      <router-view />
    </main>
    <div id="site-footer">
      <Footer />
    </div>
    <CookieBanner />
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import CookieBanner from './components/CookieBanner.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    CookieBanner
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f8fafc;
}
</style>

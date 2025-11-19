<template>
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="dsk-logo">
    <defs>
      <linearGradient id="dskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#38bdf8;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#6366f1;stop-opacity:1" />
      </linearGradient>
    </defs>
    
    <!-- House/Building Icon -->
    <g fill="url(#dskGradient)">
      <!-- Roof -->
      <path d="M50 15 L75 35 L75 40 L25 40 L25 35 Z" />
      
      <!-- Building body -->
      <rect x="30" y="40" width="40" height="45" opacity="0.3"/>
      
      <!-- Windows -->
      <rect x="35" y="45" width="8" height="8" opacity="0.6"/>
      <rect x="57" y="45" width="8" height="8" opacity="0.6"/>
      <rect x="35" y="58" width="8" height="8" opacity="0.6"/>
      <rect x="57" y="58" width="8" height="8" opacity="0.6"/>
      
      <!-- Door -->
      <rect x="46" y="70" width="8" height="15" opacity="0.8"/>
    </g>
  </svg>
</template>

<script>
export default {
  name: 'DskLogo'
}
</script>

<style scoped>
.dsk-logo {
  width: 100%;
  height: 100%;
}
</style>

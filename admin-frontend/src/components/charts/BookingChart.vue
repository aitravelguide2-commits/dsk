<template><canvas ref="canv"></canvas></template>
<script setup>
import { ref, watch } from 'vue';
import Chart from 'chart.js/auto';
const props = defineProps({ data: Object });
const canv = ref(null); let chart;
watch(() => props.data, (d) => {
  if (!canv.value) return;
  if (chart) chart.destroy();
  chart = new Chart(canv.value, { type: 'line', data: d, options: { responsive: true } });
}, { immediate: true });
</script>

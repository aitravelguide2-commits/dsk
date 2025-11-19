<template>
  <q-card class="q-pa-sm" flat bordered>
    <q-card-section class="row items-center no-wrap">
      <div class="col-auto">
        <div class="circle q-ma-xs" :class="`bg-${color}`">
          <q-icon :name="icon" size="md" color="white" />
        </div>
      </div>
      <div class="col">
        <div class="text-caption text-grey-7">{{ title }}</div>
        <div class="text-h5 text-weight-bold">{{ value }}</div>
        <div v-if="subtext" class="text-caption text-grey-6 q-mt-xs">{{ subtext }}</div>
      </div>
    </q-card-section>
  </q-card>
  </template>
<script setup>
const { title, value, icon, color, subtext } = defineProps({
  title: { type: String, required: true },
  value: { type: [String, Number], required: true },
  icon: { type: String, default: 'insights' },
  color: { type: String, default: 'primary' },
  subtext: { type: String, default: '' }
});
</script>
<style scoped>
.circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: grid;
  place-items: center;
}
</style>

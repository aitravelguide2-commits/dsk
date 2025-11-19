<template>
  <div class="relative w-full">
    <div ref="triggerRef" class="grid md:grid-cols-2 gap-4">
      <div class="border border-gray-300 rounded-xl p-3">
        <label class="block text-xs font-semibold text-gray-700 mb-1">{{ checkInLabel }}</label>
        <button type="button" aria-haspopup="dialog" :aria-expanded="open ? 'true' : 'false'" class="w-full text-left border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white" @click="open = true">
          <span v-if="modelValue.checkin">{{ formatDate(modelValue.checkin) }}</span>
          <span v-else class="text-gray-400">{{ checkInPlaceholder }}</span>
        </button>
      </div>
      <div class="border border-gray-300 rounded-xl p-3">
        <label class="block text-xs font-semibold text-gray-700 mb-1">{{ checkOutLabel }}</label>
        <button type="button" aria-haspopup="dialog" :aria-expanded="open ? 'true' : 'false'" class="w-full text-left border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white" @click="open = true">
          <span v-if="modelValue.checkout">{{ formatDate(modelValue.checkout) }}</span>
          <span v-else class="text-gray-400">{{ checkOutPlaceholder }}</span>
        </button>
      </div>
    </div>

    <!-- Inline selection summary -->
    <div class="mt-3">
      <div v-if="internal.checkin && internal.checkout" class="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center justify-between" :data-range-summary="true" :data-checkin="internal.checkin" :data-checkout="internal.checkout">
        <div class="text-sm md:text-base text-gray-800">
          <span class="font-semibold">{{ summaryLabel }}</span>
          <span class="ml-1">{{ formatDate(internal.checkin) }} → {{ formatDate(internal.checkout) }}</span>
        </div>
        <div class="text-sm md:text-base text-gray-900 font-semibold">
          {{ nights }} {{ nights === 1 ? nightLabelSingular : nightLabelPlural }}
        </div>
      </div>
      <div v-else-if="internal.checkin" class="bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm md:text-base text-gray-700">
        {{ selectedLabel }}: {{ formatDate(internal.checkin) }} · {{ pickCheckoutLabel }}
      </div>
    </div>

    <transition name="fade-scale">
      <div v-if="open" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Datumsbereich auswählen" @click.self="onCancel">
        <div class="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-[900px] min-h-[500px] max-h-[90vh] overflow-y-auto" :class="{ 'max-w-none': fullWidthModal }">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <button class="px-2 py-1 rounded hover:bg-gray-100" @click="prevMonth">‹</button>
              <div class="text-sm text-gray-600">{{ monthYear(displayStart) }}</div>
            </div>
            <div class="flex items-center gap-2">
              <div class="text-sm text-gray-600">{{ monthYear(nextMonth(displayStart)) }}</div>
              <button class="px-2 py-1 rounded hover:bg-gray-100" @click="nextMonthClick">›</button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div class="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-2">
                <div v-for="d in weekDays" :key="d" class="text-center">{{ d }}</div>
              </div>
              <div class="calendar-grid grid grid-cols-7 gap-1" role="grid" :aria-label="monthYear(displayStart)">
                <div v-for="cell in calendar(displayStart)" :key="cell.key" :class="dayClass(cell)" @mouseenter="hoverDate = cell.dateStr" @mouseleave="hoverDate = null" @click="onSelect(cell)" :aria-disabled="cell.disabled" :aria-label="cell.label" role="gridcell" :tabindex="cell.disabled ? -1 : 0" @keydown="onDayKeydown(cell, $event)">
                  <div class="font-semibold text-sm md:text-base">{{ cell.day }}</div>
                </div>
              </div>
            </div>
            <div>
              <div class="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-2">
                <div v-for="d in weekDays" :key="d" class="text-center">{{ d }}</div>
              </div>
              <div class="calendar-grid grid grid-cols-7 gap-1" role="grid" :aria-label="monthYear(nextMonth(displayStart))">
                <div v-for="cell in calendar(nextMonth(displayStart))" :key="cell.key" :class="dayClass(cell)" @mouseenter="hoverDate = cell.dateStr" @mouseleave="hoverDate = null" @click="onSelect(cell)" :aria-disabled="cell.disabled" :aria-label="cell.label" role="gridcell" :tabindex="cell.disabled ? -1 : 0" @keydown="onDayKeydown(cell, $event)">
                  <div class="font-semibold text-sm md:text-base">{{ cell.day }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between mt-3">
            <div class="flex items-center gap-4 text-xs">
              <div class="flex items-center"><div class="w-4 h-4 bg-green-50 border border-green-200 rounded mr-2"></div><span class="text-gray-600">{{ availableLabel }}</span></div>
              <div class="flex items-center"><div class="w-4 h-4 bg-red-50 border border-red-200 rounded mr-2"></div><span class="text-gray-600">{{ bookedLabel }}</span></div>
              <div class="flex items-center"><div class="w-4 h-4 bg-blue-500 rounded mr-2"></div><span class="text-gray-600">{{ selectedLabel }}</span></div>
            </div>
            <div class="flex gap-2">
              <button class="px-3 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200" @click="onCancel">{{ cancelLabel }}</button>
              <button class="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700" :disabled="!modelValue.checkin || !modelValue.checkout" @click="onApply">{{ applyLabel }}</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'DateRangePicker',
  props: {
    modelValue: { type: Object, required: true },
    availabilityMap: { type: Object, default: () => ({}) },
    locale: { type: String, default: 'de-DE' },
    minDate: { type: String, default: '' },
    labels: { type: Object, default: () => ({}) },
    fullWidthModal: { type: Boolean, default: false },
    minNights: { type: Number, default: 1 }
  },
  data() {
    return {
      open: false,
      displayStart: this.startOfMonth(new Date()),
      hoverDate: null,
      internal: { checkin: this.modelValue.checkin || '', checkout: this.modelValue.checkout || '' }
    }
  },
  computed: {
    weekDays() {
      const base = new Date(2021, 7, 1)
      const fmt = new Intl.DateTimeFormat(this.locale, { weekday: 'short' })
      return [...Array(7)].map((_, i) => fmt.format(new Date(base.getTime() + i * 86400000)))
    },
    checkInLabel() { return this.labels.checkin || 'Check-in' },
    checkOutLabel() { return this.labels.checkout || 'Check-out' },
    checkInPlaceholder() { return this.labels.pickCheckin || 'Datum wählen' },
    checkOutPlaceholder() { return this.labels.pickCheckout || 'Datum wählen' },
    availableLabel() { return this.labels.available || 'Verfügbar' },
    bookedLabel() { return this.labels.booked || 'Gebucht' },
    selectedLabel() { return this.labels.selected || 'Ausgewählt' },
    cancelLabel() { return this.labels.cancel || 'Abbrechen' },
    applyLabel() { return this.labels.apply || 'Übernehmen' }
    ,
    summaryLabel() { return this.labels.summary || 'Auswahl' },
    nightLabelSingular() { return this.labels.night || 'Nacht' },
    nightLabelPlural() { return this.labels.nights || 'Nächte' },
    pickCheckoutLabel() { return this.labels.pickCheckout || 'Check-out wählen' },
    nights() {
      try {
        if (!this.internal.checkin || !this.internal.checkout) return 0
        const ci = new Date(this.internal.checkin)
        const co = new Date(this.internal.checkout)
        const diff = co.getTime() - ci.getTime()
        if (diff <= 0) return 0
        return Math.ceil(diff / (1000 * 60 * 60 * 24))
      } catch { return 0 }
    }
  },
  watch: {
    modelValue: {
      deep: true,
      handler(v) { this.internal = { checkin: v.checkin || '', checkout: v.checkout || '' } }
    },
    open(val) {
      if (val) document.body.style.overflow = 'hidden'
      else document.body.style.overflow = ''
    }
  },
  methods: {
    clamp(n, min, max) { return Math.max(min, Math.min(max, n)) },
    plusDays(dateStr, days) {
      try {
        const d = new Date(dateStr)
        d.setDate(d.getDate() + days)
        return d.toISOString().slice(0, 10)
      } catch { return dateStr }
    },
    focusCellByDate(ds) {
      const pop = this.$refs.popoverRef
      if (!pop) return
      const el = pop.querySelector(`[aria-label="${ds}"]`)
      if (el && !el.getAttribute('aria-disabled')) {
        el.focus()
        this.hoverDate = ds
      }
    },
    onDayKeydown(cell, e) {
      const key = e.key
      if (key === 'Enter') { this.onSelect(cell); return }
      if (key === 'Escape') { this.onCancel(); return }
      let delta = 0
      if (key === 'ArrowLeft') delta = -1
      else if (key === 'ArrowRight') delta = 1
      else if (key === 'ArrowUp') delta = -7
      else if (key === 'ArrowDown') delta = 7
      if (delta !== 0) {
        e.preventDefault()
        const next = this.plusDays(cell.dateStr, delta)
        this.focusCellByDate(next)
      }
    },
    formatDate(d) { try { return new Date(d).toLocaleDateString(this.locale) } catch { return d } },
    startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1) },
    nextMonth(d) { return new Date(d.getFullYear(), d.getMonth() + 1, 1) },
    prevMonth() { this.displayStart = this.startOfMonth(new Date(this.displayStart.getFullYear(), this.displayStart.getMonth() - 1, 1)) },
    nextMonthClick() { this.displayStart = this.startOfMonth(new Date(this.displayStart.getFullYear(), this.displayStart.getMonth() + 1, 1)) },
    monthYear(d) { return new Intl.DateTimeFormat(this.locale, { month: 'long', year: 'numeric' }).format(d) },
    calendar(monthStart) {
      const firstDay = new Date(monthStart)
      const startDow = firstDay.getDay()
      const daysInMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate()
      const cells = []
      for (let i = 0; i < startDow; i++) { cells.push({ empty: true, key: `${monthStart}-pad-${i}` }) }
      for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(monthStart.getFullYear(), monthStart.getMonth(), day)
        const ds = d.toISOString().slice(0, 10)
        const minOk = this.minDate ? ds >= this.minDate : true
        const isAvail = this.availabilityMap[ds] !== false
        const minStayOk = this.internal.checkin ? (ds >= this.plusDays(this.internal.checkin, this.clamp(this.minNights||1,1,365))) : true
        cells.push({ day, date: d, dateStr: ds, key: ds, disabled: !minOk || !isAvail || !minStayOk, label: ds })
      }
      return cells
    },
    dayClass(cell) {
      if (cell.empty) return 'h-10'
      const today = new Date().toISOString().slice(0,10)
      const inRange = this.internal.checkin && !this.internal.checkout && this.internal.checkin <= cell.dateStr && (!this.hoverDate || cell.dateStr <= this.hoverDate)
      const selected = (cell.dateStr === this.internal.checkin) || (cell.dateStr === this.internal.checkout) || (this.internal.checkin && this.internal.checkout && cell.dateStr > this.internal.checkin && cell.dateStr < this.internal.checkout)
      const base = ['flex items-center justify-center aspect-square h-10 md:h-11 text-center rounded-xl border transition-all duration-200 cursor-pointer select-none']
      if (cell.disabled) base.push('bg-red-50 border-red-200 text-red-600 cursor-not-allowed')
      else base.push('bg-green-50 border-green-200 hover:bg-green-100')
      if (selected) base.push('bg-blue-500 text-white border-blue-500')
      else if (inRange) base.push('bg-blue-100 border-blue-200')
      if (cell.dateStr === today) base.push('ring-2 ring-blue-500 ring-opacity-50')
      return base.join(' ')
    },
    onSelect(cell) {
      if (cell.empty || cell.disabled) return
      const ds = cell.dateStr
      if (!this.internal.checkin || (this.internal.checkin && this.internal.checkout)) {
        this.internal.checkin = ds
        this.internal.checkout = ''
        this.$emit('update:modelValue', { checkin: this.internal.checkin, checkout: this.internal.checkout })
        return
      }
      if (ds <= this.internal.checkin) {
        this.internal.checkin = ds
        this.$emit('update:modelValue', { checkin: this.internal.checkin, checkout: this.internal.checkout })
        return
      }
      this.internal.checkout = ds
      this.$emit('update:modelValue', { checkin: this.internal.checkin, checkout: this.internal.checkout })
      this.open = false
      this.$emit('rangeSelected', { checkin: this.internal.checkin, checkout: this.internal.checkout })
    },
    onCancel() {
      this.open = false
      this.hoverDate = null
    },
    onApply() {
      this.open = false
      this.hoverDate = null
      this.$emit('rangeSelected', { checkin: this.internal.checkin, checkout: this.internal.checkout })
    }
  }
}
</script>

<style scoped>
.shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
.calendar-grid { grid-auto-rows: minmax(2.25rem, 1fr); }
.datepicker-popover { min-width: 320px; max-width: 90vw; }
@media (min-width: 768px) {
  .datepicker-popover { min-width: 660px; }
}
.datepicker-popover { max-height: 80vh; overflow-y: auto; contain: layout style paint; overscroll-behavior: contain; -webkit-overflow-scrolling: touch; }
.fade-scale-enter-active, .fade-scale-leave-active { transition: opacity .15s ease, transform .15s ease; }
.fade-scale-enter-from, .fade-scale-leave-to { opacity: 0; transform: scale(.98); }
</style>
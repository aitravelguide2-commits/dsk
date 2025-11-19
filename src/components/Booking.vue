<template>
  <div class="min-h-screen py-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <div class="container mx-auto px-4 max-w-6xl">
      <!-- Hero Section -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          {{ $t('booking.title') }}
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Buchen Sie Ihre perfekte Monteurunterkunft in Leipzig
        </p>
      </div>

      <div class="grid lg:grid-cols-2 gap-8">
        <!-- Booking Form -->
        <div class="bg-white/80 rounded-2xl shadow-xl border border-white/20 p-8">
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-800">Buchungsformular</h2>
          </div>

          <div v-if="changeModeOpen" id="change-accommodation-panel" class="mb-6 border border-gray-200 rounded-2xl p-4" role="region" aria-label="Unterkunft ändern">
            <label for="change-accommodation-select" class="block text-sm font-semibold text-gray-700 mb-2">Neue Unterkunft auswählen</label>
            <select 
              id="change-accommodation-select"
              v-model="selectionPendingId"
              class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white"
            >
              <option value="">Bitte wählen...</option>
              <option 
                v-for="acc in accommodations" 
                :key="acc.id" 
                :value="acc.id"
              >
                {{ acc.name }} - €{{ acc.price }}/Nacht - {{ acc.location }}
              </option>
            </select>
            <div class="mt-3 flex items-center gap-2">
              <button type="button" @click="applySelection" :disabled="!selectionPendingId || changeLoading" class="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">Änderung übernehmen</button>
              <button type="button" @click="cancelChangeMode" class="px-4 py-2 rounded-xl bg-gray-100 text-gray-800 hover:bg-gray-200">Abbrechen</button>
            </div>
            <div class="mt-2 text-sm" aria-live="polite">
              <span v-if="changeFeedback" class="text-green-700">{{ changeFeedback }}</span>
              <span v-else-if="changeError" class="text-red-700">{{ changeError }}</span>
            </div>
          </div>

          <div v-if="accommodationId" class="flex items-center justify-between mb-4">
            <div class="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
              Direktbuchung: {{ selectedAccommodation?.name }}
            </div>
            <button type="button" @click="openChangeMode" class="text-sm font-semibold text-blue-600 hover:text-blue-700" aria-controls="change-accommodation-panel" :aria-expanded="changeModeOpen ? 'true' : 'false'">
              Unterkunft ändern
            </button>
          </div>

          <form @submit.prevent="submitBooking" class="space-y-6">
            <!-- Accommodation Selection -->
            <div v-if="!accommodationId" class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700">
                <svg class="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                </svg>
                Unterkunft auswählen
              </label>
              <select 
                v-model="selectedAccommodationId"
                class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white"
                required
              >
                <option value="">Bitte wählen...</option>
                <option 
                  v-for="acc in accommodations" 
                  :key="acc.id" 
                  :value="acc.id"
                >
                  {{ acc.name }} - €{{ acc.price }}/Nacht - {{ acc.location }}
                </option>
              </select>
            </div>

            <!-- Modern Date Selection -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-800 flex items-center">
                <svg class="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                Aufenthaltsdauer
              </h3>
              
              <DateRangePicker 
                :availabilityMap="availabilityMap"
                :locale="locale"
                :minDate="minDate"
                :minNights="selectedAccommodation?.minStay || 1"
                v-model="dateRange"
                @rangeSelected="onRangeSelected"
                :labels="{checkin: $t('booking.form.checkin'), checkout: $t('booking.form.checkout'), available: $t('booking.calendar.available'), booked: $t('booking.calendar.booked'), selected: 'Ausgewählt', cancel: 'Abbrechen', apply: 'Übernehmen'}"
              />


              <!-- Date Range Display -->
              <div v-if="bookingData.checkin && bookingData.checkout && nights > 0" class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                <div class="flex items-center justify-between">
                  <div class="flex items-center text-blue-700">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span class="font-semibold">{{ nights }} {{ nights === 1 ? 'Nacht' : 'Nächte' }}</span>
                  </div>
                  <div class="text-right">
                  <div class="text-2xl font-bold text-blue-600">
                    <span v-if="!priceLoading">€{{ totalPrice }}</span>
                    <span v-else class="inline-flex items-center">
                      <svg class="animate-spin -ml-1 mr-1 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      wird berechnet...
                    </span>
                  </div>
                  <div class="text-sm text-gray-600">Gesamtpreis</div>
                </div>
              </div>
              <div v-if="priceData" class="mt-2 text-sm text-gray-700">
                <div>Grundpreis: €{{ Math.round(priceData.basePrice) }}</div>
                <div v-if="priceData.cleaningFeeApplied">Reinigungsgebühr: €{{ Math.round(priceData.cleaningFee) }}</div>
                <div class="font-semibold">Summe: €{{ Math.round(priceData.total) }}</div>
              </div>
            </div>
            </div>

            <!-- Personal Information -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-800 flex items-center">
                <svg class="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                Persönliche Daten
              </h3>

              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('booking.form.name') }} *
                  </label>
                  <input 
                    type="text" 
                    v-model="bookingData.name"
                    class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white"
                    placeholder="Ihr vollständiger Name"
                    required
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('booking.form.company') }}
                  </label>
                  <input 
                    type="text" 
                    v-model="bookingData.company"
                    class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white"
                    placeholder="Firmenname (optional)"
                  >
                </div>
              </div>

              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('booking.form.phone') }} *
                  </label>
                  <input 
                    type="tel" 
                    v-model="bookingData.phone"
                    class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white"
                    placeholder="+49 151 71421923"
                    required
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('booking.form.email') }} *
                  </label>
                  <input 
                    type="email" 
                    v-model="bookingData.email"
                    class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white"
                    placeholder="ihre@email.de"
                    required
                  >
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('booking.form.persons') }} *
                </label>
                <select 
                  v-model="bookingData.persons"
                  class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white"
                  required
                >
                  <option v-for="n in personsMax" :key="n" :value="n">{{ n }} {{ n === 1 ? 'Person' : 'Personen' }}</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Besondere Wünsche
                </label>
                <textarea 
                  v-model="bookingData.notes"
                  rows="3"
                  class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white resize-none"
                  placeholder="Haben Sie besondere Wünsche oder Anforderungen?"
                ></textarea>
              </div>
            </div>

            <!-- Success Message -->
            <div v-if="emailService.success.value" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl">
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <div>
                  <div class="font-semibold">Buchungsanfrage erfolgreich gesendet!</div>
                  <div class="text-sm">Wir werden uns schnellstmöglich bei Ihnen melden.</div>
                </div>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="emailService.error.value" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
                {{ emailService.error.value }}
              </div>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit"
              :disabled="!isFormValid || emailService.isLoading.value"
              class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
            >
              <span v-if="!isSubmitting && !emailService.isLoading.value" class="flex items-center justify-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                {{ $t('booking.form.submit') }}
              </span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Wird gesendet...
              </span>
            </button>
          </form>
        </div>

        <!-- Calendar & Accommodation Info -->
        <div class="space-y-6">
          <!-- Selected Accommodation Info -->
          <div v-if="selectedAccommodation" class="bg-white/80 rounded-2xl shadow-xl border border-white/20 p-6">
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-800">{{ selectedAccommodation.name }}</h3>
            </div>
            
            <div class="relative overflow-hidden rounded-xl mb-4 group">
              <img 
                :src="selectedAccommodation.image" 
                :alt="selectedAccommodation.name"
                class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div class="absolute bottom-4 left-4 text-white">
                <div class="text-2xl font-bold">€{{ selectedAccommodation.price }}</div>
                <div class="text-sm opacity-90">pro Nacht</div>
              </div>
            </div>
            
            <p class="text-gray-600 mb-4 leading-relaxed">{{ selectedAccommodation.description }}</p>
            
            <div class="grid grid-cols-2 gap-4 text-sm mb-4">
              <div class="flex items-center bg-gray-50 rounded-lg p-3">
                <svg class="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                </svg>
                <span class="font-medium">{{ selectedAccommodation.capacity }} {{ selectedAccommodation.capacity === 1 ? 'Person' : 'Personen' }}</span>
              </div>
              <div class="flex items-center bg-gray-50 rounded-lg p-3">
                <svg class="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                </svg>
                <span class="font-medium">{{ selectedAccommodation.location }}</span>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <h4 class="font-semibold text-gray-800 flex items-center mb-2">
                  <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Ausstattung
                </h4>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="feature in selectedAccommodation.features" 
                    :key="feature"
                    class="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-200"
                  >
                    {{ getFeatureIcon(feature) }} {{ $t(`accommodations.features.${feature}`) }}
                  </span>
                </div>
              </div>

              <!-- Interactive Map -->
              <div>
                <h4 class="font-semibold text-gray-800 flex items-center mb-2">
                  <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  {{ $t('accommodations.location') }}
                </h4>
                <InteractiveMap
                  :center="getAccommodationLocation(selectedAccommodation)"
                  :zoom="15"
                  :height="'200px'"
                  :markers="[getAccommodationMarker(selectedAccommodation)]"
                  :address="selectedAccommodation.address"
                  :showDirections="true"
                  :showSurroundingsLink="true"
                />
              </div>
            </div>
          </div>

          <!-- Enhanced Calendar Preview -->
          <div class="bg-white/80 rounded-2xl shadow-XL border border-white/20 p-6">
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-gray-800">Verfügbarkeitskalender</h3>
            </div>
            
              <div class="grid grid-cols-7 gap-1 text-xs mb-4">
                <div v-for="day in calendarDays" :key="day.date" 
                       :class="[
                         'p-3 text-center rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md',
                         day.isAvailable ? 'bg-green-50 border-green-200 hover:bg-green-100' : 'bg-red-50 border-red-200 hover:bg-red-100',
                         day.isToday ? 'ring-2 ring-blue-500 ring-opacity-50' : '',
                         day.isSelected ? 'bg-blue-500 text-white border-blue-500' : ''
                       ]">
                  <div class="font-semibold">{{ day.day }}</div>
                  <div :class="[day.isSelected ? 'text-blue-100' : 'text-gray-500', !day.isAvailable ? 'line-through' : '']">{{ day.date }}</div>
                </div>
              </div>
            
            <div class="flex items-center justify-center space-x-6 text-xs">
              <div class="flex items-center">
                <div class="w-4 h-4 bg-green-50 border border-green-200 rounded mr-2"></div>
                <span class="text-gray-600">{{ $t('booking.calendar.available') }}</span>
              </div>
              <div class="flex items-center">
                <div class="w-4 h-4 bg-red-50 border border-red-200 rounded mr-2"></div>
                <span class="text-gray-600">{{ $t('booking.calendar.booked') }}</span>
              </div>
              <div class="flex items-center">
                <div class="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                <span class="text-gray-600">Ausgewählt</span>
              </div>
            </div>
          </div>

          <!-- Trust Elements -->
          <div class="bg-white/80 rounded-2xl shadow-xl border border-white/20 p-6">
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-gray-800">Vertrauen & Sicherheit</h3>
            </div>
            
            <div class="space-y-3">
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                Sofortige Buchungsbestätigung
              </div>
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                Kostenlose Stornierung bis 24h vorher
              </div>
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                24/7 Kundenservice
              </div>
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                Sichere Zahlungsabwicklung
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Glassmorphism and modern styling */
.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.glass-sidebar {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Form styling */
.form-group {
  position: relative;
  margin-bottom: 1.5rem;
}

.form-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
}

.form-input:invalid {
  border-color: #ef4444;
}

.form-input:valid {
  border-color: #10b981;
}

.form-label {
  position: absolute;
  top: -8px;
  left: 12px;
  background: white;
  padding: 0 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

/* Date picker styling */
.date-picker {
  position: relative;
}

.date-input {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: textfield;
}

.date-input::-webkit-calendar-picker-indicator {
  background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3e%3cpath fill-rule='evenodd' d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z' clip-rule='evenodd'/%3e%3c/svg%3e") no-repeat;
  background-size: 20px 20px;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

/* Calendar preview styling */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-top: 1rem;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 0.75rem;
  transition: all 0.2s ease;
  cursor: pointer;
}

.calendar-day.available {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.calendar-day.unavailable {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.2);
  cursor: not-allowed;
}

.calendar-day.selected {
  background: #3b82f6;
  color: white;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.calendar-day.today {
  font-weight: bold;
  border: 2px solid #3b82f6;
}

/* Accommodation card styling */
.accommodation-card {
  border: 2px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
}

.accommodation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.accommodation-card.selected {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.accommodation-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.accommodation-card:hover .accommodation-image {
  transform: scale(1.05);
}

/* Feature icons */
.feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 50%;
  font-size: 14px;
  margin: 2px;
  transition: all 0.2s ease;
}

.feature-icon:hover {
  background: rgba(59, 130, 246, 0.2);
  transform: scale(1.1);
}

/* Price display */
.price-display {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  margin: 1rem 0;
}

.price-breakdown {
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.price-breakdown:last-child {
  border-bottom: none;
  font-weight: bold;
  font-size: 1.2rem;
}

/* Submit button */
.submit-button {
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
}

.submit-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

.submit-button.loading {
  color: transparent;
}

.submit-button.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Trust elements */
.trust-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0.25rem;
}

.trust-badge svg {
  width: 16px;
  height: 16px;
  margin-right: 0.5rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .booking-container {
    flex-direction: column;
  }
  
  .booking-sidebar {
    order: -1;
    margin-bottom: 2rem;
  }
  
  .calendar-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .accommodation-grid {
    grid-template-columns: 1fr;
  }
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

/* Smooth scrolling - verhindert beim Neuladen */
html {
  scroll-behavior: smooth;
}

html:not(:target) {
  scroll-behavior: auto;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.5);
}
</style>

<script>
import { useSEO, seoData } from '../composables/useSEO.js'
import { useEmailService } from '../composables/useEmailService.js'
import { useI18n } from 'vue-i18n'
import InteractiveMap from './InteractiveMap.vue'
import DateRangePicker from './DateRangePicker.vue'
import { accommodationService } from '../services/api.js'
import { toNumericId, isValidId, persistSelection, readPersistedSelection } from '../utils/selection.js'

export default {
  name: 'Booking',
  components: {
    InteractiveMap,
    DateRangePicker
  },
  props: {
    id: String
  },
  setup() {
    const { setPageSEO } = useSEO()
    const { locale } = useI18n()
    const emailService = useEmailService()
    
    return {
      setPageSEO,
      locale,
      emailService
    }
  },
  mounted() {
    this.updateSEO()
    this.loadAccommodations()
    const pid = readPersistedSelection()
    if (!this.id && pid) {
      this.selectedAccommodationId = pid
      this.accommodationId = pid
    }
  },
  watch: {
    locale() {
      this.updateSEO()
    }
    ,
    '$route.params.id'() {
      this.loadAccommodations()
    }
    ,
    '$route.query.accommodationId'() {
      this.loadAccommodations()
    }
    ,
    '$route.query.accomodationId'() {
      this.loadAccommodations()
    }
  },
  data() {
    return {
      accommodationId: this.id,
      selectedAccommodationId: this.id || '',
      selectionPendingId: '',
      changeModeOpen: false,
      changeFeedback: '',
      changeError: '',
      changeLoading: false,
      isSubmitting: false,
      bookingData: {
        name: '',
        company: '',
        phone: '',
        email: '',
        persons: 1,
        checkin: '',
        checkout: '',
        notes: ''
      },
      accommodations: [],
      availabilityMap: {},
      priceLoading: false,
      priceError: '',
      priceData: null,
      dateRange: { checkin: '', checkout: '' }
    }
  },
  computed: {
    selectedAccommodation() {
      return this.accommodations.find(acc => acc.id === parseInt(this.selectedAccommodationId))
    },
    personsMax() {
      return this.selectedAccommodation?.capacity || 8
    },
    nights() {
      if (!this.bookingData.checkin || !this.bookingData.checkout) return 0
      const checkin = new Date(this.bookingData.checkin)
      const checkout = new Date(this.bookingData.checkout)
      const diff = checkout.getTime() - checkin.getTime()
      return Math.ceil(diff / (1000 * 3600 * 24))
    },
    totalPrice() {
      if (this.priceData && this.priceData.total != null) return Math.round(this.priceData.total)
      if (!this.selectedAccommodation || this.nights <= 0) return 0
      return this.selectedAccommodation.price * this.nights
    },
    isFormValid() {
      return this.selectedAccommodationId && 
             this.bookingData.name && 
             this.bookingData.phone && 
             this.bookingData.email && 
             this.bookingData.checkin && 
             this.bookingData.checkout &&
             this.nights > 0 &&
             this.isDateAvailable(this.bookingData.checkin) &&
             this.isDateAvailable(this.bookingData.checkout)
    },
    minDate() {
      const today = new Date()
      return today.toISOString().split('T')[0]
    },
    minCheckoutDate() {
      if (!this.bookingData.checkin) return this.minDate
      const checkin = new Date(this.bookingData.checkin)
      checkin.setDate(checkin.getDate() + 1)
      return checkin.toISOString().split('T')[0]
    },
    calendarDays() {
      const days = []
      const today = new Date()
      const checkinStr = this.bookingData.checkin || this.dateRange.checkin || ''
      const checkoutStr = this.bookingData.checkout || this.dateRange.checkout || ''
      
      for (let i = 0; i < 14; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        const dateString = date.toISOString().split('T')[0]
        
        // Check if this date is selected (checkin, checkout, or in between)
        let isSelected = false
        if (checkinStr && checkoutStr) {
          isSelected = dateString >= checkinStr && dateString <= checkoutStr
        } else if (checkinStr) {
          isSelected = dateString === checkinStr
        } else if (checkoutStr) {
          isSelected = dateString === checkoutStr
        }
        
        days.push({
          date: date.getDate(),
          day: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'][date.getDay()],
          isAvailable: this.isDateAvailable(dateString),
          isToday: i === 0,
          isSelected: isSelected
        })
      }
      return days
    }
  },
  methods: {
    updateSEO() {
      const currentSeoData = seoData.booking[this.locale] || seoData.booking.de
      this.setPageSEO({
        ...currentSeoData,
        canonical: `${window.location.origin}/buchung`,
        ogUrl: `${window.location.origin}/buchung`,
        ogImage: `${window.location.origin}/images/booking-hero.jpg`
      })
    },
    isDateAvailable(dateString) {
      // If availability not loaded for this date, assume available
      if (!this.availabilityMap || !(dateString in this.availabilityMap)) return true
      return !!this.availabilityMap[dateString]
    },
    async loadAccommodations() {
      try {
        const q = this.$route?.query?.accommodationId
        const qAlt = this.$route?.query?.accomodationId
        const qVal = q ?? qAlt
        const qpId = qVal ? parseInt(String(qVal).replace(/\D/g, '')) : null
        const p = this.$route?.params?.id
        const routeId = !qpId && p ? parseInt(String(p).replace(/\D/g, '')) : null
        const effectiveId = qpId || routeId || null

        if (effectiveId) {
          const res = await accommodationService.getById(effectiveId)
          const acc = res?.data || null
          this.accommodations = acc ? [acc] : []
          this.selectedAccommodationId = acc ? acc.id : ''
          this.accommodationId = acc ? acc.id : ''
          const qCheckIn = this.$route?.query?.checkIn
          const qCheckOut = this.$route?.query?.checkOut
          const qGuests = this.$route?.query?.guests
          if (qCheckIn) {
            this.bookingData.checkin = String(qCheckIn)
            this.dateRange.checkin = String(qCheckIn)
          }
          if (qCheckOut) {
            this.bookingData.checkout = String(qCheckOut)
            this.dateRange.checkout = String(qCheckOut)
          }
          if (qGuests) {
            const g = parseInt(String(qGuests).replace(/\D/g, ''))
            if (!isNaN(g) && g > 0) this.bookingData.persons = g
          }
        } else {
          const res = await accommodationService.getAll({ isActive: true })
          this.accommodations = res?.data || []
          if (!this.selectedAccommodationId && this.accommodations.length) {
            this.selectedAccommodationId = this.accommodations[0].id
          }
          this.accommodationId = ''
        }
        await this.loadAvailability()
      } catch (e) {
        console.error('Fehler beim Laden der Unterkünfte:', e)
      }
    },
    async ensureAllAccommodations() {
      try {
        if (!this.accommodations || this.accommodations.length <= 1) {
          const res = await accommodationService.getAll({ isActive: true })
          this.accommodations = res?.data || []
        }
      } catch (e) {
        console.error('Fehler beim Laden aller Unterkünfte:', e)
      }
    },
    openChangeMode() {
      this.selectionPendingId = this.selectedAccommodationId || ''
      this.changeModeOpen = true
      this.changeFeedback = ''
      this.changeError = ''
      this.ensureAllAccommodations()
    },
    cancelChangeMode() {
      this.changeModeOpen = false
      this.changeFeedback = ''
      this.changeError = ''
    },
    async applySelection() {
      try {
        if (!this.selectionPendingId) {
          this.changeError = 'Bitte wählen Sie eine Unterkunft.'
          return
        }
        this.changeLoading = true
        const newId = toNumericId(this.selectionPendingId)
        if (!isValidId(newId)) {
          throw new Error('Ungültige Auswahl')
        }
        this.selectedAccommodationId = newId
        this.accommodationId = newId
        persistSelection(newId)
        this.changeFeedback = 'Auswahl aktualisiert'
        this.changeError = ''
        await this.loadAvailability()
        this.$router.push({ path: `/buchung/${newId}` })
        this.changeModeOpen = false
      } catch (e) {
        this.changeError = e?.message || 'Änderung fehlgeschlagen'
      } finally {
        this.changeLoading = false
      }
    },
    async loadAvailability() {
      if (!this.selectedAccommodationId) return
      try {
        const today = new Date()
        const startDate = today.toISOString().slice(0, 10)
        const end = new Date(today)
        end.setDate(end.getDate() + 60)
        const endDate = end.toISOString().slice(0, 10)
        const res = await accommodationService.checkAvailability(this.selectedAccommodationId, startDate, endDate)
        const days = res?.data?.availability || []
        const map = {}
        days.forEach(d => { map[d.date] = d.isAvailable })
        this.availabilityMap = map
      } catch (e) {
        console.error('Fehler beim Laden der Verfügbarkeit:', e)
        this.availabilityMap = {}
      }
    },
    getFeatureIcon(feature) {
      const icons = {
        wifi: '📶',
        kitchen: '🍳',
        parking: '🚗',
        bathroom: '🚿',
        tv: '📺',
        laundry: '🧺'
      }
      return icons[feature] || '✓'
    },
    getAccommodationLocation(accommodation) {
      // Define locations for each accommodation based on their location property
      const locations = {
        'Zentrum': [51.3397, 12.3731], // Leipzig city center
        'West': [51.3350, 12.3200],    // Leipzig west
        'Nord': [51.3600, 12.3731],    // Leipzig north
        'Süd': [51.3200, 12.3731],     // Leipzig south
        'Ost': [51.3397, 12.4100]      // Leipzig east
      }
      return locations[accommodation.location] || [51.3397, 12.3731] // Default to center
    },
    getAccommodationMarker(accommodation) {
      const location = this.getAccommodationLocation(accommodation)
      return {
        lat: location[0],
        lng: location[1],
        popup: `<strong>${accommodation.name}</strong><br>€${accommodation.price}/Nacht<br>${accommodation.location}`,
        tooltip: accommodation.name
      }
    },
    calculatePrice() {
      // Price calculation happens automatically in computed properties
      // This method can be used for additional validation or side effects
      if (this.bookingData.checkin && !this.isDateAvailable(this.bookingData.checkin)) {
        // Could show a notification here
      }
    },
    onRangeSelected(range) {
      this.bookingData.checkin = range.checkin
      this.bookingData.checkout = range.checkout
      this.calculatePrice()
      this.loadPrice()
    },
    async loadPrice() {
      this.priceError = ''
      this.priceData = null
      if (!this.selectedAccommodationId || !this.bookingData.checkin || !this.bookingData.checkout) return
      try {
        this.priceLoading = true
        const res = await accommodationService.priceEstimate(
          parseInt(this.selectedAccommodationId),
          this.bookingData.checkin,
          this.bookingData.checkout
        )
        this.priceData = res?.data || null
      } catch (e) {
        this.priceError = e?.msg || 'Preisberechnung fehlgeschlagen'
      } finally { this.priceLoading = false }
    },
      async submitBooking() {
      if (!this.isFormValid) return
      
      if (!this.selectedAccommodation) {
        this.emailService.error.value = 'Bitte wählen Sie eine Unterkunft aus.'
        return
      }

      this.isSubmitting = true
      this.emailService.resetState()
      
      try {
        // Create booking data for email service
        const bookingEmailData = {
          accommodationId: this.selectedAccommodation.id,
          accommodationName: this.selectedAccommodation.name || 'Unbekannte Unterkunft',
          guestName: this.bookingData.name,
          guestEmail: this.bookingData.email,
          guestPhone: this.bookingData.phone,
          checkIn: this.bookingData.checkin,
          checkOut: this.bookingData.checkout,
          guests: Number(this.bookingData.persons),
          totalPrice: this.totalPrice,
          specialRequests: this.bookingData.notes || ''
        }

        // Validate payload before sending
        if (!bookingEmailData.accommodationId) throw new Error('Unterkunft ID fehlt')
        if (!bookingEmailData.checkIn || !bookingEmailData.checkOut) throw new Error('Reisezeitraum fehlt')
        if (isNaN(bookingEmailData.guests) || bookingEmailData.guests < 1) throw new Error('Ungültige Personenanzahl')
        
        // Send booking email via Supabase
        console.log('Sending booking data:', bookingEmailData)
        const result = await this.emailService.sendBookingEmail(bookingEmailData)
        
        if (!result.success) {
          throw new Error(result.error || 'Fehler beim Senden der Buchungsanfrage')
        }
        
        // Create booking summary
        const bookingSummary = {
          accommodation: this.selectedAccommodation.name,
          accommodationPrice: this.selectedAccommodation.price,
          ...this.bookingData,
          nights: this.nights,
          totalPrice: this.totalPrice,
          bookingDate: new Date().toISOString(),
          bookingId: 'DSK-' + Date.now()
        }
        
        // Create downloadable confirmation
        this.downloadBookingConfirmation(bookingSummary)
        
        // Show success message
        this.showSuccessMessage()
        
        // Reset form
        this.resetForm()
        
        // Navigate back to home after delay
        setTimeout(() => {
          this.$router.push('/')
        }, 5000)
        
      } catch (error) {
        console.error('Booking error:', error)
        this.emailService.error.value = error.message || 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.'
      } finally {
        this.isSubmitting = false
      }
    },
    showSuccessMessage() {
      // Create and show a success notification
      const notification = document.createElement('div')
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300'
      notification.innerHTML = `
        <div class="flex items-center">
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <div>
            <div class="font-semibold">Buchung erfolgreich!</div>
            <div class="text-sm opacity-90">Bestätigung wurde heruntergeladen</div>
          </div>
        </div>
      `
      
      document.body.appendChild(notification)
      
      // Animate in
      setTimeout(() => {
        notification.classList.remove('translate-x-full')
      }, 100)
      
      // Remove after 5 seconds
      setTimeout(() => {
        notification.classList.add('translate-x-full')
        setTimeout(() => {
          document.body.removeChild(notification)
        }, 300)
      }, 5000)
    },
    resetForm() {
      this.bookingData = {
        name: '',
        company: '',
        phone: '',
        email: '',
        persons: 1,
        checkin: '',
        checkout: '',
        notes: ''
      }
      if (!this.id) {
        this.selectedAccommodationId = ''
      }
    },
    downloadBookingConfirmation(booking) {
      const content = `
DSK-UG Monteurunterkünfte Leipzig
Buchungsbestätigung
================================

Buchungs-ID: ${booking.bookingId}
Buchungsdatum: ${new Date(booking.bookingDate).toLocaleString('de-DE')}

UNTERKUNFT
----------
${booking.accommodation}
Preis: €${booking.accommodationPrice} pro Nacht
Standort: ${this.selectedAccommodation.location}

AUFENTHALT
----------
Check-in: ${new Date(booking.checkin).toLocaleDateString('de-DE')}
Check-out: ${new Date(booking.checkout).toLocaleDateString('de-DE')}
Nächte: ${booking.nights}
Personen: ${booking.persons}

GAST
----
Name: ${booking.name}
${booking.company ? `Firma: ${booking.company}` : ''}
Telefon: ${booking.phone}
E-Mail: ${booking.email}
${booking.notes ? `Besondere Wünsche: ${booking.notes}` : ''}

KOSTEN
------
Gesamtpreis: €${booking.totalPrice}

WICHTIGE HINWEISE
-----------------
• Kostenlose Stornierung bis 24 Stunden vor Anreise
• Check-in: 15:00 - 20:00 Uhr
• Check-out: bis 11:00 Uhr
• Bei Fragen: +49 151 71421923

Vielen Dank für Ihre Buchung!
DSK-UG Monteurunterkünfte Leipzig
www.dsk-ug-leipzig.de
      `.trim()
      
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `buchungsbestaetigung-${booking.bookingId}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  },
  watch: {
    selectedAccommodationId(newVal) {
      this.accommodationId = newVal
      const num = toNumericId(newVal)
      if (isValidId(num)) persistSelection(num)
      // Reload availability for the newly selected accommodation
      this.loadAvailability()
      this.loadPrice()
      // Clamp persons to capacity
      if (this.bookingData.persons > this.personsMax) {
        this.bookingData.persons = this.personsMax
      }
    },
    'bookingData.checkin'(newVal) {
      if (newVal && !this.isDateAvailable(newVal)) {
        // Auto-clear invalid date
        setTimeout(() => {
          this.bookingData.checkin = ''
        }, 100)
      }
    }
  }
}
</script>

<template>
  <footer class="bg-gray-800 text-white py-12">
    <div class="container mx-auto px-4">
      <div class="grid md:grid-cols-4 gap-8">
        <!-- Company Info -->
        <div>
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold">DSK</span>
            </div>
            <h3 class="text-xl font-bold">DSK-UG</h3>
          </div>
          <p class="text-gray-400 mb-4">
            Professionelle Monteurunterkünfte in Leipzig. Seit 2014 Ihr zuverlässiger Partner für komfortable Unterkünfte.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-lg font-semibold mb-4">Schnellzugriff</h4>
          <ul class="space-y-2">
            <li>
              <router-link to="/unterkuenfte" class="text-gray-400 hover:text-white transition-colors">
                Unterkünfte
              </router-link>
            </li>
            <li>
              <router-link to="/buchung" class="text-gray-400 hover:text-white transition-colors">
                Buchung
              </router-link>
            </li>
            <li>
              <router-link to="/ueber-uns" class="text-gray-400 hover:text-white transition-colors">
                Über uns
              </router-link>
            </li>
            <li>
              <router-link to="/kontakt" class="text-gray-400 hover:text-white transition-colors">
                Kontakt
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h4 class="text-lg font-semibold mb-4">Kontakt</h4>
          <ul class="space-y-2 text-gray-400">
            <li class="flex items-center">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
              </svg>
              Leipzig, Deutschland
            </li>
            <li class="flex items-center">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
              </svg>
              +49 151 71421923
            </li>
            <li class="flex items-center">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
              info@dsk-ug.de
            </li>
          </ul>
        </div>

        <!-- Legal -->
        <div>
          <h4 class="text-lg font-semibold mb-4">Rechtliches</h4>
          <ul class="space-y-2">
            <li>
              <router-link to="/impressum" class="text-gray-400 hover:text-white transition-colors">
                {{ $t('footer.imprint') }}
              </router-link>
            </li>
            <li>
              <router-link to="/datenschutz" class="text-gray-400 hover:text-white transition-colors">
                {{ $t('footer.privacy') }}
              </router-link>
            </li>
            <li>
              <router-link to="/agb" class="text-gray-400 hover:text-white transition-colors">
                AGB
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; 2024 DSK-UG. {{ $t('footer.rights') }}</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

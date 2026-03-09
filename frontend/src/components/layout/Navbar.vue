<template>
  <nav class="sticky top-0 z-50 transition-all duration-300"
    :class="scrolled
      ? 'glass dark:glass-dark shadow-card border-b border-white/20 dark:border-gray-700/50'
      : 'bg-transparent'">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">

        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2 group">
          <div class="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-shadow duration-300">
            <span class="text-white font-display font-bold text-lg">N</span>
          </div>
          <span class="font-display font-bold text-xl text-gray-900 dark:text-white">
            NonTin<span class="gradient-text">Tché</span>
          </span>
        </RouterLink>

        <!-- Menu desktop -->
        <div class="hidden md:flex items-center gap-1">
          <RouterLink to="/"
            class="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200">
            Accueil
          </RouterLink>
          <RouterLink v-if="auth.estConnecte" to="/annonces"
            class="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200">
            Annonces
          </RouterLink>
          <RouterLink v-if="auth.estProprietaire" to="/dashboard"
            class="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200">
            Dashboard
          </RouterLink>
          <RouterLink to="/charte" class="block hover:text-primary-400 transition-colors">
            Charte d'honnêteté
            </RouterLink>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2">

          <!-- Dark mode -->
          <button @click="auth.toggleDarkMode()"
            class="p-2 rounded-xl bg-gray-100 dark:bg-gray-700/80 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-105">
            <span class="text-base">{{ auth.darkMode ? '☀️' : '🌙' }}</span>
          </button>

          <!-- Non connecté -->
          <template v-if="!auth.estConnecte">
            <RouterLink to="/connexion"
              class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors">
              Connexion
            </RouterLink>
            <RouterLink to="/inscription"
              class="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white text-sm font-semibold rounded-xl shadow-glow-sm hover:shadow-glow transition-all duration-200 hover:scale-105">
              S'inscrire
            </RouterLink>
          </template>

          <!-- Connecté -->
          <template v-else>
            <div class="relative" ref="menuRef">
              <button @click="menuOuvert = !menuOuvert"
                class="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700/80 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200">
                <div class="w-7 h-7 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                  <span class="text-white text-xs font-bold">{{ auth.utilisateur?.nom?.charAt(0) }}</span>
                </div>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                  {{ auth.utilisateur?.nom }}
                </span>
                <span class="text-gray-400 text-xs transition-transform duration-200"
                  :class="menuOuvert ? 'rotate-180' : ''">▼</span>
              </button>

              <!-- Dropdown -->
              <Transition enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0 scale-95 -translate-y-2"
                enter-to-class="opacity-100 scale-100 translate-y-0"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95">
                <div v-if="menuOuvert"
                  class="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50 overflow-hidden">

                  <div class="px-4 py-2 border-b border-gray-100 dark:border-gray-700 mb-1">
                    <p class="text-sm font-semibold text-gray-800 dark:text-white">{{ auth.utilisateur?.nom }} {{ auth.utilisateur?.prenom }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ auth.utilisateur?.role }}</p>
                  </div>

                  <RouterLink v-if="auth.estAdmin" to="/admin"
                    class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-colors"
                    @click="menuOuvert = false">
                    ⚙️ Administration
                  </RouterLink>
                  <RouterLink v-if="auth.estProprietaire" to="/dashboard"
                    class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-colors"
                    @click="menuOuvert = false">
                    📊 Mon Dashboard
                  </RouterLink>
                  <RouterLink to="/annonces"
                    class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-colors"
                    @click="menuOuvert = false">
                    🏠 Annonces
                  </RouterLink>
                  <RouterLink to="/favoris"
                    class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-colors"
                    @click="menuOuvert = false">
                    ❤️ Mes Favoris
                  </RouterLink>
                  <RouterLink to="/profil"
                    class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-colors"
                    @click="menuOuvert = false">
                    👤 Mon Profil
                  </RouterLink>
                  <RouterLink v-if="auth.estProprietaire" to="/dashboard/paiements"
                    class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-colors"
                    @click="menuOuvert = false">
                    💳 Paiements
                  </RouterLink>

                  <div class="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                    <button @click="seDeconnecter"
                      class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      🚪 Déconnexion
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../../store/auth.store.js'

const auth = useAuthStore()
const router = useRouter()
const menuOuvert = ref(false)
const menuRef = ref(null)
const scrolled = ref(false)

const seDeconnecter = () => {
  auth.deconnexion()
  menuOuvert.value = false
  router.push('/connexion')
}

const fermerMenu = (e) => {
  if (menuRef.value && !menuRef.value.contains(e.target)) menuOuvert.value = false
}

const onScroll = () => { scrolled.value = window.scrollY > 20 }

onMounted(() => {
  document.addEventListener('click', fermerMenu)
  window.addEventListener('scroll', onScroll)
})
onUnmounted(() => {
  document.removeEventListener('click', fermerMenu)
  window.removeEventListener('scroll', onScroll)
})
</script>
<template>
  <Transition
    enter-active-class="transition duration-500 ease-out"
    enter-from-class="opacity-0 translate-y-full"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-300 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-full">

    <div v-if="visible" class="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 sm:px-4 sm:pb-4 md:px-6 md:pb-6">
      <div class="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 border border-red-500/30 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">

        <!-- Barre rouge top -->
        <div class="h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-pulse"></div>

        <div class="p-4 sm:p-5 md:p-6">

          <!-- Header -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 sm:w-10 sm:h-10 bg-red-500/20 border border-red-500/40 rounded-xl flex items-center justify-center flex-shrink-0">
                <span class="text-lg sm:text-xl">⚠️</span>
              </div>
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="font-display font-bold text-white text-base sm:text-lg">Avertissement important</h3>
                <span class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold animate-pulse">
                  URGENT
                </span>
              </div>
            </div>
            <button @click="fermerSansCocher"
              class="text-gray-500 hover:text-gray-300 transition-colors p-1 flex-shrink-0 ml-2">
              ✕
            </button>
          </div>

          <!-- Règles — scroll horizontal sur très petit écran -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-3">
            <div v-for="(regle, i) in regles" :key="i"
              class="bg-white/5 border border-white/10 rounded-xl p-2.5 sm:p-3 flex items-start gap-2">
              <span class="text-red-400 font-bold text-xs flex-shrink-0 mt-0.5">✕</span>
              <p class="text-gray-300 text-xs leading-relaxed">{{ regle }}</p>
            </div>
          </div>

          <!-- Message principal -->
          <div class="bg-red-500/10 border border-red-500/30 rounded-xl p-2.5 sm:p-3 mb-3">
            <p class="text-red-300 text-xs sm:text-sm font-semibold text-center leading-relaxed">
              🔴 NonTinTché ne vous demandera <span class="text-white">JAMAIS</span> d'envoyer de l'argent avant de voir le logement en personne !
            </p>
          </div>

          <!-- Actions -->
          <div class="flex flex-col xs:flex-row items-start xs:items-center gap-3">

            <!-- Checkbox -->
            <label class="flex items-center gap-2 cursor-pointer group flex-shrink-0">
              <div @click="toggleCheckbox"
                class="w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0"
                :class="compris
                  ? 'bg-primary-600 border-primary-600'
                  : 'border-gray-500 group-hover:border-gray-300'">
                <span v-if="compris" class="text-white text-xs font-bold">✓</span>
              </div>
              <span class="text-gray-300 text-xs sm:text-sm">J'ai lu et compris</span>
            </label>

            <!-- Boutons -->
            <div class="flex gap-2 w-full xs:w-auto xs:ml-auto">
              <RouterLink to="/charte"
                class="flex-1 xs:flex-none px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-medium rounded-xl transition-all text-center">
                En savoir plus
              </RouterLink>
              <button @click="fermer" :disabled="!compris"
                :class="compris
                  ? 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white cursor-pointer hover:scale-105 shadow-glow-sm'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'"
                class="flex-1 xs:flex-none px-3 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap">
                {{ compris ? 'Je comprends ✓' : 'Cochez d\'abord' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Overlay -->
  <Transition enter-active-class="transition duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100"
    leave-active-class="transition duration-300" leave-from-class="opacity-100" leave-to-class="opacity-0">
    <div v-if="visible && !compris" class="fixed inset-0 bg-black/30 z-40 pointer-events-none"></div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

const visible = ref(false)
const compris = ref(false)

const regles = [
  'Ne jamais envoyer de l\'argent à distance avant de visiter le logement et de rencontrer le propriétaire',
  'Ne jamais payer un montant différent de celui affiché, même pour une "réservation"',
  'Ne jamais communiquer vos informations bancaires ou Mobile Money sur cette plateforme',
]

const toggleCheckbox = () => { compris.value = !compris.value }

const fermer = () => {
  if (!compris.value) return
  visible.value = false
  localStorage.setItem('avertissement_vu', Date.now().toString())
}

const fermerSansCocher = () => {
  visible.value = false
  sessionStorage.setItem('avertissement_ferme', 'true')
}

onMounted(() => {
  const dernierVu = localStorage.getItem('avertissement_vu')
  const fermeDansSession = sessionStorage.getItem('avertissement_ferme')
  if (fermeDansSession) return
  if (dernierVu) {
    const heuresPassees = (Date.now() - parseInt(dernierVu)) / (1000 * 60 * 60)
    if (heuresPassees < 24) return
  }
  setTimeout(() => { visible.value = true }, 1500)
})
</script>

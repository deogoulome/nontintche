<template>
  <Transition
    enter-active-class="transition duration-500 ease-out"
    enter-from-class="opacity-0 translate-y-full"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-300 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-full">

    <div v-if="visible" class="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 md:px-6 md:pb-6">
      <div class="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 border border-red-500/30 rounded-3xl shadow-2xl overflow-hidden">

        <!-- Barre rouge top -->
        <div class="h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-pulse"></div>

        <div class="p-5 md:p-6">
          <div class="flex items-start gap-4">

            <!-- Icône -->
            <div class="w-12 h-12 bg-red-500/20 border border-red-500/40 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse">
              <span class="text-2xl">⚠️</span>
            </div>

            <!-- Contenu -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-2">
                <h3 class="font-display font-bold text-white text-lg">Avertissement important</h3>
                <span class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold animate-pulse">
                  URGENT
                </span>
              </div>

              <!-- Règles -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div v-for="(regle, i) in regles" :key="i"
                  class="bg-white/5 border border-white/10 rounded-xl p-3 flex items-start gap-2">
                  <span class="text-red-400 font-bold text-sm flex-shrink-0 mt-0.5">✕</span>
                  <p class="text-gray-300 text-xs leading-relaxed">{{ regle }}</p>
                </div>
              </div>

              <!-- Message principal -->
              <div class="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
                <p class="text-red-300 text-sm font-semibold text-center">
                  🔴 NonTinTché ne vous demandera <span class="text-white">JAMAIS</span> d'envoyer de l'argent avant de voir le logement en personne !
                </p>
              </div>

              <!-- Actions -->
              <div class="flex flex-col sm:flex-row items-center gap-3">
                <label class="flex items-center gap-2 cursor-pointer group">
                  <div @click="toggleCheckbox"
                    class="w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0"
                    :class="compris
                      ? 'bg-primary-600 border-primary-600'
                      : 'border-gray-500 group-hover:border-gray-300'">
                    <span v-if="compris" class="text-white text-xs font-bold">✓</span>
                  </div>
                  <span class="text-gray-300 text-sm">J'ai lu et compris cet avertissement</span>
                </label>

                <div class="flex gap-2 sm:ml-auto">
                  <RouterLink to="/charte"
                    class="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium rounded-xl transition-all">
                    En savoir plus
                  </RouterLink>
                  <button @click="fermer" :disabled="!compris"
                    :class="compris
                      ? 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white cursor-pointer hover:scale-105 shadow-glow-sm'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'"
                    class="px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200">
                    {{ compris ? 'Je comprends ✓' : 'Cochez d\'abord' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Fermer (X) -->
            <button @click="fermerSansCocher"
              class="text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0 p-1">
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Overlay semi-transparent quand visible -->
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
  'Ne jamais envoyer de l\'argent à distance avant de visiter le logement en personne et de rencontrer le vrai propriétaire',
  'Ne jamais payer un montant différent de celui affiché sur l\'annonce, même si le propriétaire dit que c\'est pour une "réservation"',
  'Ne jamais communiquer vos informations bancaires ou Mobile Money à qui que ce soit sur cette plateforme',
]

const toggleCheckbox = () => {
  compris.value = !compris.value
}

const fermer = () => {
  if (!compris.value) return
  visible.value = false
  // Mémoriser pour 24h
  localStorage.setItem('avertissement_vu', Date.now().toString())
}

const fermerSansCocher = () => {
  visible.value = false
  // Mémoriser seulement pour la session
  sessionStorage.setItem('avertissement_ferme', 'true')
}

onMounted(() => {
  // Vérifier si déjà vu dans les dernières 24h
  const dernierVu = localStorage.getItem('avertissement_vu')
  const fermeDansSession = sessionStorage.getItem('avertissement_ferme')

  if (fermeDansSession) return

  if (dernierVu) {
    const heuresPassees = (Date.now() - parseInt(dernierVu)) / (1000 * 60 * 60)
    if (heuresPassees < 24) return
  }

  // Afficher après 1.5 secondes
  setTimeout(() => {
    visible.value = true
  }, 1500)
})
</script>
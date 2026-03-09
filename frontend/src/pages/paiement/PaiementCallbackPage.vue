<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
    <div class="max-w-md w-full text-center animate-fade-in-up">

      <!-- Chargement -->
      <div v-if="statut === 'verification'" class="bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-card border border-gray-100 dark:border-gray-700">
        <div class="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h2 class="font-display text-xl font-bold text-gray-800 dark:text-white mb-2">Vérification en cours...</h2>
        <p class="text-gray-500 dark:text-gray-400 text-sm">Nous confirmons votre paiement</p>
      </div>

      <!-- Succès -->
      <div v-else-if="statut === 'confirme'" class="bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-card border border-green-100 dark:border-green-800">
        <div class="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <span class="text-white text-4xl">✓</span>
        </div>
        <h2 class="font-display text-2xl font-bold text-gray-800 dark:text-white mb-2">Paiement réussi ! 🎉</h2>
        <p class="text-gray-500 dark:text-gray-400 mb-2">Votre annonce est maintenant</p>
        <span class="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-1.5 rounded-full font-bold text-sm mb-6">
          ✅ Active
        </span>
        <p class="text-gray-400 text-xs mb-6">Redirection dans {{ compte }}s...</p>
        <RouterLink to="/dashboard"
          class="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-3.5 rounded-2xl font-bold transition-all hover:scale-105 shadow-glow-sm inline-block">
          Voir mon dashboard →
        </RouterLink>
      </div>

      <!-- Échec -->
      <div v-else-if="statut === 'echoue'" class="bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-card border border-red-100 dark:border-red-800">
        <div class="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <span class="text-white text-4xl">✕</span>
        </div>
        <h2 class="font-display text-2xl font-bold text-gray-800 dark:text-white mb-2">Paiement échoué</h2>
        <p class="text-gray-500 dark:text-gray-400 mb-6">Le paiement n'a pas pu être traité. Veuillez réessayer.</p>
        <RouterLink to="/dashboard"
          class="w-full bg-gray-800 dark:bg-gray-700 text-white py-3.5 rounded-2xl font-bold transition-all hover:scale-105 inline-block">
          ← Retour au dashboard
        </RouterLink>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import api from '../../services/api.js'

const route = useRoute()
const router = useRouter()
const statut = ref('verification')
const compte = ref(5)

onMounted(async () => {
  const transaction_id = route.query.id

  if (!transaction_id) {
    statut.value = 'echoue'
    return
  }

  try {
    const { data } = await api.get(`/paiements/verifier/${transaction_id}`)
    statut.value = data.statut === 'confirme' ? 'confirme' : 'echoue'

    if (statut.value === 'confirme') {
      // Compte à rebours redirection
      const interval = setInterval(() => {
        compte.value--
        if (compte.value <= 0) {
          clearInterval(interval)
          router.push('/dashboard')
        }
      }, 1000)
    }
  } catch (err) {
    statut.value = 'echoue'
  }
})
</script>
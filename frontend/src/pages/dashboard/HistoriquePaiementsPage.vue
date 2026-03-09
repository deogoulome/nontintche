<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <Navbar />

    <!-- Header -->
    <div class="bg-gradient-to-r from-primary-700 to-primary-600 text-white py-10 px-4 relative overflow-hidden">
      <div class="absolute inset-0 pattern-bg opacity-20"></div>
      <div class="relative max-w-4xl mx-auto">
        <p class="text-primary-200 text-sm font-medium mb-1">Mes transactions</p>
        <h1 class="font-display text-3xl font-bold">💳 Historique des paiements</h1>
        <p class="text-primary-100 mt-1">{{ paiements.length }} transaction(s)</p>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 py-8">

      <div v-if="chargement" class="text-center py-16">
        <div class="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>

      <div v-else-if="paiements.length === 0"
        class="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
        <div class="text-6xl mb-4">📭</div>
        <p class="text-gray-500 dark:text-gray-400 font-semibold">Aucun paiement effectué</p>
      </div>

      <div v-else class="space-y-4">
        <div v-for="(p, i) in paiements" :key="p.id"
          :style="`animation-delay: ${i * 0.05}s`"
          class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-card border border-gray-100 dark:border-gray-700 hover:shadow-card-hover transition-all duration-300 animate-fade-in-up flex items-center justify-between gap-4">

          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl flex items-center justify-center text-xl flex-shrink-0">
              💳
            </div>
            <div>
              <p class="font-semibold text-gray-800 dark:text-white">{{ p.annonce?.titre }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ p.typeannonce?.libelle }} — {{ p.typeannonce?.duree_jours }} jours
              </p>
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-1 font-mono">
                {{ p.reference_transaction }}
              </p>
            </div>
          </div>

          <div class="text-right flex-shrink-0">
            <p class="text-lg font-display font-bold text-primary-600">
              {{ Number(p.montant_paye).toLocaleString() }} F
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ p.mode_paiement }}</p>
            <span :class="p.statut === 'confirme'
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-yellow-100 text-yellow-700'"
              class="text-xs px-2.5 py-1 rounded-full font-semibold mt-1 inline-block">
              {{ p.statut === 'confirme' ? '✅ Confirmé' : '⏳ En attente' }}
            </span>
            <p class="text-xs text-gray-400 mt-1">
              {{ new Date(p.date_paiement).toLocaleDateString('fr-FR') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '../../components/layout/Navbar.vue'
import api from '../../services/api.js'

const paiements = ref([])
const chargement = ref(false)

onMounted(async () => {
  chargement.value = true
  try {
    const { data } = await api.get('/paiements/historique')
    paiements.value = data
  } catch (err) { console.error(err) }
  finally { chargement.value = false }
})
</script>
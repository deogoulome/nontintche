<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <Navbar />
    <AvertissementChercheur />
    <!-- Header -->
    <div class="bg-gradient-to-r from-primary-700 to-primary-600 text-white py-10 px-4">
      <div class="max-w-7xl mx-auto">
        <h1 class="font-display text-3xl md:text-4xl font-bold mb-2">🏠 Annonces disponibles</h1>
        <p class="text-primary-100">Trouvez le logement qui vous correspond</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">

      <!-- Filtres -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-8 shadow-card border border-gray-100 dark:border-gray-700">
        <p class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">🔍 Filtrer les annonces</p>
        <div class="flex flex-wrap gap-3">
          <input v-model="filtres.ville" type="text" placeholder="🏙️ Ville"
            class="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all" />
          <input v-model="filtres.quartier" type="text" placeholder="📍 Quartier"
            class="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all" />
          <input v-model="filtres.prix_max" type="number" placeholder="💰 Prix max"
            class="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm w-36 transition-all" />
          <select v-model="filtres.id_typechambre"
            class="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all">
            <option value="">🏠 Tous les types</option>
            <option v-for="t in typeChambres" :key="t.id" :value="t.id">{{ t.emoji }} {{ t.libelle }}</option>
          </select>
          <!-- <button @click="chargerAnnonces"
            class="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 shadow-glow-sm">
            Filtrer
          </button> -->
          <button @click="reinitialiser"
            class="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200">
            Réinitialiser
          </button>
        </div>
      </div>

      <!-- Résultats count -->
      <p v-if="!chargement" class="text-sm text-gray-500 dark:text-gray-400 mb-4">
        <span class="font-semibold text-primary-600">{{ annonces.length }}</span> annonce(s) trouvée(s)
      </p>

      <!-- Chargement -->
      <div v-if="chargement" class="text-center py-20">
        <div class="inline-flex flex-col items-center gap-4">
          <div class="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-gray-500 dark:text-gray-400 font-medium">Chargement des annonces...</p>
        </div>
      </div>

      <!-- Aucune annonce -->
      <div v-else-if="annonces.length === 0"
        class="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
        <div class="text-6xl mb-4">🔍</div>
        <p class="text-gray-600 dark:text-gray-300 text-lg font-semibold mb-2">Aucune annonce trouvée</p>
        <p class="text-gray-400 dark:text-gray-500 text-sm">Essayez d'autres critères de recherche</p>
      </div>

      <!-- Grille annonces -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="(annonce, i) in annonces" :key="annonce.id"
          :style="`animation-delay: ${i * 0.05}s`"
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 dark:border-gray-700 card-hover animate-fade-in-up group"
          @click="voirDetail(annonce.id)">

          <!-- Image -->
          <div class="h-48 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 flex items-center justify-center relative overflow-hidden">
            <img v-if="annonce.imageannonce?.length > 0"
              :src="annonce.imageannonce[0].chemin_image"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <span v-else class="text-6xl group-hover:scale-110 transition-transform duration-300">🏠</span>

            <!-- Badges -->
            <span class="absolute top-3 left-3 bg-primary-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
              {{ annonce.typechambre?.libelle }}
            </span>
            <span v-if="annonce.note_moyenne" class="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              ⭐ {{ annonce.note_moyenne }}
            </span>
          </div>

          <!-- Contenu -->
          <div class="p-5">
            <h3 class="font-bold text-gray-800 dark:text-white text-base mb-1 truncate group-hover:text-primary-600 transition-colors">
              {{ annonce.titre }}
            </h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm mb-3 flex items-center gap-1">
              <span>📍</span> {{ annonce.quartier }}, {{ annonce.ville }}
            </p>

            <!-- Commodités -->
            <div class="flex flex-wrap gap-1 mb-4">
              <span v-for="c in annonce.annoncecommodite?.slice(0, 3)" :key="c.id_commodite"
                class="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2.5 py-1 rounded-lg font-medium">
                {{ c.commodite.libelle }}
              </span>
              <span v-if="annonce.annoncecommodite?.length > 3"
                class="bg-primary-50 dark:bg-primary-900/30 text-primary-600 text-xs px-2.5 py-1 rounded-lg font-medium">
                +{{ annonce.annoncecommodite.length - 3 }}
              </span>
            </div>

            <!-- Prix et contact -->
            <div class="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
              <div>
                <p class="text-xl font-bold text-primary-600">
                  {{ Number(annonce.prix).toLocaleString() }}
                  <span class="text-xs font-normal text-gray-500">FCFA/mois</span>
                </p>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <span class="text-primary-600 text-xs font-bold">{{ annonce.utilisateur?.nom?.charAt(0) }}</span>
                </div>
                <span class="text-primary-600 text-sm font-semibold group-hover:translate-x-1 transition-transform inline-block">
                  Voir →
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>


import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Navbar from '../../components/layout/Navbar.vue'
import api from '../../services/api.js'
import AvertissementChercheur from '../../components/ui/AvertissementChercheur.vue'

const router = useRouter()
const route = useRoute()
const annonces = ref([])
const chargement = ref(false)
let debounceTimer = null

const typeChambres = [
  { id: 1, libelle: 'Studio', emoji: '🛏️' },
  { id: 2, libelle: 'Chambre simple', emoji: '🚪' },
  { id: 3, libelle: 'Chambre moderne', emoji: '✨' },
  { id: 4, libelle: 'Appartement', emoji: '🏢' },
  { id: 5, libelle: 'Villa', emoji: '🏡' },
]

const filtres = ref({
  ville: route.query.ville || '',
  quartier: route.query.quartier || '',
  prix_max: route.query.prix_max || '',
  id_typechambre: route.query.id_typechambre || '',
})

const chargerAnnonces = async () => {
  chargement.value = true
  try {
    const params = {}
    if (filtres.value.ville) params.ville = filtres.value.ville
    if (filtres.value.quartier) params.quartier = filtres.value.quartier
    if (filtres.value.prix_max) params.prix_max = filtres.value.prix_max
    if (filtres.value.id_typechambre) params.id_typechambre = filtres.value.id_typechambre
    const { data } = await api.get('/annonces', { params })
    annonces.value = data
  } catch (err) {
    console.error(err)
  } finally {
    chargement.value = false
  }
}

const reinitialiser = () => {
  filtres.value = { ville: '', quartier: '', prix_max: '', id_typechambre: '' }
}

// ✅ Watch avec debounce — attend 400ms après la dernière frappe
watch(filtres, () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    chargerAnnonces()
  }, 400)
}, { deep: true })

const voirDetail = (id) => router.push(`/annonces/${id}`)
onMounted(chargerAnnonces)


</script>

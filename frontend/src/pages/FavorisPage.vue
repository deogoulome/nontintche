<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <Navbar />

    <!-- Header -->
    <div class="bg-gradient-to-r from-primary-700 to-primary-600 text-white py-10 px-4 relative overflow-hidden">
      <div class="absolute inset-0 pattern-bg opacity-20"></div>
      <div class="relative max-w-7xl mx-auto">
        <p class="text-primary-200 text-sm font-medium mb-1">Mes sauvegardes</p>
        <h1 class="font-display text-3xl font-bold">❤️ Mes favoris</h1>
        <p class="text-primary-100 mt-1">{{ favoris.length }} annonce(s) sauvegardée(s)</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">

      <div v-if="chargement" class="text-center py-20">
        <div class="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-500">Chargement...</p>
      </div>

      <div v-else-if="favoris.length === 0"
        class="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
        <div class="text-6xl mb-4">💔</div>
        <p class="text-gray-600 dark:text-gray-300 text-lg font-semibold mb-2">Aucun favori pour le moment</p>
        <p class="text-gray-400 text-sm mb-6">Parcourez les annonces et sauvegardez vos préférées</p>
        <RouterLink to="/annonces"
          class="inline-block bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-600 transition-all hover:scale-105 shadow-glow-sm">
          Parcourir les annonces
        </RouterLink>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="(f, i) in favoris" :key="f.id"
          :style="`animation-delay: ${i * 0.05}s`"
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 card-hover animate-fade-in-up group">

          <!-- Image -->
          <div class="h-48 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 flex items-center justify-center relative overflow-hidden">
            <img v-if="f.annonce.imageannonce?.length > 0"
              :src="`http://localhost:3000/${f.annonce.imageannonce[0].chemin_image}`"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <span v-else class="text-6xl">🏠</span>

            <!-- Badge type -->
            <span class="absolute top-3 left-3 bg-primary-600 text-white text-xs px-3 py-1 rounded-full font-medium">
              {{ f.annonce.typechambre?.libelle }}
            </span>

            <!-- Bouton retirer favori -->
            <button @click="retirerFavori(f.annonce.id)"
              class="absolute top-3 right-3 w-9 h-9 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all duration-200 hover:bg-red-50">
              ❤️
            </button>
          </div>

          <!-- Contenu -->
          <div class="p-5">
            <h3 class="font-bold text-gray-800 dark:text-white truncate group-hover:text-primary-600 transition-colors">
              {{ f.annonce.titre }}
            </h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-3">
              📍 {{ f.annonce.quartier }}, {{ f.annonce.ville }}
            </p>

            <!-- Commodités -->
            <div class="flex flex-wrap gap-1 mb-4">
              <span v-for="c in f.annonce.annoncecommodite?.slice(0, 3)" :key="c.id_commodite"
                class="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2.5 py-1 rounded-lg font-medium">
                {{ c.commodite.libelle }}
              </span>
            </div>

            <div class="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
              <p class="text-xl font-bold text-primary-600">
                {{ Number(f.annonce.prix).toLocaleString() }}
                <span class="text-xs font-normal text-gray-500">FCFA/mois</span>
              </p>
              <RouterLink :to="`/annonces/${f.annonce.id}`"
                class="bg-primary-50 dark:bg-primary-900/30 text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-900/50 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105">
                Voir →
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import Navbar from '../components/layout/Navbar.vue'
import api from '../services/api.js'

const favoris = ref([])
const chargement = ref(false)

const chargerFavoris = async () => {
  chargement.value = true
  try {
    const { data } = await api.get('/favoris')
    favoris.value = data
  } catch (err) { console.error(err) }
  finally { chargement.value = false }
}

const retirerFavori = async (id_annonce) => {
  try {
    await api.post('/favoris', { id_annonce })
    await chargerFavoris()
  } catch (err) { console.error(err) }
}

onMounted(chargerFavoris)
</script>
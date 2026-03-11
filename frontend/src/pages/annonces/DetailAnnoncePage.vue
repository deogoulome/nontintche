<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Navbar />
    <AvertissementChercheur />

    <div v-if="chargement" class="text-center py-16">
      <div class="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-gray-500">Chargement...</p>
    </div>

    <div v-else-if="annonce" class="max-w-4xl mx-auto px-4 sm:px-6 py-8">

      <!-- Retour -->
      <button @click="$router.back()"
        class="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 mb-6 transition-colors">
        ← Retour aux annonces
      </button>

      <!-- Carousel images -->
      <div class="relative h-56 sm:h-72 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-gray-800 rounded-2xl mb-4 overflow-hidden">
        <div v-if="annonce.imageannonce?.length > 0">
          <img :src="annonce.imageannonce[imageActive].chemin_image"
            class="w-full h-56 sm:h-72 object-cover transition-opacity duration-300" />
          <button v-if="annonce.imageannonce.length > 1"
            @click="imageActive = (imageActive - 1 + annonce.imageannonce.length) % annonce.imageannonce.length"
            class="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-9 h-9 rounded-full flex items-center justify-center text-xl transition-colors">‹</button>
          <button v-if="annonce.imageannonce.length > 1"
            @click="imageActive = (imageActive + 1) % annonce.imageannonce.length"
            class="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-9 h-9 rounded-full flex items-center justify-center text-xl transition-colors">›</button>
          <div v-if="annonce.imageannonce.length > 1" class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            <button v-for="(img, index) in annonce.imageannonce" :key="index"
              @click="imageActive = index"
              :class="index === imageActive ? 'bg-white w-6' : 'bg-white/50 w-2'"
              class="h-2 rounded-full transition-all duration-300"></button>
          </div>
          <span class="absolute top-3 right-3 bg-black/40 text-white text-xs px-3 py-1 rounded-full">
            {{ imageActive + 1 }} / {{ annonce.imageannonce.length }}
          </span>
        </div>
        <div v-else class="w-full h-full flex items-center justify-center">
          <span class="text-8xl">🏠</span>
        </div>
      </div>

      <!-- Miniatures -->
      <div v-if="annonce.imageannonce?.length > 1" class="flex gap-2 mb-6 overflow-x-auto pb-1">
        <img v-for="(img, index) in annonce.imageannonce" :key="index"
          :src="img.chemin_image"
          @click="imageActive = index"
          :class="index === imageActive ? 'border-primary-500 opacity-100' : 'border-transparent opacity-60'"
          class="w-16 h-16 object-cover rounded-xl border-2 cursor-pointer hover:opacity-100 transition-all flex-shrink-0" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- Infos principales -->
        <div class="lg:col-span-2 space-y-6">

          <!-- Titre & Prix -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-card border border-gray-100 dark:border-gray-700">
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div class="flex-1">
                <span class="bg-primary-100 dark:bg-primary-900 text-primary-600 text-sm px-3 py-1 rounded-full font-medium">
                  {{ annonce.typechambre?.libelle }}
                </span>
                <h1 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mt-2">{{ annonce.titre }}</h1>
                <p class="text-gray-500 dark:text-gray-400 mt-1">📍 {{ annonce.quartier }}, {{ annonce.ville }}</p>
              </div>
              <p class="text-2xl font-bold text-primary-600 sm:text-right">
                {{ Number(annonce.prix).toLocaleString() }}
                <span class="text-sm font-normal text-gray-500 block">FCFA/mois</span>
              </p>
            </div>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">{{ annonce.description }}</p>
          </div>

          <!-- Commodités -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-card border border-gray-100 dark:border-gray-700">
            <h2 class="font-bold text-gray-800 dark:text-white mb-4">✨ Équipements</h2>
            <div class="flex flex-wrap gap-2">
              <span v-for="c in annonce.annoncecommodite" :key="c.id_commodite"
                class="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium">
                {{ c.commodite.libelle }}
              </span>
            </div>
          </div>

          <!-- Avis -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-card border border-gray-100 dark:border-gray-700">
            <h2 class="font-bold text-gray-800 dark:text-white mb-4">
              ⭐ Avis ({{ annonce.avis?.length || 0 }})
            </h2>

            <div v-if="annonce.avis?.length === 0" class="text-gray-400 text-sm mb-4">
              Aucun avis pour le moment
            </div>
            <div v-else class="space-y-3 mb-4">
              <div v-for="avis in annonce.avis" :key="avis.id"
                class="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0">
                <div class="flex items-center justify-between mb-1">
                  <span class="font-medium text-gray-700 dark:text-gray-300 text-sm">
                    {{ avis.utilisateur?.nom }} {{ avis.utilisateur?.prenom }}
                  </span>
                  <span class="text-yellow-500 text-sm">{{ '⭐'.repeat(avis.note) }}</span>
                </div>
                <p class="text-gray-500 dark:text-gray-400 text-sm">{{ avis.commentaire }}</p>
              </div>
            </div>

            <!-- Formulaire avis — connecté -->
            <div v-if="auth.estConnecte" class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <h3 class="font-semibold text-gray-700 dark:text-gray-300 mb-3">Laisser un avis</h3>
              <div class="flex gap-2 mb-3">
                <button v-for="n in 5" :key="n" @click="nouvelAvis.note = n"
                  class="text-2xl transition-transform hover:scale-110">
                  {{ n <= nouvelAvis.note ? '⭐' : '☆' }}
                </button>
              </div>
              <textarea v-model="nouvelAvis.commentaire" rows="2" placeholder="Votre commentaire..."
                class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm mb-2"></textarea>
              <div v-if="avisSucces" class="text-green-600 text-sm mb-2">✅ Avis envoyé !</div>
              <button @click="soumettreAvis"
                class="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors">
                Envoyer l'avis
              </button>
            </div>

            <!-- Non connecté — invitation -->
            <div v-else class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-5 text-center">
              <p class="text-gray-600 dark:text-gray-300 mb-3 text-sm">
                🔐 Connectez-vous pour laisser un avis
              </p>
              <RouterLink to="/connexion"
                class="inline-block bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:from-primary-700 hover:to-primary-600 transition-all hover:scale-105">
                Se connecter →
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-4">

          <!-- Contact propriétaire -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-card border border-gray-100 dark:border-gray-700 lg:sticky lg:top-20">
            <h2 class="font-bold text-gray-800 dark:text-white mb-4">👤 Propriétaire</h2>
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-white font-bold text-lg">{{ annonce.utilisateur?.nom?.charAt(0) }}</span>
              </div>
              <div>
                <p class="font-semibold text-gray-800 dark:text-white">
                  {{ annonce.utilisateur?.nom }} {{ annonce.utilisateur?.prenom }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Propriétaire</p>
              </div>
            </div>

            <!-- Téléphone — visible pour tous -->
            <a :href="`tel:${annonce.utilisateur?.telephone}`"
              class="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 hover:scale-[1.02] shadow-glow-sm">
              📞 {{ annonce.utilisateur?.telephone }}
            </a>

            <!-- Favori — connecté seulement -->
            <template v-if="auth.estConnecte">
              <button @click="toggleFavori"
                :class="estFavori
                  ? 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-500'
                  : 'border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20'"
                class="w-full mt-3 border-2 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 hover:scale-[1.02]">
                {{ estFavori ? '❤️ Retirer des favoris' : '🤍 Ajouter aux favoris' }}
              </button>
              <button @click="modalSignalement = true"
                class="w-full mt-2 text-red-500 hover:text-red-700 text-sm py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-1">
                🚩 Signaler cette annonce
              </button>
            </template>

            <!-- Non connecté -->
            <template v-else>
              <div class="mt-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                <p class="text-gray-500 dark:text-gray-400 text-xs mb-2">
                  Connectez-vous pour ajouter aux favoris ou signaler
                </p>
                <RouterLink to="/connexion"
                  class="inline-block text-primary-600 font-semibold text-sm hover:text-primary-700 transition-colors">
                  Se connecter →
                </RouterLink>
              </div>
            </template>

            <p class="text-xs text-gray-400 dark:text-gray-500 text-center mt-3">
              Contactez directement le propriétaire
            </p>
          </div>

          <!-- Détails -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-card border border-gray-100 dark:border-gray-700">
            <h2 class="font-bold text-gray-800 dark:text-white mb-4">📋 Détails</h2>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between items-center py-1.5 border-b border-gray-100 dark:border-gray-700">
                <span class="text-gray-500 dark:text-gray-400">Pièces</span>
                <span class="font-semibold text-gray-700 dark:text-gray-300">{{ annonce.nombre_pieces }}</span>
              </div>
              <div class="flex justify-between items-center py-1.5 border-b border-gray-100 dark:border-gray-700">
                <span class="text-gray-500 dark:text-gray-400">Type</span>
                <span class="font-semibold text-gray-700 dark:text-gray-300">{{ annonce.typechambre?.libelle }}</span>
              </div>
              <div class="flex justify-between items-center py-1.5">
                <span class="text-gray-500 dark:text-gray-400">Expire le</span>
                <span class="font-semibold text-gray-700 dark:text-gray-300">
                  {{ annonce.date_fin_annonce ? new Date(annonce.date_fin_annonce).toLocaleDateString('fr-FR') : '-' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Signalement -->
    <div v-if="modalSignalement" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-fade-in-up">
        <h3 class="font-display font-bold text-gray-800 dark:text-white text-xl mb-1">🚩 Signaler</h3>
        <p class="text-gray-500 dark:text-gray-400 text-sm mb-5">Aidez-nous à maintenir la qualité</p>

        <div v-if="signalementSucces"
          class="bg-green-50 dark:bg-green-900/20 border border-green-200 text-green-600 px-4 py-3 rounded-xl mb-4 text-sm">
          ✅ Signalement envoyé ! Merci.
        </div>

        <div v-else class="space-y-4">
          <div class="grid grid-cols-2 gap-2">
            <button v-for="motif in motifs" :key="motif"
              @click="signalement.motif = motif"
              :class="signalement.motif === motif
                ? 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-600'
                : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300'"
              class="border-2 rounded-xl py-2.5 px-3 text-sm font-medium transition-all">
              {{ motif }}
            </button>
          </div>

          <textarea v-model="signalement.description" rows="3"
            placeholder="Décrivez le problème..."
            class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400 resize-none text-sm"></textarea>

          <div class="flex gap-3">
            <button @click="fermerSignalement"
              class="flex-1 border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Annuler
            </button>
            <button @click="envoyerSignalement" :disabled="!signalement.motif || signalementChargement"
              class="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white py-3 rounded-xl font-bold transition-all hover:scale-[1.02]">
              <span v-if="signalementChargement">⏳...</span>
              <span v-else>Envoyer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
import Navbar from '../../components/layout/Navbar.vue'
import AvertissementChercheur from '../../components/ui/AvertissementChercheur.vue'
import { useAuthStore } from '../../store/auth.store.js'
import api from '../../services/api.js'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const annonce = ref(null)
const chargement = ref(false)
const imageActive = ref(0)
const estFavori = ref(false)
const nouvelAvis = ref({ note: 5, commentaire: '' })
const avisSucces = ref(false)
const modalSignalement = ref(false)
const signalementSucces = ref(false)
const signalementChargement = ref(false)
const motifs = ['Arnaque', 'Contenu inapproprié', 'Annonce dupliquée', 'Autre']
const signalement = ref({ motif: '', description: '' })

const requireAuth = () => {
  if (!auth.estConnecte) {
    if (confirm('Vous devez être connecté pour cette action. Se connecter maintenant ?')) {
      router.push('/connexion')
    }
    return false
  }
  return true
}

const toggleFavori = async () => {
  if (!requireAuth()) return
  try {
    const { data } = await api.post('/favoris', { id_annonce: annonce.value.id })
    estFavori.value = data.favori
  } catch (err) { console.error(err) }
}

const soumettreAvis = async () => {
  if (!requireAuth()) return
  try {
    await api.post('/avis', {
      id_annonce: annonce.value.id,
      note: nouvelAvis.value.note,
      commentaire: nouvelAvis.value.commentaire
    })
    avisSucces.value = true
    nouvelAvis.value = { note: 5, commentaire: '' }
    const { data } = await api.get(`/annonces/${route.params.id}`)
    annonce.value = data
    setTimeout(() => avisSucces.value = false, 3000)
  } catch (err) { console.error(err) }
}

const envoyerSignalement = async () => {
  if (!requireAuth()) return
  signalementChargement.value = true
  try {
    await api.post('/signalements', {
      id_annonce: annonce.value.id,
      motif: signalement.value.motif,
      description: signalement.value.description
    })
    signalementSucces.value = true
    setTimeout(() => fermerSignalement(), 2000)
  } catch (err) { console.error(err) }
  finally { signalementChargement.value = false }
}

const fermerSignalement = () => {
  modalSignalement.value = false
  signalementSucces.value = false
  signalement.value = { motif: '', description: '' }
}

onMounted(async () => {
  chargement.value = true
  try {
    const { data } = await api.get(`/annonces/${route.params.id}`)
    annonce.value = data

    // Vérifier si en favori (seulement si connecté)
    if (auth.estConnecte) {
      const favoris = await api.get('/favoris')
      estFavori.value = favoris.data.some(f => f.id_annonce === data.id)
    }
  } catch (err) {
    console.error(err)
  } finally {
    chargement.value = false
  }
})
</script>

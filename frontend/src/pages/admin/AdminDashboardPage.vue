<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Navbar />
    <div class="max-w-7xl mx-auto px-4 py-8">

      <!-- Header -->
   <div class="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-10 px-4 -mx-4 mb-8 rounded-b-3xl">
  <div class="max-w-7xl mx-auto">
    <p class="text-gray-400 text-sm font-medium mb-1">Administration</p>
    <h1 class="font-display text-3xl font-bold">⚙️ Tableau de bord admin</h1>
    <p class="text-gray-400 mt-1">Gérez les utilisateurs, annonces et signalements</p>
  </div>
</div>

      <!-- Tabs -->
      <div class="flex gap-2 mb-6 bg-white dark:bg-gray-800 p-1 rounded-2xl shadow-sm w-fit">
        <button v-for="tab in tabs" :key="tab.id" @click="tabActive = tab.id"
          :class="tabActive === tab.id
            ? 'bg-primary-600 text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
          class="px-5 py-2 rounded-xl font-medium text-sm transition-all">
          {{ tab.emoji }} {{ tab.label }}
        </button>
      </div>

      <!-- Stats -->
      <div v-if="tabActive === 'dashboard'">
        <div v-if="chargement" class="text-center py-16">
          <div class="text-5xl mb-4">⏳</div>
        </div>
        <div v-else>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
              <p class="text-3xl font-bold text-primary-600">{{ stats.totalUtilisateurs }}</p>
              <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">👤 Utilisateurs</p>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
              <p class="text-3xl font-bold text-blue-500">{{ stats.totalAnnonces }}</p>
              <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">🏠 Annonces</p>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
              <p class="text-3xl font-bold text-green-500">{{ Number(stats.totalPaiements).toLocaleString() }} F</p>
              <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">💰 Revenus</p>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
              <p class="text-3xl font-bold text-red-500">{{ stats.signalements }}</p>
              <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">🚩 Signalements</p>
            </div>
          </div>

          <!-- Annonces récentes -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
            <div class="p-5 border-b border-gray-100 dark:border-gray-700">
              <h2 class="font-bold text-gray-800 dark:text-white">🕐 Dernières annonces</h2>
            </div>
            <div class="divide-y divide-gray-100 dark:divide-gray-700">
              <div v-for="a in annoncesRecentes" :key="a.id" class="p-4 flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-800 dark:text-white">{{ a.titre }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    👤 {{ a.utilisateur?.nom }} — 📍 {{ a.ville }}
                  </p>
                </div>
                <span :class="{
                  'bg-green-100 text-green-700': a.statut === 'active',
                  'bg-yellow-100 text-yellow-700': a.statut === 'en_attente_paiement',
                  'bg-red-100 text-red-700': a.statut === 'expiree',
                  'bg-gray-100 text-gray-700': a.statut === 'suspendue',
                }" class="text-xs px-3 py-1 rounded-full font-medium">
                  {{ statutLabel(a.statut) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Utilisateurs -->
      <div v-if="tabActive === 'utilisateurs'">
        <div v-if="chargementU" class="text-center py-16"><div class="text-5xl">⏳</div></div>
        <div v-else class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div class="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h2 class="font-bold text-gray-800 dark:text-white">👥 Utilisateurs ({{ utilisateurs.length }})</h2>
            <input v-model="searchU" type="text" placeholder="🔍 Rechercher..."
              class="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
          </div>
          <div class="divide-y divide-gray-100 dark:divide-gray-700">
            <div v-for="u in utilisateursFiltres" :key="u.id"
              class="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                  <span class="text-white font-bold">{{ u.nom?.charAt(0) }}</span>
                </div>
                <div>
                  <p class="font-medium text-gray-800 dark:text-white">{{ u.nom }} {{ u.prenom }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ u.login }} — {{ u.telephone }}</p>
                  <div class="flex gap-2 mt-1">
                    <span class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                      {{ u.role }}
                    </span>
                    <span class="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-2 py-0.5 rounded-full">
                      {{ u._count?.annonce }} annonce(s)
                    </span>
                  </div>
                </div>
              </div>
              <button @click="toggleUser(u)"
                :class="u.est_actif ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'"
                class="px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                {{ u.est_actif ? '🚫 Désactiver' : '✅ Activer' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Annonces -->
      <div v-if="tabActive === 'annonces'">
        <div v-if="chargementA" class="text-center py-16"><div class="text-5xl">⏳</div></div>
        <div v-else class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div class="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h2 class="font-bold text-gray-800 dark:text-white">🏠 Annonces ({{ annonces.length }})</h2>
            <input v-model="searchA" type="text" placeholder="🔍 Rechercher..."
              class="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
          </div>
          <div class="divide-y divide-gray-100 dark:divide-gray-700">
            <div v-for="a in annoncesFiltrees" :key="a.id"
              class="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750">
              <div class="flex items-center gap-3">
                <div class="w-14 h-14 bg-primary-100 dark:bg-primary-900 rounded-xl overflow-hidden flex items-center justify-center">
                  <img v-if="a.imageannonce?.length > 0"
                    :src="`http://localhost:3000/${a.imageannonce[0].chemin_image}`"
                    class="w-full h-full object-cover" />
                  <span v-else class="text-2xl">🏠</span>
                </div>
                <div>
                  <p class="font-medium text-gray-800 dark:text-white">{{ a.titre }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    👤 {{ a.utilisateur?.nom }} — 📍 {{ a.ville }}, {{ a.quartier }}
                  </p>
                  <p class="text-sm font-medium text-primary-600">{{ Number(a.prix).toLocaleString() }} FCFA/mois</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span :class="{
                  'bg-green-100 text-green-700': a.statut === 'active',
                  'bg-yellow-100 text-yellow-700': a.statut === 'en_attente_paiement',
                  'bg-red-100 text-red-700': a.statut === 'expiree',
                  'bg-gray-100 text-gray-700': a.statut === 'suspendue',
                }" class="text-xs px-3 py-1 rounded-full font-medium">
                  {{ statutLabel(a.statut) }}
                </span>
                <button @click="toggleAnnonce(a)"
                  :class="a.statut === 'suspendue' ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-red-100 text-red-600 hover:bg-red-200'"
                  class="px-3 py-1 rounded-xl text-xs font-medium transition-colors">
                  {{ a.statut === 'suspendue' ? '✅ Réactiver' : '⏸️ Suspendre' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Signalements -->
      <div v-if="tabActive === 'signalements'">
        <div v-if="chargementS" class="text-center py-16"><div class="text-5xl">⏳</div></div>
        <div v-else class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div class="p-5 border-b border-gray-100 dark:border-gray-700">
            <h2 class="font-bold text-gray-800 dark:text-white">🚩 Signalements ({{ signalements.length }})</h2>
          </div>
          <div v-if="signalements.length === 0" class="text-center py-12">
            <div class="text-5xl mb-3">✅</div>
            <p class="text-gray-500">Aucun signalement en cours</p>
          </div>
          <div v-else class="divide-y divide-gray-100 dark:divide-gray-700">
            <div v-for="s in signalements" :key="s.id" class="p-4">
              <div class="flex items-start justify-between">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-medium text-gray-800 dark:text-white text-sm">{{ s.motif }}</span>
                    <span :class="{
                      'bg-yellow-100 text-yellow-700': s.statut === 'en_cours',
                      'bg-green-100 text-green-700': s.statut === 'traite',
                      'bg-gray-100 text-gray-700': s.statut === 'rejete',
                    }" class="text-xs px-2 py-0.5 rounded-full font-medium">
                      {{ s.statut }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    📋 Annonce : <span class="text-primary-600">{{ s.annonce?.titre }}</span>
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    👤 Signalé par : {{ s.utilisateur?.nom }} {{ s.utilisateur?.prenom }}
                  </p>
                  <p v-if="s.description" class="text-sm text-gray-400 mt-1 italic">{{ s.description }}</p>
                </div>
                <div v-if="s.statut === 'en_cours'" class="flex gap-2 ml-4">
                  <button @click="traiterSignalement(s.id, 'traite')"
                    class="bg-green-100 text-green-600 hover:bg-green-200 px-3 py-1 rounded-xl text-xs font-medium transition-colors">
                    ✅ Traité
                  </button>
                  <button @click="traiterSignalement(s.id, 'rejete')"
                    class="bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 px-3 py-1 rounded-xl text-xs font-medium transition-colors">
                    ❌ Rejeter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Navbar from '../../components/layout/Navbar.vue'
import api from '../../services/api.js'

const tabActive = ref('dashboard')
const tabs = [
  { id: 'dashboard', label: 'Dashboard', emoji: '📊' },
  { id: 'utilisateurs', label: 'Utilisateurs', emoji: '👥' },
  { id: 'annonces', label: 'Annonces', emoji: '🏠' },
  { id: 'signalements', label: 'Signalements', emoji: '🚩' },
]

// Dashboard
const chargement = ref(false)
const stats = ref({})
const annoncesRecentes = ref([])

// Utilisateurs
const chargementU = ref(false)
const utilisateurs = ref([])
const searchU = ref('')
const utilisateursFiltres = computed(() =>
  utilisateurs.value.filter(u =>
    `${u.nom} ${u.prenom} ${u.login} ${u.telephone}`.toLowerCase().includes(searchU.value.toLowerCase())
  )
)

// Annonces
const chargementA = ref(false)
const annonces = ref([])
const searchA = ref('')
const annoncesFiltrees = computed(() =>
  annonces.value.filter(a =>
    `${a.titre} ${a.ville} ${a.quartier}`.toLowerCase().includes(searchA.value.toLowerCase())
  )
)

// Signalements
const chargementS = ref(false)
const signalements = ref([])

const statutLabel = (statut) => ({
  active: '✅ Active',
  en_attente_paiement: '⏳ En attente',
  expiree: '❌ Expirée',
  suspendue: '⏸️ Suspendue',
}[statut] || statut)

const chargerDashboard = async () => {
  chargement.value = true
  try {
    const { data } = await api.get('/admin/dashboard')
    stats.value = data.stats
    annoncesRecentes.value = data.annoncesRecentes
  } catch (err) { console.error(err) }
  finally { chargement.value = false }
}

const chargerUtilisateurs = async () => {
  chargementU.value = true
  try {
    const { data } = await api.get('/admin/utilisateurs')
    utilisateurs.value = data
  } catch (err) { console.error(err) }
  finally { chargementU.value = false }
}

const chargerAnnonces = async () => {
  chargementA.value = true
  try {
    const { data } = await api.get('/admin/annonces')
    annonces.value = data
  } catch (err) { console.error(err) }
  finally { chargementA.value = false }
}

const chargerSignalements = async () => {
  chargementS.value = true
  try {
    const { data } = await api.get('/admin/signalements')
    signalements.value = data
  } catch (err) { console.error(err) }
  finally { chargementS.value = false }
}

const toggleUser = async (u) => {
  try {
    await api.put(`/admin/utilisateurs/${u.id}/toggle`)
    u.est_actif = !u.est_actif
  } catch (err) { console.error(err) }
}

const toggleAnnonce = async (a) => {
  try {
    await api.put(`/admin/annonces/${a.id}/toggle`)
    await chargerAnnonces()
  } catch (err) { console.error(err) }
}

const traiterSignalement = async (id, statut) => {
  try {
    await api.put(`/admin/signalements/${id}`, { statut })
    await chargerSignalements()
  } catch (err) { console.error(err) }
}

watch(tabActive, (val) => {
  if (val === 'utilisateurs' && utilisateurs.value.length === 0) chargerUtilisateurs()
  if (val === 'annonces' && annonces.value.length === 0) chargerAnnonces()
  if (val === 'signalements' && signalements.value.length === 0) chargerSignalements()
})

onMounted(chargerDashboard)
</script>
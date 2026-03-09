<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Navbar />

    <div class="bg-gradient-to-r from-primary-700 to-primary-600 text-white py-10 px-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <p class="text-primary-200 text-sm font-medium mb-1">Tableau de bord</p>
          <h1 class="font-display text-3xl font-bold">Bonjour, {{ auth.utilisateur?.nom }} 👋</h1>
          <p class="text-primary-100 mt-1">Gérez vos annonces depuis votre espace</p>
        </div>
        <RouterLink to="/dashboard/nouvelle-annonce"
          class="bg-white text-primary-700 hover:bg-gray-50 px-6 py-3 rounded-2xl font-bold transition-all duration-200 hover:scale-105 shadow-lg hidden md:flex items-center gap-2">
          + Nouvelle annonce
        </RouterLink>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">

      <!-- Bouton mobile -->
      <RouterLink to="/dashboard/nouvelle-annonce"
        class="md:hidden w-full mb-6 bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
        + Nouvelle annonce
      </RouterLink>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <p class="text-3xl font-bold text-primary-600">{{ stats.total }}</p>
          <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Total annonces</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <p class="text-3xl font-bold text-green-500">{{ stats.actives }}</p>
          <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Actives</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <p class="text-3xl font-bold text-yellow-500">{{ stats.enAttente }}</p>
          <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">En attente</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <p class="text-3xl font-bold text-red-500">{{ stats.expirees }}</p>
          <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Expirées</p>
        </div>
      </div>

      <!-- Liste annonces -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 class="font-bold text-gray-800 dark:text-white text-lg">Mes annonces</h2>
        </div>

        <div v-if="chargement" class="text-center py-12">
          <div class="text-4xl mb-3">⏳</div>
          <p class="text-gray-500">Chargement...</p>
        </div>

        <div v-else-if="annonces.length === 0" class="text-center py-12">
          <div class="text-5xl mb-4">📭</div>
          <p class="text-gray-500 dark:text-gray-400">Aucune annonce pour le moment</p>
          <RouterLink to="/dashboard/nouvelle-annonce"
            class="mt-4 inline-block bg-primary-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors">
            Créer ma première annonce
          </RouterLink>
        </div>

        <div v-else class="divide-y divide-gray-100 dark:divide-gray-700">
          <div v-for="annonce in annonces" :key="annonce.id"
            class="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center text-2xl">
                🏠
              </div>
              <div>
                <p class="font-semibold text-gray-800 dark:text-white">{{ annonce.titre }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">📍 {{ annonce.quartier }}, {{ annonce.ville }}</p>
                <p class="text-sm font-medium text-primary-600 mt-1">
                  {{ Number(annonce.prix).toLocaleString() }} FCFA/mois
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <!-- Statut -->
              <span :class="{
                'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400': annonce.statut === 'active',
                'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400': annonce.statut === 'en_attente_paiement',
                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': annonce.statut === 'expiree',
                'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400': annonce.statut === 'suspendue',
              }" class="text-xs px-3 py-1 rounded-full font-medium">
                {{ statutLabel(annonce.statut) }}
              </span>

              <!-- Payer si en attente -->
              <button v-if="annonce.statut === 'en_attente_paiement'"
                @click="ouvrirPaiement(annonce)"
                class="bg-primary-600 hover:bg-primary-700 text-white text-xs px-4 py-2 rounded-xl font-medium transition-colors">
                💳 Payer
              </button>

            <button v-if="annonce.statut === 'expiree'"
                @click="ouvrirRenouvellement(annonce)"
                class="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-xl font-medium transition-colors">
                🔄 Renouveler
                </button>

              <!-- Supprimer -->
              <button @click="supprimerAnnonce(annonce.id)"
                class="text-red-500 hover:text-red-700 text-sm px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Paiement -->
    <div v-if="modalPaiement" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h3 class="font-bold text-gray-800 dark:text-white text-lg mb-2">💳 Paiement de l'annonce</h3>
        <p class="text-gray-500 dark:text-gray-400 text-sm mb-4">{{ annonceSel?.titre }}</p>

        <div class="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4 mb-4">
          <p class="text-sm text-gray-600 dark:text-gray-300">Montant à payer</p>
          <p class="text-2xl font-bold text-primary-600">
            {{ Number(annonceSel?.typeannonce?.prix).toLocaleString() }} FCFA
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Durée : {{ annonceSel?.typeannonce?.duree_jours }} jours
          </p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mode de paiement</label>
          <select v-model="modePaiement"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="Mobile Money">📱 Mobile Money</option>
            <option value="Carte">💳 Carte bancaire</option>
            <option value="Especes">💵 Espèces</option>
          </select>
        </div>

        <div class="flex gap-3">
          <button @click="modalPaiement = false"
            class="flex-1 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 py-3 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Annuler
          </button>
          <button @click="effectuerPaiement" :disabled="paiementChargement"
            class="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white py-3 rounded-xl font-semibold transition-colors">
            <span v-if="paiementChargement">⏳...</span>
            <span v-else>Confirmer</span>
          </button>
        </div>
      </div>
    </div>

<!-- Modal Renouvellement -->
<div v-if="modalRenouvellement" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
  <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
    <h3 class="font-bold text-gray-800 dark:text-white text-lg mb-2">🔄 Renouveler l'annonce</h3>
    <p class="text-gray-500 dark:text-gray-400 text-sm mb-4">{{ annonceSel?.titre }}</p>

    <div class="grid grid-cols-3 gap-2 mb-4">
      <button v-for="t in typeAnnonces" :key="t.id"
        @click="typeRenouvellement = t.id"
        :class="typeRenouvellement === t.id
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
          : 'border-gray-200 dark:border-gray-600'"
        class="border-2 rounded-xl p-3 text-center transition-all">
        <p class="font-bold text-gray-800 dark:text-white text-sm">{{ t.libelle }}</p>
        <p class="text-xs text-gray-500">{{ t.duree_jours }}j</p>
        <p class="text-primary-600 font-semibold text-sm">{{ Number(t.prix).toLocaleString() }}F</p>
      </button>
    </div>

    <select v-model="modePaiement"
      class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4">
      <option value="Mobile Money">📱 Mobile Money</option>
      <option value="Carte">💳 Carte bancaire</option>
      <option value="Especes">💵 Espèces</option>
    </select>

    <div class="flex gap-3">
      <button @click="modalRenouvellement = false"
        class="flex-1 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 py-3 rounded-xl font-medium transition-colors">
        Annuler
      </button>
      <button @click="effectuerRenouvellement" :disabled="renouvellementChargement"
        class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-semibold transition-colors">
        <span v-if="renouvellementChargement">⏳...</span>
        <span v-else>Renouveler</span>
      </button>
    </div>
  </div>
</div>

  </div>
</template>






<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import Navbar from '../../components/layout/Navbar.vue'
import { useAuthStore } from '../../store/auth.store.js'
import api from '../../services/api.js'

const auth = useAuthStore()
const annonces = ref([])
const chargement = ref(false)
const modalPaiement = ref(false)
const annonceSel = ref(null)
const modePaiement = ref('Mobile Money')
const paiementChargement = ref(false)
const modalRenouvellement = ref(false)
const typeRenouvellement = ref(2)
const renouvellementChargement = ref(false)
const typeAnnonces = ref([
  { id: 1, libelle: 'Basique', duree_jours: 7, prix: 500 },
  { id: 2, libelle: 'Standard', duree_jours: 30, prix: 1500 },
  { id: 3, libelle: 'Premium', duree_jours: 90, prix: 3500 },
])

const stats = computed(() => ({
  total: annonces.value.length,
  actives: annonces.value.filter(a => a.statut === 'active').length,
  enAttente: annonces.value.filter(a => a.statut === 'en_attente_paiement').length,
  expirees: annonces.value.filter(a => a.statut === 'expiree').length,
}))

const statutLabel = (statut) => {
  const labels = {
    active: '✅ Active',
    en_attente_paiement: '⏳ En attente',
    expiree: '❌ Expirée',
    suspendue: '⏸️ Suspendue',
  }
  return labels[statut] || statut
}

const chargerAnnonces = async () => {
  chargement.value = true
  try {
    const { data } = await api.get('/annonces/mes-annonces')
    annonces.value = data
  } catch (err) {
    console.error(err)
  } finally {
    chargement.value = false
  }
}

const ouvrirPaiement = (annonce) => {
  annonceSel.value = annonce
  modalPaiement.value = true
}

// const effectuerPaiement = async () => {
//   paiementChargement.value = true
//   try {
//     await api.post('/paiements', {
//       id_annonce: annonceSel.value.id,
//       mode_paiement: modePaiement.value
//     })
//     modalPaiement.value = false
//     await chargerAnnonces()
//   } catch (err) {
//     console.error(err)
//   } finally {
//     paiementChargement.value = false
//   }
// }

const effectuerPaiement = async () => {
  paiementChargement.value = true
  try {
    const { data } = await api.post('/paiements', {
      id_annonce: annonceSel.value.id,
    })
    // Rediriger vers FedaPay
    window.location.href = data.payment_url
  } catch (err) {
    console.error(err)
    alert('Erreur lors de l\'initiation du paiement')
  } finally {
    paiementChargement.value = false
  }
}

const supprimerAnnonce = async (id) => {
  if (!confirm('Voulez-vous vraiment supprimer cette annonce ?')) return
  try {
    await api.delete(`/annonces/${id}`)
    await chargerAnnonces()
  } catch (err) {
    console.error(err)
  }
}

const ouvrirRenouvellement = (annonce) => {
  annonceSel.value = annonce
  modalRenouvellement.value = true
}

// const effectuerRenouvellement = async () => {
//   renouvellementChargement.value = true
//   try {
//     await api.post(`/annonces/${annonceSel.value.id}/renouveler`, {
//       id_typeannonce: typeRenouvellement.value,
//       mode_paiement: modePaiement.value
//     })
//     modalRenouvellement.value = false
//     await chargerAnnonces()
//   } catch (err) {
//     console.error(err)
//   } finally {
//     renouvellementChargement.value = false
//   }
// }


const effectuerRenouvellement = async () => {
  renouvellementChargement.value = true
  try {
    const { data } = await api.post('/paiements', {
      id_annonce: annonceSel.value.id,
      id_typeannonce: typeRenouvellement.value,
    })
    // Rediriger vers FedaPay
    window.location.href = data.payment_url
  } catch (err) {
    console.error(err)
    alert('Erreur lors du renouvellement')
  } finally {
    renouvellementChargement.value = false
  }
}

onMounted(chargerAnnonces)
</script>
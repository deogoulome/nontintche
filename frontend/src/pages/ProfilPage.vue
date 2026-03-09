<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <Navbar />

    <!-- Header -->
    <div class="bg-gradient-to-r from-primary-700 to-primary-600 text-white py-12 px-4 relative overflow-hidden">
      <div class="absolute inset-0 pattern-bg opacity-20"></div>
      <div class="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      <div class="relative max-w-2xl mx-auto flex items-center gap-5">
        <div class="w-16 h-16 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-2xl flex items-center justify-center flex-shrink-0">
          <span class="text-white font-display font-bold text-2xl">{{ profil?.nom?.charAt(0) }}</span>
        </div>
        <div>
          <p class="text-primary-200 text-sm font-medium">Mon compte</p>
          <h1 class="font-display text-2xl font-bold">{{ profil?.nom }} {{ profil?.prenom }}</h1>
          <span class="inline-block mt-1 text-xs bg-white/20 text-white px-3 py-1 rounded-full font-medium">
            {{ profil?.role === 'proprietaire' ? '🏠 Propriétaire' : '🔍 Chercheur' }}
          </span>
        </div>
      </div>
    </div>

    <div class="max-w-2xl mx-auto px-4 py-8">

      <div v-if="chargement" class="text-center py-16">
        <div class="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>

      <div v-else class="space-y-6">

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center shadow-card border border-gray-100 dark:border-gray-700">
            <p class="text-2xl font-display font-bold text-primary-600">{{ profil?._count?.annonce || 0 }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Annonces</p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center shadow-card border border-gray-100 dark:border-gray-700">
            <p class="text-2xl font-display font-bold text-primary-600">{{ profil?._count?.favori || 0 }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Favoris</p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center shadow-card border border-gray-100 dark:border-gray-700">
            <p class="text-2xl font-display font-bold text-primary-600">{{ profil?._count?.avis || 0 }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Avis</p>
          </div>
        </div>

        <!-- Modifier profil -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <h2 class="font-display font-bold text-gray-800 dark:text-white">✏️ Modifier mon profil</h2>
          </div>
          <div class="p-6">
            <div v-if="erreur" class="bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
              ⚠️ {{ erreur }}
            </div>
            <div v-if="succes" class="bg-green-50 dark:bg-green-900/20 border border-green-200 text-green-600 px-4 py-3 rounded-xl mb-4 text-sm">
              ✅ {{ succes }}
            </div>

            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nom</label>
                  <input v-model="form.nom" type="text"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Prénom</label>
                  <input v-model="form.prenom" type="text"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Téléphone</label>
                <input v-model="form.telephone" type="tel"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Adresse</label>
                <input v-model="form.adresse" type="text"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all" />
              </div>
              <button @click="sauvegarderProfil" :disabled="sauvegarde"
                class="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 disabled:opacity-50 text-white py-3 rounded-xl font-bold transition-all hover:scale-[1.02] shadow-glow-sm">
                {{ sauvegarde ? '⏳ Sauvegarde...' : 'Sauvegarder les modifications' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Changer mot de passe -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <h2 class="font-display font-bold text-gray-800 dark:text-white">🔒 Changer le mot de passe</h2>
          </div>
          <div class="p-6">
            <div v-if="erreurMdp" class="bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
              ⚠️ {{ erreurMdp }}
            </div>
            <div v-if="succesMdp" class="bg-green-50 dark:bg-green-900/20 border border-green-200 text-green-600 px-4 py-3 rounded-xl mb-4 text-sm">
              ✅ {{ succesMdp }}
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Ancien mot de passe</label>
                <input v-model="mdp.ancien" type="password"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nouveau mot de passe</label>
                <input v-model="mdp.nouveau" type="password"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all" />
              </div>
              <button @click="changerMdp" :disabled="changementMdp"
                class="w-full bg-gray-800 dark:bg-gray-600 hover:bg-gray-900 dark:hover:bg-gray-500 disabled:opacity-50 text-white py-3 rounded-xl font-bold transition-all hover:scale-[1.02]">
                {{ changementMdp ? '⏳...' : 'Changer le mot de passe' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Infos compte -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700 p-6">
          <h2 class="font-display font-bold text-gray-800 dark:text-white mb-4">📋 Informations du compte</h2>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <span class="text-gray-500 dark:text-gray-400">Login</span>
              <span class="font-semibold text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">{{ profil?.login }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <span class="text-gray-500 dark:text-gray-400">Rôle</span>
              <span class="font-semibold text-primary-600 bg-primary-50 dark:bg-primary-900/30 px-3 py-1 rounded-lg">{{ profil?.role }}</span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-gray-500 dark:text-gray-400">Membre depuis</span>
              <span class="font-semibold text-gray-800 dark:text-white">
                {{ profil?.date_inscription ? new Date(profil.date_inscription).toLocaleDateString('fr-FR') : '-' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '../components/layout/Navbar.vue'
import api from '../services/api.js'

const profil = ref(null)
const chargement = ref(false)
const erreur = ref('')
const succes = ref('')
const sauvegarde = ref(false)
const erreurMdp = ref('')
const succesMdp = ref('')
const changementMdp = ref(false)
const form = ref({ nom: '', prenom: '', telephone: '', adresse: '' })
const mdp = ref({ ancien: '', nouveau: '' })

onMounted(async () => {
  chargement.value = true
  try {
    const { data } = await api.get('/utilisateurs/profil')
    profil.value = data
    form.value = { nom: data.nom, prenom: data.prenom, telephone: data.telephone, adresse: data.adresse || '' }
  } catch (err) { console.error(err) }
  finally { chargement.value = false }
})

const sauvegarderProfil = async () => {
  erreur.value = ''
  succes.value = ''
  sauvegarde.value = true
  try {
    await api.put('/utilisateurs/profil', form.value)
    succes.value = 'Profil mis à jour avec succès !'
    setTimeout(() => succes.value = '', 3000)
  } catch (err) {
    erreur.value = err.response?.data?.message || 'Erreur lors de la sauvegarde'
  } finally { sauvegarde.value = false }
}

const changerMdp = async () => {
  erreurMdp.value = ''
  succesMdp.value = ''
  if (!mdp.value.ancien || !mdp.value.nouveau) {
    erreurMdp.value = 'Veuillez remplir les deux champs'
    return
  }
  changementMdp.value = true
  try {
    await api.put('/utilisateurs/changer-mdp', mdp.value)
    succesMdp.value = 'Mot de passe changé avec succès !'
    mdp.value = { ancien: '', nouveau: '' }
    setTimeout(() => succesMdp.value = '', 3000)
  } catch (err) {
    erreurMdp.value = err.response?.data?.message || 'Erreur'
  } finally { changementMdp.value = false }
}
</script>
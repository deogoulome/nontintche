<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 flex items-center justify-center px-4 py-10 relative overflow-hidden">
    <div class="absolute inset-0 pattern-bg opacity-20"></div>
    <div class="absolute top-1/4 right-1/4 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl"></div>

    <div class="relative w-full max-w-lg animate-fade-in-up">

      <!-- Logo -->
      <div class="text-center mb-8">
        <RouterLink to="/" class="inline-flex items-center gap-2 group">
          <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-glow">
            <span class="text-white font-display font-bold text-xl">N</span>
          </div>
          <span class="font-display font-bold text-2xl text-white">
            Non<span class="gradient-text">TinTché</span>
          </span>
        </RouterLink>
        <h1 class="font-display text-2xl font-bold text-white mt-4">Créer un compte 🎉</h1>
        <p class="text-gray-400 mt-1">Rejoignez NonTinTché aujourd'hui</p>
      </div>

      <!-- Carte -->
      <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">

        <div v-if="erreur"
          class="bg-red-500/20 border border-red-500/40 text-red-300 px-4 py-3 rounded-xl mb-5 text-sm">
          ⚠️ {{ erreur }}
        </div>
        <div v-if="succes"
          class="bg-green-500/20 border border-green-500/40 text-green-300 px-4 py-3 rounded-xl mb-5 text-sm">
          ✅ Compte créé ! Redirection...
        </div>

        <div class="space-y-4">
          <!-- Nom / Prénom -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">Nom</label>
              <input v-model="form.nom" type="text" placeholder="Dupont"
                class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">Prénom</label>
              <input v-model="form.prenom" type="text" placeholder="Jean"
                class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all" />
            </div>
          </div>

          <!-- Téléphone -->
          <div>
            <label class="block text-sm font-semibold text-gray-300 mb-2">Téléphone</label>
            <input v-model="form.telephone" type="tel" placeholder="97000000"
              class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all" />
          </div>

          <!-- Adresse -->
          <div>
            <label class="block text-sm font-semibold text-gray-300 mb-2">Adresse</label>
            <input v-model="form.adresse" type="text" placeholder="Cotonou, Bénin"
              class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all" />
          </div>

          <!-- Login -->
          <div>
            <label class="block text-sm font-semibold text-gray-300 mb-2">Login</label>
            <input v-model="form.login" type="text" placeholder="jean.dupont"
              class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all" />
          </div>

          <!-- Mot de passe -->
          <div>
            <label class="block text-sm font-semibold text-gray-300 mb-2">Mot de passe</label>
            <div class="relative">
              <input v-model="form.motdepasse" :type="afficherMdp ? 'text' : 'password'"
                placeholder="••••••••"
                class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all pr-12" />
              <button @click="afficherMdp = !afficherMdp"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                {{ afficherMdp ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <!-- Rôle -->
          <div>
            <label class="block text-sm font-semibold text-gray-300 mb-2">Je suis...</label>
            <div class="grid grid-cols-2 gap-3">
              <button @click="form.role = 'chercheur'"
                :class="form.role === 'chercheur'
                  ? 'border-primary-500 bg-primary-500/20 text-primary-300'
                  : 'border-white/20 text-gray-400 hover:border-white/40'"
                class="border-2 rounded-xl py-3 px-4 font-semibold transition-all text-sm">
                🔍 Chercheur
              </button>
              <button @click="form.role = 'proprietaire'"
                :class="form.role === 'proprietaire'
                  ? 'border-primary-500 bg-primary-500/20 text-primary-300'
                  : 'border-white/20 text-gray-400 hover:border-white/40'"
                class="border-2 rounded-xl py-3 px-4 font-semibold transition-all text-sm">
                🏠 Propriétaire
              </button>
            </div>
          </div>

          <!-- Bouton -->
          <button @click="sInscrire" :disabled="chargement"
            class="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 disabled:opacity-50 text-white py-3.5 rounded-xl font-bold transition-all duration-200 hover:scale-[1.02] shadow-glow mt-2 flex items-center justify-center">
            <span v-if="chargement">
              <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              Création...
            </span>
            <span v-else>Créer mon compte →</span>
          </button>
        </div>

        <p class="text-center text-sm text-gray-400 mt-6">
          Déjà un compte ?
          <RouterLink to="/connexion" class="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
            Se connecter
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../../store/auth.store.js'

const auth = useAuthStore()
const router = useRouter()
const form = ref({ nom: '', prenom: '', telephone: '', adresse: '', login: '', motdepasse: '', role: 'chercheur' })
const erreur = ref('')
const succes = ref(false)
const chargement = ref(false)
const afficherMdp = ref(false)

const sInscrire = async () => {
  erreur.value = ''
  if (!form.value.nom || !form.value.prenom || !form.value.telephone || !form.value.login || !form.value.motdepasse) {
    erreur.value = 'Veuillez remplir tous les champs obligatoires'
    return
  }
  chargement.value = true
  try {
    await auth.inscription(form.value)
    succes.value = true
    setTimeout(() => router.push('/connexion'), 1500)
  } catch (err) {
    erreur.value = err.response?.data?.message || 'Erreur lors de l\'inscription'
  } finally {
    chargement.value = false
  }
}
</script>
<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
    <!-- Effets background -->
    <div class="absolute inset-0 pattern-bg opacity-20"></div>
    <div class="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl"></div>
    <div class="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary-300/10 rounded-full blur-2xl"></div>

    <div class="relative w-full max-w-md animate-fade-in-up">

      <!-- Logo -->
      <div class="text-center mb-8">
        <RouterLink to="/" class="inline-flex items-center gap-2 group">
          <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-glow group-hover:shadow-glow transition-all">
            <span class="text-white font-display font-bold text-xl">N</span>
          </div>
          <span class="font-display font-bold text-2xl text-white">
            Non<span class="gradient-text">TinTché</span>
          </span>
        </RouterLink>
        <h1 class="font-display text-2xl font-bold text-white mt-4">Bon retour ! 👋</h1>
        <p class="text-gray-400 mt-1">Connectez-vous à votre compte</p>
      </div>

      <!-- Carte -->
      <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">

        <!-- Erreur -->
        <div v-if="erreur"
          class="bg-red-500/20 border border-red-500/40 text-red-300 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
          ⚠️ {{ erreur }}
        </div>

        <div class="space-y-5">
          <!-- Login -->
          <div>
            <label class="block text-sm font-semibold text-gray-300 mb-2">Login</label>
            <input v-model="form.login" type="text" placeholder="votre.login"
              @keyup.enter="seConnecter"
              class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />
          </div>

          <!-- Mot de passe -->
          <div>
            <label class="block text-sm font-semibold text-gray-300 mb-2">Mot de passe</label>
            <div class="relative">
              <input v-model="form.motdepasse" :type="afficherMdp ? 'text' : 'password'"
                placeholder="••••••••" @keyup.enter="seConnecter"
                class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all pr-12" />
              <button @click="afficherMdp = !afficherMdp"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors">
                {{ afficherMdp ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <!-- Bouton -->
          <button @click="seConnecter" :disabled="chargement"
            class="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 disabled:opacity-50 text-white py-3.5 rounded-xl font-bold transition-all duration-200 hover:scale-[1.02] shadow-glow flex items-center justify-center gap-2">
            <span v-if="chargement">
              <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              Connexion...
            </span>
            <span v-else>Se connecter →</span>
          </button>
        </div>

        <p class="text-center text-sm text-gray-400 mt-6">
          Pas encore de compte ?
          <RouterLink to="/inscription" class="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
            S'inscrire
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
const form = ref({ login: '', motdepasse: '' })
const erreur = ref('')
const chargement = ref(false)
const afficherMdp = ref(false)

const seConnecter = async () => {
  erreur.value = ''
  if (!form.value.login || !form.value.motdepasse) {
    erreur.value = 'Veuillez remplir tous les champs'
    return
  }
  chargement.value = true
  try {
    const data = await auth.connexion(form.value.login, form.value.motdepasse)
    if (data.utilisateur.role === 'admin') router.push('/admin')
    else if (data.utilisateur.role === 'proprietaire') router.push('/dashboard')
    else router.push('/annonces')
  } catch (err) {
    erreur.value = err.response?.data?.message || 'Erreur de connexion'
  } finally {
    chargement.value = false
  }
}
</script>
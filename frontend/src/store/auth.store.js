import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api.js'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const utilisateur = ref(JSON.parse(localStorage.getItem('utilisateur') || 'null'))
  const darkMode = ref(localStorage.getItem('darkMode') === 'true')

  const estConnecte = computed(() => !!token.value)
  const estProprietaire = computed(() => utilisateur.value?.role === 'proprietaire')
  const estAdmin = computed(() => utilisateur.value?.role === 'admin')
  

  const connexion = async (login, motdepasse) => {
    const { data } = await api.post('/auth/connexion', { login, motdepasse })
    token.value = data.token
    utilisateur.value = data.utilisateur
    localStorage.setItem('token', data.token)
    localStorage.setItem('utilisateur', JSON.stringify(data.utilisateur))
    return data
  }

  const inscription = async (form) => {
    const { data } = await api.post('/auth/inscription', form)
    return data
  }

  const deconnexion = () => {
    token.value = null
    utilisateur.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('utilisateur')
  }

  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value
    localStorage.setItem('darkMode', darkMode.value)
    document.documentElement.classList.toggle('dark', darkMode.value)
  }

  // Appliquer le dark mode au chargement
  if (darkMode.value) {
    document.documentElement.classList.add('dark')
  }

  return { token, utilisateur, estConnecte, estProprietaire, estAdmin, darkMode, connexion, inscription, deconnexion, toggleDarkMode }
})
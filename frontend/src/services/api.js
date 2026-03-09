import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
})

// Ajouter le token automatiquement à chaque requête
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Gérer les erreurs globalement
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('utilisateur')
      window.location.href = '/connexion'
    }
    return Promise.reject(error)
  }
)

export default api
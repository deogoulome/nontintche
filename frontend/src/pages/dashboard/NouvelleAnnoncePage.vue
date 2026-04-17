<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Navbar />

    <div class="max-w-2xl mx-auto px-4 py-8">
      <button @click="$router.back()" class="flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-6 transition-colors">
        ← Retour
      </button>

      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 sm:p-8">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">📝 Nouvelle annonce</h1>
        <p class="text-gray-500 dark:text-gray-400 mb-6">Remplissez les informations de votre logement</p>

        <div v-if="erreur" class="bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
          ⚠️ {{ erreur }}
        </div>

        <div class="space-y-5">

          <!-- Titre -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Titre de l'annonce <span class="text-red-500">*</span>
            </label>
            <input v-model="form.titre" type="text"
              placeholder="Ex: Belle chambre moderne à Cotonou"
              maxlength="100"
              @input="form.titre = form.titre.replace(/[^a-zA-ZÀ-ÿ0-9\s\-,.']/g, '')"
              :class="erreurs.titre ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-200 dark:border-gray-600'"
              class="w-full px-4 py-3 rounded-xl border bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
            <div class="flex justify-between mt-1">
              <p v-if="erreurs.titre" class="text-red-500 text-xs">{{ erreurs.titre }}</p>
              <p class="text-xs text-gray-400 ml-auto">{{ form.titre.length }}/100</p>
            </div>
          </div>

          <!-- Ville / Quartier -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ville <span class="text-red-500">*</span>
              </label>
              <input v-model="form.ville" type="text" placeholder="Cotonou"
                maxlength="50"
                @input="form.ville = form.ville.replace(/[^a-zA-ZÀ-ÿ\s\-]/g, '')"
                :class="erreurs.ville ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-200 dark:border-gray-600'"
                class="w-full px-4 py-3 rounded-xl border bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <p v-if="erreurs.ville" class="text-red-500 text-xs mt-1">{{ erreurs.ville }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quartier <span class="text-red-500">*</span>
              </label>
              <input v-model="form.quartier" type="text" placeholder="Akpakpa"
                maxlength="50"
                @input="form.quartier = form.quartier.replace(/[^a-zA-ZÀ-ÿ0-9\s\-]/g, '')"
                :class="erreurs.quartier ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-200 dark:border-gray-600'"
                class="w-full px-4 py-3 rounded-xl border bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <p v-if="erreurs.quartier" class="text-red-500 text-xs mt-1">{{ erreurs.quartier }}</p>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description <span class="text-red-500">*</span>
            </label>
            <textarea v-model="form.description" rows="4"
              placeholder="Décrivez votre logement (minimum 20 caractères)..."
              maxlength="1000"
              :class="erreurs.description ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-200 dark:border-gray-600'"
              class="w-full px-4 py-3 rounded-xl border bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"></textarea>
            <div class="flex justify-between mt-1">
              <p v-if="erreurs.description" class="text-red-500 text-xs">{{ erreurs.description }}</p>
              <p class="text-xs text-gray-400 ml-auto">{{ form.description.length }}/1000</p>
            </div>
          </div>

          <!-- Prix / Pièces -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prix (FCFA/mois) <span class="text-red-500">*</span>
              </label>
              <input v-model="form.prix" type="number"
                placeholder="25000" min="1000" max="10000000"
                :class="erreurs.prix ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-200 dark:border-gray-600'"
                class="w-full px-4 py-3 rounded-xl border bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <p v-if="erreurs.prix" class="text-red-500 text-xs mt-1">{{ erreurs.prix }}</p>
              <p v-else class="text-xs text-gray-400 mt-1">Min : 1 000 FCFA — Max : 10 000 000 FCFA</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre de pièces <span class="text-red-500">*</span>
              </label>
              <input v-model="form.nombre_pieces" type="number"
                min="1" max="20" placeholder="1"
                :class="erreurs.nombre_pieces ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-200 dark:border-gray-600'"
                class="w-full px-4 py-3 rounded-xl border bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <p v-if="erreurs.nombre_pieces" class="text-red-500 text-xs mt-1">{{ erreurs.nombre_pieces }}</p>
              <p v-else class="text-xs text-gray-400 mt-1">Entre 1 et 20 pièces</p>
            </div>
          </div>

          <!-- Type chambre -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type de logement <span class="text-red-500">*</span>
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button v-for="t in typeChambres" :key="t.id" @click="form.id_typechambre = t.id"
                :class="form.id_typechambre === t.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                  : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300'"
                class="border-2 rounded-xl py-3 text-sm font-medium transition-all hover:border-primary-400">
                {{ t.emoji }} {{ t.libelle }}
              </button>
            </div>
            <p v-if="erreurs.id_typechambre" class="text-red-500 text-xs mt-1">{{ erreurs.id_typechambre }}</p>
          </div>

          <!-- Type annonce -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Durée de publication <span class="text-red-500">*</span>
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button v-for="t in typeAnnonces" :key="t.id" @click="form.id_typeannonce = t.id"
                :class="form.id_typeannonce === t.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-600'"
                class="border-2 rounded-xl p-3 text-center transition-all hover:border-primary-400">
                <p class="font-bold text-gray-800 dark:text-white text-sm">{{ t.libelle }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ t.duree_jours }} jours</p>
                <p class="text-primary-600 font-semibold text-sm mt-1">{{ Number(t.prix).toLocaleString() }} F</p>
              </button>
            </div>
            <p v-if="erreurs.id_typeannonce" class="text-red-500 text-xs mt-1">{{ erreurs.id_typeannonce }}</p>
          </div>

          <!-- Commodités -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Équipements disponibles <span class="text-gray-400 font-normal">(optionnel)</span>
            </label>
            <div class="flex flex-wrap gap-2">
              <button v-for="c in commodites" :key="c.id" @click="toggleCommodite(c.id)"
                :class="form.commodites.includes(c.id)
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'"
                class="border-2 rounded-xl px-4 py-2 text-sm font-medium transition-all hover:border-primary-400">
                {{ c.libelle }}
              </button>
            </div>
          </div>

          <!-- Upload images -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              📷 Photos du logement
              <span class="text-gray-400 font-normal">(max 5 photos — fortement recommandé)</span>
            </label>
            <div
              @click="$refs.inputImages.click()"
              @dragover.prevent
              @drop.prevent="onDrop"
              class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all">
              <div class="text-4xl mb-2">📸</div>
              <p class="text-gray-500 dark:text-gray-400 text-sm">Cliquez ou glissez vos photos ici</p>
              <p class="text-gray-400 dark:text-gray-500 text-xs mt-1">JPG, PNG, WEBP — Max 5MB par image</p>
              <input ref="inputImages" type="file" multiple accept="image/jpeg,image/png,image/webp" class="hidden" @change="onSelectImages" />
            </div>
            <p v-if="erreurs.images" class="text-red-500 text-xs mt-1">{{ erreurs.images }}</p>

            <div v-if="aperçuImages.length > 0" class="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-3">
              <div v-for="(img, index) in aperçuImages" :key="index" class="relative group">
                <img :src="img.url" class="w-full h-20 object-cover rounded-xl border-2"
                  :class="index === 0 ? 'border-primary-500' : 'border-gray-200 dark:border-gray-600'" />
                <span v-if="index === 0"
                  class="absolute top-1 left-1 bg-primary-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  ⭐
                </span>
                <button @click="supprimerImage(index)"
                  class="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  ✕
                </button>
              </div>
            </div>
            <p v-if="aperçuImages.length > 0" class="text-xs text-gray-400 dark:text-gray-500 mt-2">
              ⭐ = photo principale affichée dans la liste
            </p>
          </div>

          <!-- Avertissement charte -->
          <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
            <span class="text-red-500 text-xl flex-shrink-0">⚠️</span>
            <div>
              <p class="text-red-700 dark:text-red-400 font-semibold text-sm">Rappel important</p>
              <p class="text-red-600 dark:text-red-300 text-xs mt-1 leading-relaxed">
                Toute fausse information entraîne la suppression définitive de votre compte.
                <RouterLink to="/charte" class="underline font-semibold hover:text-red-800">
                  Lire la charte d'honnêteté →
                </RouterLink>
              </p>
            </div>
          </div>

          <!-- Bouton soumettre -->
          <button @click="creerAnnonce" :disabled="chargement"
            class="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 disabled:opacity-60 text-white py-4 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] shadow-glow-sm">
            <span v-if="chargement">{{ etapeChargement }}</span>
            <span v-else>Créer l'annonce →</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import Navbar from '../../components/layout/Navbar.vue'
import api from '../../services/api.js'

const router = useRouter()
const erreur = ref('')
const erreurs = ref({})
const chargement = ref(false)
const etapeChargement = ref('')
const inputImages = ref(null)
const aperçuImages = ref([])
const fichiers = ref([])

const form = ref({
  titre: '', ville: '', quartier: '', description: '',
  prix: '', nombre_pieces: 1,
  id_typechambre: null, id_typeannonce: null, commodites: []
})

const typeChambres = [
  { id: 1, libelle: 'Studio', emoji: '🛏️' },
  { id: 2, libelle: 'Chambre simple', emoji: '🚪' },
  { id: 3, libelle: 'Chambre moderne', emoji: '✨' },
  { id: 4, libelle: 'Appartement', emoji: '🏢' },
  { id: 5, libelle: 'Villa', emoji: '🏡' },
]

const typeAnnonces = ref([])
const commodites = ref([])

const toggleCommodite = (id) => {
  const idx = form.value.commodites.indexOf(id)
  if (idx === -1) form.value.commodites.push(id)
  else form.value.commodites.splice(idx, 1)
}

// Validation complète
const validerFormulaire = () => {
  const e = {}

  // Titre
  if (!form.value.titre.trim()) {
    e.titre = 'Le titre est obligatoire'
  } else if (form.value.titre.trim().length < 10) {
    e.titre = 'Le titre doit contenir au moins 10 caractères'
  } else if (form.value.titre.trim().length > 100) {
    e.titre = 'Le titre ne peut pas dépasser 100 caractères'
  }

  // Ville
  if (!form.value.ville.trim()) {
    e.ville = 'La ville est obligatoire'
  } else if (form.value.ville.trim().length < 2) {
    e.ville = 'Ville invalide'
  }

  // Quartier
  if (!form.value.quartier.trim()) {
    e.quartier = 'Le quartier est obligatoire'
  } else if (form.value.quartier.trim().length < 2) {
    e.quartier = 'Quartier invalide'
  }

  // Description
  if (!form.value.description.trim()) {
    e.description = 'La description est obligatoire'
  } else if (form.value.description.trim().length < 20) {
    e.description = 'La description doit contenir au moins 20 caractères'
  }

  // Prix
  const prix = Number(form.value.prix)
  if (!form.value.prix) {
    e.prix = 'Le prix est obligatoire'
  } else if (isNaN(prix) || prix < 1000) {
    e.prix = 'Le prix minimum est 1 000 FCFA'
  } else if (prix > 10000000) {
    e.prix = 'Le prix maximum est 10 000 000 FCFA'
  }

  // Nombre de pièces
  const pieces = Number(form.value.nombre_pieces)
  if (!form.value.nombre_pieces) {
    e.nombre_pieces = 'Le nombre de pièces est obligatoire'
  } else if (pieces < 1 || pieces > 20) {
    e.nombre_pieces = 'Le nombre de pièces doit être entre 1 et 20'
  }

  // Type chambre
  if (!form.value.id_typechambre) {
    e.id_typechambre = 'Veuillez choisir un type de logement'
  }

  // Type annonce
  if (!form.value.id_typeannonce) {
    e.id_typeannonce = 'Veuillez choisir une durée de publication'
  }

  erreurs.value = e
  return Object.keys(e).length === 0
}

const onSelectImages = (e) => {
  ajouterFichiers(Array.from(e.target.files))
}

const onDrop = (e) => {
  ajouterFichiers(Array.from(e.dataTransfer.files))
}

const ajouterFichiers = (nouveaux) => {
  erreurs.value.images = ''
  const typesAcceptes = ['image/jpeg', 'image/png', 'image/webp']
  const restants = 5 - fichiers.value.length
  const aAjouter = nouveaux.slice(0, restants)

  aAjouter.forEach(f => {
    if (!typesAcceptes.includes(f.type)) {
      erreurs.value.images = 'Format non accepté — JPG, PNG ou WEBP uniquement'
      return
    }
    if (f.size > 5 * 1024 * 1024) {
      erreurs.value.images = `"${f.name}" dépasse 5MB`
      return
    }
    fichiers.value.push(f)
    aperçuImages.value.push({ url: URL.createObjectURL(f), nom: f.name })
  })

  if (nouveaux.length > restants) {
    erreurs.value.images = `Maximum 5 photos — ${nouveaux.length - restants} photo(s) ignorée(s)`
  }
}

const supprimerImage = (index) => {
  aperçuImages.value.splice(index, 1)
  fichiers.value.splice(index, 1)
}

const creerAnnonce = async () => {
  erreur.value = ''

  if (!validerFormulaire()) {
    erreur.value = 'Veuillez corriger les erreurs ci-dessous'
    // Scroll vers le haut pour voir l'erreur
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  chargement.value = true
  try {
    etapeChargement.value = '⏳ Création de l\'annonce...'
    const { data } = await api.post('/annonces', {
      ...form.value,
      titre: form.value.titre.trim(),
      ville: form.value.ville.trim(),
      quartier: form.value.quartier.trim(),
      description: form.value.description.trim(),
    })
    const annonceId = data.annonce.id

    if (fichiers.value.length > 0) {
      etapeChargement.value = '📸 Upload des images...'
      const formData = new FormData()
      fichiers.value.forEach(f => formData.append('images', f))
      await api.post(`/annonces/${annonceId}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }

    router.push('/dashboard')
  } catch (err) {
    erreur.value = err.response?.data?.message || 'Erreur lors de la création'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    chargement.value = false
    etapeChargement.value = ''
  }
}

onMounted(async () => {
  try {
    const [ta, com] = await Promise.all([
      api.get('/typeannonces'),
      api.get('/commodites'),
    ])
    typeAnnonces.value = ta.data
    commodites.value = com.data
  } catch (err) {
    typeAnnonces.value = [
      { id: 1, libelle: 'Basique', duree_jours: 7, prix: 500 },
      { id: 2, libelle: 'Standard', duree_jours: 30, prix: 1500 },
      { id: 3, libelle: 'Premium', duree_jours: 90, prix: 3500 },
    ]
    commodites.value = [
      { id: 1, libelle: 'WiFi' }, { id: 2, libelle: 'Eau courante' },
      { id: 3, libelle: 'Electricité' }, { id: 4, libelle: 'Climatisation' },
      { id: 5, libelle: 'Parking' }, { id: 6, libelle: 'Gardien' },
      { id: 7, libelle: 'Cuisine équipée' },
    ]
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Navbar />

    <div class="max-w-2xl mx-auto px-4 py-8">
      <button @click="$router.back()" class="flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-6 transition-colors">
        ← Retour
      </button>

      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">📝 Nouvelle annonce</h1>
        <p class="text-gray-500 dark:text-gray-400 mb-6">Remplissez les informations de votre logement</p>

        <div v-if="erreur" class="bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
          ⚠️ {{ erreur }}
        </div>

        <div class="space-y-5">
          <!-- Titre -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Titre de l'annonce</label>
            <input v-model="form.titre" type="text" placeholder="Ex: Belle chambre moderne à Cotonou"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>

          <!-- Ville / Quartier -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ville</label>
              <input v-model="form.ville" type="text" placeholder="Cotonou"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quartier</label>
              <input v-model="form.quartier" type="text" placeholder="Akpakpa"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <textarea v-model="form.description" rows="4" placeholder="Décrivez votre logement..."
              class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"></textarea>
          </div>

          <!-- Prix / Pièces -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prix (FCFA/mois)</label>
              <input v-model="form.prix" type="number" placeholder="25000"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre de pièces</label>
              <input v-model="form.nombre_pieces" type="number" min="1" placeholder="1"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>

          <!-- Type chambre -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type de logement</label>
            <div class="grid grid-cols-3 gap-2">
              <button v-for="t in typeChambres" :key="t.id" @click="form.id_typechambre = t.id"
                :class="form.id_typechambre === t.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                  : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300'"
                class="border-2 rounded-xl py-3 text-sm font-medium transition-all">
                {{ t.emoji }} {{ t.libelle }}
              </button>
            </div>
          </div>

          <!-- Type annonce -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Durée de publication</label>
            <div class="grid grid-cols-3 gap-3">
              <button v-for="t in typeAnnonces" :key="t.id" @click="form.id_typeannonce = t.id"
                :class="form.id_typeannonce === t.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-600'"
                class="border-2 rounded-xl p-3 text-center transition-all">
                <p class="font-bold text-gray-800 dark:text-white text-sm">{{ t.libelle }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ t.duree_jours }} jours</p>
                <p class="text-primary-600 font-semibold text-sm mt-1">{{ Number(t.prix).toLocaleString() }} F</p>
              </button>
            </div>
          </div>

          <!-- Commodités -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Équipements disponibles</label>
            <div class="flex flex-wrap gap-2">
              <button v-for="c in commodites" :key="c.id" @click="toggleCommodite(c.id)"
                :class="form.commodites.includes(c.id)
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'"
                class="border-2 rounded-xl px-4 py-2 text-sm font-medium transition-all">
                {{ c.libelle }}
              </button>
            </div>
          </div>

          <!-- Upload images -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              📷 Photos du logement <span class="text-gray-400 font-normal">(max 5 photos)</span>
            </label>

            <!-- Zone de drop -->
            <div
              @click="$refs.inputImages.click()"
              @dragover.prevent
              @drop.prevent="onDrop"
              class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all">
              <div class="text-4xl mb-2">📸</div>
              <p class="text-gray-500 dark:text-gray-400 text-sm">Cliquez ou glissez vos photos ici</p>
              <p class="text-gray-400 dark:text-gray-500 text-xs mt-1">JPG, PNG, WEBP — Max 5MB par image</p>
              <input ref="inputImages" type="file" multiple accept="image/*" class="hidden" @change="onSelectImages" />
            </div>

            <!-- Aperçu images -->
            <div v-if="aperçuImages.length > 0" class="grid grid-cols-3 gap-3 mt-4">
              <div v-for="(img, index) in aperçuImages" :key="index" class="relative group">
                <img :src="img.url" class="w-full h-24 object-cover rounded-xl border-2"
                  :class="index === 0 ? 'border-primary-500' : 'border-gray-200 dark:border-gray-600'" />
                <!-- Badge principale -->
                <span v-if="index === 0"
                  class="absolute top-1 left-1 bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                  Principale
                </span>
                <!-- Bouton supprimer -->
                <button @click="supprimerImage(index)"
                  class="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  ✕
                </button>
              </div>
            </div>
            <p v-if="aperçuImages.length > 0" class="text-xs text-gray-400 dark:text-gray-500 mt-2">
              💡 La première image sera la photo principale de l'annonce
            </p>
          </div>

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
            class="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white py-4 rounded-xl font-bold text-lg transition-colors">
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
import { useRouter } from 'vue-router'
import Navbar from '../../components/layout/Navbar.vue'
import api from '../../services/api.js'

const router = useRouter()
const erreur = ref('')
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

const onSelectImages = (e) => {
  ajouterFichiers(Array.from(e.target.files))
}

const onDrop = (e) => {
  ajouterFichiers(Array.from(e.dataTransfer.files))
}

const ajouterFichiers = (nouveaux) => {
  const restants = 5 - fichiers.value.length
  const aAjouter = nouveaux.slice(0, restants)
  aAjouter.forEach(f => {
    if (f.size > 5 * 1024 * 1024) return
    fichiers.value.push(f)
    aperçuImages.value.push({ url: URL.createObjectURL(f), nom: f.name })
  })
}

const supprimerImage = (index) => {
  aperçuImages.value.splice(index, 1)
  fichiers.value.splice(index, 1)
}

const creerAnnonce = async () => {
  erreur.value = ''
  if (!form.value.titre || !form.value.ville || !form.value.quartier || !form.value.prix) {
    erreur.value = 'Veuillez remplir tous les champs obligatoires'
    return
  }
  if (!form.value.id_typechambre || !form.value.id_typeannonce) {
    erreur.value = 'Veuillez choisir un type de logement et une durée'
    return
  }

  chargement.value = true
  try {
    // Étape 1 : Créer l'annonce
    etapeChargement.value = '⏳ Création de l\'annonce...'
    const { data } = await api.post('/annonces', form.value)
    const annonceId = data.annonce.id

    // Étape 2 : Upload des images si présentes
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

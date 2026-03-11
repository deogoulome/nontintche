<template>
  <div class="min-h-screen bg-white dark:bg-gray-950">
    <Navbar />

    <!-- Hero -->
<section class="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-primary-900 to-primary-800">
  <div class="absolute inset-0 pattern-bg opacity-30"></div>
  <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl"></div>
  <div class="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary-300/20 rounded-full blur-2xl"></div>

  <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center">

      <!-- Texte -->
      <div class="text-white text-center lg:text-left">
        <div class="inline-flex items-center gap-2 bg-primary-900/50 border border-primary-700/50 text-primary-300 text-sm px-4 py-2 rounded-full mb-6 animate-fade-in">
          <span class="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></span>
          500+ annonces actives au Bénin
        </div>
        <h1 class="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in-up">
          Trouvez votre
          <span class="gradient-text block">chez-vous</span>
          idéal 🏠
        </h1>
        <p class="text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed mb-8 animate-fade-in-up delay-100 max-w-xl mx-auto lg:mx-0">
          NonTinTché connecte propriétaires et chercheurs de logements partout au Bénin. Simple, rapide, fiable.
        </p>

        <!-- Recherche -->
        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 flex flex-col sm:flex-row gap-2 animate-fade-in-up delay-200">
          <input v-model="recherche.ville" type="text" placeholder="🏙️ Ville (ex: Cotonou)"
            class="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
          <input v-model="recherche.quartier" type="text" placeholder="📍 Quartier"
            class="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
          <button @click="lancerRecherche"
            class="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 shadow-glow whitespace-nowrap w-full sm:w-auto">
            Rechercher →
          </button>
        </div>
      </div>

      <!-- Stats cards -->
      <div class="grid grid-cols-2 gap-4 animate-fade-in-up delay-300">
        <div v-for="(stat, i) in stats" :key="i"
          class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-5 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1">
          <div class="text-3xl mb-2">{{ stat.emoji }}</div>
          <p class="text-xl sm:text-2xl font-display font-bold text-white">{{ stat.valeur }}</p>
          <p class="text-gray-400 text-xs sm:text-sm mt-1">{{ stat.label }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Scroll indicator -->
  <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 animate-bounce hidden sm:flex">
    <span class="text-xs">Défiler</span>
    <div class="w-5 h-8 border-2 border-gray-500 rounded-full flex justify-center pt-1">
      <div class="w-1 h-2 bg-primary-400 rounded-full animate-bounce"></div>
    </div>
  </div>
</section>

    <!-- Types de chambres -->
    <section class="py-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12">
          <p class="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">Catégories</p>
          <h2 class="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Que recherchez-vous ?
          </h2>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div v-for="(type, i) in typeChambres" :key="type.id"
            @click="filtrerParType(type.id)"
            :style="`animation-delay: ${i * 0.1}s`"
            class="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center cursor-pointer card-hover border-2 border-transparent hover:border-primary-400 group animate-fade-in-up">
            <div class="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{{ type.emoji }}</div>
            <p class="font-semibold text-gray-700 dark:text-gray-200 text-sm">{{ type.libelle }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Comment ça marche -->
    <section class="py-20 px-4 bg-white dark:bg-gray-950">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-12">
          <p class="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">Processus</p>
          <h2 class="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Comment ça marche ?
          </h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(etape, i) in etapes" :key="i" class="text-center group">
            <div class="relative inline-block mb-4">
              <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-2xl shadow-glow group-hover:shadow-glow group-hover:scale-110 transition-all duration-300 mx-auto">
                {{ etape.emoji }}
              </div>
              <div class="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-xs font-bold flex items-center justify-center">
                {{ i + 1 }}
              </div>
            </div>
            <h3 class="font-display font-bold text-lg text-gray-900 dark:text-white mb-2">{{ etape.titre }}</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{{ etape.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 px-4 bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden">
      <div class="absolute inset-0 pattern-bg opacity-20"></div>
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      <div class="relative max-w-3xl mx-auto text-center text-white">
        <h2 class="font-display text-3xl md:text-4xl font-bold mb-4">
          Vous avez une chambre à louer ?
        </h2>
        <p class="text-primary-100 mb-8 text-lg">
          Publiez votre annonce en quelques minutes et trouvez un locataire rapidement
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <RouterLink to="/inscription"
            class="bg-white text-primary-700 hover:bg-gray-100 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 hover:scale-105 shadow-xl">
            Publier une annonce →
          </RouterLink>
          <RouterLink to="/annonces"
            class="bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200">
            Parcourir les annonces
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-950 text-gray-400 py-12 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span class="text-white font-display font-bold">N</span>
              </div>
              <span class="font-display font-bold text-lg text-white">NonTinTché</span>
            </div>
            <p class="text-sm text-gray-500 leading-relaxed">
              La plateforme de référence pour trouver ou louer un logement au Bénin.
            </p>
          </div>
          <div>
            <h4 class="font-semibold text-white mb-4">Navigation</h4>
            <div class="space-y-2 text-sm">
              <RouterLink to="/" class="block hover:text-primary-400 transition-colors">Accueil</RouterLink>
              <RouterLink to="/annonces" class="block hover:text-primary-400 transition-colors">Annonces</RouterLink>
              <RouterLink to="/inscription" class="block hover:text-primary-400 transition-colors">S'inscrire</RouterLink>
              <RouterLink to="/connexion" class="block hover:text-primary-400 transition-colors">Se connecter</RouterLink>
            </div>
          </div>
          <div>
            <h4 class="font-semibold text-white mb-4">Contact</h4>
            <div class="space-y-2 text-sm">
              <p>📧 contact@nontintche.bj</p>
              <p>📞 +229 00 00 00 00</p>
              <p>📍 Cotonou, Bénin</p>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p class="text-sm">© 2026 NonTinTché — Tous droits réservés</p>
          <div class="flex gap-4 text-sm">
            <a href="#" class="hover:text-primary-400 transition-colors">Confidentialité</a>
            <a href="#" class="hover:text-primary-400 transition-colors">CGU</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import Navbar from '../components/layout/Navbar.vue'

const router = useRouter()
const recherche = ref({ ville: '', quartier: '' })

const stats = [
  { emoji: '🏠', valeur: '500+', label: 'Annonces actives' },
  { emoji: '🏙️', valeur: '20+', label: 'Villes couvertes' },
  { emoji: '👥', valeur: '1000+', label: 'Utilisateurs' },
  { emoji: '⭐', valeur: '4.8/5', label: 'Note moyenne' },
]

const typeChambres = [
  { id: 1, libelle: 'Studio', emoji: '🛏️' },
  { id: 2, libelle: 'Chambre simple', emoji: '🚪' },
  { id: 3, libelle: 'Chambre moderne', emoji: '✨' },
  { id: 4, libelle: 'Appartement', emoji: '🏢' },
  { id: 5, libelle: 'Villa', emoji: '🏡' },
]

const etapes = [
  { emoji: '📝', titre: 'Créez un compte', desc: 'Inscrivez-vous gratuitement en tant que propriétaire ou chercheur de logement.' },
  { emoji: '🏠', titre: 'Publiez ou cherchez', desc: 'Propriétaires, publiez votre annonce. Chercheurs, filtrez selon vos critères.' },
  { emoji: '🤝', titre: 'Contactez & louez', desc: 'Prenez contact directement avec le propriétaire et finalisez votre location.' },
]

const lancerRecherche = () => {
  router.push({ path: '/annonces', query: { ...recherche.value } })
}

const filtrerParType = (id) => {
  router.push({ path: '/annonces', query: { id_typechambre: id } })
}
</script>

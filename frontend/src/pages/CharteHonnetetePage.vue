<template>
  <div class="min-h-screen bg-white dark:bg-gray-950">
    <Navbar />

    <!-- Hero dramatique -->
    <section class="relative bg-gradient-to-br from-red-900 via-red-800 to-gray-900 text-white py-20 px-4 overflow-hidden">
      <div class="absolute inset-0 pattern-bg opacity-20"></div>
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-0 w-64 h-64 bg-red-300/10 rounded-full blur-2xl"></div>

      <div class="relative max-w-4xl mx-auto text-center">
        <div class="inline-flex items-center gap-2 bg-red-500/20 border border-red-400/40 text-red-300 text-sm px-4 py-2 rounded-full mb-6 animate-fade-in">
          <span class="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
          Charte d'honnêteté NonTinTché
        </div>

        <div class="text-7xl mb-6 animate-fade-in-up">🚫</div>

        <h1 class="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in-up delay-100">
          Les fausses annonces,
          <span class="text-red-400 block">c'est interdit !</span>
        </h1>

        <p class="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto animate-fade-in-up delay-200">
          NonTinTché est une plateforme de confiance. Toute tentative d'arnaque ou de fraude entraîne une suppression définitive du compte et un signalement aux autorités.
        </p>
      </div>
    </section>

    <!-- Stats choc -->
    <section class="bg-gray-900 py-10 px-4">
      <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div class="animate-fade-in-up">
          <p class="font-display text-4xl font-bold text-red-400">100%</p>
          <p class="text-gray-400 text-sm mt-2">des fausses annonces sont supprimées</p>
        </div>
        <div class="animate-fade-in-up delay-100">
          <p class="font-display text-4xl font-bold text-red-400">0</p>
          <p class="text-gray-400 text-sm mt-2">tolérance pour les arnaques</p>
        </div>
        <div class="animate-fade-in-up delay-200">
          <p class="font-display text-4xl font-bold text-red-400">∞</p>
          <p class="text-gray-400 text-sm mt-2">suspension définitive du compte</p>
        </div>
      </div>
    </section>

    <!-- Ce qui est interdit -->
    <section class="py-16 px-4 bg-gray-50 dark:bg-gray-900">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <p class="text-red-500 font-semibold text-sm uppercase tracking-widest mb-2">Comportements interdits</p>
          <h2 class="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Ce que vous ne devez <span class="text-red-500">JAMAIS</span> faire
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="(item, i) in interdits" :key="i"
            :style="`animation-delay: ${i * 0.1}s`"
            class="bg-white dark:bg-gray-800 border-l-4 border-red-500 rounded-2xl p-5 shadow-card animate-fade-in-up flex items-start gap-4">
            <div class="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center flex-shrink-0 text-xl">
              {{ item.emoji }}
            </div>
            <div>
              <h3 class="font-bold text-gray-800 dark:text-white mb-1">{{ item.titre }}</h3>
              <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Conséquences -->
    <section class="py-16 px-4 bg-white dark:bg-gray-950">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <p class="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-2">Sanctions</p>
          <h2 class="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Les conséquences sont sévères
          </h2>
        </div>

        <div class="relative">
          <!-- Ligne verticale -->
          <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 to-red-600 hidden md:block"></div>

          <div class="space-y-6">
            <div v-for="(sanction, i) in sanctions" :key="i"
              :style="`animation-delay: ${i * 0.15}s`"
              class="flex items-start gap-6 animate-fade-in-up">
              <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white font-display font-bold text-lg z-10"
                :class="sanction.couleur">
                {{ i + 1 }}
              </div>
              <div class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-card flex-1 hover:shadow-card-hover transition-all duration-300">
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-2xl">{{ sanction.emoji }}</span>
                  <h3 class="font-bold text-gray-800 dark:text-white">{{ sanction.titre }}</h3>
                </div>
                <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{{ sanction.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Ce qui est attendu -->
    <section class="py-16 px-4 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950 dark:to-gray-900">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <p class="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">Nos valeurs</p>
          <h2 class="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Ce que nous attendons de vous ✅
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="(valeur, i) in valeurs" :key="i"
            :style="`animation-delay: ${i * 0.1}s`"
            class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card border border-primary-100 dark:border-gray-700 text-center animate-fade-in-up card-hover">
            <div class="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-glow-sm">
              {{ valeur.emoji }}
            </div>
            <h3 class="font-display font-bold text-gray-800 dark:text-white mb-2">{{ valeur.titre }}</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{{ valeur.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Signaler -->
    <section class="py-16 px-4 bg-white dark:bg-gray-950">
      <div class="max-w-3xl mx-auto">
        <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden">
          <div class="absolute inset-0 pattern-bg opacity-20"></div>
          <div class="relative">
            <div class="text-5xl mb-4">🚩</div>
            <h2 class="font-display text-2xl md:text-3xl font-bold mb-4">
              Vous avez vu une annonce suspecte ?
            </h2>
            <p class="text-gray-400 mb-8 leading-relaxed">
              Ne restez pas silencieux ! Signalez immédiatement toute annonce qui vous semble frauduleuse. Vous protégez ainsi toute la communauté NonTinTché.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <RouterLink to="/annonces"
                class="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 shadow-glow">
                Parcourir les annonces
              </RouterLink>
              <RouterLink to="/inscription"
                class="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 px-8 py-4 rounded-2xl font-bold transition-all">
                Créer un compte
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Engagement propriétaire -->
    <section class="py-16 px-4 bg-gray-50 dark:bg-gray-900">
      <div class="max-w-3xl mx-auto">
        <div class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-card border border-gray-100 dark:border-gray-700">
          <div class="text-center mb-8">
            <div class="text-5xl mb-4">🤝</div>
            <h2 class="font-display text-2xl font-bold text-gray-900 dark:text-white">
              Engagement du propriétaire
            </h2>
            <p class="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              En publiant une annonce sur NonTinTché, vous acceptez de respecter ces règles
            </p>
          </div>

          <div class="space-y-3 mb-8">
            <div v-for="(engagement, i) in engagements" :key="i"
              class="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <span class="text-primary-600 font-bold text-lg flex-shrink-0">✓</span>
              <p class="text-gray-700 dark:text-gray-300 text-sm">{{ engagement }}</p>
            </div>
          </div>

          <RouterLink to="/dashboard/nouvelle-annonce"
            class="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white py-4 rounded-2xl font-bold transition-all hover:scale-[1.02] shadow-glow-sm flex items-center justify-center gap-2">
            ✅ J'accepte et je publie mon annonce →
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-950 text-gray-400 py-8 px-4 text-center">
      <p class="text-sm">© 2026 NonTinTché — Plateforme de confiance au Bénin</p>
    </footer>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import Navbar from '../components/layout/Navbar.vue'

const interdits = [
  {
    emoji: '🏚️',
    titre: 'Photos mensongères',
    desc: 'Publier des photos qui ne correspondent pas au logement réel. Utiliser des photos volées sur internet.'
  },
  {
    emoji: '💰',
    titre: 'Prix trompeurs',
    desc: 'Afficher un prix attractif pour attirer les gens, puis demander plus d\'argent à la rencontre.'
  },
  {
    emoji: '📍',
    titre: 'Fausse localisation',
    desc: 'Indiquer une adresse ou un quartier qui ne correspond pas à l\'emplacement réel du logement.'
  },
  {
    emoji: '👻',
    titre: 'Logement inexistant',
    desc: 'Publier une annonce pour un logement qui n\'existe pas dans le but de collecter des avances.'
  },
  {
    emoji: '🔑',
    titre: 'Demande d\'avance frauduleuse',
    desc: 'Demander de l\'argent ou un virement avant la visite du logement sous prétexte de "réserver".'
  },
  {
    emoji: '📞',
    titre: 'Faux contacts',
    desc: 'Fournir de faux numéros de téléphone ou utiliser l\'identité d\'une autre personne.'
  },
  {
    emoji: '🔄',
    titre: 'Annonces dupliquées',
    desc: 'Publier plusieurs fois la même annonce avec des informations différentes pour tromper les chercheurs.'
  },
  {
    emoji: '🏷️',
    titre: 'Fausses commodités',
    desc: 'Mentionner des équipements (WiFi, climatisation, eau) qui n\'existent pas dans le logement.'
  },
]

const sanctions = [
  {
    emoji: '⚠️',
    titre: 'Avertissement immédiat',
    desc: 'Dès qu\'une fausse information est détectée, un avertissement officiel est envoyé au propriétaire et l\'annonce est suspendue dans l\'heure.',
    couleur: 'bg-yellow-500'
  },
  {
    emoji: '🗑️',
    titre: 'Suppression de l\'annonce',
    desc: 'L\'annonce frauduleuse est définitivement supprimée de la plateforme sans remboursement des frais de publication.',
    couleur: 'bg-orange-500'
  },
  {
    emoji: '🚫',
    titre: 'Suspension du compte',
    desc: 'Le compte du propriétaire est immédiatement suspendu. Toutes ses annonces actives sont désactivées sans possibilité de remboursement.',
    couleur: 'bg-red-500'
  },
  {
    emoji: '⚖️',
    titre: 'Signalement aux autorités',
    desc: 'En cas d\'arnaque avérée, NonTinTché se réserve le droit de transmettre toutes les informations du fraudeur aux autorités compétentes du Bénin.',
    couleur: 'bg-red-800'
  },
]

const valeurs = [
  {
    emoji: '🎯',
    titre: 'Honnêteté',
    desc: 'Publiez uniquement des informations vraies et vérifiables sur votre logement.'
  },
  {
    emoji: '📸',
    titre: 'Photos réelles',
    desc: 'Utilisez uniquement vos propres photos prises dans le logement à louer.'
  },
  {
    emoji: '🤝',
    titre: 'Respect',
    desc: 'Traitez les chercheurs de logement avec respect et répondez honnêtement à leurs questions.'
  },
]

const engagements = [
  'Je certifie que toutes les informations de mon annonce sont vraies et exactes',
  'Les photos publiées représentent fidèlement l\'état actuel du logement',
  'Le prix affiché est le prix réel sans frais cachés',
  'Je ne demanderai jamais d\'argent avant la visite physique du logement',
  'Je m\'engage à répondre honnêtement aux questions des chercheurs',
  'Je comprends que toute fausse information entraîne la suppression de mon compte',
]
</script>
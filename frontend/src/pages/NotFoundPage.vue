<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 flex items-center justify-center px-4">
    <div class="text-center text-white">
      <div class="relative inline-block mb-6">
        <p class="font-display text-9xl font-bold text-primary-500/30">404</p>
        <p class="font-display text-6xl font-bold absolute inset-0 flex items-center justify-center gradient-text">404</p>
      </div>
      <h1 class="font-display text-3xl font-bold mb-3">Page introuvable</h1>
      <p class="text-gray-400 mb-8 max-w-md mx-auto">La page que vous recherchez n'existe pas ou a été déplacée.</p>
      <RouterLink to="/"
        class="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white px-8 py-4 rounded-2xl font-bold hover:from-primary-700 hover:to-primary-600 transition-all duration-200 hover:scale-105 shadow-glow">
        ← Retour à l'accueil
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth.store.js'

const routes = [
  { path: '/', component: () => import('../pages/HomePage.vue') },
  { path: '/connexion', component: () => import('../pages/auth/ConnexionPage.vue') },
  { path: '/inscription', component: () => import('../pages/auth/InscriptionPage.vue') },
  // { path: '/annonces', component: () => import('../pages/annonces/ListeAnnoncesPage.vue'), meta: { requiresAuth: true } },
  // { path: '/annonces/:id', component: () => import('../pages/annonces/DetailAnnoncePage.vue'), meta: { requiresAuth: true } },


// Après — pas de requiresAuth
{ path: '/annonces', component: () => import('../pages/annonces/ListeAnnoncesPage.vue') },
{ path: '/annonces/:id', component: () => import('../pages/annonces/DetailAnnoncePage.vue') },
  { path: '/dashboard', component: () => import('../pages/dashboard/DashboardPage.vue'), meta: { requiresAuth: true, requiresProprietaire: true } },
  { path: '/dashboard/nouvelle-annonce', component: () => import('../pages/dashboard/NouvelleAnnoncePage.vue'), meta: { requiresAuth: true, requiresProprietaire: true } },
  { path: '/:pathMatch(.*)*', component: () => import('../pages/NotFoundPage.vue') },
  { path: '/profil', component: () => import('../pages/ProfilPage.vue'), meta: { requiresAuth: true } },
{ path: '/favoris', component: () => import('../pages/FavorisPage.vue'), meta: { requiresAuth: true } },
{ path: '/dashboard/paiements', component: () => import('../pages/dashboard/HistoriquePaiementsPage.vue'), meta: { requiresAuth: true, requiresProprietaire: true } },
{ path: '/admin', component: () => import('../pages/admin/AdminDashboardPage.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
{ path: '/charte', component: () => import('../pages/CharteHonnetetePage.vue') },
{ path: '/paiement/callback', component: () => import('../pages/paiement/PaiementCallbackPage.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.estConnecte) return next('/connexion')
  if (to.meta.requiresProprietaire && !auth.estProprietaire) return next('/annonces')
    if (to.meta.requiresAdmin && auth.utilisateur?.role !== 'admin') return next('/')
  next()
})

export default router



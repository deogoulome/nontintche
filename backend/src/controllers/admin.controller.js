import prisma from '../prisma.js'

// DASHBOARD ADMIN
export const dashboardAdmin = async (req, res) => {
  try {
    const [totalUtilisateurs, totalAnnonces, totalPaiements, signalements, annoncesRecentes] = await Promise.all([
      prisma.utilisateur.count(),
      prisma.annonce.count(),
      prisma.paiementannonce.aggregate({ _sum: { montant_paye: true } }),
      prisma.signalement.count({ where: { statut: 'en_cours' } }),
      prisma.annonce.findMany({
        take: 5,
        orderBy: { date_creation: 'desc' },
        include: {
          utilisateur: { select: { nom: true, prenom: true } },
          typechambre: true
        }
      })
    ])

    res.json({
      stats: {
        totalUtilisateurs,
        totalAnnonces,
        totalPaiements: totalPaiements._sum.montant_paye || 0,
        signalements
      },
      annoncesRecentes
    })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message })
  }
}

// LISTE UTILISATEURS
export const listeUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await prisma.utilisateur.findMany({
      select: {
        id: true, nom: true, prenom: true, telephone: true,
        login: true, role: true, date_inscription: true, est_actif: true,
        _count: { select: { annonce: true } }
      },
      orderBy: { date_inscription: 'desc' }
    })
    res.json(utilisateurs)
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message })
  }
}

// ACTIVER / DÉSACTIVER UTILISATEUR
export const toggleUtilisateur = async (req, res) => {
  try {
    const { id } = req.params
    const utilisateur = await prisma.utilisateur.findUnique({ where: { id: parseInt(id) } })
    if (!utilisateur) return res.status(404).json({ message: 'Utilisateur introuvable' })
    const updated = await prisma.utilisateur.update({
      where: { id: parseInt(id) },
      data: { est_actif: !utilisateur.est_actif }
    })
    res.json({ message: `Utilisateur ${updated.est_actif ? 'activé' : 'désactivé'}`, utilisateur: updated })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message })
  }
}

// LISTE TOUTES LES ANNONCES
export const listeAnnoncesAdmin = async (req, res) => {
  try {
    const annonces = await prisma.annonce.findMany({
      include: {
        utilisateur: { select: { nom: true, prenom: true, telephone: true } },
        typechambre: true,
        typeannonce: true,
        imageannonce: { where: { est_principale: true } }
      },
      orderBy: { date_creation: 'desc' }
    })
    res.json(annonces)
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message })
  }
}

// SUSPENDRE / ACTIVER UNE ANNONCE
export const toggleAnnonce = async (req, res) => {
  try {
    const { id } = req.params
    const annonce = await prisma.annonce.findUnique({ where: { id: parseInt(id) } })
    if (!annonce) return res.status(404).json({ message: 'Annonce introuvable' })
    const nouveauStatut = annonce.statut === 'suspendue' ? 'active' : 'suspendue'
    const updated = await prisma.annonce.update({
      where: { id: parseInt(id) },
      data: { statut: nouveauStatut }
    })
    res.json({ message: `Annonce ${nouveauStatut}`, annonce: updated })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message })
  }
}

// LISTE SIGNALEMENTS
export const listeSignalements = async (req, res) => {
  try {
    const signalements = await prisma.signalement.findMany({
      include: {
        utilisateur: { select: { nom: true, prenom: true } },
        annonce: { select: { titre: true, ville: true, id: true } }
      },
      orderBy: { date_signalement: 'desc' }
    })
    res.json(signalements)
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message })
  }
}

// TRAITER UN SIGNALEMENT
export const traiterSignalement = async (req, res) => {
  try {
    const { id } = req.params
    const { statut } = req.body
    const updated = await prisma.signalement.update({
      where: { id: parseInt(id) },
      data: { statut }
    })
    res.json({ message: 'Signalement traité', signalement: updated })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message })
  }
}
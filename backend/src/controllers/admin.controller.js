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
    console.error(err)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

// LISTE UTILISATEURS (paginee)
export const listeUtilisateurs = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const pageNum  = Math.max(1, parseInt(page))
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)))
    const skip = (pageNum - 1) * limitNum

    const [total, utilisateurs] = await Promise.all([
      prisma.utilisateur.count(),
      prisma.utilisateur.findMany({
        select: {
          id: true, nom: true, prenom: true, telephone: true,
          login: true, role: true, date_inscription: true, est_actif: true,
          _count: { select: { annonce: true } }
        },
        orderBy: { date_inscription: 'desc' },
        skip,
        take: limitNum,
      })
    ])

    res.json({ data: utilisateurs, pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

// ACTIVER / DESACTIVER UTILISATEUR
export const toggleUtilisateur = async (req, res) => {
  try {
    const { id } = req.params
    const utilisateur = await prisma.utilisateur.findUnique({ where: { id: parseInt(id) } })
    if (!utilisateur) return res.status(404).json({ message: 'Utilisateur introuvable' })
    const updated = await prisma.utilisateur.update({
      where: { id: parseInt(id) },
      data: { est_actif: !utilisateur.est_actif }
    })
    res.json({ message: `Utilisateur ${updated.est_actif ? 'active' : 'desactive'}`, utilisateur: updated })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

// LISTE TOUTES LES ANNONCES (paginee)
export const listeAnnoncesAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20, statut } = req.query
    const pageNum  = Math.max(1, parseInt(page))
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)))
    const skip = (pageNum - 1) * limitNum

    const where = statut ? { statut } : {}

    const [total, annonces] = await Promise.all([
      prisma.annonce.count({ where }),
      prisma.annonce.findMany({
        where,
        include: {
          utilisateur: { select: { nom: true, prenom: true, telephone: true } },
          typechambre: true,
          typeannonce: true,
          imageannonce: { where: { est_principale: true } }
        },
        orderBy: { date_creation: 'desc' },
        skip,
        take: limitNum,
      })
    ])

    res.json({ data: annonces, pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

// SUSPENDRE / REACTIVER UNE ANNONCE
export const toggleAnnonce = async (req, res) => {
  try {
    const { id } = req.params
    const annonce = await prisma.annonce.findUnique({ where: { id: parseInt(id) } })
    if (!annonce) return res.status(404).json({ message: 'Annonce introuvable' })

    const statutsAutorises = ['active', 'suspendue']
    if (!statutsAutorises.includes(annonce.statut)) {
      return res.status(400).json({
        message: `Impossible de basculer une annonce en statut "${annonce.statut}"`
      })
    }

    const nouveauStatut = annonce.statut === 'suspendue' ? 'active' : 'suspendue'
    const updated = await prisma.annonce.update({
      where: { id: parseInt(id) },
      data: { statut: nouveauStatut }
    })
    res.json({ message: `Annonce ${nouveauStatut}`, annonce: updated })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erreur serveur' })
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
    console.error(err)
    res.status(500).json({ message: 'Erreur serveur' })
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
    res.json({ message: 'Signalement traite', signalement: updated })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

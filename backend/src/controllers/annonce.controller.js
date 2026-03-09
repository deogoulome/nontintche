import prisma from '../prisma.js'

// CRÉER UNE ANNONCE
export const creerAnnonce = async (req, res) => {
  try {
    const { titre, ville, quartier, description, prix, nombre_pieces, id_typechambre, id_typeannonce, commodites } = req.body
    const id_utilisateur = req.utilisateur.id

    const annonce = await prisma.annonce.create({
      data: {
        titre, ville, quartier, description,
        prix, nombre_pieces,
        id_typechambre, id_typeannonce, id_utilisateur,
        annoncecommodite: commodites ? {
          create: commodites.map(id => ({ id_commodite: id }))
        } : undefined
      },
      include: {
        typechambre: true,
        typeannonce: true,
        imageannonce: true,
        annoncecommodite: { include: { commodite: true } }
      }
    })

    res.status(201).json({ message: 'Annonce créée, en attente de paiement', annonce })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message })
  }
}

// LISTE DES ANNONCES ACTIVES (avec filtres)
export const listerAnnonces = async (req, res) => {
  try {
    const { ville, quartier, id_typechambre, prix_min, prix_max } = req.query

    const annonces = await prisma.annonce.findMany({
      where: {
        statut: 'active',
        ...(ville && { ville: { contains: ville, mode: 'insensitive' } }),
        ...(quartier && { quartier: { contains: quartier, mode: 'insensitive' } }),
        ...(id_typechambre && { id_typechambre: parseInt(id_typechambre) }),
        ...(prix_min || prix_max ? {
          prix: {
            ...(prix_min && { gte: parseFloat(prix_min) }),
            ...(prix_max && { lte: parseFloat(prix_max) })
          }
        } : {})
      },
      include: {
        typechambre: true,
        typeannonce: true,
        utilisateur: { select: { nom: true, prenom: true, telephone: true } },
        imageannonce: { where: { est_principale: true } },
        annoncecommodite: { include: { commodite: true } },
        avis: { select: { note: true } }
      },
      orderBy: { date_creation: 'desc' }
    })

    const annoncesAvecNote = annonces.map(a => ({
      ...a,
      note_moyenne: a.avis.length > 0
        ? (a.avis.reduce((sum, av) => sum + av.note, 0) / a.avis.length).toFixed(1)
        : null
    }))

    res.json(annoncesAvecNote)
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message })
  }
}

// DÉTAIL D'UNE ANNONCE
export const detailAnnonce = async (req, res) => {
  try {
    const { id } = req.params

    const annonce = await prisma.annonce.findUnique({
      where: { id: parseInt(id) },
      include: {
        typechambre: true,
        typeannonce: true,
        utilisateur: { select: { nom: true, prenom: true, telephone: true } },
        imageannonce: true,
        annoncecommodite: { include: { commodite: true } },
        avis: {
          include: {
            utilisateur: { select: { nom: true, prenom: true } }
          }
        }
      }
    })

    if (!annonce) return res.status(404).json({ message: 'Annonce introuvable' })

    res.json(annonce)
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message })
  }
}

// MES ANNONCES (propriétaire connecté)
export const mesAnnonces = async (req, res) => {
  try {
    const id_utilisateur = req.utilisateur.id

    const annonces = await prisma.annonce.findMany({
      where: { id_utilisateur },
      include: {
        typechambre: true,
        typeannonce: true,
        imageannonce: { where: { est_principale: true } },
        paiementannonce: { orderBy: { date_paiement: 'desc' }, take: 1 }
      },
      orderBy: { date_creation: 'desc' }
    })

    res.json(annonces)
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message })
  }
}

// MODIFIER UNE ANNONCE
export const modifierAnnonce = async (req, res) => {
  try {
    const { id } = req.params
    const id_utilisateur = req.utilisateur.id
    const { titre, ville, quartier, description, prix, nombre_pieces, id_typechambre } = req.body

    const annonce = await prisma.annonce.findUnique({ where: { id: parseInt(id) } })
    if (!annonce) return res.status(404).json({ message: 'Annonce introuvable' })
    if (annonce.id_utilisateur !== id_utilisateur) return res.status(403).json({ message: 'Non autorisé' })

    const updated = await prisma.annonce.update({
      where: { id: parseInt(id) },
      data: { titre, ville, quartier, description, prix, nombre_pieces, id_typechambre }
    })

    res.json({ message: 'Annonce modifiée', annonce: updated })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message })
  }
}

// SUPPRIMER UNE ANNONCE
export const supprimerAnnonce = async (req, res) => {
  try {
    const { id } = req.params
    const id_utilisateur = req.utilisateur.id

    const annonce = await prisma.annonce.findUnique({ where: { id: parseInt(id) } })
    if (!annonce) return res.status(404).json({ message: 'Annonce introuvable' })
    if (annonce.id_utilisateur !== id_utilisateur) return res.status(403).json({ message: 'Non autorisé' })

    await prisma.annonce.delete({ where: { id: parseInt(id) } })

    res.json({ message: 'Annonce supprimée avec succès' })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message })
  }

}


// RENOUVELER UNE ANNONCE EXPIRÉE
export const renouvelerAnnonce = async (req, res) => {
  try {
    const { id } = req.params
    const { id_typeannonce, mode_paiement } = req.body
    const id_utilisateur = req.utilisateur.id

    const annonce = await prisma.annonce.findUnique({
      where: { id: parseInt(id) },
      include: { typeannonce: true }
    })

    if (!annonce) return res.status(404).json({ message: 'Annonce introuvable' })
    if (annonce.id_utilisateur !== id_utilisateur) return res.status(403).json({ message: 'Non autorisé' })
    if (annonce.statut !== 'expiree') return res.status(400).json({ message: 'Seules les annonces expirées peuvent être renouvelées' })

    const typeannonce = await prisma.typeannonce.findUnique({ where: { id: parseInt(id_typeannonce) } })

    const reference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    await prisma.paiementannonce.create({
      data: {
        montant_paye: typeannonce.prix,
        mode_paiement,
        reference_transaction: reference,
        statut: 'confirme',
        id_annonce: annonce.id,
        id_utilisateur,
        id_typeannonce: parseInt(id_typeannonce)
      }
    })

    const dateDebut = new Date()
    const dateFin = new Date()
    dateFin.setDate(dateFin.getDate() + typeannonce.duree_jours)

    const updated = await prisma.annonce.update({
      where: { id: parseInt(id) },
      data: {
        statut: 'active',
        id_typeannonce: parseInt(id_typeannonce),
        date_debut_annonce: dateDebut,
        date_fin_annonce: dateFin
      }
    })

    res.json({
      message: '✅ Annonce renouvelée avec succès !',
      annonce: updated,
      active_jusqu_au: dateFin
    })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message })
  }
}
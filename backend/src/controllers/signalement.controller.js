import prisma from '../prisma.js'

export const signalerAnnonce = async (req, res) => {
  try {
    const id_utilisateur = req.utilisateur.id
    const { id_annonce, motif, description } = req.body

    const signalement = await prisma.signalement.create({
      data: { id_utilisateur, id_annonce: parseInt(id_annonce), motif, description }
    })
    res.status(201).json({ message: 'Signalement envoyé', signalement })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message })
  }
}
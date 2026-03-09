import prisma from '../prisma.js'

export const ajouterAvis = async (req, res) => {
  try {
    const id_utilisateur = req.utilisateur.id
    const { id_annonce, note, commentaire } = req.body

    if (note < 1 || note > 5) return res.status(400).json({ message: 'La note doit être entre 1 et 5' })

    const existant = await prisma.avis.findUnique({
      where: { id_utilisateur_id_annonce: { id_utilisateur, id_annonce: parseInt(id_annonce) } }
    })

    if (existant) {
      const updated = await prisma.avis.update({
        where: { id_utilisateur_id_annonce: { id_utilisateur, id_annonce: parseInt(id_annonce) } },
        data: { note, commentaire }
      })
      return res.json({ message: 'Avis modifié', avis: updated })
    }

    const avis = await prisma.avis.create({
      data: { id_utilisateur, id_annonce: parseInt(id_annonce), note, commentaire }
    })
    res.status(201).json({ message: 'Avis ajouté', avis })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message })
  }
}

export const supprimerAvis = async (req, res) => {
  try {
    const id_utilisateur = req.utilisateur.id
    const { id } = req.params
    const avis = await prisma.avis.findUnique({ where: { id: parseInt(id) } })
    if (!avis) return res.status(404).json({ message: 'Avis introuvable' })
    if (avis.id_utilisateur !== id_utilisateur) return res.status(403).json({ message: 'Non autorisé' })
    await prisma.avis.delete({ where: { id: parseInt(id) } })
    res.json({ message: 'Avis supprimé' })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message })
  }
}
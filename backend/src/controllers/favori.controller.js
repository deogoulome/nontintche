import prisma from '../prisma.js'

export const ajouterFavori = async (req, res) => {
  try {
    const id_utilisateur = req.utilisateur.id
    const { id_annonce } = req.body

    const existant = await prisma.favori.findUnique({
      where: { id_utilisateur_id_annonce: { id_utilisateur, id_annonce: parseInt(id_annonce) } }
    })

    if (existant) {
      await prisma.favori.delete({
        where: { id_utilisateur_id_annonce: { id_utilisateur, id_annonce: parseInt(id_annonce) } }
      })
      return res.json({ message: 'Retiré des favoris', favori: false })
    }

    await prisma.favori.create({ data: { id_utilisateur, id_annonce: parseInt(id_annonce) } })
    res.status(201).json({ message: 'Ajouté aux favoris', favori: true })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message })
  }
}

export const mesFavoris = async (req, res) => {
  try {
    const id_utilisateur = req.utilisateur.id
    const favoris = await prisma.favori.findMany({
      where: { id_utilisateur },
      include: {
        annonce: {
          include: {
            typechambre: true,
            utilisateur: { select: { nom: true, prenom: true, telephone: true } },
            imageannonce: { where: { est_principale: true } },
            annoncecommodite: { include: { commodite: true } }
          }
        }
      },
      orderBy: { date_ajout: 'desc' }
    })
    res.json(favoris)
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message })
  }
}
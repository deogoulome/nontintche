// import prisma from '../prisma.js'

// export const uploadImages = async (req, res) => {
//   try {
//     const { id } = req.params
//     const id_utilisateur = req.utilisateur.id

//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ message: 'Aucune image fournie' })
//     }

//     const annonce = await prisma.annonce.findUnique({ where: { id: parseInt(id) } })
//     if (!annonce) return res.status(404).json({ message: 'Annonce introuvable' })
//     if (annonce.id_utilisateur !== id_utilisateur)
//       return res.status(403).json({ message: 'Non autorisé' })

//     // Cloudinary retourne l'URL complète dans file.path
//     const images = req.files.map((file, index) => ({
//       chemin_image: file.path, // URL Cloudinary complète https://res.cloudinary.com/...
//       est_principale: index === 0,
//       id_annonce: parseInt(id)
//     }))

//     await prisma.imageannonce.createMany({ data: images })

//     res.status(201).json({ message: 'Images uploadées avec succès', images })
//   } catch (err) {
//     console.error(err)
//     res.status(500).json({ message: 'Erreur serveur', erreur: err.message })
//   }
// }

import prisma from '../prisma.js'

export const uploadImages = async (req, res) => {
  try {
    const { id } = req.params
    const id_utilisateur = req.utilisateur.id

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Aucune image fournie' })
    }

    const annonce = await prisma.annonce.findUnique({ where: { id: parseInt(id) } })
    if (!annonce) return res.status(404).json({ message: 'Annonce introuvable' })
    if (annonce.id_utilisateur !== id_utilisateur)
      return res.status(403).json({ message: 'Non autorisé' })

    const images = req.files.map((file, index) => ({
      chemin_image: file.path,
      est_principale: index === 0,
      id_annonce: parseInt(id)
    }))

    await prisma.imageannonce.createMany({ data: images })
    res.status(201).json({ message: 'Images uploadées avec succès', images })

  } catch (err) {
    // Afficher l'erreur complète dans les logs
    console.error('ERREUR UPLOAD:', JSON.stringify(err, null, 2))
    console.error('MESSAGE:', err.message)
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message })
  }
}
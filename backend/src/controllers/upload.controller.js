import multer from 'multer'
import path from 'path'
import prisma from '../prisma.js'

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, unique + path.extname(file.originalname))
  }
})

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/
    const ext = allowed.test(path.extname(file.originalname).toLowerCase())
    const mime = allowed.test(file.mimetype)
    if (ext && mime) cb(null, true)
    else cb(new Error('Seules les images sont autorisées'))
  }
})

// export const uploadImages = async (req, res) => {
//   try {
//     const { id } = req.params
//     const id_utilisateur = req.utilisateur.id

//     const annonce = await prisma.annonce.findUnique({ where: { id: parseInt(id) } })
//     if (!annonce) return res.status(404).json({ message: 'Annonce introuvable' })
//     if (annonce.id_utilisateur !== id_utilisateur) return res.status(403).json({ message: 'Non autorisé' })

//     const images = req.files.map((file, index) => ({
//       chemin_image: `uploads/${file.filename}`,
//       est_principale: index === 0,
//       id_annonce: parseInt(id)
//     }))

//     await prisma.imageannonce.createMany({ data: images })

//     res.status(201).json({ message: 'Images uploadées avec succès', images })
//   } catch (err) {
//     res.status(500).json({ message: 'Erreur serveur', erreur: err.message })
//   }
// }

export const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Aucune image fournie' })
    }

    // Cloudinary retourne req.files[i].path comme URL complète
    const images = req.files.map(file => ({
      chemin_image: file.path, // URL Cloudinary complète
      url: file.path
    }))

    res.json({ images })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erreur upload' })
  }
}
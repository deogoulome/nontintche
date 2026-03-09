import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prisma.js'

// INSCRIPTION
export const inscription = async (req, res) => {
  try {
    const { nom, prenom, telephone, adresse, motdepasse, login, role } = req.body

    const existeDeja = await prisma.utilisateur.findFirst({
      where: { OR: [{ login }, { telephone }] }
    })

    if (existeDeja) {
      return res.status(400).json({ message: 'Login ou téléphone déjà utilisé' })
    }

    const hash = await bcrypt.hash(motdepasse, 10)

    const utilisateur = await prisma.utilisateur.create({
      data: { nom, prenom, telephone, adresse, motdepasse: hash, login, role }
    })

    res.status(201).json({ message: 'Compte créé avec succès', utilisateur })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message })
  }
}

// CONNEXION
export const connexion = async (req, res) => {
  try {
    const { login, motdepasse } = req.body

    const utilisateur = await prisma.utilisateur.findUnique({ where: { login } })

    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur introuvable' })
    }

    if (!utilisateur.est_actif) {
      return res.status(403).json({ message: 'Compte désactivé' })
    }

    const valide = await bcrypt.compare(motdepasse, utilisateur.motdepasse)
    if (!valide) {
      return res.status(401).json({ message: 'Mot de passe incorrect' })
    }

    const token = jwt.sign(
      { id: utilisateur.id, role: utilisateur.role, login: utilisateur.login },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Connexion réussie',
      token,
      utilisateur: {
        id: utilisateur.id,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        role: utilisateur.role,
        login: utilisateur.login
      }
    })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message })
  }
}
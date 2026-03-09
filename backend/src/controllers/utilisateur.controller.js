import prisma from '../prisma.js'
import bcrypt from 'bcryptjs'

export const monProfil = async (req, res) => {
  try {
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: req.utilisateur.id },
      select: {
        id: true, nom: true, prenom: true,
        telephone: true, adresse: true, login: true,
        role: true, date_inscription: true, est_actif: true,
        _count: { select: { annonce: true, favori: true, avis: true } }
      }
    })
    res.json(utilisateur)
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message })
  }
}

export const modifierProfil = async (req, res) => {
  try {
    const { nom, prenom, telephone, adresse } = req.body
    const updated = await prisma.utilisateur.update({
      where: { id: req.utilisateur.id },
      data: { nom, prenom, telephone, adresse },
      select: { id: true, nom: true, prenom: true, telephone: true, adresse: true, login: true, role: true }
    })
    res.json({ message: 'Profil modifié', utilisateur: updated })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message })
  }
}

export const changerMotDePasse = async (req, res) => {
  try {
    const { ancien, nouveau } = req.body
    const utilisateur = await prisma.utilisateur.findUnique({ where: { id: req.utilisateur.id } })
    const valide = await bcrypt.compare(ancien, utilisateur.motdepasse)
    if (!valide) return res.status(400).json({ message: 'Ancien mot de passe incorrect' })
    const hash = await bcrypt.hash(nouveau, 10)
    await prisma.utilisateur.update({ where: { id: req.utilisateur.id }, data: { motdepasse: hash } })
    res.json({ message: 'Mot de passe modifié avec succès' })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message })
  }
}
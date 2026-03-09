import jwt from 'jsonwebtoken'

export const verifierToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Token manquant' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.utilisateur = decoded
    next()
  } catch (err) {
    return res.status(403).json({ message: 'Token invalide' })
  }
}

export const estProprietaire = (req, res, next) => {
  if (req.utilisateur.role !== 'proprietaire' && req.utilisateur.role !== 'admin') {
    return res.status(403).json({ message: 'Accès réservé aux propriétaires' })
  }
  next()
}

export const estAdmin = (req, res, next) => {
  if (req.utilisateur.role !== 'admin') {
    return res.status(403).json({ message: 'Accès réservé aux admins' })
  }
  next()
}
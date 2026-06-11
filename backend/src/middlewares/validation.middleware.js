import { body, param, validationResult } from 'express-validator'

// Helper : renvoie les erreurs de validation ou continue
export const valider = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Données invalides', erreurs: errors.array() })
  }
  next()
}

// ── Inscription ──────────────────────────────────────────────────────────────
export const regleInscription = [
  body('nom').trim().notEmpty().withMessage('Le nom est requis'),
  body('prenom').trim().notEmpty().withMessage('Le prénom est requis'),
  body('login').trim().isLength({ min: 3 }).withMessage('Le login doit contenir au moins 3 caractères'),
  body('telephone').trim().notEmpty().withMessage('Le téléphone est requis'),
  body('motdepasse').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
]

// ── Connexion ─────────────────────────────────────────────────────────────────
export const regleConnexion = [
  body('login').trim().notEmpty().withMessage('Le login est requis'),
  body('motdepasse').notEmpty().withMessage('Le mot de passe est requis'),
]

// ── Création d'annonce ────────────────────────────────────────────────────────
export const regleAnnonce = [
  body('titre').trim().isLength({ min: 3, max: 200 }).withMessage('Titre requis (3–200 caractères)'),
  body('ville').trim().notEmpty().withMessage('La ville est requise'),
  body('quartier').trim().notEmpty().withMessage('Le quartier est requis'),
  body('prix').isFloat({ gt: 0 }).withMessage('Le prix doit être un nombre positif'),
  body('nombre_pieces').optional().isInt({ min: 1 }).withMessage('Le nombre de pièces doit être ≥ 1'),
  body('id_typechambre').isInt({ gt: 0 }).withMessage('Type de chambre invalide'),
  body('id_typeannonce').isInt({ gt: 0 }).withMessage('Type d\'annonce invalide'),
  body('commodites').optional().isArray().withMessage('Les commodités doivent être un tableau'),
  body('commodites.*').optional().isInt({ gt: 0 }).withMessage('ID commodité invalide'),
]

// ── Avis ─────────────────────────────────────────────────────────────────────
export const regleAvis = [
  body('note').isInt({ min: 1, max: 5 }).withMessage('La note doit être entre 1 et 5'),
  body('commentaire').optional().trim().isLength({ max: 1000 }).withMessage('Commentaire trop long'),
]

// ── Signalement ──────────────────────────────────────────────────────────────
export const regleSignalement = [
  body('motif').trim().notEmpty().isLength({ max: 100 }).withMessage('Motif requis (max 100 caractères)'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description trop longue'),
]

// ── ID param ─────────────────────────────────────────────────────────────────
export const regleIdParam = [
  param('id').isInt({ gt: 0 }).withMessage('ID invalide'),
]

// import prisma from '../prisma.js'

// // EFFECTUER UN PAIEMENT
// export const effectuerPaiement = async (req, res) => {
//   try {
//     const { id_annonce, mode_paiement } = req.body
//     const id_utilisateur = req.utilisateur.id

//     // Vérifier que l'annonce existe et appartient à l'utilisateur
//     const annonce = await prisma.annonce.findUnique({
//       where: { id: parseInt(id_annonce) },
//       include: { typeannonce: true }
//     })

//     if (!annonce) return res.status(404).json({ message: 'Annonce introuvable' })
//     if (annonce.id_utilisateur !== id_utilisateur) return res.status(403).json({ message: 'Non autorisé' })
//     if (annonce.statut !== 'en_attente_paiement') return res.status(400).json({ message: 'Cette annonce ne nécessite pas de paiement' })

//     // Générer une référence unique
//     const reference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

//     // Créer le paiement
//     const paiement = await prisma.paiementannonce.create({
//       data: {
//         montant_paye: annonce.typeannonce.prix,
//         mode_paiement,
//         reference_transaction: reference,
//         statut: 'confirme',  // Dans la réalité, ce serait 'en_attente' jusqu'à confirmation
//         id_annonce: annonce.id,
//         id_utilisateur,
//         id_typeannonce: annonce.id_typeannonce
//       }
//     })

//     // Activer l'annonce (trigger PostgreSQL le fait aussi, double sécurité)
//     const dateDebut = new Date()
//     const dateFin = new Date()
//     dateFin.setDate(dateFin.getDate() + annonce.typeannonce.duree_jours)

//     await prisma.annonce.update({
//       where: { id: annonce.id },
//       data: {
//         statut: 'active',
//         date_debut_annonce: dateDebut,
//         date_fin_annonce: dateFin
//       }
//     })

//     res.status(201).json({
//       message: '✅ Paiement confirmé ! Votre annonce est maintenant active.',
//       paiement,
//       annonce_active_jusqu_au: dateFin
//     })
//   } catch (err) {
//     res.status(500).json({ message: 'Erreur serveur', erreur: err.message })
//   }
// }

// // HISTORIQUE DES PAIEMENTS
// export const historiquePaiements = async (req, res) => {
//   try {
//     const id_utilisateur = req.utilisateur.id

//     const paiements = await prisma.paiementannonce.findMany({
//       where: { id_utilisateur },
//       include: {
//         annonce: { select: { titre: true, ville: true, statut: true } },
//         typeannonce: { select: { libelle: true, duree_jours: true } }
//       },
//       orderBy: { date_paiement: 'desc' }
//     })

//     res.json(paiements)
//   } catch (err) {
//     res.status(500).json({ message: 'Erreur serveur', erreur: err.message })
//   }
// }


import { FedaPay, Transaction } from 'fedapay'
import prisma from '../prisma.js'

// Initialiser FedaPay
FedaPay.setApiKey(process.env.FEDAPAY_SECRET_KEY)
FedaPay.setEnvironment(process.env.FEDAPAY_ENV || 'sandbox')

// Créer une transaction FedaPay et initier le paiement
export const initierPaiement = async (req, res) => {
  const { id_annonce, id_typeannonce } = req.body
  const id_utilisateur = req.utilisateur.id

  try {
    // Récupérer l'annonce
    const annonce = await prisma.annonce.findUnique({
      where: { id: id_annonce },
      include: { typeannonce: true }
    })

    if (!annonce) return res.status(404).json({ message: 'Annonce introuvable' })
    if (annonce.id_utilisateur !== id_utilisateur)
      return res.status(403).json({ message: 'Non autorisé' })

    const typeannonce = id_typeannonce
      ? await prisma.typeannonce.findUnique({ where: { id: id_typeannonce } })
      : annonce.typeannonce

    if (!typeannonce) return res.status(404).json({ message: 'Type annonce introuvable' })

    // Récupérer l'utilisateur
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: id_utilisateur }
    })

    // Créer la transaction FedaPay
    const transaction = await Transaction.create({
      description: `Paiement annonce - ${annonce.titre}`,
      amount: typeannonce.prix,
      currency: { iso: 'XOF' },
      callback_url: `${process.env.FRONTEND_URL}/paiement/callback`,
      customer: {
        firstname: utilisateur.prenom || utilisateur.nom,
        lastname: utilisateur.nom,
        phone_number: {
        //   number: utilisateur.telephone,
          number: '64000001', // ← temporaire pour les tests sandbox
          country: 'BJ'
        }
      }
    })

    // Générer le lien de paiement
    const token = await transaction.generateToken()

    // Sauvegarder le paiement en attente dans la BDD
    const paiement = await prisma.paiementannonce.create({
      data: {
        id_annonce,
        id_utilisateur,
        id_typeannonce: typeannonce.id,
        montant_paye: typeannonce.prix,
        mode_paiement: 'Mobile Money',
        statut: 'en_attente',
        reference_transaction: transaction.id.toString(),
      }
    })

    res.json({
      paiement_id: paiement.id,
      transaction_id: transaction.id,
      payment_url: token.url,
      montant: typeannonce.prix,
      typeannonce: typeannonce.libelle
    })

  } catch (err) {
    console.error('Erreur FedaPay:', err)
    res.status(500).json({ message: 'Erreur lors de l\'initiation du paiement', detail: err.message })
  }
}

// Vérifier le statut d'une transaction après retour
export const verifierPaiement = async (req, res) => {
  const { transaction_id } = req.params

  try {
    const transaction = await Transaction.retrieve(parseInt(transaction_id))

    const paiement = await prisma.paiementannonce.findFirst({
      where: { reference_transaction: transaction_id.toString() },
      include: { annonce: { include: { typeannonce: true } } }
    })

    if (!paiement) return res.status(404).json({ message: 'Paiement introuvable' })

    if (transaction.status === 'approved' && paiement.statut !== 'confirme') {
      // Activer l'annonce
      const dateDebut = new Date()
      const dateFin = new Date()
      dateFin.setDate(dateFin.getDate() + paiement.annonce.typeannonce.duree_jours)

      await prisma.paiementannonce.update({
        where: { id: paiement.id },
        data: { statut: 'confirme' }
      })

      await prisma.annonce.update({
        where: { id: paiement.id_annonce },
        data: {
          statut: 'active',
          date_debut_annonce: dateDebut,
          date_fin_annonce: dateFin,
          id_typeannonce: paiement.id_typeannonce
        }
      })

      return res.json({
        statut: 'confirme',
        message: 'Paiement confirmé ! Annonce activée.',
        annonce_id: paiement.id_annonce
      })
    }

    if (transaction.status === 'declined' || transaction.status === 'canceled') {
      await prisma.paiementannonce.update({
        where: { id: paiement.id },
        data: { statut: 'echec' }
      })
      return res.json({ statut: 'echec', message: 'Paiement échoué ou annulé.' })
    }

    res.json({ statut: paiement.statut, transaction_status: transaction.status })

  } catch (err) {
    console.error('Erreur vérification:', err)
    res.status(500).json({ message: 'Erreur lors de la vérification', detail: err.message })
  }
}

// Webhook FedaPay (appelé automatiquement par FedaPay)
export const webhookFedaPay = async (req, res) => {
  const event = req.body

  try {
    if (event.name === 'transaction.approved') {
      const transactionId = event.entity?.id?.toString()
      if (!transactionId) return res.status(400).json({ message: 'ID transaction manquant' })

      const paiement = await prisma.paiementannonce.findFirst({
        where: { reference_transaction: transactionId },
        include: { annonce: { include: { typeannonce: true } } }
      })

      if (paiement && paiement.statut !== 'confirme') {
        const dateDebut = new Date()
        const dateFin = new Date()
        dateFin.setDate(dateFin.getDate() + paiement.annonce.typeannonce.duree_jours)

        await prisma.paiementannonce.update({
          where: { id: paiement.id },
          data: { statut: 'confirme' }
        })

        await prisma.annonce.update({
          where: { id: paiement.id_annonce },
          data: {
            statut: 'active',
            date_debut_annonce: dateDebut,
            date_fin_annonce: dateFin,
          }
        })
      }
    }

    res.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    res.status(500).json({ message: 'Erreur webhook' })
  }
}

// Historique paiements
export const getHistoriquePaiements = async (req, res) => {
  try {
    const paiements = await prisma.paiementannonce.findMany({
      where: { id_utilisateur: req.utilisateur.id },
      include: {
        annonce: { select: { titre: true } },
        typeannonce: true
      },
      orderBy: { date_paiement: 'desc' }
    })
    res.json(paiements)
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' })
  }
}
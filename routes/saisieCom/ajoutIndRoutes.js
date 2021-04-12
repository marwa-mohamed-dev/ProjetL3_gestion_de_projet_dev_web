const express = require('express')
const ajoutIndController = require('../../controllers/saisieCom/ajoutIndController')

const router = express.Router();

// Affiche la page de ajout individu à partir de commande
router.get('/', ajoutIndController.commande_afficheNewInd)

// Créer un nouvel individu depuis l'espace saisie de commande
router.post('/', ajoutIndController.commande_creerNewInd)

module.exports = router;
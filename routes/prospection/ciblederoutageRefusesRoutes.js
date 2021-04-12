const express = require('express')
const ciblederoutageRefusesController = require('../../controllers/prospection/ciblederoutageRefusesController')

const router = express.Router();

// Affiche la page des cibles de routage refusées et la liste des cibles
router.get('/', ciblederoutageRefusesController.cibleRefusee_affiche)

// Récupère les informations de la cible de routage sélectionnée
router.get('/:id', ciblederoutageRefusesController.cibleRefusee_getOne)

// Supprime la cible de routage refusée
router.delete('/:id', ciblederoutageRefusesController.cibleRefusee_delete)

module.exports = router;
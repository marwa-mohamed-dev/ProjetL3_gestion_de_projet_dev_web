const express = require('express')
const creationCiblederoutageController = require('../../controllers/prospection/creationCiblederoutageController')

const router = express.Router();

// Récuperation liste articles pour creation cible de routage
router.get('/', creationCiblederoutageController.creationCible_getListArt)

// Créer une cible de routage
router.post('/', creationCiblederoutageController.creationCible_creer)

module.exports = router;
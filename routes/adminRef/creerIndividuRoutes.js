const express = require('express')
const creerIndividuController = require('../../controllers/adminRef/creerIndividuController')

const router = express.Router();

// Créer nouvel individu
router.get('/', creerIndividuController.creerIndividu_get)

// ajoute un individu à la base de données
// fait marcher le bouton submit en soi
// puis redirige vers la page administrateur
router.post('/', creerIndividuController.creerIndividu_creer)

module.exports = router;
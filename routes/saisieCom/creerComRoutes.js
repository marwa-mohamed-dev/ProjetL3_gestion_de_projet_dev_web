const express = require('express')
const creerComController = require('../../controllers/saisieCom/creerComController')

const router = express.Router();

// Récupère la page de création d'une nouvelle commande
router.get('/',  creerComController.creerCom_getPage)

// Créer un nouvel object commande selon la requête et l'ajoute à notre base de donnée
// fait aussi les vérifications d'anomalies
router.post('/', creerComController.creerCom_creer_verifAnomalie)

module.exports = router;
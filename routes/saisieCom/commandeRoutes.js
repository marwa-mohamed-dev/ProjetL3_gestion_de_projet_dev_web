const express = require('express')
const commandeController = require('../../controllers/saisieCom/commandeController')

const router = express.Router();

// affiche les informations de l'individu sélectionné
// dans la liste de recherche
router.get('/', commandeController.commande_affiche)

// supprime la commande sélectionnée
router.delete('/', commandeController.commande_delete)

module.exports = router;

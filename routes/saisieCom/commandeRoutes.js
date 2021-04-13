const express = require('express')
const commandeController = require('../../controllers/saisieCom/commandeController')

const router = express.Router();

// affiche les informations de l'individu sélectionné
// dans la liste de recherche
router.get('/:id', commandeController.commande_getOne)

// supprime la commande sélectionnée
router.delete('/:id', commandeController.commande_delete)

module.exports = router;

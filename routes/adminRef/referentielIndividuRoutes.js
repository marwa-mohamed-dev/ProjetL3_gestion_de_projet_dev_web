const express = require('express')
const referentielIndividuController = require('../../controllers/adminRef/referentielIndividuController')

const router = express.Router();

// affiche les informations de l'individu sélectionné
// dans la liste de recherche
router.get('/:id', referentielIndividuController.individu_getOne)

// Enregistre les informations qui ont subi une modification
router.put('/:id', referentielIndividuController.individu_modif)

module.exports = router;
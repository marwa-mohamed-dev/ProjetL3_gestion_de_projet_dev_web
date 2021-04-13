const express = require('express')
const rechercheIndController = require('../../controllers/recherche/rechercheIndController')

const router = express.Router();

// affiche liste de tous les individus de la base
// ordonés avec celui ajouté le plus récemment en premier
router.get('/', rechercheIndController.recherche_indRecherche)

// affiche les informations d'un seul individu sélectionné
// dans la liste de recherche
router.get('/:id', rechercheIndController.recherche_getOne)

module.exports = router;
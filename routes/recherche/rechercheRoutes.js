const express = require('express')
const rechercheController = require('../../controllers/recherche/rechercheController')

const router = express.Router();

// affiche liste de tous les individus de la base
// ordonés avec celui ajouté le plus récemment en premier
router.get('/', rechercheController.recherche_indRecherche)

// affiche les informations d'un seul individu sélectionné
// dans la liste de recherche
router.get('/:id', rechercheController.recherche_getOne)

// supprime un des individus sélectionné
router.delete('/:id', rechercheController.recherche_indDelete)

module.exports = router;
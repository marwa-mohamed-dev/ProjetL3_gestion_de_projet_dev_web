const express = require('express')
const rechercheArtController = require('../../controllers/recherche/rechercheArtController')

const router = express.Router();

// affiche liste de tous les individus de la base
// ordonés avec celui ajouté le plus récemment en premier
router.get('/', rechercheArtController.recherche_artRecherche)

// affiche les informations d'un seul individu sélectionné
// dans la liste de recherche
router.get('/:id', rechercheArtController.recherche_getOne)

module.exports = router;
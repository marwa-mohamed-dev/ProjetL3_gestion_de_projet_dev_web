const express = require('express')
const modifIndividuController = require('../../controllers/adminRef/modifIndividuController')

const router = express.Router();

// affiche liste de tous les individu de la base, ordonnés avec celui ajouté le plus récemment en premier
// Permet d'effectuer la recherche des individus en fonction du nom prénom date de naissance
router.get('/', modifIndividuController.modifIndividu_recherche)

// supprime l'individu sélectionné
router.delete('/:id', modifIndividuController.modifIndividu_delete)

module.exports = router;
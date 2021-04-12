const express = require('express')
const referentielArticleController = require('../../controllers/adminRef/referentielArticleController')

const router = express.Router();

// affiche les informations d'un seul article sélectionné
// dans la liste de recherche
router.get('/:id', referentielArticleController.article_getOne)

// Enregistre les informations qui ont subi une modification
router.put('/:id', referentielArticleController.article_modif)

module.exports = router;
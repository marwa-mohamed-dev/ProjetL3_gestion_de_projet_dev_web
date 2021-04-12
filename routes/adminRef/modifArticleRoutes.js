const express = require('express')
const modifArticleController = require('../../controllers/adminRef/modifArticleController')

const router = express.Router();

// affiche liste de tous les articles de la base, ordonés avec celui ajouté le plus récemment en premier
// Permet d'effectuer la recherche des articles en fonction de désigantion et de la référence
router.get('/', modifArticleController.modifArticle_recherche)

// supprime l'article sélectionné
router.delete('/:id', modifArticleController.modifArticle_delete)

module.exports = router;
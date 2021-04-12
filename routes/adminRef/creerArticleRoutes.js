const express = require('express')
const creerArticleController = require('../../controllers/adminRef/creerArticleController')

const router = express.Router();

// Aller sur la page Créer un article
router.get('/', creerArticleController.creerArticle_get)

// Créer un nouvel article sur la base de données
router.post('/', creerArticleController.creerArticle_creer)

module.exports = router;
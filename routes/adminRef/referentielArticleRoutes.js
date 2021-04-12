const express = require('express')
const Article = require('../../models/article');

const router = express.Router();

// affiche les informations d'un seul article sélectionné
// dans la liste de recherche
router.get('/:id', (req, res) => {
    const id = req.params.id;
    Article.findById(id)
        .then(result => {
            res.render('./adminRef/Article', { article: result, title: "Administration du référentiel", style: "Referentiel" });
        })
        .catch((err) => {
            console.log(err);
        });
});

router.put('/:id', async(req, res) => {
    let article
    try {
        article = await Article.findById(req.params.id)
        article.designation = req.body.designation
        article.prix = req.body.prix
        article.description = req.body.description
        await article.save()
        res.redirect('/referentielModifArticle')
    } catch {
        res.redirect('/referentiel')
    }
})

module.exports = router;
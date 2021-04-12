const express = require('express')
const Article = require('../../models/article');

const router = express.Router();

// affiche liste de tous les articles de la base
//ordonés avec celui ajouté le plus récemment en premier
router.get('/', (req, res) => {
    let searchOptions = {};
    if (req.query.reference != null && req.query.designation != null) {
        searchOptions.reference = new RegExp(req.query.reference);
        searchOptions.designation = new RegExp(req.query.designation, 'i');
    }
    Article.find(searchOptions).sort({ createdAt: -1 })
        .then((result) => {
            res.render('./adminRef/ModifArticle', {
                title: 'Administration du référentiel',
                articles: result,
                style: "Referentiel",
                searchOptions: req.query
            });
        })
        .catch((err) => {
            console.log(err);
        });
});

// supprime l'article sélectionné
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Article.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/referentielModifArticle' });
        })
        .catch((err) => {
            console.log(err);
        });
});

module.exports = router;
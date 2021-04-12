// modifArticle_recherche, modifArticle_delete
const Article = require('../../models/article');

const modifArticle_recherche = (req, res) => {
    let searchOptions = {};
    if (req.query.reference != null && req.query.designation != null) {
        searchOptions.reference = new RegExp(req.query.reference);
        searchOptions.designation = new RegExp(req.query.designation, 'i');
    }
    Article.find(searchOptions).sort({ createdAt: -1 }).limit(10)
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
}

const modifArticle_delete = (req, res) => {
    const id = req.params.id;
    Article.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/referentielModifArticle' });
        })
        .catch((err) => {
            console.log(err);
        });
}

module.exports = {
    modifArticle_recherche,
    modifArticle_delete
}
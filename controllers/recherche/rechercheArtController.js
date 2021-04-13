// recherche_ArtRecherche, recherche_getOne
const Article = require('../../models/article');

const recherche_artRecherche = (req, res) => {
    let searchOptions = {};
    if (req.query.reference != null && req.query.designation != null) {
        searchOptions.reference = new RegExp(req.query.reference);
        searchOptions.designation = new RegExp(req.query.designation, 'i');
    }
    Article.find(searchOptions).sort({ createdAt: -1 }).limit(10)
        .then((result) => {
            res.render('recherche/rechercheArt', {
                title: 'Liste articles',
                articles: result,
                style: "recherche",
                searchOptions: req.query
            });
        })
        .catch((err) => {
            console.log(err);
        });
}

const recherche_getOne = (req, res) => {
    const id = req.params.id;
    Article.findById(id)
        .then(result => {
            res.render('recherche/detailsArt', { article: result, title: "Détails article", style: "recherche" });
        })
        .catch((err) => {
            console.log(err);
        });
}

module.exports = {
    recherche_artRecherche,
    recherche_getOne
}
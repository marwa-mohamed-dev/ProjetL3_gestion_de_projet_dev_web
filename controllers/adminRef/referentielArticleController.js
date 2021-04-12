// article_getOne, article_modif
const Article = require('../../models/article');

const article_getOne = (req, res) => {
    const id = req.params.id;
    Article.findById(id)
        .then(result => {
            res.render('./adminRef/Article', { article: result, title: "Administration du référentiel", style: "Referentiel" });
        })
        .catch((err) => {
            console.log(err);
        });
}

const article_modif = async (req, res) => {
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
}

module.exports = {
    article_getOne,
    article_modif
}
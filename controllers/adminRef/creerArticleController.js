// creerArticle_get, creerArticle_creer
const Article = require('../../models/article');

const creerArticle_get = (req, res) => {
    try {
        const article = new Article();
        res.render('./adminRef/CreerArticle', {
            title: 'Administration du référentiel',
            style: 'Referentiel',
            article: article
        })
    } catch (err) {
        console.log(err);
    }
}

const creerArticle_creer = (req, res) => {
    const fileName = req.file != null ? req.file.filename : null;
    const article = new Article({
        designation: req.body.designation,
        prix: req.body.prix,
        nomImage: fileName,
        description: req.body.description
    })
    article.reference = generateRef();
    article.save()
        .then((result) => {
            res.redirect('/referentiel');
        })
        .catch((err) => {
            console.log(err);
        });
}

function generateRef() {
    var num = Math.trunc(Math.random() * 100000000);
    while (num < 10000000) {
        num = num * 10;
    }
    return num;
}

module.exports = {
    creerArticle_get,
    creerArticle_creer
}
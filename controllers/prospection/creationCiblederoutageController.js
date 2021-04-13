// creationCible_getListArt, creationCible_creer
const Individu = require('../../models/individu');
const Article = require('../../models/article');
const CibleDeRoutage = require('../../models/cibleDeRoutage');

const creationCible_getListArt = async (req, res) => {
    try {
        const articles = await Article.find({})
            //const individus = await Individu.find({})
            //const cibleDeRoutage = new cibleDeRoutage()
        res.render('./prospection/new', {
            articles: articles,
            // individus : individus,
            //cibleDeRoutage: cibleDeRoutage
            title: 'Cibles de routage',
            style: "prospection"
        })
    } catch (err) {
        console.log(err);
    }
}

const creationCible_creer = async (req, res) => {
    const individus = await Individu.find({})
    const cibleDeRoutage = new CibleDeRoutage(req.body);

    const liste = new Array();
    individus.forEach(individu => {
        if (cibleDeRoutage.client === 'Non') {
            if ((individu.age <= cibleDeRoutage.ageMax) && (individu.age >= cibleDeRoutage.ageMin) && (individu.categoriePro === cibleDeRoutage.categoriePro) && (Math.floor(individu.adresseCode / 1000) === cibleDeRoutage.departementResidence) && (individu.statut === 'Enregistré')) {
                liste.push(individu._id)
            }
        } else {
            if ((individu.age <= cibleDeRoutage.ageMax) && (individu.age >= cibleDeRoutage.ageMin) && (individu.categoriePro === cibleDeRoutage.categoriePro) && (Math.floor(individu.adresseCode / 1000) === cibleDeRoutage.departementResidence) && (individu.statut === 'Client')) {
                liste.push(individu._id)
            }
        }

    })
    cibleDeRoutage.listeIndividus = liste
    cibleDeRoutage.save()
        //CibleDeRoutage.updateOne({_id: cibleDeRoutage._id}, {$set : {listeIndividus: liste}})
        .then((result) => {
            res.redirect('/creationCiblederoutage');
        })
        .catch((err) => {
            console.log(err);
        });
}

module.exports = {
    creationCible_getListArt,
    creationCible_creer
}
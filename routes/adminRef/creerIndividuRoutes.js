const express = require('express')
const Individu = require('../../models/individu');

const router = express.Router();

// Créer nouvel individu
router.get('/', (req, res) => {
    res.render('./adminRef/CreerIndividu', { title: 'Administration du référentiel', style: 'Referentiel' });
});

// ajoute un individu à la base de données
// fait marcher le bouton submit en soi
// puis redirige vers la page administrateur
router.post('/', (req, res) => {
    const individu = new Individu(req.body);
    individu.age = getAge(individu.dateNaissance)
    individu.save()
        .then((result) => {
            res.redirect('/referentiel');
        })
        .catch((err) => {
            console.log(err);
        });
});

function getAge(date) {
    var diff = Date.now() - date.getTime();
    var age = new Date(diff);
    return Math.abs(age.getUTCFullYear() - 1970);
}

module.exports = router;
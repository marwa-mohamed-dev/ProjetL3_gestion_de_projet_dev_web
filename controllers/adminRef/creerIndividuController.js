// creerIndividu_get, creerIndividu_creer
const Individu = require('../../models/individu');

const creerIndividu_get = (req, res) => {
    res.render('./adminRef/CreerIndividu', { title: 'Administration du référentiel', style: 'Referentiel' });
}

const creerIndividu_creer = (req, res) => {
    const individu = new Individu(req.body);
    individu.age = getAge(individu.dateNaissance)
    individu.save()
        .then((result) => {
            res.redirect('/referentiel');
        })
        .catch((err) => {
            console.log(err);
        });
}

function getAge(date) {
    var diff = Date.now() - date.getTime();
    var age = new Date(diff);
    return Math.abs(age.getUTCFullYear() - 1970);
}

module.exports = {
    creerIndividu_get,
    creerIndividu_creer
}
// modifIndividu_recherche, modifIndividu_delete
const Individu = require('../../models/individu');

const modifIndividu_recherche = (req, res) => {
    let searchOptions = {};
    if (req.query.nom != null && req.query.prenom != null && req.query.dateNaissance != null) {
        if (req.query.dateNaissance != '') {
            searchOptions.dateNaissance = req.query.dateNaissance;
        }
        searchOptions.nom = new RegExp(req.query.nom, 'i');
        searchOptions.prenom = new RegExp(req.query.prenom, 'i');
    }
    Individu.find(searchOptions).sort({ createdAt: -1 }).limit(10)
        .then((result) => {
            res.render('./adminRef/ModifIndividu', {
                title: 'Administration du référentiel',
                individus: result,
                style: "Referentiel",
                searchOptions: req.query
            });
        })
        .catch((err) => {
            console.log(err);
        });
}

const modifIndividu_delete = (req, res) => {
    const id = req.params.id;
    Individu.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/referentielModifIndividu' });
        })
        .catch((err) => {
            console.log(err);
        });
}

module.exports = {
    modifIndividu_recherche,
    modifIndividu_delete
}
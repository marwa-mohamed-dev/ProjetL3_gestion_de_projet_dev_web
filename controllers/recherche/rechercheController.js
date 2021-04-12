// recherche_IndRecherche, recherche_getOne, recherche_indDelete
const Individu = require('../../models/individu');

const recherche_indRecherche = (req, res) => {
    let searchOptions = {}
    if (req.query.nom != null && req.query.prenom != null) {
        searchOptions.nom = new RegExp(req.query.nom, 'i');
        searchOptions.prenom = new RegExp(req.query.prenom, 'i')
    }
    Individu.find(searchOptions).sort({ createdAt: -1 })
        .then((result) => {
            res.render('recherche', {
                title: 'Liste individus',
                individus: result,
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
    Individu.findById(id)
        .then(result => {
            res.render('details', { individu: result, title: "Détails individu", style: "recherche" });
        })
        .catch((err) => {
            console.log(err);
        });
}

const recherche_indDelete = (req, res) => {
    const id = req.params.id;
    Individu.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/recherche' });
        })
        .catch((err) => {
            console.log(err);
        });
}

module.exports = {
    recherche_indRecherche,
    recherche_getOne,
    recherche_indDelete
}
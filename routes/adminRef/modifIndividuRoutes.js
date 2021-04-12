const express = require('express')
const Individu = require('../../models/individu');

const router = express.Router();

// affiche liste de tous les individu de la base
//ordonés avec celui ajouté le plus récemment en premier
router.get('/', (req, res) => {
    let searchOptions = {};
    console.log(req.query);
    if (req.query.nom != null && req.query.prenom != null && req.query.dateNaissance != null) {
        if (req.query.dateNaissance != '') {
            searchOptions.dateNaissance = req.query.dateNaissance;
        }
        searchOptions.nom = new RegExp(req.query.nom, 'i');
        searchOptions.prenom = new RegExp(req.query.prenom, 'i');
    }
    console.log(searchOptions);
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
});

// supprime l'individu sélectionné
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Individu.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/referentielModifIndividu' });
        })
        .catch((err) => {
            console.log(err);
        });
});

module.exports = router;
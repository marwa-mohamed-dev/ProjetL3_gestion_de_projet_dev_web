const express = require('express')
const Individu = require('../../models/individu');

const router = express.Router();

// affiche liste de tous les individus de la base
//ordonés avec celui ajouté le plus récemment en premier
router.get('/', (req, res) => {
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
});

// affiche les informations d'un seul individu sélectionné
// dans la liste de recherche
router.get('/:id', (req, res) => {
    const id = req.params.id;
    Individu.findById(id)
        .then(result => {
            res.render('details', { individu: result, title: "Détails individu", style: "recherche" });
        })
        .catch((err) => {
            console.log(err);
        });
});


// supprime un des individus sélectionné
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Individu.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/recherche' });
        })
        .catch((err) => {
            console.log(err);
        });
});

module.exports = router;
const express = require('express')
const Individu = require('../../models/individu');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('./saisieCom/AjoutInd', { title: 'Commandes', style: "Commande" })
})

//créer un nouvel individu depuis l'espace saisie de commande
router.post('/', (req, res) => {
    const individu = new Individu(req.body);
    individu.age = getAge(individu.dateNaissance)
    individu.save()
        .then((result) => {
            res.redirect('/creerCom');
        })
        .catch((err) => {
            console.log(err);
        });
});

module.exports = router;
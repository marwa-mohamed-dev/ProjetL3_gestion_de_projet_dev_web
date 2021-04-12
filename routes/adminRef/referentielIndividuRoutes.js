const express = require('express')
const Individu = require('../../models/individu');

const router = express.Router();

// affiche les informations de l'individu sélectionné
// dans la liste de recherche
router.get('/:id', (req, res) => {
    const id = req.params.id;
    Individu.findById(id)
        .then(result => {
            res.render('./adminRef/Individu', { individu: result, title: "Administration du référentiel", style: "Referentiel" });
        })
        .catch((err) => {
            console.log(err);
        });
});

router.put('/:id', async(req, res) => {
    let individu
    try {
        individu = await Individu.findById(req.params.id)
        individu.nom = req.body.nom
        individu.prenom = req.body.prenom
        //individu.dateNaissance = req.body.dateNaissance
        individu.categoriePro = req.body.categoriePro
        individu.adresseNum = req.body.adresseNum
        individu.adresseType = req.body.adresseType
        individu.adresseCode = req.body.adresseCode
        individu.adresseVille = req.body.adresseVille
        individu.adresseInfos = req.body.adresseInfos
        individu.adresseMail = req.body.adresseMail
        individu.numeroTel = req.body.numeroTel
        individu.statut = req.body.statut
        await individu.save()
        res.redirect('/referentielModifIndividu')
    } catch {
        res.redirect('/referentiel')
    }
})

module.exports = router;
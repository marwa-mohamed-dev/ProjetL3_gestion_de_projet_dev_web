// commande_afficheNewInd, commande_creerNewInd
const Individu = require('../../models/individu');

const commande_afficheNewInd = (req, res) => {
    res.render('./saisieCom/AjoutInd', { title: 'Saisie de Commandes', style: "Commande" })
}

const commande_creerNewInd = (req, res) => {
    const individu = new Individu(req.body);
    individu.age = getAge(individu.dateNaissance)
    individu.save()
        .then((result) => {
            res.redirect('/creerCom');
        })
        .catch((err) => {
            console.log(err);
        });
}

module.exports = {
    commande_afficheNewInd,
    commande_creerNewInd
}
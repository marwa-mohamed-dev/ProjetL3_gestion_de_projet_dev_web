// modifCom_recherche
const Commande = require('../../models/commande');

const modifCom_recherche = (req, res) => {
    let searchOptions = {}
    if (req.query.numCommande != null) {
        searchOptions.numCommande = new RegExp(req.query.numCommande);
    }
    Commande.find(searchOptions).sort({ createdAt: -1 })
        .then((result) => {
            res.render('./saisieCom/ModifCom', {
                title: 'Saisie de Commandes',
                commandes: result,
                style: "Commande",
                searchOptions: req.query
            });
        })
        .catch((err) => {
            console.log(err);
        });
}


module.exports = {
    modifCom_recherche
}
const express = require('express')
const Individu = require('../../models/individu');
const Article = require('../../models/article');
const Commande = require('../../models/commande');

const router = express.Router();

// affiche les informations de l'individu sélectionné
// dans la liste de recherche
router.get('/', async(req, res) => {
    try {
        const id = req.params.id;
        const com = await Commande.findById(id);
        let client = await Individu.findOne(com.client);
        let articles = await Article.find({ _id: { $in: com.articles } });
        res.render('./saisieCom/Commande', { commande: com, cl: client, larticles: articles, title: "Commande", style: "Commande" });
    } catch (err) {
        console.log(err);
    };
});

// supprime l'individu sélectionné
router.delete('/', (req, res) => {
    const id = req.params.id;
    Commande.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/modifCom' });
        })
        .catch((err) => {
            console.log(err);
        });
});

module.exports = router;

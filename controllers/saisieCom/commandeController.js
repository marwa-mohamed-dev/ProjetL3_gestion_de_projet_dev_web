// commande_affiche, commande_delete
const Individu = require('../../models/individu');
const Article = require('../../models/article');
const Commande = require('../../models/commande');

const commande_affiche = async (req, res) => {
    try {
        const id = req.params.id;
        const com = await Commande.findById(id);
        let client = await Individu.findOne(com.client);
        let articles = await Article.find({ _id: { $in: com.articles } });
        res.render('./saisieCom/Commande', { commande: com, cl: client, larticles: articles, title: "Commande", style: "Commande" });
    } catch (err) {
        console.log(err);
    };
}

const commande_delete = (req, res) => {
    const id = req.params.id;
    Commande.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/modifCom' });
        })
        .catch((err) => {
            console.log(err);
        });
}

module.exports = {
    commande_affiche,
    commande_delete
}
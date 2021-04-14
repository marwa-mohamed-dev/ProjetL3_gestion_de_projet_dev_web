// commande_affiche, commande_delete
const Individu = require('../../models/individu');
const Article = require('../../models/article');
const Commande = require('../../models/commande');
const Anomalie = require('../../models/anomalie')
const {calculPrix, verifSoldeCB, testAnomalie } = require('./functionAnomalies')

const commande_getOne = async (req, res) => {
    try {
        const id = req.params.id;
        const com = await Commande.findById(id);
        let client = await Individu.findOne(com.client);
        let articles = await Article.find({ _id: { $in: com.articles } });
        res.render('./saisieCom/Commande', { commande: com, cl: client, larticles: articles, title: 'Saisie de Commandes', style: "Commande" });
    } catch (err) {
        console.log(err);
    };
}

const commande_verif = async (req, res) => {
    let commande = await Commande.findById(req.params.id)
    //pour récupérer la liste des prix des articles de notre commande
    const ids = commande.articles;
    const articles = await Article.find({ _id: { $in: ids } });
    const lprix = [];
    ids.forEach(id => {
        articles.forEach(article => {
            if (article.id == id) {
                lprix.push(article.prix);
            }
        });
    });

    commande.prix = calculPrix(lprix, commande.quantite);
    if(commande.pCarte=='on' && commande.numeroCarte!="" && commande.dateExpiration!="" && commande.crypto!=""){
        commande.valeur=verifSoldeCB(commande);
    }
    commande.etat = testAnomalie(commande);

    if(commande.etat.length>0){
        const anomalie=new Anomalie();
        anomalie.numeroCom=commande.numCommande;
        anomalie.client=commande.client;
        anomalie.anomalies=commande.etat;
        anomalie.save();
    } else {
        // TODO Téléchargement
        const individu = await Individu.findOne(commande.client)
        const data = {"Client":individu, "Commande" : commande, "Article(s) ":articles}
        res.set("Content-Disposition", "attachment;filename=file.json");
        res.type("application/json");
        res.json(data);
    }

    commande.verification = true;
    commande.save()
        .then((result) => {
            res.redirect('/commandes');
        })
        .catch((err) => {
            console.log(err);
        });
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
    commande_getOne,
    commande_verif,
    commande_delete
}
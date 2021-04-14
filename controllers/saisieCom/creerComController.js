// creerCom_getPage, creerCom_creer_verifAnomalie
const Individu = require('../../models/individu');
const Article = require('../../models/article');
const Commande = require('../../models/commande');
const Anomalie = require('../../models/anomalie');

const {generateNumCom, calculPrix, verifSoldeCB, testAnomalie } = require('./functionAnomalies')

const creerCom_getPage = async (req, res) => {
    const articles = await Article.find({})
    const individus = await Individu.find({})
    res.render('./saisieCom/CreerCom', { articles: articles, individus: individus, title: 'Saisie de Commandes', style: "Commande" })
}

const creerCom_creer_verifAnomalie = async (req, res) => {
    const commande = new Commande(req.body);
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
    commande.numCommande = generateNumCom().toString();
    commande.etat = testAnomalie(commande);

    if(commande.etat.length>0){
        const anomalie=new Anomalie();
        anomalie.idCom=commande._id;
        anomalie.client=commande.client;
        anomalie.anomalies=commande.etat;
        anomalie.save();
    } else {
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

module.exports = {
    creerCom_getPage,
    creerCom_creer_verifAnomalie
}
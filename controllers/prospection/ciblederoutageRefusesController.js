// cibleRefusee_affiche, cibleRefusee_getOne, cibleRefusee_delete
const Individu = require('../../models/individu');
const Article = require('../../models/article');
const CibleDeRoutage = require('../../models/cibleDeRoutage');

const cibleRefusee_affiche = async (req, res) => {
    try {
        const cibleDeRoutages = await CibleDeRoutage.find({}).sort({ createdAt: -1 })
        res.render('./prospection/visualiserRefuses', {
            cibleDeRoutages: cibleDeRoutages,
            title: 'Cibles de routage',
            style: "prospection"
        })
    } catch (err) {
        console.log(err);
    }
}

const cibleRefusee_getOne = async (req, res) => {
    try {
        const id = req.params.id;
        const cible = await CibleDeRoutage.findById(id)
        const articles = await Article.find({ _id: { $in: cible.articles } })
        const individus = await Individu.find({ _id: { $in: cible.listeIndividus } })
        res.render('./prospection/modif', { cible: cible, articles: articles, individus: individus, title: 'cible de routage', style: "prospection" });
    } catch (error) {
        console.log(err);
    }
}

const cibleRefusee_delete = async(req, res) => {
    const id = req.params.id;
    const cible = await CibleDeRoutage.findById(id)
    const individus = await Individu.find({ _id: { $in: cible.listeIndividus } })
    if(cible.listeIndividus.length>0){
        console.log(individus)
        individus.forEach( async (individu) => {
            if(individu.statut === 'Prospect'){
                individu.statut = 'Enregistré'
                await individu.save()
                console.log(individu)
            }
            
        })
    }
    console.log(individus)
    CibleDeRoutage.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/ciblederoutageRefuses' });
        })
        .catch((err) => {
            console.log(err);
        });
}

module.exports = {
    cibleRefusee_affiche,
    cibleRefusee_getOne,
    cibleRefusee_delete
}
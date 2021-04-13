// cible_affiche, cible_getOne, cible_refus, cible_valide_statutInd, cible_delete
const Individu = require('../../models/individu');
const Article = require('../../models/article');
const CibleDeRoutage = require('../../models/cibleDeRoutage');

const cible_affiche = async (req, res) => {
    try {
        const cibleDeRoutages = await CibleDeRoutage.find({}).sort({ createdAt: -1 })
        res.render('./prospection/validate', {
            cibleDeRoutages: cibleDeRoutages,
            title: 'Cibles de routage',
            style: "prospection"
        })
    } catch (err) {
        console.log(err);
    }
}

const cible_getOne = async (req, res) => {
    try {
        const id = req.params.id;
        const cible = await CibleDeRoutage.findById(id)
        const articles = await Article.find({ _id: { $in: cible.articles } })
        const individus = await Individu.find({ _id: { $in: cible.listeIndividus } })
        res.render('./prospection/details', { cible: cible, articles: articles, individus: individus, title: 'cible de routage', style: "prospection" });
    } catch (error) {
        console.log(err);
    }
}

const cible_refus = (req, res) => {
    console.log('refus')
    const id = req.params.id;
    const remarque = req.body.remarque
    console.log(remarque)
<<<<<<< Updated upstream
    CibleDeRoutage.findByIdAndUpdate(id, { refus: true, valide: false , remarque: remarque })
=======
    CibleDeRoutage.findByIdAndUpdate(id, { refus: true, remarque: remarque })
>>>>>>> Stashed changes
        .then(result => {
            res.redirect('/validationCiblederoutage');
        })
        .catch((err) => {
            console.log(err);
        });
}

const cible_valide_statutInd = async (req, res) => {
    try {
        const id = req.params.id;
        const cible = await CibleDeRoutage.findById(id)
        const individus = await Individu.find({ _id: { $in: cible.listeIndividus } })
        individus.forEach(individu => {
                individu.statut = 'Prospect'
                individu.save()
            })
            // await individus.save()
        cible.valide = true
        cible.dateValide = new Date()
        cible.refus = false
        cible.remarque = req.body.remarque
        cible.save()
            //await CibleDeRoutage.findByIdAndUpdate(id,{valide: true, dateValide: new Date(), refus: false })
        res.redirect('/validationCiblederoutage');
    } catch (error) {
        console.log(err);
    }
}

const cible_delete = (req, res) => {
    const id = req.params.id;
    CibleDeRoutage.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/validationCiblederoutage' });
        })
        .catch((err) => {
            console.log(err);
        });
}

module.exports = {
    cible_affiche,
    cible_getOne,
    cible_refus,
    cible_valide_statutInd,
    cible_delete
}
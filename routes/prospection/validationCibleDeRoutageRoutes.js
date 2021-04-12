const express = require('express')
const Individu = require('../../models/individu');
const Article = require('../../models/article');
const CibleDeRoutage = require('../../models/cibleDeRoutage');

const router = express.Router();

router.get('/', async(req, res) => {
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
})

router.get('/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const cible = await CibleDeRoutage.findById(id)
        const articles = await Article.find({ _id: { $in: cible.articles } })
        const individus = await Individu.find({ _id: { $in: cible.listeIndividus } })
        res.render('./prospection/details', { cible: cible, articles: articles, individus: individus, title: 'cible de routage', style: "prospection" });
    } catch (error) {
        console.log(err);
    }

});

router.post('/:id', (req, res) => {
    const id = req.params.id;
    const remarque = req.remarque
    //console.log(remarque)
    CibleDeRoutage.findByIdAndUpdate(id, { refus: true, remarque: remarque })
        .then(result => {
            res.redirect('/validationCiblederoutage');
        })
        .catch((err) => {
            console.log(err);
        });
});

router.put('/:id', async(req, res) => {
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
        cible.save()
            //await CibleDeRoutage.findByIdAndUpdate(id,{valide: true, dateValide: new Date(), refus: false })
        res.redirect('/validationCiblederoutage');
    } catch (error) {
        console.log(err);
    }
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    CibleDeRoutage.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/validationCiblederoutage' });
        })
        .catch((err) => {
            console.log(err);
        });
});

module.exports = router;
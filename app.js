const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Individu = require('./models/individu');
const Article = require('./models/article');
const Employee = require('./models/employee');
const Commande = require('./models/commande');

const { render } = require('ejs');

// on créé une instance d'une application express
// permet de faciliter le routing
const app = express();

//connect to database mongodb
const dbURI = 'mongodb+srv://mimirdev:mimir1234@fenouil.t2pik.mongodb.net/fenouil_app?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

// register view engine
// configure quelques paramètres de l'application
// permet de savoir que ejs va être utilisé dans nos templates
app.set('view engine', 'ejs');
// si je veux un autre nom de folder que views
// app.det('views', 'myviews');

// listen for request
// comprend automatiquement qu'on se réfère au localhost
//app.listen(3000);

//midleware & static files
// rend disponible au front-end les fichiers contenus dans le folder public
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// dev option
//app.use(morgan('dev'));


// requête de type app.get
// routing
app.get('/', (req, res) => {
    res.render('Connexion', {title: 'Connexion' });
});

app.get('/acceuil', (req, res) => {
    res.render('acceuil', {title: 'Acceuil', style: 'acceuil'});
});
  
app.get('/referentiel', (req, res) => {
    res.render('Referentiel', {title: 'Administration du référentiel', style: 'Referentiel'});
});

app.get('/referentiel/newIndividu', (req, res) => {
    res.render('newIndividu', {title: 'Créer individu', style: "styles"});
})
app.get('/commandes', (req,res)=> {
    res.render('Commande', {title:'Commandes',style:"Commande"})
})
app.get('/prospection', (req,res)=> {
    res.render('prospection', {title:'Prospection',style:"prospection"})
})
app.get('/anomalies', (req,res)=> {
    res.render('anomalie', {title:'Gestion des Anomalies',style:"anomalie"})
})
//blog routes

// affiche liste de tous les individus de la base
//ordonés avec celui ajouté le plus récemment en premier
app.get('/recherche', (req, res) => {
    Individu.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('recherche', { title: 'Liste individus', individus: result, style: "styles"});
        })
        .catch((err) => {
            console.log(err);
        });
});

// ajoute un individu à la base de données
// fait marcher le bouton submit en soi
// puis redirige vers la page administrateur
app.post('/acceuil', (req, res) => {
    const individu = new Individu(req.body);

    individu.save()
        .then((result) => {
            res.redirect('/referentiel');
        })
        .catch((err) => {
            console.log(err);
        });
});

// affiche les informations d'un seul individu sélectionné
// dans la liste de recherche
app.get('/recherche/:id',(req, res) => {
    const id = req.params.id;
    Individu.findById(id)
        .then(result => {
            res.render('details', { individu: result, title: "Détails individu", style: "styles"});
        })
        .catch((err) => {
            console.log(err);
        });
});


// supprime un des individus sélectionné
app.delete('/recherche/:id',(req, res) => {
    const id = req.params.id;
    Individu.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/recherche' });
        })
        .catch((err) => {
            console.log(err);
        });
});



// 404 page
// use: fonction middleware qui marche que si les options du dessus 
// n'ont pas été validées, eut-être placée à n'importe quel endroit
app.use((req, res) => {
    res.status(404).render('404', {title: '404 Error', style: "styles"});
});




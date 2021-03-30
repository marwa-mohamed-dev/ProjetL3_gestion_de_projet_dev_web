if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
};

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Individu = require('./models/individu');
const Article = require('./models/article');
const Employee = require('./models/employee');
const Commande = require('./models/commande');
const { render } = require('ejs');


// //////////////////////////////////////////
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');
const initializePassport = require('./passport-config');
initializePassport(
    passport,
    identifiant => users.find(user => user.identifiant === identifiant),
    id => users.find(user => user.id === id)
);

const users = [ {id: '1', identifiant: "winkler", mdp: "astrid"},
{id: '2', identifiant: "lee", mdp: "jiou"}, 
{id: '3', identifiant: "weber", mdp: "louise"}, 
{id: '4', identifiant: "gomes", mdp: "lucie"}, 
{id: '5', identifiant: "mohamed", mdp: "marwa"}
]
///////////////////////////////////////////////


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
app.set('view engine', 'ejs');

//midleware & static files
// rend disponible au front-end les fichiers contenus dans le folder public
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


// Connexion à l'app
// avec utilisation package passeport
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

// requête de type app.get
// routing

app.get('/', checkNotAuthenticated, (req, res) => {
    res.render('Connexion', {title: 'Connexion' });
});

app.get('/acceuil', checkAuthenticated, (req, res) => {
    res.render('acceuil', {title: 'Accueil', style: 'acceuil'});
});

// Que fait l'appli en fonction de si authentification réussie ou pas
app.post('/', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/acceuil',
    failureRedirect: '/',
    failureFlash: true
}))
  
app.get('/referentiel', checkAuthenticated, (req, res) => {
    res.render('Referentiel', {title: 'Administration du référentiel', style: 'Referentiel'});
});

app.get('/referentiel/Article', checkAuthenticated, (req, res) => {
    res.render('Article', {title: 'Administration du référentiel', style: 'Referentiel'});
});

app.get('/referentiel/Individu', checkAuthenticated, (req, res) => {
    res.render('Individu', {title: 'Administration du référentiel', style: 'Referentiel'});
});

/*
app.get('/referentiel/newIndividu', (req, res) => {
    res.render('newIndividu', {title: 'Créer individu', style: "styles"});
})
*/

app.get('/commandes', checkAuthenticated, (req,res)=> {
    res.render('Commande', {title:'Commandes',style:"Commande"})
})
app.post('/commandes', checkAuthenticated, (req, res) => {
    const commande = new Commande(req.body);
    commande.save()
        .then((result) => {
            res.redirect('/commandes');
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/prospection', checkAuthenticated, (req,res)=> {
    res.render('prospection', {title:'Prospection',style:"prospection"})
})
app.get('/anomalies', checkAuthenticated, (req,res)=> {
    res.render('anomalie', {title:'Gestion des Anomalies',style:"anomalie"})
})

// affiche liste de tous les individus de la base
//ordonés avec celui ajouté le plus récemment en premier
app.get('/recherche', checkAuthenticated, (req, res) => {
    Individu.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('recherche', { title: 'Liste individus', individus: result, style: "recherche" });
        })
        .catch((err) => {
            console.log(err);
        });
});

// ajoute un individu à la base de données
// fait marcher le bouton submit en soi
// puis redirige vers la page administrateur
app.post('/referentiel/Individu', checkAuthenticated, (req, res) => {
    const individu = new Individu(req.body);
    individu.save()
        .then((result) => {
            res.redirect('/referentiel');
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post('/referentiel/Article', checkAuthenticated, (req, res) => {
    const article = new Article(req.body);
    article.save()
        .then((result) => {
            res.redirect('/referentiel');
        })
        .catch((err) => {
            console.log(err);
        });
});

// affiche les informations d'un seul individu sélectionné
// dans la liste de recherche
app.get('/recherche/:id', checkAuthenticated, (req, res) => {
    const id = req.params.id;
    Individu.findById(id)
        .then(result => {
            res.render('details', { individu: result, title: "Détails individu", style: "styles" });
        })
        .catch((err) => {
            console.log(err);
        });
});


// supprime un des individus sélectionné
app.delete('/recherche/:id', checkAuthenticated, (req, res) => {
    const id = req.params.id;
    Individu.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/recherche' });
        })
        .catch((err) => {
            console.log(err);
        });
});

// permet de se déconnecter (revient à page de connexion)
app.delete('/logout', checkAuthenticated, (req, res) => {
    req.logOut()
    res.redirect('/')
})

// permet l'accès à certaines pages en fonction de statut authentification
function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    res.redirect('/')
}

function checkNotAuthenticated(req, res, next){
    if (req.isAuthenticated()) {
        return res.redirect('/acceuil')
    }
    next()
}

// 404 page
// use: fonction middleware qui marche que si les options du dessus 
// n'ont pas été validées, eut-être placée à n'importe quel endroit
app.use((req, res) => {
    res.status(404).render('404', { title: '404 Error', style: "styles" });
});
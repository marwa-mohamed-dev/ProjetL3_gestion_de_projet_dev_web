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
const CibleDeRoutage = require('./models/cibleDeRoutage');
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
    res.render('./adminRef/Referentiel', {title: 'Administration du référentiel', style: 'Referentiel'});
});

app.get('/referentiel/CreerArticle', checkAuthenticated, (req, res) => {
    res.render('./adminRef/CreerArticle', {title: 'Administration du référentiel', style: 'Referentiel'});
});

/*app.get('/referentiel/ModifArticle', checkAuthenticated, (req, res) => {
    res.render('./Referentiel/ModifArticle', {title: 'Administration du référentiel', style: 'Referentiel'});
});*/

app.get('/referentiel/CreerIndividu', checkAuthenticated, (req, res) => {
    res.render('./adminRef/CreerIndividu', {title: 'Administration du référentiel', style: 'Referentiel'});
});

/*app.get('/referentiel/ModifIndividu', checkAuthenticated, (req, res) => {
    res.render('./adminRef/ModifIndividu', {title: 'Administration du référentiel', style: 'Referentiel'});
});*/

app.get('/referentiel/Article', (req, res) => {
    res.render('./adminRef/Article', {title: 'Article', style: 'Referentiel'});
})

app.get('/referentiel/Individu', (req, res) => {
    res.render('./adminRef/Individu', {title: 'Individu', style: 'Referentiel'});
})
app.get('/commandes', checkAuthenticated, (req,res)=> {
    res.render('./saisieCom/AcceuilCom', {title:'Commandes',style:"Commande"})
})

app.get('/creerCom', checkAuthenticated, async (req,res)=> {
    const articles = await Article.find({})
    const individus = await Individu.find({})
    res.render('./saisieCom/CreerCom', {articles:articles, individus:individus, title:'Commandes',style:"Commande"})
})

app.get('/modifCom', checkAuthenticated, (req,res)=> {
    res.render('./saisieCom/ModifCom', {title:'Commandes',style:"Commande"})
})
app.post('/creerCom', checkAuthenticated, (req, res) => {
    const num=generateNumCom();
    const commande = new Commande(req.body);
    commande.numCommande=num;
    commande.save()
        .then((result) => {
            res.redirect('/creerCom');
        })
        .catch((err) => {
            console.log(err);
        });
});

function generateNumCom() { 
    var num = Math.trunc(Math.random()*100000000);
    while(num<10000000){
        num=num*10}
    return num;
}

app.get('/prospection', checkAuthenticated, (req,res)=> {
    res.render('./prospection/page', {title:'Prospection',style:"prospection"})
})

// affiche liste de tous cibles de routage
//ordonés avec celui ajouté le plus récemment en premier
// app.get('/prospection', checkAuthenticated, (req, res) => {
//     CibleDeRoutage.find().sort({ createdAt: -1 })
//         .then((result) => {
//             res.render('prospection', { title: 'Cibles de routage', cibles: result, style: "prospection" });
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// });

//app.use('/prospection',CibleDeRoutage)

// affiche liste de tous les individus de la base
//ordonés avec celui ajouté le plus récemment en premier
// app.get('/prospection', checkAuthenticated, (req, res) => {

//     Article.find().sort({ createdAt: -1 })
//         .then((result) => {
//             res.render('prospection', {
//                 articles: result,
//                 style: "prospection"});
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// });


//creer une cible de routage
app.post('/creationCiblederoutage', checkAuthenticated, async (req, res) => {
    const individus = await Individu.find({})
    const cibleDeRoutage = new CibleDeRoutage(req.body);
    const liste = new Array();
    individus.forEach(individu=> {
        if(cibleDeRoutage.client==='Non'){
            if((individu.age<=cibleDeRoutage.ageMax)&&(individu.age>=cibleDeRoutage.ageMin)&& (individu.categoriePro === cibleDeRoutage.categoriePro) && (Math.floor(individu.adresseCode/1000) === cibleDeRoutage.departementResidence) && (individu.statut === 'Enregistré')){
                liste.push(individu)
            }
        } else {
            if((individu.age<=cibleDeRoutage.ageMax)&&(individu.age>=cibleDeRoutage.ageMin)&& (individu.categoriePro === cibleDeRoutage.categoriePro) && (Math.floor(individu.adresseCode/1000) === cibleDeRoutage.departementResidence) && (individu.statut === 'Client')){
                liste.push(individu)
            }
        }
       
    })
    cibleDeRoutage.listeIndividus = liste
    cibleDeRoutage.save()
    //CibleDeRoutage.updateOne({_id: cibleDeRoutage._id}, {$set : {listeIndividus: liste}})
        .then((result) => {
            res.redirect('/creationCiblederoutage');
            console.log(liste)
        })
        .catch((err) => {
            console.log(err);
        });
});
//recuperation liste articles pour creation cible de routage
app.get('/creationCiblederoutage', checkAuthenticated, async (req, res) => {
    try {
        const articles = await Article.find({})
        //const individus = await Individu.find({})
        //const cibleDeRoutage = new cibleDeRoutage()
        res.render('./prospection/new',{
            articles : articles,
            // individus : individus,
            //cibleDeRoutage: cibleDeRoutage
            title: 'Cibles de routage', 
            style: "prospection"
        })
    } catch (err) {
        console.log(err);
    }
})
app.get('/validationCibleDeRoutage', checkAuthenticated, async (req, res) => {
    try {
        const cibleDeRoutages = await CibleDeRoutage.find({}).sort({ createdAt: -1 })
        res.render('./prospection/validate',{
            cibleDeRoutages : cibleDeRoutages,
            title: 'Cibles de routage', 
            style: "prospection"
        })
    } catch (err) {
        console.log(err);
    }
})

app.get('/envoyerPublicite', checkAuthenticated, async (req, res) => {
    try {
        const cibleDeRoutages = await CibleDeRoutage.find({}).sort({ createdAt: -1 })
        res.render('./prospection/recuperer',{
            cibleDeRoutages : cibleDeRoutages,
            title: 'Cibles de routage', 
            style: "prospection"
        })
    } catch (err) {
        console.log(err);
    }
})


app.get('/ciblederoutageRefuses', checkAuthenticated, async (req, res) => {
    try {
        const cibleDeRoutages = await CibleDeRoutage.find({}).sort({ createdAt: -1 })
        res.render('./prospection/visualiserRefuses',{
            cibleDeRoutages : cibleDeRoutages,
            title: 'Cibles de routage', 
            style: "prospection"
        })
    } catch (err) {
        console.log(err);
    }
})

app.get('/ciblederoutageRefuses/:id', checkAuthenticated, (req, res) => {
    const id = req.params.id;
    CibleDeRoutage.findById(id)
        .then(result => {
            res.render('./prospection/modif', { cible: result, title: 'cible de routage', style: "prospection" });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/validationCiblederoutage/:id', checkAuthenticated, (req, res) => {
    const id = req.params.id;
    CibleDeRoutage.findById(id)
        .then(result => {
            res.render('./prospection/details', { cible: result, title: 'cible de routage', style: "prospection" });
        })
        .catch((err) => {
            console.log(err);
        });
});
app.delete('/validationCiblederoutage/:id', checkAuthenticated, (req, res) => {
    const id = req.params.id;
    CibleDeRoutage.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/validationCiblederoutage' });
        })
        .catch((err) => {
            console.log(err);
        });
});
app.put('/validationCiblederoutage/:id', checkAuthenticated, (req, res) => {
    const id = req.params.id;
    CibleDeRoutage.findByIdAndUpdate(id,{valide: true, refus: false})
    //ajouter pour changement de statut
    const cible = cibleCibleDeRoutage.findById(id)
    const insdividus = cible.individus
    individus.forEach(individu=> {
        individu.statut = 'Prospect'
        individu.dateProspect = Date.now
    })
        .then(result => {
            res.json({ redirect: '/validationCiblederoutage' });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post('/validationCiblederoutage/:id', checkAuthenticated, (req, res) => {
    const id = req.params.id;
    CibleDeRoutage.findByIdAndUpdate(id,{refus: true})
        .then(result => {
            res.json({ redirect: '/validationCiblederoutage' });
        })
        .catch((err) => {
            console.log(err);
        });
});


app.get('/anomalies', checkAuthenticated, (req,res)=> {
    res.render('anomalie', {title:'Gestion des Anomalies',style:"anomalie"})
})

// affiche liste de tous les individus de la base
//ordonés avec celui ajouté le plus récemment en premier
app.get('/recherche', checkAuthenticated, (req, res) => {
    let searchOptions = {}
    if (req.query.nom != null && req.query.prenom != null) {
        searchOptions.nom = new RegExp(req.query.nom, 'i');
        searchOptions.prenom = new RegExp(req.query.prenom, 'i')
    }
    Individu.find(searchOptions).sort({ createdAt: -1 })
        .then((result) => {
            res.render('recherche', {
                title: 'Liste individus',
                individus: result,
                style: "recherche",
                searchOptions: req.query});
        })
        .catch((err) => {
            console.log(err);
        });
});

// ajoute un individu à la base de données
// fait marcher le bouton submit en soi
// puis redirige vers la page administrateur
app.post('/referentiel/CreerIndividu', checkAuthenticated, (req, res) => {
    const individu = new Individu(req.body);
    individu.age = getAge(individu.dateNaissance)
    individu.save()
        .then((result) => {
            res.redirect('/referentiel');
        })
        .catch((err) => {
            console.log(err);
        });
});
function getAge(date) { 
    var diff = Date.now() - date.getTime();
    var age = new Date(diff); 
    return Math.abs(age.getUTCFullYear() - 1970);
}
// créer un nouvel article
app.post('/referentiel/CreerArticle', checkAuthenticated, (req, res) => {
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

// affiche liste de tous les articles de la base
//ordonés avec celui ajouté le plus récemment en premier
app.get('/referentiel/ModifArticle', checkAuthenticated, (req, res) => {
    let searchOptions = {};
    if (/*req.query.reference != null &&*/req.query.designation != null) {
        //searchOptions.reference= new RegExp(req.query.reference, 'i');
        searchOptions.designation = new RegExp(req.query.designation, 'i');
    }
    Article.find(searchOptions).sort({ createdAt: -1 })
        .then((result) => {
            res.render('./adminRef/ModifArticle', {
                title: 'Administration du référentiel',
                articles: result,
                style: "Referentiel",
                searchOptions: req.query});
        })
        .catch((err) => {
            console.log(err);
        });
});

// affiche les informations d'un seul article sélectionné
// dans la liste de recherche
app.get('/referentiel/Article/:id', checkAuthenticated, (req, res) => {
    const id = req.params.id;
    Article.findById(id)
        .then(result => {
            res.render('./adminRef/Article', { article: result, title: "Administration du référentiel", style: "referentiel" });
        })
        .catch((err) => {
            console.log(err);
        });
});

// supprime l'article sélectionné
app.delete('/referentiel/ModifArticle/:id', checkAuthenticated, (req, res) => {
    const id = req.params.id;
    Article.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/referentiel/ModifArticle' });
        })
        .catch((err) => {
            console.log(err);
        });
});

// affiche liste de tous les individu de la base
//ordonés avec celui ajouté le plus récemment en premier
app.get('/referentiel/ModifIndividu', checkAuthenticated, (req, res) => {
    let searchOptions = {};
    if (req.query.nom != null && req.query.prenom != null) {
        searchOptions.nom= new RegExp(req.query.nom, 'i');
        searchOptions.prenom = new RegExp(req.query.prenom, 'i');
    }
    Individu.find(searchOptions).sort({ createdAt: -1 })
        .then((result) => {
            res.render('./adminRef/ModifIndividu', {
                title: 'Administration du référentiel',
                individus: result,
                style: "Referentiel",
                searchOptions: req.query});
        })
        .catch((err) => {
            console.log(err);
        });
});

// affiche les informations de l'individu sélectionné
// dans la liste de recherche
app.get('/referentiel/Individu/:id', checkAuthenticated, (req, res) => {
    const id = req.params.id;
    Individu.findById(id)
        .then(result => {
            res.render('./adminRef/Individu', { individu: result, title: "Administration du référentiel", style: "referentiel" });
        })
        .catch((err) => {
            console.log(err);
        });
});

// supprime l'individu sélectionné
app.delete('/referentiel/ModifIndividu/:id', checkAuthenticated, (req, res) => {
    const id = req.params.id;
    Individu.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/referentiel/ModifIndividu' });
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
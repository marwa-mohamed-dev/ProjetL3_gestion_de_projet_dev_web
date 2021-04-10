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

//////////////////////////////////////////////
const multer = require('multer');
const path = require('path');
const uploadPath = path.join('public', Article.imageBasePath)
const imageMimeTypes = ['images/jpeg', 'images/jpg', 'images/png', 'images/gif']
const upload = multer({
    dest: uploadPath
    // fileFilter: (req, file, callback) => {
    //     callback(null, imageMimeTypes.includes(file.mimetype))
    // }
})

// //////////////////////////////////////////
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');
const initializePassport = require('./passport-config');
const { authorize } = require('passport');
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


// on créé une instance d'une servlication express
// permet de faciliter le routing
const serv = express();

//connect to database mongodb
const dbURI = 'mongodb+srv://mimirdev:mimir1234@fenouil.t2pik.mongodb.net/fenouil_serv?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => serv.listen(3000))
    .catch((err) => console.log(err));

// register view engine
// configure quelques paramètres de l'servlication
serv.set('view engine', 'ejs');

//midleware & static files
// rend disponible au front-end les fichiers contenus dans le folder public
serv.use(express.static('public'));
serv.use(express.urlencoded({ extended: true }));


// Connexion à l'serv
// avec utilisation package passeport
serv.use(flash())
serv.use(session({
    secret: process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : false
}))

serv.use(passport.initialize())
serv.use(passport.session())
serv.use(methodOverride('_method'))

// requête de type serv.get
// routing

serv.get('/', checkNotAuthenticated, (req, res) => {
    res.render('Connexion', {title: 'Connexion' });
});

serv.get('/acceuil', checkAuthenticated, (req, res) => {
    res.render('acceuil', {title: 'Accueil', style: 'acceuil'});
});

// Que fait l'servli en fonction de si authentification réussie ou pas
serv.post('/', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/acceuil',
    failureRedirect: '/',
    failureFlash: true
}))
  
serv.get('/referentiel', checkAuthenticated, (req, res) => {
    res.render('./adminRef/Referentiel', {title: 'Administration du référentiel', style: 'Referentiel'});
});

serv.get('/referentiel/CreerArticle', checkAuthenticated, (req, res) => {
    try {
        const article = new Article();
        res.render('./adminRef/CreerArticle', {
            title: 'Administration du référentiel',
            style: 'Referentiel',
            article: article
        })
    } catch (err) {
        console.log(err);
    } 
});

serv.get('/referentiel/CreerIndividu', checkAuthenticated, (req, res) => {
    res.render('./adminRef/CreerIndividu', {title: 'Administration du référentiel', style: 'Referentiel'});
});

/*serv.get('/referentiel/ModifIndividu', checkAuthenticated, (req, res) => {
    res.render('./adminRef/ModifIndividu', {title: 'Administration du référentiel', style: 'Referentiel'});
});*/

// serv.get('/referentielArticle', (req, res) => {
//     res.render('./adminRef/Article', {title: 'Article', style: 'Referentiel'});
// })

// serv.get('/referentielIndividu', (req, res) => {
//     res.render('./adminRef/Individu', {title: 'Individu', style: 'Referentiel'});
// })

serv.get('/commandes', checkAuthenticated, (req,res)=> {
    res.render('./saisieCom/AcceuilCom', {title:'Commandes',style:"Commande"})
})

serv.get('/creerCom', checkAuthenticated, async (req,res)=> {
    const articles = await Article.find({})
    const individus = await Individu.find({})
    res.render('./saisieCom/CreerCom', {articles:articles, individus:individus, title:'Commandes',style:"Commande"})
})

serv.post('/creerCom', checkAuthenticated, (req, res) => {
    const num=generateNumCom();
    const commande = new Commande(req.body);
    // const iden=req.params.id;
    // const ind= Individu.findById(iden);
    // console.log(iden);
    // console.log(ind.nom);
    commande.numCommande=num.toString();
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
        num=num*10;}
    return num;
}

// affiche liste de toutes les commandes de la base
//ordonés avec celle ajoutée le plus récemment en premier
serv.get('/modifCom', checkAuthenticated, (req, res) => {
    let searchOptions = {}
    if (req.query.numCommande != null) {
        searchOptions.numCommande = new RegExp(req.query.numCommande);
    }
    Commande.find(searchOptions).sort({ createdAt: -1 })
        .then((result) => {
            res.render('./saisieCom/ModifCom', {
                title: 'Commandes',
                commandes: result,
                style: "Commande",
                searchOptions: req.query});
        })
        .catch((err) => {
            console.log(err);
        });
});
// affiche les informations de l'individu sélectionné
// dans la liste de recherche
serv.get('/commande/:id', checkAuthenticated, (req, res) => {
    const id = req.params.id;
    Commande.findById(id)
        .then(result => {
            res.render('./saisieCom/Commande', { commande: result, title: "Commande", style: "commande" });
        })
        .catch((err) => {
            console.log(err);
        });
});

// supprime l'individu sélectionné
serv.delete('/commande/:id', checkAuthenticated, (req, res) => {
    const id = req.params.id;
    Commande.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/modifCom' });
        })
        .catch((err) => {
            console.log(err);
        });
});

serv.get('/prospection', checkAuthenticated, (req,res)=> {
    res.render('./prospection/page', {title:'Prospection',style:"prospection"})
})

// affiche liste de tous cibles de routage
//ordonés avec celui ajouté le plus récemment en premier
// serv.get('/prospection', checkAuthenticated, (req, res) => {
//     CibleDeRoutage.find().sort({ createdAt: -1 })
//         .then((result) => {
//             res.render('prospection', { title: 'Cibles de routage', cibles: result, style: "prospection" });
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// });

//serv.use('/prospection',CibleDeRoutage)

// affiche liste de tous les individus de la base
//ordonés avec celui ajouté le plus récemment en premier
// serv.get('/prospection', checkAuthenticated, (req, res) => {

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
serv.post('/creationCiblederoutage', checkAuthenticated, async (req, res) => {
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
serv.get('/creationCiblederoutage', checkAuthenticated, async (req, res) => {
    try {
        const articles = await Article.find({})
        //const individus = await Individu.find({})
        //const cibleDeRoutage = new cibleDeRoutage()
        res.render('./prospection/new',{
            articles : articles,
            // individus : individus,
            // cibleDeRoutage: cibleDeRoutage
            title: 'Cibles de routage', 
            style: "prospection"
        })
    } catch (err) {
        console.log(err);
    }
})
serv.get('/validationCibleDeRoutage', checkAuthenticated, async (req, res) => {
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

serv.get('/envoyerPublicite', checkAuthenticated, async (req, res) => {
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


serv.get('/ciblederoutageRefuses', checkAuthenticated, async (req, res) => {
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

serv.get('/ciblederoutageRefuses/:id', checkAuthenticated, (req, res) => {
    const id = req.params.id;
    CibleDeRoutage.findById(id)
        .then(result => {
            res.render('./prospection/modif', { cible: result, title: 'cible de routage', style: "prospection" });
        })
        .catch((err) => {
            console.log(err);
        });
});

serv.get('/validationCiblederoutage/:id', checkAuthenticated, (req, res) => {
    const id = req.params.id;
    CibleDeRoutage.findById(id)
        .then(result => {
            res.render('./prospection/details', { cible: result, title: 'cible de routage', style: "prospection" });
        })
        .catch((err) => {
            console.log(err);
        });
});
serv.delete('/validationCiblederoutage/:id', checkAuthenticated, (req, res) => {
    const id = req.params.id;
    CibleDeRoutage.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/validationCiblederoutage' });
        })
        .catch((err) => {
            console.log(err);
        });
});
serv.put('/validationCiblederoutage/:id', checkAuthenticated, (req, res) => {
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

serv.post('/validationCiblederoutage/:id', checkAuthenticated, (req, res) => {
    const id = req.params.id;
    CibleDeRoutage.findByIdAndUpdate(id,{refus: true})
        .then(result => {
            res.json({ redirect: '/validationCiblederoutage' });
        })
        .catch((err) => {
            console.log(err);
        });
});


serv.get('/anomalies', checkAuthenticated, (req,res)=> {
    res.render('anomalie', {title:'Gestion des Anomalies',style:"anomalie"})
})

// affiche liste de tous les individus de la base
//ordonés avec celui ajouté le plus récemment en premier
serv.get('/recherche', checkAuthenticated, (req, res) => {
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
serv.post('/referentiel/CreerIndividu', checkAuthenticated, (req, res) => {
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
serv.post('/referentiel/CreerArticle', checkAuthenticated, upload.single('image'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null;
    const num = generateRef();
    const article = new Article({
        designation: req.body.designation,
        prix: req.body.prix,
        nomImage: fileName,
        description: req.body.description
    })
    article.reference = num;
    article.save()
        .then((result) => {
            res.redirect('/referentiel');
        })
        .catch((err) => {
            console.log(err);
        });
});

function generateRef() { 
    var num = Math.trunc(Math.random()*100000000);
    while(num<10000000){
        num=num*10;}
    return num;
}

// affiche les informations d'un seul individu sélectionné
// dans la liste de recherche
serv.get('/recherche/:id', checkAuthenticated, (req, res) => {
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
serv.delete('/recherche/:id', checkAuthenticated, (req, res) => {
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
serv.get('/referentielModifArticle', checkAuthenticated, (req, res) => {
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
serv.get('/referentielArticle/:id', checkAuthenticated, (req, res) => {
    const id = req.params.id;
    Article.findById(id)
        .then(result => {
            res.render('./adminRef/Article', { article: result, title: "Administration du référentiel", style: "referentiel" });
        })
        .catch((err) => {
            console.log(err);
        });
});

serv.put('/referentielArticle/:id', checkAuthenticated, async (req, res) => {
    let article
    try {
        article = await Article.findById(req.params.id)
        article.designation = req.body.designation
        article.prix = req.body.prix
        article.description = req.body.description
        await article.save()
        res.redirect('/referentielModifArticle')
    } catch {
        res.redirect('/referentiel')
    }
})

// supprime l'article sélectionné
serv.delete('/referentielModifArticle/:id', checkAuthenticated, (req, res) => {
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
serv.get('/referentielModifIndividu', checkAuthenticated, (req, res) => {
    let searchOptions = {};
    if (req.query.nom != null && req.query.prenom != null) {
        searchOptions.nom= new RegExp(req.query.nom, 'i');
        searchOptions.prenom = new RegExp(req.query.prenom, 'i');
    }
    Individu.find(searchOptions).sort({ createdAt: -1 }).limit(10)
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
serv.get('/referentielIndividu/:id', checkAuthenticated, (req, res) => {
    const id = req.params.id;
    Individu.findById(id)
        .then(result => {
            res.render('./adminRef/Individu', { individu: result, title: "Administration du référentiel", style: "referentiel" });
        })
        .catch((err) => {
            console.log(err);
        });
});

serv.put('/referentielIndividu/:id', checkAuthenticated, async (req, res) =>{
    let individu
    try {
        individu = await Individu.findById(req.params.id)
        individu.nom = req.body.nom
        individu.prenom = req.body.prenom
        individu.dateNaissance = req.body.dateNaissance
        individu.categoriePro = req.body.categoriePro
        individu.adresseNum = req.body.adresseNum
        individu.adresseType = req.body.adresseType
        individu.adresseCode = req.body.adresseCode
        individu.adresseVille = req.body.adresseVille
        individu.adresseInfos = req.body.adresseInfos
        individu.adresseMail = req.body.adresseMail
        individu.numeroTel = req.body.numeroTel
        await individu.save()
        res.redirect('/referentielModifIndividu')
    } catch {
        res.redirect('/referentiel')
    }
})

// supprime l'individu sélectionné
serv.delete('/referentielModifIndividu/:id', checkAuthenticated, (req, res) => {
    const id = req.params.id;
    Individu.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/referentielModifIndividu' });
        })
        .catch((err) => {
            console.log(err);
        });
});

// permet de se déconnecter (revient à page de connexion)
serv.delete('/logout', checkAuthenticated, (req, res) => {
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
serv.use((req, res) => {
    res.status(404).render('404', { title: '404 Error', style: "styles" });
});
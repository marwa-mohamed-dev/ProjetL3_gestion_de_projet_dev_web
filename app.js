if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
};

///// PACKAGES /////
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Individu = require('./models/individu');
const Article = require('./models/article');
const Employee = require('./models/employee');
const Commande = require('./models/commande');
const Anomalie = require('./models/anomalie');
const CibleDeRoutage = require('./models/cibleDeRoutage');
const { render } = require('ejs');

///// ORGANISATION, ACCÈS ROUTES /////
// adminRef
const creerArticleRoutes = require('./routes/adminRef/creerArticleRoutes')
const modifArticleRoutes = require('./routes/adminRef/modifArticleRoutes')
const referentielArticleRoutes = require('./routes/adminRef/referentielArticleRoutes')
const creerIndividuRoutes = require('./routes/adminRef/creerIndividuRoutes')
const modifIndividuRoutes = require('./routes/adminRef/modifIndividuRoutes')
const referentielIndividuRoutes = require('./routes/adminRef/referentielIndividuRoutes')

// saisieCom
const commandeRoutes = require('./routes/saisieCom/commandeRoutes')
const ajoutIndRoutes = require('./routes/saisieCom/ajoutIndRoutes')
const creerComRoutes = require('./routes/saisieCom/creerComRoutes')
const modifComRoutes = require('./routes/saisieCom/modifComRoutes')

// prospection
const creationCiblederoutageRoutes = require('./routes/prospection/creationCiblederoutageRoutes')
const ciblederoutageRefusesRoutes = require('./routes/prospection/ciblederoutageRefusesRoutes')
const validationCibleDeRoutageRoutes = require('./routes/prospection/validationCibleDeRoutageRoutes')

//recherche
const rechercheIndRoutes = require('./routes/recherche/rechercheIndRoutes')
const rechercheArtRoutes = require('./routes/recherche/rechercheArtRoutes')

//////////////////////////////////////////////
/// IMAGES ///
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

////////////////////////////////////////////
// CONNEXION //
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');
const initializePassport = require('./passport-config');
const { result } = require('lodash');
const { db } = require('./models/individu');
const { authorize } = require('passport');
initializePassport(
    passport,
    identifiant => users.find(user => user.identifiant === identifiant),
    id => users.find(user => user.id === id)
);

const { users } = require('./data')
roleAdmin = ["admin", "all"]
roleGestAnomalie = ["gest", "all"]
roleSaisieCom = ["saisie", "all"]
roleProsp = ["prosp", "all", "strat"]
roleDirecteurStrat = ["strat", "all"]
roleResponsableEnvoiPub = ["pub", "all"]

function letAcess(arrayRole) {
    return (req, res, next) => {
        let acces = false
        arrayRole.forEach(role => {
            if (req.user.role == role) {
                acces = true
                next()
            }
        })
        if(!acces) {
            res.status(401);
            return res.send("Vous n'avez pas accès à ce module");
            //res.redirect('/acceuil')
        }
    }
}

// on créé une instance d'une application express
const app = express();

var server = app.listen(process.env.PORT || 3000, function () {
    var host = server.address().address
    var port = server.address().port
})

//connect to database mongodb
const dbURI = 'mongodb+srv://mimirdev:mimir1234@fenouil.t2pik.mongodb.net/fenouil_app?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log('Mongoose connected'))
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
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

///////////////////////////////////////////////////////////////////
//////////////////      APPEL ROUTES      /////////////////////////
///////////////////////////////////////////////////////////////////

app.get('/', checkNotAuthenticated, (req, res) => {
    res.render('Connexion', { title: 'Connexion' });
});

app.get('/acceuil', checkAuthenticated, (req, res) => {
    res.render('acceuil', { title: 'Accueil', style: 'acceuil' });
});

// Que fait l'appli en fonction de si authentification réussie ou pas
app.post('/', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/acceuil',
    failureRedirect: '/',
    failureFlash: true
}))

/////////////////////////////////////////////////
// Administration du référentiel
app.get('/referentiel', checkAuthenticated, letAcess(roleAdmin), (req, res) => {
    res.render('./adminRef/Referentiel', { title: 'Administration du référentiel', style: 'Referentiel' });
});

//// Articles
// /referentielCreerArticle
// get, post et generateRef()
app.use('/referentielCreerArticle', checkAuthenticated, letAcess(roleAdmin), upload.single('image'), creerArticleRoutes)

// /referentielModifArticle et /referentielModifArticle/:id
// get et delete
app.use('/referentielModifArticle', checkAuthenticated, letAcess(roleAdmin), modifArticleRoutes);

// /referentielArticle/:id
// get et put
app.use('/referentielArticle', checkAuthenticated, letAcess(roleAdmin), referentielArticleRoutes)


//// Individus
// /referentielCreerIndividu
// get, post et getAge()
app.use('/referentielCreerIndividu', checkAuthenticated, letAcess(roleAdmin), creerIndividuRoutes)

// /referentielModifIndividu et /:id
// get et delete
app.use('/referentielModifIndividu', checkAuthenticated, letAcess(roleAdmin), modifIndividuRoutes)

// /referentielIndividu/:id
// get et put
app.use('/referentielIndividu', checkAuthenticated, letAcess(roleAdmin), referentielIndividuRoutes)


/////////////////////////////////////////////////
// Saisie de Commandes
app.get('/commandes', checkAuthenticated, letAcess(roleSaisieCom), (req, res) => {
    res.render('./saisieCom/AcceuilCom', { title: 'Saisie de Commandes', style: "Commande" })
})

// /creerCom
// get et post, fonction generateNumCom(), calculPrix(), verifSolde(), testAnomalie(), 
app.use('/creerCom', checkAuthenticated, letAcess(roleSaisieCom), creerComRoutes)

// affiche liste de toutes les commandes de la base
//ordonés avec celle ajoutée le plus récemment en premier
app.use('/modifCom', checkAuthenticated, letAcess(roleSaisieCom), modifComRoutes)

// /commande/:id
// get et delete
app.use('/commande', checkAuthenticated, letAcess(roleSaisieCom), commandeRoutes)

// /ajoutInd
// get et post
app.use('/ajoutInd', checkAuthenticated, letAcess(roleSaisieCom), ajoutIndRoutes)


/////////////////////////////////////////////////
// Prospection
app.get('/prospection', checkAuthenticated, letAcess(roleProsp), (req, res) => {
    res.render('./prospection/page', { title: 'Prospection', style: "prospection" })
})

// /creationCiblederoutage
//get et post
app.use('/creationCiblederoutage', checkAuthenticated, letAcess(roleProsp), creationCiblederoutageRoutes)

// Envoi publicité
app.get('/envoyerPublicite', checkAuthenticated, letAcess(roleResponsableEnvoiPub), async(req, res) => {
    try {
        const cibleDeRoutages = await CibleDeRoutage.find({}).sort({ createdAt: -1 })
        cibleDeRoutages.forEach(  async cible => {
            if (Math.abs(new Date() - cible.dateValide) > 864000000) {
                if(cible.listeIndividus.length>0){
                    const individus = await Individu.find({ _id: { $in: cibleDeRoutages.listeIndividus } })
                    individus.forEach(async individu => {
                        if(individu.statut === 'Prospect'){
                            individu.statut = 'Enregistré'
                            await individu.save()
                        }
                    })
                    cible.listeIndividus = []
                    await cible.save()
                }
            }
        })
        res.render('./prospection/recuperer', {
            cibleDeRoutages: cibleDeRoutages,
            title: 'Cibles de routage',
            style: "prospection"
        })
    } catch (err) {
        console.log(err);
    }
})

// Envoyer une publicité
// Download a file
app.get('/envoyerPublicite/:id', checkAuthenticated, async (req, res) => {
    const id = req.params.id
    const cible = await CibleDeRoutage.findById(id)
    const individus = await Individu.find({_id: { $in: cible.listeIndividus }})
    const articles = await Article.find({_id: { $in: cible.articles }})
    const data = {"Titre":cible.titre, "Description" : cible.description, "Liste des individus": individus, "Articles" : articles }
    res.set("Content-Disposition", "attachment;filename=file.json");
    res.type("application/json");
    //res.save()
    res.json(data);
    res.redirect('/prospection')
});

// Récupérer les courriers à envoyer
// Download a file
app.get('/courrier/:id', checkAuthenticated, async (req, res) => {
    const id = req.params.id
    const courrier = await Anomalie.findById(id)
    const individu = await Individu.find({_id: { $in: courrier.client }})
    //const commande = await Commande.find({_id: { $in: courrier.commande }})
    const data = {"Client":individu, "Numéro de commande" : courrier.numeroCom, "Anomalie(s) présente(s)": courrier.anomalies }
    res.set("Content-Disposition", "attachment;filename=file.json");
    res.type("application/json");
    res.json(data);
});

// /ciblederoutageRefuses et 2 fois /:id
// get, get et delete
app.use('/ciblederoutageRefuses', checkAuthenticated, letAcess(roleProsp), ciblederoutageRefusesRoutes)

// /validationCibleDeRoutage et 4 fois /:id
// get et get, post, put, delete
app.use('/validationCibleDeRoutage', checkAuthenticated, letAcess(roleDirecteurStrat), validationCibleDeRoutageRoutes)

/////////////////////////////////////////////////
// Anomalie

// affiche liste de tous les articles de la base
//ordonés avec celui ajouté le plus récemment en premier
app.get('/rechercheAnomalies', checkAuthenticated, letAcess(roleGestAnomalie), async (req, res) => {
    let searchOptions = {};
    let client=null;

    if( req.query.nom!=null && req.query.prenom!= null && req.query.idCom!= null &&((req.query.nom !="" || req.query.prenom!= "") || req.query.idCom!=null) /*req.query.date!= null*/){
        if(req.query.nom !="" && req.query.prenom!= ""){
            client= await Individu.find({nom: req.query.nom, prenom : req.query.prenom});
        }
        else if(req.query.nom !=""){
            client= await Individu.find({nom: req.query.nom});
        }
        else if(req.query.prenom !=""){
            client= await Individu.find({prenom: req.query.prenom});
        }
        //console.log(client);
        if(client!=null){
            searchOptions.client = client;
        }
        if(req.query.idCom!=null){
            let com= await Commande.findOne({numCommande:{$regex:req.query.idCom}})
            searchOptions.idCom =com.id;
        }
        /*let dateA= new Date(req.query.date);
        console.log(dateA);
        if (req.query.date!= '') {
            let anoJour= await Anomalie.find({createdAt:{$regex :req.query.date}});
            console.log(anoJour);
            searchOptions.createdAt = req.query.date;
        }*/
    }
    Anomalie.find(searchOptions).sort({ createdAt: -1 })
        .then(async (result) => {
            let commandes= await Commande.find(result.idCom);
            res.render('rechercheAnomalie', {
                title: 'Gestion des Anomalies',
                anomalies: result,
                coms:commandes,
                style: "anomalie",
                searchOptions: req.query
            });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/anomalie/:id', checkAuthenticated, async (req, res) => {
    const id = req.params.id;
    let ano= await Anomalie.findById(id);
    let com= await Commande.findById(ano.idCom);
    let cl = await Individu.findById(ano.client);

    Anomalie.findById(id)
        .then(result => {
            res.render('anomalie', { anomalie: result, lacom:com, leclient:cl, title: "Gestion des Anomalies", style: "anomalie" });
        })
        .catch((err) => {
            console.log(err);
        });
})

/////////////////////////////////////////////////
// Bouton Recherche

app.get('/recherche', checkAuthenticated, (req, res) => {
    res.render('recherche/recherche', {
        title: "Recherche",
        style: "recherche"
    })
})

// /recherche et 2 fois /:id
// get, get et delete
app.use('/rechercheInd', checkAuthenticated, rechercheIndRoutes)

// /recherche et 2 fois /:id
// get, get et delete
app.use('/rechercheArt', checkAuthenticated, rechercheArtRoutes)


/////////////////////////////////////////
// AUTRES FONCTIONS

// permet de se déconnecter (revient à page de connexion)
app.delete('/logout', checkAuthenticated, (req, res) => {
    req.logOut()
    res.redirect('/')
})

// permet l'accès à certaines pages en fonction de statut authentification
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/')
}

function checkNotAuthenticated(req, res, next) {
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
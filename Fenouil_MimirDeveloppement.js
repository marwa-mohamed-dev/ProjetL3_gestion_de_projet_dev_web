
/////Connexion
const administrateurs = [{login:"admin",password:"password"}]
const Id = document.getElementById('Id')
const password = document.getElementById('password')
function validate(){
    for(let admin of administrateurs){
        if(Id.value==admin.login && password.value==admin.password){
            alert("Connexion reussie")
            return false;
        } else {
            alert("Identifiant ou mot de passe incorrect")
            return false;
        }
    }
}



// const Id = document.getElementById('Id')
// const password = document.getElementById('password')
// const connexion = document.getElementById('form')
// const submitConnexion = document.getElementById('submit')
// const errorElement = document.getElementById('error')
// connexion.addEventListener('submit',(e) =>{
//     let messages = ["Identifiant : "+Id.value]
//     console.log(Id.value)
//     if(messages.length > 0){
//         e.preventDefault()
//         errorElement.innerText = messages.join(', ')
//     }
    
// })




//////////////////////////////
ListesIndividus= [];
ListesCommandes= [];
ListesArticles= [];


class Commande{
    constructor(numeroCommande,individu, articles,date, paiement){
        this.numeroCommande = numeroCommande;
        this.individu = individu;
        this.articles = articles;
        this.date = date;
        this.paiement = paiement;
    }

    saisie(){

    }
    
    verificationMontant(){
        return(this.paiement.montant == this.article.prix);
    }
    verificationIndividu(){
       EstEnregistre = ListesIndividus.find(individu => this.individu == individu);
    }


}

class individu{
    constructor(nom,prenom,dateNaissance,categorie,adresse,numeroTel,adresseMail,statut){
        this.nom = nom;
        this.prenom = prenom;
        this.dateNaissance = dateNaissance;
        this.categorie = categorie;
        this.adresse = adresse;
        this.adresseMail = adresseMail;
        this.numeroTel = numeroTel;
        this.statut = statut;
    }

    setNom(){

    }

    getNom(){
        
    }

    Estprospecte(){
        return (this.statut=='prospecte');
    }

    EstClient(){
        return (this.statut=='client');
    }

    EstClientInterdit(){
        return (this.statut=='clientInterdit');
    }
}

class article{
    constructor(numeroArticle,designation,prix){
        this.numeroArticle = numeroArticle;
        this.designation = designation;
        this.prix = prix;
    }
}

class paiement{
    constructor(moyenPaiement, montant){
        this.moyenPaiement = moyenPaiement;
        this.montant = montant;
    }
}
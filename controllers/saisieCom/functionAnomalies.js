function generateNumCom() {
    var num = Math.trunc(Math.random() * 100000000);
    while (num < 10000000) {
        num = num * 10;
    }
    return num;
}

function calculPrix(lprix, lquant) {
    let prix = 0;
    for (let i = 0; i < lprix.length; i++) {
        prix = prix + lprix[i] * lquant[i];
    }
    return prix;
}

//vérifie si le solde sur le compte de la CB est suffisant pour payer la commande
//Comme nous n'avons pas accès à des vrais comptes de CB, nous faisons une simulation
//on génère un nombre aléatoire pour simuler le solde du client
function verifSoldeCB(com){
    let val=null;
    let n=Math.trunc(Math.random()*10)-3;
    let solde=Math.trunc((Math.random()*Math.pow(10,n))*100)/100;
    console.log("Solde:"+solde);
    if(solde>=com.prix){
        val=com.prix;
    }
    return val;
}

//Test si la commande possède une ou plusieurs anomalies
function testAnomalie(com) {
    let etat = [];

    //Anomalie montant pour les CB et les chèques
    if (com.valeur == null) {
        etat.push("anoMontant");
    } else if (com.valeur != com.prix) {
        etat.push("anoMontant");
    }

     //Anomalie Moyen Paiement si aucun moyen de paiement choisis
    if (com.pCheque == null && com.pCarte == null) {
        etat.push("anoPaiement");
    } 
    
    //Anomalie Moyen Paiement pour le chèque
    else if (com.pCheque == 'on') {
        if(com.numeroCheque =='') {
            etat.push("anoPaiement");
        } else if (com.banque == '') {
            etat.push("anoPaiement");
        }
        else if (com.signature!="on"){
            etat.push("anoPaiement");
         }
    }

    //Anomalie Moyen Paiement pour la CB
    else if(com.pCarte=='on'){
        if(com.numeroCarte==""){
            etat.push("anoPaiement");
        }
        else if(com.titulaire==""){
            etat.push("anoPaiement");
        }
        else if(com.crypto==""){
            etat.push("anoPaiement");
        }
        else if(com.dateExpiration==""){
            etat.push("anoPaiement");
        }
        else if(com.dateExpiration!=""){
            let today=new Date();
            let annee=today.getFullYear();
            let mois=today.getMonth();

            let d=com.dateExpiration;
            d=d.split('/');
            let year=Number(d[1])+2000;
            let month=Number(d[0])-1;

            //l'année d'expiration ne doit pas être plus petite que l'année en cours
            // et ne doit pas être à plus de 4 ans de la date actuelle (les Cb on 2 à 3ans d'utilisation)
            //pas besoin de regarder le jour car un CB est valable jusqu'à la fin de son mois d'expiration
            if(year<annee || year>=annee+4){
                etat.push("anoPaiement");
            }
            else{
                if(year==annee){
                    if(month<mois){
                        etat.push("anoPaiement");
                    }
                }
            }
        }
    }
    return etat;
}

module.exports = {
    generateNumCom,
    calculPrix,
    verifSoldeCB,
    testAnomalie
}
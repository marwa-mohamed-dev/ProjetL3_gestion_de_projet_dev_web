const mongoose = require('mongoose');
//const Individu = require('./individu');
const Schema = mongoose.Schema;

const commandeSchema = new Schema({
    numCommande: {
         type: String,
    },
    client: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Individu',
        required: true
    },
    articles: {
        type:mongoose.Schema.Types.Array,
        ref: 'Article',
        required: true
    },
    quantite: {
        type: Array,
        required: true
    },
    pCheque: {
        type: String,
        //required: true
    },
    pCarte: {
        type: String,
        //required: true
    },
    numeroCarte: {
        type: String,
    },
    crypto:{
        type:String,
    },
    dateExpiration: {
        type: String,
    },
    titulaire:{
        type:String,
    },
    numeroCheque: {
        type: String,
    },
    banque: {
        type: String,
    },
    signature:{
        type:String,
    },
    etat: {
        type: Array,
        required: true
    },
    //valeur du moyen de paiement
    valeur: {
        type: Number
        //required: True
    },
    //prix de l'ensemble des articles de la commande
    prix:{
        type: Number
    },
    verification: {
        type: Boolean,
        Default: false
    }
    
}, { timestamps: true })

const Commande = mongoose.model('Commande', commandeSchema);

module.exports = Commande;

const mongoose = require('mongoose');
//const Individu = require('./individu');
const Schema = mongoose.Schema;

const commandeSchema = new Schema({
    // numCommande: {
    //     type: String,
    //     required: true
    // },

    client: {
        // à mettre type object Individu
        type: String,
        required: true
    },
    articles: {
        type: String,
        required: true
    },
    quantite: {
        type: Number,
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
        type: Number,
    },
    dateExpiration: {
        type: String,
    },
    numeroCheque: {
        type: Number,
    },
    banque: {
        type: String,
    },
    // date: {
    //     type: String,
    // },
    
    

}, { timestamps: true })

const Commande = mongoose.model('Commande', commandeSchema);

module.exports = Commande;

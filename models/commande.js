const mongoose = require('mongoose');
//const Individu = require('./individu');
const Schema = mongoose.Schema;

const commandeSchema = new Schema({
    numCommande: {
         type: String,
     },

    client: {
        // à mettre type object Individu
        type: mongoose.Schema.Types.ObjectId,
        ref:"Individu",
        required: true
    },
    articles: {
        type: mongoose.Schema.Types.Array,
        ref:"Article",
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

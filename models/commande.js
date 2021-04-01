const mongoose = require('mongoose');
//const Individu = require('./individu');
const Schema = mongoose.Schema;

const commandeSchema = new Schema({
    // numCommande: {
    //     type: String,
    //     required: true
    // },

    individu: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Individu'
    },
    articles : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Article'
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
    date: {
        type: Date,
        default: Date.now
    },
    
    

}, { timestamps: true })

const Commande = mongoose.model('Commande', commandeSchema);

module.exports = Commande;

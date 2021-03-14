const mongoose = require('mongoose');
const Individu = require('./individu');
const Schema = mongoose.Schema;

const commandeSchema = new Schema({
    numCommande: {
        type: String,
        required: true
    },
    client: {
        type: Individu,
        required: true
    },
    article: {
        type: Number,
        required: true
    },
    paiement: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true,
    },
    
    

}, { timestamps: true })

const Commande = mongoose.model('Commande', commandeSchema);

module.exports = Commande;

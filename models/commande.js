const mongoose = require('mongoose');
//const Individu = require('./individu');
const Schema = mongoose.Schema;

const commandeSchema = new Schema({
    numCommande: {
        type: String,
        required: true
    },
    client: {
        // à mettre type object Individu
        type: String,
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

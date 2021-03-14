const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const individuSchema = new Schema({
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    dateNaissance : {
        type: String,
        required: true
    }, 
    categoriePro : String,
    adresseNum : Number,
    adresseType : String,
    adresseCode : Number,
    adresseVille : String,
    adressePays : String,
    adresseInfos : String,
    adresseMail : String,
    numeroTel : Number,
    statut : String, 
    cbNum : Number,
    cbDate : String,
    cbCode : Number

}, { timestamps: true })

const Individu = mongoose.model('Individu', individuSchema);

module.exports = Individu;

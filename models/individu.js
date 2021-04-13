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
        type: Date,
        required: true
    },
    age :{
        type: Number
    },
    categoriePro : {
        type : String,
        required: true,
        default: 'inconnu'
    },
    adresseNum : {
        type : Number,
        required: true
    },
    adresseType :  {
        type : String,
        required: true
    },
    adresseCode : {
        type : Number,
        required: true
    },
    adresseVille :  {
        type : String,
        required: true
    },
    adresseInfos : String,
    adresseMail : String,
    numeroTel :  {
        type : String,
        required: true
    },
    statut : {
        type : String,
        required: true
    },
    // commandes : {
    //     type: mongoose.Schema.Types.Array,
    //     ref: 'Commandes'
    // },
    dateProspect :Date,
    cbNum : Number,
    cbDate : String,
    cbCode : Number

}, { timestamps: true })

const Individu = mongoose.model('Individu', individuSchema);

module.exports = Individu;

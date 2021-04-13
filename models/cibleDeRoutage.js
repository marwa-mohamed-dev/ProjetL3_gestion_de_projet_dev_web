const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CibleDeRoutageSchema = new Schema({
    valide:{
        type: Boolean,
        default: false
    },
    dateValide: {
        type: Date,
    },
    refus:{
        type: Boolean,
        default: false
    },
    titre:{
        type: String,
        required: true
    },
    dateProspection:{
        type: Date,
        default: Date.now
    },
    description:{
        type: String,
        required: true
    },
    listeIndividus: {
        type: mongoose.Schema.Types.Array,
        ref: 'Individu'
    },
    ageMin: {
        type: Number,
        default:-1
    }, 
    ageMax: {
        type: Number,
        default:-1
    },
    categoriePro : {
        type : String,
        default:''
    },
    departementResidence : {
        type : Number,
        default:-1
    },
    client:{
        type:String,
    },
    cataloguePapier : {
        type:String,
    },
    typePapier : {
        type:String,
    },
    catalogueInternet : {
        type:String,
    },  
    articles : {
        type: mongoose.Schema.Types.Array,
        required: true,
        ref: 'Article'
    },
    remarque : {
        type:String,
        default: ''
    }
    // article1 : {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Article'
    // },
    // article2 : {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Article'
    // },
    // article3 : {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Article'
    // },
    // article4 : {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Article'
    // },
    // article5 : {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Article'
    // }


}, { timestamps: true })

const CibleDeRoutage = mongoose.model('CibleDeRoutage', CibleDeRoutageSchema);

module.exports = CibleDeRoutage;

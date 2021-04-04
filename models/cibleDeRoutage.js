const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CibleDeRoutageSchema = new Schema({
    valide:{
        type: Boolean,
        required: true,
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
    individus: {
        type: mongoose.Schema.Types.Array,
        //required: true,
        ref: 'Individu'
    },
    ageMin: {
        type: Number,
        required: true
    }, 
    ageMax: {
        type: Number,
        required: true
    },
    categoriePro : {
        type : String,
        required: true
    },
    departementResidence : {
        type : String,
        required: true
    },
    client:{
        type:String,
        required : true
    },
    cataloguePapier : {
        type:String,
        //required:true
    },
    typePapier : {
        type:String,
        //required:true
    },
    catalogueInternet : {
        type:String,
        //required:true
    },  
    // articles : {
    //     type: mongoose.Schema.Types.Array,
    //     required: true,
    //     ref: 'Article'
    // },
    article1 : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    },
    article2 : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    },
    article3 : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    },
    article4 : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    },
    article5 : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    }


}, { timestamps: true })

const CibleDeRoutage = mongoose.model('CibleDeRoutage', CibleDeRoutageSchema);

module.exports = CibleDeRoutage;

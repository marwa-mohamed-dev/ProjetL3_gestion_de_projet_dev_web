const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CibleDeRoutageSchema = new Schema({
    titre:{
        type: String,
        required: true
    },
    // dateProspection:{
    //     type: Date = new Date()
    // },
    description:{
        type: String,
        required: true
    },
    // individu: {
    //     type: String,
    //     required: true
    // },
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
    articles : {
        type: String,
        required: true
    }
    

}, { timestamps: true })

const CibleDeRoutage = mongoose.model('CibleDeRoutage', CibleDeRoutageSchema);

module.exports = CibleDeRoutage;

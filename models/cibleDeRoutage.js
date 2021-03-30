const mongoose = require('mongoose');
const Individu = require('./individu');
const Schema = mongoose.Schema;

const CibleDeRoutageSchema = new Schema({
    Individu: {
        type: Individu,
        required: true
    },
    trancheAge: {
        type: String,
        required: true
    }, 
    categoriePro : {
        type : String,
        required: true
    },
    departementResidence : {
        type : String,
        required: true
    }
    // client:{
    //     type:Boolean,
    //     required : true
    // }

}, { timestamps: true })

const CibleDeRoutage = mongoose.model('CibleDeRoutage', CibleDeRoutageSchema);

module.exports = CibleDeRoutage;

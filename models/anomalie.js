const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const anomalieSchema = new Schema({
    numeroCom: {
         type: String,
         required: true
     },

    client: {
        // à mettre type object Individu
        type: String,
        ref:"Individu",
        required: true
    },

    anomalies: {
        type: String,
        //required: true
    },
    
}, { timestamps: true })

const Anomalie = mongoose.model('Anomalie', anomalieSchema);
module.exports = Anomalie;
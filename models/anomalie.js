const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const anomalieSchema = new Schema({
    idCom: {
         type: mongoose.Schema.Types.ObjectId ,
         required: true
     },

    client: {
        // à mettre type object Individu
        type: mongoose.Schema.Types.ObjectId,
        ref:"Individu",
        required: true
    },

    anomalies: {
        type: Array,
        required: true
    },
    
}, { timestamps: true })

const Anomalie = mongoose.model('Anomalie', anomalieSchema);
module.exports = Anomalie;
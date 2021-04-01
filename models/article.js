const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    reference: Number,

    designation: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    prix: {
        type: Number,
        required: true
    },

     enVente: {
         type: Boolean,
     }

}, { timestamps: true })

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;

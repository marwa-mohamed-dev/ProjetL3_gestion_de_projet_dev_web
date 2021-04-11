const mongoose = require('mongoose');
const path = require('path')
const Schema = mongoose.Schema;

const imageBasePath = 'uploads'

const articleSchema = new Schema({
    reference: {
        type: String,
    },
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
    nomImage: {
        type: String,
        required: true
    },
    enVente: {
        type: Boolean,
    }

}, { timestamps: true })

articleSchema.virtual('imagePath').get(function() {
    if(this.nomImage != null) {
        return path.join('/', imageBasePath, this.nomImage)
    }
})

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;
module.exports.imageBasePath = imageBasePath;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    identifiant: {
        type: String,
        required: true
    },
    mdp: {
        type: String,
        required: true
    },
    

}, { timestamps: true })

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;

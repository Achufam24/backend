const mongoose = require('mongoose');


const Schema = mongoose.Schema;
const experienceSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true 
    },
    companyName: {
        type: String,
        default: null,
        required: true,
    },
    jobTitle: {
        type: String,
        required: true,
        default: null
    },
    roleDescription: {
        type: String,
        default: null,
        required: false
    },
    startDate: {
        type: Date,
        default: null,
        required: true
    },
    endDate: {
        type: Date,
        default: null,
        required: false
    },
    present: {
        type: Boolean,
        required: false,
        default:false
    }
});


module.exports = mongoose.model('Experience', experienceSchema);
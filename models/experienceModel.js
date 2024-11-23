const mongoose = require('mongoose');


const Schema = mongoose.Schema;
const experienceSchema = new Schema({
    companyName: {
        type: String,
        required: true,
    },
    jobTitle: {
        type: String,
    },
    roleDescription: {
        type: String,
        required: false
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: false
    },
    present: {
        type: Boolean,
        required: false,
        default:false
    }
});


module.exports = mongoose.model('Experience', experienceSchema);
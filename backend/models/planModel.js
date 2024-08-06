const mongoose = require("mongoose");
const validator = require('validator');
const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'a plan must have a name'],
        unique: true
    },
    category : {
        type: String,
        required: true,
        unique: true
    },
    company_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'a review must belong to a user, i.e. company']
    },
    type_of_service: {
        type : String,
        enum : ["Data","Wi-Fi","Fiber"],
        required: true
    },
    type_of_plan: {
        type : String,
        enum : ["Prepaid" , "Postpaid"],
        required: true
    },
    price : {
        type : Number,
        required: true
    },
    amount_data : {
        type : String,
        required: true
    },
    duration : {
        type : String,
        required: true
    },
    details : {
        type : String,
        required : true
    }


});
const Plan = mongoose.model('Plan', planSchema);
module.exports = Plan;
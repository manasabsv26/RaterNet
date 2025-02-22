const mongoose = require("mongoose");
const validator = require('validator');
const locationSchema = new mongoose.Schema({
    address_line1: {
        type: String,
        required: [true, 'the location must have address line 1'],
    },
    company_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'a location must belong to a user, i.e. company']
    },
    city: {
        type : String,
        required: true
    },
    state: {
        type : String,
        enum : ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"],
        required: true
    },
    pincode : {
        type : Number,
        required: true
    }

});
const Location = mongoose.model('Location', locationSchema);
module.exports = Location;

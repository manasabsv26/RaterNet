const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { stringify } = require('json5');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide the email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'please provide a password'],
        minlength: 8,
    },
    asn: {
        type: String,
        required: [true, 'please provide a asn number'],        
    },
    contact : {
        type: Number,
        required:true
    },
    services_provided : {
        type : String
    },
    webURL : {
        type : String
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }



});
userSchema.pre('save', async function(next) {
    //only run this function if password is actually modified 
    if (!this.isModified('password')) return next();
    //hasing the password with cost of 12 (salt string)
    this.password = await bcrypt.hash(this.password, 12);
    //delete this field as we dnt want in the database
    this.passwordConfirm = undefined;
    next();

})
userSchema.pre(/^find/, function(next) {
    // this points to the current query
    this.find({ active: { $ne: false } });
    next();
});
userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) {
        return next();
    }
    this.passwordChangedAt = Date.now() - 1000;
    //to execute smoothly we subtract 1sec
    next();
});
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    //  this.password will not be available ass password is not available
    return await bcrypt.compare(candidatePassword, userPassword);
}
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        //console.log(this.passwordChangedAt, JWTTimestamp);
        const changedTimeStamp = parseInt((this.passwordChangedAt.getTime() / 1000), 10);
        return (changedTimeStamp > JWTTimestamp);

    }
    //false means not changed
    return false;
}
userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
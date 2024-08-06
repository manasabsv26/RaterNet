const User = require('./../models/usermodel');
const jwt = require('jsonwebtoken');
const Apperror = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const express = require('express');
const crypto = require('crypto');
const signToken = (id,name,asn) => {
    return jwt.sign({ id: id,name:name,asn:asn}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}



const createSendToken = (user, statusCode, res) => {
        const token = signToken(user.id,user.name,user.asn)
            
        const cookieOptions = {
            expires: new Date(Date.now + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
            secure: true,
            HttpOnly: true
        };

        res.cookie('jwt', token, cookieOptions);
        user.password = undefined; //here while creating we wil see the users password so we need to undefined it

        res.status(statusCode).json({
            status: "success",
            token,
            data: {
                user: user
            }

        });


    }
    //for user
exports.signup = catchAsync(async(req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        photo: req.body.photo,
        asn : req.body.asn,
        contact : req.body.contact,
        services : req.body.services,
        webUrl : req.body.webURL,
        //passwordChangedAt: req.body.passwordChangedAt
    });

    //here  in create we have not used req.body only bcoz  it will create 
    // a security flaw by giving right to the user to become whichever role user wants
    createSendToken(newUser, 201, res);

});


exports.login = catchAsync(async(req, res, next) => {
    const { email, password } = req.body;

    //checking if email and password actually exists
    if (!email || !password) {
        return next(new Apperror('please provide email and password', 400));

    }
    //checking if user exists
    const user = await User.findOne({ email }).select('+ password ')


    if (!user || !await user.correctPassword(password, user.password)) {
        return next(new Apperror('incorrect email or password', 401));
    }
    // req.user = user;
    // console.log(user);
    //if everything is ok,send token to the client
    createSendToken(user, 200, res);
    //adding user as soon as they log in on to the request object


    // next();
});

exports.protect = catchAsync(async(req, res, next) => {
    let token;
    //get the token and check it is there
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];

    }
    // console.log(token);
    if (!token) {
        return next(new Apperror('you are not logged in!!', 401));
    }
    //validate the token

    const decoded = await (jwt.verify(token, process.env.JWT_SECRET))
        // console.log(decoded);
        //check user still exists here we  need to check for both models
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
        return next(new Apperror('Denied Route', 401));
    }

    //check if  user changed password after token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new Apperror('The user recently changed the password please login again', 401));
    }
    req.user = currentUser;

    next();
});
//we usually cant pass the arguments in the middleware function



exports.resetPassword = catchAsync(async(req, res, next) => {
    //get user based on the token 

    const hashToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ passwordResetToken: hashToken, passwordResetExpires: { $gt: Date.now() } })


    //if token has not expired and there is user set the new password
    if (!user) {
        return next(new Apperror('token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined,
        user.passwordResetExpires = undefined;
    //here we want the validators to check the details so we will write .save();
    await user.save();

    //update the changepasswordat property for the user
    //this is done by the middleware function we created
    //log in the user and send the JWT
    createSendToken(user, 200, res);

});

exports.updatePassword = catchAsync(async(req, res, next) => {
    //get the user 
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
        return next(new Apperror('no user with this id'), 400);
    }
    //check if the current password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new Apperror('your current password is wrong'), 401);
    }

    //if so update the password 

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm
    await user.save();
    //log user in ,send JWT
    createSendToken(user, 200, res);

});
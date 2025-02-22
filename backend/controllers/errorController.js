const AppError = require('./../utils/appError');
const sendErrorDev = (err, res) => {
    console.log("in the development error");
    console.log(err.message);
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        name: err.name,
        message: err.message,
        stack: err.stack



    });
   
};
const handleCastErrorDB = err => {
    console.log("we are in handle caste error");
    console.log(err);
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};
const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};
const sendErrorProd = (err, res) => {

    console.log("in send err production");
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message

        });


    } else {

        console.error('ERROR 💥', err);


        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        });
    }
};

const JsonWebTokenError = err => new AppError('Invalid token please login again', 401);
const TokenExpiredError = err => new AppError('Your token has expired  please login again', 401);

const handleDuplicateFieldsDB = err => {

    console.log(err);
    const temp = Object.keys(err.keyPattern);
    console.log(temp);
    const value = err.keyValue[temp];
    //const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    console.log(value);

    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};
module.exports = (err, req, res, next) => {
    // console.log("in global handler");
    err.statusCode = err.statusCode || 500;

    // console.log(JSON.stringify(err));
    // console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'development') {
        console.log("we are in the development if statement");
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        console.log("in production");
        //console.log(err.name);
        let error = err; //this is where magic happens 
        // console.log(error.name);

        if (error.name === 'CastError') {
            error = handleCastErrorDB(error);
            console.log("in cast error if statement");
        }
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError')
            error = JsonWebTokenError(error);
        if (error.name === 'TokenExpiredError')
            error = TokenExpiredError(error);

        sendErrorProd(error, res);
    }

}
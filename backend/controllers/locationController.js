const Location = require('../models/locationModel')
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

exports.createLocation = catchAsync(async (req,res,next)=>{
    const newLocation = await Location.create(req.body)
    console.log("newLocation: ",newLocation)    
    res.status(200).json({
        _id : newLocation._id,
        status: 'success'
    })
});

// Get plans by Company ID GET /plan/:company-id
exports.getLocationsById = catchAsync(async(req, res, next) => {
    const id = req.params.id
    const locations = await Location.find({company_id : id})

    if (!locations) {

        return next(new AppError('No location found with that ID', 404));
    } else {

        res.status(200).json({
            status: 'success',
            data: {
                locations
            }
        });
    }
});
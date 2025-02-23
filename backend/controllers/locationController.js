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

// Get locations by Company ID GET /location/:company-id
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

exports.updateLocation = catchAsync(async(req, res, next) => {
    const id = req.params.id

    const location = await Location.findOneAndUpdate({ "_id": id}, {
        "$set": {
                "address_line1": req.body.address_line1,
                "city": req.body.city,
                "state": req.body.price,
                "pincode": req.body.pincode
        }
    },);
    if (!location) {

        return next(new AppError('No location found with that ID', 404));
    } else {

        res.status(200).json({
            status: 'success',
            data: {
                plan
            }
        });
    }
});

exports.deleteLocation = catchAsync(async(req, res, next) => {
    const del = await Location.deleteOne({
        _id: req.params.id
    });
    if (!del) {
        return next(new AppError('There was some problem while Deleting. Delete after some time', 500));
    }
    res.status(200).json({
        status: 'success'
    })
});

exports.getallLocations = catchAsync(async(req, res, next) => {

    
    const locations = await Location.find();
    
    res.status(200).json({
        status: 'success',
        results: locations.length,
        data: {
            locations
        }
    });
}

);
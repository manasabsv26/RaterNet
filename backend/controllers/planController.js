const Plan = require('../models/planModel')
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


// Create a new plan , POST /plan
exports.createPlan = catchAsync(async(req, res, next) => {
    const newPlan = await Plan.create(req.body);
    console.log("newPlan: ",newPlan)
    res.status(200).json({
        _id: newPlan._id,
        status: 'success'
    })
});


// Delete a plan , DELETE /plan/options/:id
exports.deletePlan = catchAsync(async(req, res, next) => {
    const del = await Plan.deleteOne({
        _id: req.params.id
    });
    if (!del) {
        return next(new AppError('There was some problem while Deleting. Delete after some time', 500));
    }
    res.status(200).json({
        status: 'success'
    })
});

//Get all plans  GET /plan/
exports.getallPlans = catchAsync(async(req, res, next) => {

    
        const plans = await Plan.find();
        
        res.status(200).json({
            status: 'success',
            results: plans.length,
            data: {
                plans
            }
        });
    }

);
// Get plans by Company ID GET /plan/:company-id
exports.getPlanById = catchAsync(async(req, res, next) => {
        const id = req.params.id
        const plan = await Plan.find({company_id : id})

        if (!plan) {

            return next(new AppError('No plan found with that ID', 404));
        } else {

            res.status(200).json({
                status: 'success',
                data: {
                    plan
                }
            });
        }
    });

exports.updatePlan = catchAsync(async(req, res, next) => {
    const id = req.params.id

    const plan = await Plan.findOneAndUpdate({ "_id": req.params.id}, {
        "$set": {
                "type_of_service": req.body.type_of_service,
                "type_of_plan": req.body.type_of_plan,
                "price": req.body.price,
                "amount_data": req.body.amount_data,
                "duration": req.body.duration,
                "details": req.body.details
        }
    },);
    if (!plan) {

        return next(new AppError('No plan found with that ID', 404));
    } else {

        res.status(200).json({
            status: 'success',
            data: {
                plan
            }
        });
    }
});


const datawewant = async(t)=>{
    console.log(t);
    const temp1 = await Plan.find({name:t});
    return temp1[0]._id
    
}











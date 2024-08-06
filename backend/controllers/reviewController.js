const Review = require('./../models/reviewmodel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.getallReviews = catchAsync(async(req, res, next) => {

    const review = await Review.find();
    res.status(200).json({
        status: 'success',
        results: review.length,
        data: {
            review
        }
    })

});
exports.createReview = catchAsync(async(req, res, next) => {

    const newReview = await Review.create(req.body);
    res.status(201).json({
        status: 'success',

        data: {
            newReview
        }
    })

});

exports.getReviewsByCid = catchAsync(async(req, res, next) => {
    const id = req.params.id
    const review = await Review.find({company_id : id})

    if (!review) {

        return next(new AppError('No plan found with that ID', 404));
    } else {

        res.status(200).json({
            status: 'success',
            data: {
                review
            }
        });
    }
});

exports.getReviewByCandL = catchAsync(async(req, res, next) => {

    const company_id = req.params.id
    const locality = req.body.locality
    const newReview = await Review.find({ $and: [{company_id:company_id},{locality:locality}]});
    res.status(201).json({
        status: 'success',

        data: {
            newReview
        }
    })

});
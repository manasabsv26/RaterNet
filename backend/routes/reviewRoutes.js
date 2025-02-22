const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');
const express = require('express');
const router = express.Router();


router.route('/')
    .get(reviewController.getallReviews)
    .post( reviewController.createReview);

router.route('/options/:id')
    .get(reviewController.getReviewsByCid);

router.route('/locality/:id')
    .get(reviewController.getReviewByCandL);
    

module.exports = router;
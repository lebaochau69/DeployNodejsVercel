const express    = require('express');
const catchAsync = require('../utils/catchAsync');
const reviews    = require('../controllers/reviews');
const router     = express.Router({ mergeParams: true });

const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');

/**
 * Create a new review
 */
router.route('/')
      .post(isLoggedIn, validateReview, catchAsync(reviews.createReview))
      .get(reviews.redirectShowpage)

/**
 * Delete a review
 */
router.route('/:reviewId')
      .delete(isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;
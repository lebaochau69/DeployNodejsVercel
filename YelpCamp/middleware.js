const Campground   = require('./model/campground');
const Review       = require('./model/review');
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('./schemas');

/**
 * Check is login method
 * 
 * @param {*} req 
 * @param {*} resp 
 * @param {*} next 
 */
module.exports.isLoggedIn = (req, resp, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = '/login' == req.originalUrl ? '/' : req.originalUrl;
        req.flash('error', 'You must be sign in!');
        resp.redirect('/login');
    } else {
        next();
    }
};

/**
 * Check isAuthor
 * 
 * @param {*} req 
 * @param {*} resp 
 * @param {*} next 
 * @returns 
 */
module.exports.isAuthor = async (req, resp, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You don\'t have permission to do that!');
        return resp.redirect(`/campgrounds/${ id }`);
    } else {
        next();
    }
    
};

/**
 * Validate data type of campgrounds
 * 
 * @param {*} req 
 * @param {*} resp 
 * @param {*} next 
 */
module.exports.validateCampground = (req, resp, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

/**
 * Validate review object data type
 * 
 * @param {*} req 
 * @param {*} resp 
 * @param {*} next 
 */
module.exports.validateReview = (req, resp, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

/**
 * Check if user own this reivew or not
 * 
 * @param {*} req 
 * @param {*} resp 
 * @param {*} next 
 * @returns 
 */
module.exports.isReviewAuthor = async (req, resp, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author._id.equals(req.user._id)) {
        req.flash('error', 'You don\'t have permission to do that!');
        return resp.redirect(`/campgrounds/${ id }`);
    } else {
        next();
    }
};
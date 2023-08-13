const Campground = require('../model/campground');
const Review     = require('../model/review');

module.exports.createReview = async (req, resp) => {
    if (req.user._id != null) {
        const campground = await Campground.findById(req.params.id);
        const review = new Review(req.body.review);
        review.author = req.user._id;
        campground.reviews.push(review);
        await review.save();
        await campground.save();
        req.flash('success', 'Successfully create new review!');
    }
    resp.redirect(`/campgrounds/${req.params.id}`);
}

module.exports.deleteReview = async (req, resp) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    resp.redirect(`/campgrounds/${id}`);
}

module.exports.redirectShowpage = (req, resp) => {
    resp.redirect(`/campgrounds/${req.params.id}`);
}
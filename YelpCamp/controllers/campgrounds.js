const Campground  = require('../model/campground');

module.exports.index = async (req, resp) => {
    const campgrounds = await Campground.find({});
    resp.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm =  (req, resp) => {
    resp.render('campgrounds/new');
}

module.exports.renderEditForm = async (req, resp) => {
    const { id }     = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return resp.redirect('/campgrounds');
    }
    resp.render('campgrounds/edit', { campground });
}

module.exports.createCampground = async (req, resp) => {
    const campground  = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    resp.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req, resp) => {
    const campground = await Campground.findById(req.params.id).populate({
        path    : 'reviews',
        populate: { path: 'author' }
    }).populate('author')
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return resp.redirect('/campgrounds');
    }
    resp.render('campgrounds/show', { campground });
}

module.exports.updateCampground = async (req, resp) => {
    const { id }      = req.params;
    const campground  = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    const imgs        = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    req.flash('success', 'Successfully updated campground!')
    resp.redirect(`/campgrounds/${ id }`);
}

module.exports.deleteCampground = async (req, resp) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    resp.redirect(`/campgrounds`);
}
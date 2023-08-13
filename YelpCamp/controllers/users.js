const User = require('../model/user');

module.exports.renderRegister = (req, resp) => {
    resp.render('users/register');
}

module.exports.register = async (req, resp, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registerUser = await User.register(user, password);
        req.login(registerUser, err => {
            if (err) { return next(err); }
            req.flash('success', 'Welcome to Yelp Camp!');
            resp.redirect('/campgrounds');
        });
    } catch (e) {
        req.flash('error', e.message);
        resp.redirect('register');
    }
}

module.exports.renderLogin = (req, resp) => {
    if (req.isAuthenticated()) {
        resp.redirect('/campgrounds')
    } else {
        resp.render('users/login');
    }
}

module.exports.login = (req, resp) => {
    req.flash('success', 'Welcome back!!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    resp.redirect(redirectUrl);
}

module.exports.logout = (req, resp) => {
    if (req.isAuthenticated()) {
        req.logout();
        req.flash('success', 'Goodbye!');
        resp.redirect('/campgrounds')
    } else {
        resp.redirect('/campgrounds')
    }
}
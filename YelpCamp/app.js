if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express          = require('express');
const path             = require('path');
const mongoose         = require('mongoose');
const ejsMate          = require('ejs-mate');
const methodOverride   = require('method-override');
const session          = require('express-session');
const flash            = require('connect-flash');
const passport         = require('passport');
const localStrategy    = require('passport-local');

const User             = require('./model/user');
const ExpressError     = require('./utils/ExpressError');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes     = require('./routes/reviews');
const userRoutes       = require('./routes/users');

mongoose.connect('mongodb+srv://lebaochau96:Gx0byJiKdZaneh4b@mymongodb.iuurvyd.mongodb.net/mymongodb?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
    console.log('Database Connected');
});

const app = express();
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7
    }
}
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, resp, next) => {
    resp.locals.currentUser = req.user;
    resp.locals.success     = req.flash('success');
    resp.locals.error       = req.flash('error');
    next();
})

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

app.get('/', (req, resp) => {
    resp.render('home');
});

app.all('*', (req, resp, next) => {
    next(new ExpressError('Page not found', 404));
})

app.use((err, req, resp, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = "Something went wrong";
    }
    resp.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log('Serving on port 3000');
})
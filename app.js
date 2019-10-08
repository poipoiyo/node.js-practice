const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

// Mongo Database connection URI 
const MONGODB_URI = 'mongodb+srv://<username>:<password>@cluster0-qnhak.mongodb.net/<>';

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

const csrfProtection = csrf();


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
	session({
		secret: 'my secret',
		resave: false,
		saveUninitialized: false,
		store: store
	})
);

// csrfToken should be behind session
app.use(csrfProtection); 
app.use(flash());

app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	next();
});

app.use((req, res, next) => {
	if (!req.session.user) {
		return next();
	}
	User.findById(req.session.user._id)
		.then(user => {
		req.user = user;
		next();
    })
    .catch(err => {
		const error = new Error(err);
		error.httpStatusCode = 500;
		return next(error);
	});
});

app.use('/admin', adminRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
	res.status(500).render('500',{
		pageTitle: 'Error', 
		path: '/500',
		isAuthenticated: req.session.isLoggedIn
	});
});

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(result => {
    app.listen(3030);
  })
  .catch(err => {
    console.log(err);
  });

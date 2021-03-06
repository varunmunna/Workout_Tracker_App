const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const session = require('express-session');
const methodOverride = require('method-override');
const bcrypt = require('bcrypt');
const app = express();
require('pretty-error').start();
const PORT = process.env.PORT || 3000;


//db
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/workout_tracker';
mongoose.connect(mongoURI, {useMongoClient: true});
mongoose.Promise = global.Promise;

//fail/success
const db = mongoose.connection;
db.on('error', (err) => {
  console.log(err.message);
})
db.on('connected', () => {
  console.log('Mongo running: ', mongoURI);
})


//middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(session({
  secret: 'waereawr',
  resave: false,
  saveUninitialized: false
}));

//controllers
const appController = require('./controllers/router.js');
const sessionsController = require('./controllers/session.js');
app.use(methodOverride('_method'));
app.use('/workout_tracker', appController);
app.use('/user', sessionsController);

//root route
app.get('/', (req, res) => {
  res.redirect('/workout_tracker/home');
})

app.get('/workout_tracker', (req, res) => {
  res.redirect('/workout_tracker/home');
})

//listener
app.listen(PORT, () => {
  console.log('================');
  console.log("Mongoose app on port : ", PORT);
  console.log('================');
})

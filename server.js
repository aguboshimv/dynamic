var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var dbConfig = require('./db');
var mongoose = require('mongoose');
// Connect to DB
mongoose.connect(dbConfig.url);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession({ secret: 'mySecretKey' }));
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport);
app.use('/', routes);

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;

  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
app.listen(3000, function () {
  console.log("listening on port 3000")
})
module.exports = app;


// // passport/login.js
// passport.use('login', new LocalStrategy({
//     passReqToCallback : true
//   },
//   function(req, username, password, done) { 
//     // check in mongo if a user with username exists or not
//     User.findOne({ 'username' :  username }, 
//       function(err, user) {
//         // In case of any error, return using the done method
//         if (err)
//           return done(err);
//         // Username does not exist, log error & redirect back
//         if (!user){
//           console.log('User Not Found with username '+username);
//           return done(null, false, 
//                 req.flash('message', 'User Not found.'));                 
//         }
//         // User exists but wrong password, log the error 
//         if (!isValidPassword(user, password)){
//           console.log('Invalid Password');
//           return done(null, false, 
//               req.flash('message', 'Invalid Password'));
//         }
//         // User and password both match, return user from 
//         // done method which will be treated like success
//         return done(null, user);
//       }
//     );
// }));

// passport.use('signup', new LocalStrategy({
//     passReqToCallback : true
//   },
//   function(req, username, password, done) {
//     findOrCreateUser = function(){
//       // find a user in Mongo with provided username
//       User.findOne({'username':username},function(err, user) {
//         // In case of any error return
//         if (err){
//           console.log('Error in SignUp: '+err);
//           return done(err);
//         }
//         // already exists
//         if (user) {
//           console.log('User already exists');
//           return done(null, false, 
//              req.flash('message','User Already Exists'));
//         } else {
//           // if there is no user with that email
//           // create the user
//           var newUser = new User();
//           // set the user's local credentials
//           newUser.username = username;
//           newUser.password = createHash(password);
//           newUser.email = req.param('email');
//           newUser.firstName = req.param('firstName');
//           newUser.lastName = req.param('lastName');

//           // save the user
//           newUser.save(function(err) {
//             if (err){
//               console.log('Error in Saving user: '+err);  
//               throw err;  
//             }
//             console.log('User Registration succesful');    
//             return done(null, newUser);
//           });
//         }
//       });
//     };

//     // Delay the execution of findOrCreateUser and execute 
//     // the method in the next tick of the event loop
//     process.nextTick(findOrCreateUser);
//   })
// )

// // Generates hash using bCrypt
// var createHash = function(password){
//  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
// }
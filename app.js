const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoContact = require("connect-mongo")(session);
const path = require("path");
const ejs = require("ejs");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const promisify = require("es6-promisify");
const flash = require("connect-flash");
const expressValidator = require("express-validator");
const router = require("./routes/index");
const helpers = require("./helpers");
const errorHandlers = require("./handlers/errorHandlers");
const settingsApp = require("./middlewares/settingsApp");
const auth = require("./middlewares/auth");

// create our Express app
const app = express();
// view engine setup
app.set("views", path.join(__dirname, "views")); // this is the folder where we keep our pug files
app.set("view engine", "ejs"); // we use the engine pug, mustache or EJS work great too

// serves up static files from the public folder. Anything in public/ will just be served up as the file it is
app.use(express.static(path.join(__dirname, "public")));

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Exposes a bunch of methods for validating data. Used heavily on userController.validateRegister
// app.use(expressValidator());

// populates req.cookies with any cookies that came along with the request
app.use(cookieParser());

// Sessions allow us to Contact data on visitors from request to request
// This keeps users logged in and allows us to send flash messages
app.use(
  session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    Contact: new MongoContact({ mongooseConnection: mongoose.connection }),
  })
);

// // The flash middleware let's us use req.flash('error', 'Shit!'), which will then pass that message to the next page the user requests
app.use(flash());
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
//   res.header("Access-Control-Expose-Headers", "Content-Length");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Accept, Authorization, Content-Type, X-Requested-With, Range"
//   );
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   } else {
//     return next();
//   }
// });
// pass variables to our templates + all requests
app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.flashes = req.flash();
  res.locals.user = req.user || null;
  res.locals.currentPath = req.path;
  next();
});

// promisify some callback based APIs
app.use((req, res, next) => {
  req.login = promisify(req.login, req);
  next();
});

// Load custom or default menu
app.use(settingsApp);

// After allllll that above middleware, we finally handle our own routes!
app.use(router);

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// One of our error handlers will see if these errors are just validation errors
app.use(errorHandlers.flashValidationErrors);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get("env") === "development") {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

// done! we export it so we can start the site in start.js
module.exports = app;

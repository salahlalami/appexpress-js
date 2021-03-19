const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const promisify = require("es6-promisify");
const flash = require("connect-flash");
// const expressValidator = require("express-validator");
const authRouter = require("./routes/auth");
const pageRouter = require("./routes/page");
const apiRouter = require("./routes/api");
const authJwtRouter = require("./routes/authJwt");
const helpers = require("./helpers");
const errorHandlers = require("./handlers/errorHandlers");
const settingsApp = require("./middlewares/settingsApp");
const passport = require("passport");
const { checkAuth, isLoggedIn } = require("./controllers/authController");
const { isValidToken } = require("./controllers/authJwtController ");
require("./handlers/passport")(passport); // pass passport for configuration

// create our Express app
const app = express();
// view engine setup
app.set("views", path.join(__dirname, "views")); // this is the folder where we keep our pug files
app.set("view engine", "pug"); // we use the engine pug, mustache or EJS work great too

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
    store: MongoStore.create({ mongoUrl: process.env.DATABASE }),
  })
);

// // Passport JS is what we use to handle our logins
app.use(passport.initialize());
app.use(passport.session());

// // The flash middleware let's us use req.flash('error', 'Shit!'), which will then pass that message to the next page the user requests
app.use(flash());

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

// app.use(function (req, res, next) {
//   if (req.url.slice(-1) === "/" && req.path.length > 1) {
//     // req.path = req.path.slice(0, -1);
//     req.url = req.url.slice(0, -1);
//   }
//   next();
// });

// After allllll that above middleware, we finally handle our own routes!
app.use(authRouter);
// app.use(isLoggedIn, pageRouter);
app.use(pageRouter);

// app.use("/api", authJwtRouter);

// app.use("/api", isValidToken, apiRouter);

app.use("/v1/api", apiRouter);
// Here our API Routes
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Methods", "GET,PATCH,POST,DELETE");
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
// app.use("/api", checkAuth, apiRouter);

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

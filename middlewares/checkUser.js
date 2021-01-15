//this middleware will check if the user  is logged in, if not he will be redirected to the login page :)

//this middleware will check if the user  is logged in, if not he will be redirected to the login page :)
module.exports = (req, res, next) => {
  console.warn(req.user);
  // only register && public/download  routes will be allowed to get pass :)

  // he we check if the the user collection exist in the request
  // if yes means that the user is logged in
  // else the user is not logged it

  if (
    req.user == undefined &&
    req.path !== "/register" &&
    req.path !== "/login" &&
    req.path.search("/public/download") !== 0
  ) {
    // redirect to login page if the user is not logged in :')
    return res.render("login");
  }

  // if yes continue the user actions ^_^
  next();
};

//this middleware will check if the staff  is logged in, if not he will be redirected to the login page :)

//this middleware will check if the staff  is logged in, if not he will be redirected to the login page :)
module.exports = (req, res, next) => {
  console.warn(req.user);
  // only register && public/download  routes will be allowed to get pass :)

  // he we check if the the staff collection exist in the request
  // if yes means that the staff is logged in
  // else the staff is not logged it

  if (
    req.user == undefined &&
    req.path !== "/register" &&
    req.path !== "/login" &&
    req.path.search("/public/download") !== 0
  ) {
    // redirect to login page if the staff is not logged in :')
    return res.render("login");
  }

  // if yes continue the staff actions ^_^
  next();
};

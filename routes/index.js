var User = require('../schema/user').User;
var e = require('../ext/error');
module.exports = function(app){

  require("./pages/home")(app, e, User);
  require("./pages/login")(app, e, User);
  require("./pages/register")(app, e, User);
  require("./pages/logout")(app, e, User);
  require('./pages/chat')(app, e, User);
  require("./pages/users")(app, e, User);

};

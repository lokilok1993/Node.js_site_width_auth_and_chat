 module.exports = function(app, e, User){
  app.get('/login', function(req, res, next){
    res.render('login', {title: "Вход", name:"Гость", logged: false})
  });

  app.post('/login', function(req, res, next){
    
    var login = req.body.login;
    var pass = req.body.password;
    User.findOne({name: login}, function(err, curUser){
      if(err) next(err);
      if(curUser){
        if(curUser.checkPassword(pass)){
          req.session.user = curUser._id;
          res.status(302);
          res.setHeader('Location', '/');
          res.end();
        }else{
          next(e.setError(401));
        }
      }else{
        next(e.setError(401));
      }
    });
  });
 }

module.exports = function(app, e, User, logged){
  app.get('/register', function(req, res, next){
    res.render('register', {title: "Регистрация", name:"Гость", logged: false})
  });

  app.post('/register', function(req, res, next){
    var login = req.body.login;
    var pass = req.body.password;

    var user = new User({
      name: login,
      password: pass
    });

    user.save(function(err){
      if(err) next(err);

      res.status(302);
      res.setHeader('Location', '/login');
      res.end();
    })



  });
}
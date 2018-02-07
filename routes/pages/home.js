module.exports = function(app, e, User){
  app.get('/', function(req, res, next){
     if(req.session.user){
      User.findById(req.session.user, function(err, user){
        if(err) next(err);
        res.render('index', {title: "Вход", name:user.name, logged: true})
      });
    }else{
       res.render('index', {title: "Наш сайт", name:"Гость", logged: false})
    }
  });
}


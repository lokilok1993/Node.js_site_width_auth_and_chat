module.exports = function(app, e, User){
  

  app.get('/chat', function(req, res, next){
    if(req.session.user){
      User.findById(req.session.user, function(err, user){
        if(err) next(err);
        res.render('chat', {title:'chat', userName: user.name});
      });
    }else{
       res.redirect('/')
    }
  });
}
 
module.exports = function(app, e, User){
   app.get('/users/:id', function(req, res, next){
    User.findById(req.param('id'), function(err, user){
      if(err) next(err);
      if(user == null){ 
        next(e.setError(400, 'Пользователь не найден')); 
      }else{
        res.json(user)
      }
      
    })
  });

  app.get('/users', function(req, res, next){
    User.find({}, function( err, users){
      if(err) next(err);
      res.json(users);
    });
  });
}

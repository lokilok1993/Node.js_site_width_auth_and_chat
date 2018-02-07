module.exports = function(app, e, User){
  app.get("/logout", function(req, res, next){
    req.session.destroy(function(err){
      if(err) next(err);
      res.status(302);
      res.setHeader('Location', '/');
      res.end();
    })
  });
}
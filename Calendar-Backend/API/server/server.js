var express = require('express'),
app = express(),
port = process.env.PORT || 5000,
bodyParser = require('body-parser'),
calendarRoutes = require('../routes/calenderRoutes');

exports.start = () => {

  //configure app to use bodyParser for easy retrieval of data from a POST
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());    

  //configure cors on all routes
  app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", 'GET,HEAD,PUT,PATCH,POST,DELETE, OPTIONS');
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
  });

  //register known routes    
  app.use('/', calendarRoutes);

  //handle unknown routes
  app.use(function(req, res) {
      res.status(404).send({url: req.originalUrl + ' not found'})
  });

  app.listen(port);

  console.log('RESTFUL API server started on: ' + port);

}

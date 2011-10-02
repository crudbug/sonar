/**
 * Module dependencies.
 */

//chat

var express = require('express');

var app = module.exports = express.createServer();

/*  foursquare  */
var config = {
  "secrets" : {
    "clientId" : "RJQIJESWVTS4NH4MFD4M0R4XWP0GTT4N540UGLMODADMOG4S",
    "clientSecret" : "TU0Z0TAVCI21IK3Q4ZEMZWJ4CTWYQCGJNZ2E2Z4ECJV1X5ZG",
    "redirectUrl" : "http://miimenu.com/callback"
  }
}

var foursquare = require("node-foursquare")(config);



//socket.io chat 
var io = require("socket.io").listen(app);

io.sockets.on("conntection",function(socket){
   console.log("User Connected");
});

var count = 0;
setInterval(function(){
  console.log("send message "+count++)
  io.sockets.emit("message",{ data:"test"+count } ); 
},4000);

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(express.compiler({ src: __dirname + '/public', enable: ['sass'] }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Sonar'
  });
});

/**********************************************************/
app.get('/login', function(req, res) {
  res.writeHead(303, { "location	": Foursquare.getAuthClientRedirectUrl() });
  res.end();
});

app.get('/callback', function (req, res) {
  Foursquare.getAccessToken({
    code: req.query.code
	redirect_uri: http://miimenu.com/callback,
    client_id: "RJQIJESWVTS4NH4MFD4M0R4XWP0GTT4N540UGLMODADMOG4S",
    client_secret: "TU0Z0TAVCI21IK3Q4ZEMZWJ4CTWYQCGJNZ2E2Z4ECJV1X5ZG"
  }, function (error, accessToken) {
	if(error) {
      res.send("An error was thrown: " + error.message);
    }
    else {
      // Save the accessToken and redirect.
    }
  });
});
/**********************************************************/






app.listen(80);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);


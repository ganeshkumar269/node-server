var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var uri = require("./util/mymongodbURI.js")
var Ddos = require('ddos')
var MongoClient = require('mongodb').MongoClient;

// App variables
var app = express();
var ddos = new Ddos({burst:5, limit:15})

//importing utility functions


//importing route handlers
var createHandler = require('./routes/create.js')
var loginHandler = require('./routes/login.js')
var sendMessageHandler = require('./routes/sendMessage.js')
var getMessagesHandler = require('./routes/getMessages.js') 
var pingHandler = require('./routes/ping.js')

//importing middlewares
var verifyToken = require('./middlewares/verifyToken.js')


//express handles
app.use(ddos.express);
app.use(bodyParser.urlencoded({extended : true}));



//GET methods
app.get('/',(q,s) => res.end("<h1> Welcome to CLC</h1>"));
app.get('/api/v1/getMessages',verifyToken,getMessagesHandler);
app.get('/api/v1/ping',verifyToken,pingHandler);


//POST methods
app.post('/api/v1/create',createHandler);
app.post('/api/v1/login',loginHandler);
app.post('/api/v1/sendMessage',verifyToken,sendMessageHandler);

//Listener
app.listen(process.env.PORT || 4000,err=>console.log("Listening to port 4000"))

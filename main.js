require('module-alias/register')
var express = require('express');
var bodyParser = require('body-parser');
var Ddos = require('ddos')
var cors = require('cors')


// App variables
var app = express();
var ddos = new Ddos({burst:5, limit:15})


//importing utility functions
var authorize = require('./util/authorizeHeadersForExpress.js')


//importing route handlers
var createHandler = require('./routes/create.js')
var loginHandler = require('./routes/login.js')
var sendMessageHandler = require('./routes/sendMessage.js')
var getMessagesHandler = require('./routes/getMessages.js') 
var pingHandler = require('./routes/ping.js')


//importing middlewares
var splitToken = require('./middlewares/splitToken.js')


//express handles
app.use(ddos.express)
app.use(bodyParser.urlencoded({extended : true}))
app.use(cors())
app.options("*",cors())

// app.use((req,res,next)=>{
//     res.header("Access-Control-Allow-Origin","*")
//     req.header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,PATCH,OPTIONS")
//     res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept,Authorization");
//     req.header("Access-Control-Allow-Origin","*")
//     req.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept,Authorization");
//     next();
// })


//GET methods
app.get('/',(q,s) => s.end("<h1> Welcome to CLC</h1>"));    
app.get('/api/v1/getMessages',splitToken,getMessagesHandler);
app.get('/api/v1/ping',splitToken,pingHandler);


//POST methods
app.post('/api/v1/create',createHandler);
app.post('/api/v1/login',loginHandler);
app.post('/api/v1/sendMessage',splitToken,sendMessageHandler);


//Listener
app.listen(process.env.PORT || 3000,err=>console.log("Listening to port 3000"))

require('module-alias/register')
var express = require('express');
var bodyParser = require('body-parser');
var Ddos = require('ddos')
var cors = require('cors')
var MongoClient = require('mongodb').MongoClient

// App variables
var app = express();
var ddos = new Ddos({burst:5, limit:15})


//importing utility functions
var authorize = require('./util/authorizeHeadersForExpress.js')
var uri = require("@mymongodbURI")
// var options = { 
//                 promiseLibrary: Promise,
//                 useNewUrlParser:true,
//                 keepAlive: 1, 
//                 useUnifiedTopology: true
//               }
// var client = new MongoClient(uri, options)
var getDb = require("./db.js")

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
app.get('/',(q,s) => {
    console.log("Home Page Request Arrived")
    s.send("<h1>Hello, World!</h1>")
})
app.get('/api/v1/getMessages',getDb,splitToken,getMessagesHandler,);
app.get('/api/v1/ping',getDb,splitToken,pingHandler);


//POST methods
app.post('/api/v1/create',getDb,createHandler);
app.post('/api/v1/login',getDb,loginHandler);
app.post('/api/v1/sendMessage',getDb,splitToken,sendMessageHandler);


//Listener
app.listen(process.env.PORT || 3000, () => console.log(`Node.js app is listening at http://localhost:3000`))


// client.connect()
//   .catch(err => console.error(err.stack))
//   .then(db => {
//     app.locals.db = client
//     app.listen(process.env.PORT || 3000, () => {
//       console.log(`Node.js app is listening at http://localhost:3000`);
//     });
//   });
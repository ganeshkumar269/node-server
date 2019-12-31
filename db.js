var uri = require("@mymongodbURI")
var options = { 
                promiseLibrary: Promise,
                useNewUrlParser:true,
                keepAlive: 1, 
                useUnifiedTopology: true
              }
var MongoClient = require('mongodb').MongoClient
var client = new MongoClient(uri, options)

var getDb = async (req,res,next)=>{
    if(req.app.locals.db)
        next()
    await client.connect()
    req.app.locals.db = client
    next()
}

module.exports = getDb

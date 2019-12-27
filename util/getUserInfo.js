//importing packages
var MongoClient = require('mongodb').MongoClient;
var ObjectID  = require('mongodb').ObjectID


//importing custom files
var uri = require("@mymongodbURI")


//declaring app variables
const client = new MongoClient(uri,{useNewUrlParser:true,useUnifiedTopology: true})


module.exports = async (username)=>{
    console.log("UserInfo Request arrived for "+ username)
    return client.connect()
    .then(async db=>{
        try{
            var user = await client
                            .db('User-Data')
                            .collection('User-Info')
                            .find({"username":username},{_id:0})
                            .limit(1)
                            .toArray()
            console.log("getUserInfo.js: User[0]: " + user[0])
            return user[0]
        }catch(err){
            console.log("getUserInfo.js: Try Block , err: " + err)
            throw err
        }
    })
    .catch(err=>{
        console.log("getUserInfo.js: Connection to MongoDB failed, err: " + err);
        throw err
    })
}

require('module-alias/register')

//importing packages

var MongoClient = require('mongodb').MongoClient;


//importing custom files
var uri = require("@mymongodbURI")


//declaring app variables
const client = new MongoClient(uri,{useNewUrlParser:true,useUnifiedTopology: true });


module.exports = async (username)=>{
    try{
        await client.connect()               
    }catch(err){
        console.log("getUserCredentials.js: MongoDB failed to connect")
        throw err
    }   
    return client
    .db('User-Data')
    .collection('Credentials')
    .find({"username":username},{_id:0,userId:0})
    .limit(1).toArray()
    .then(res=> {
        return res[0]
    })
    .catch(err=>{
        console.log("login.js: Error in client.connect.find: " + err)
        throw err
    })
}
//importing packages
var MongoClient = require('mongodb').MongoClient;
var ObjectID  = require('mongodb').ObjectID


//importing custom files
var Conversation = require('@Conversation')
var uri = require("@mymongodbURI")


//declaring app variables
const client = new MongoClient(uri,{useNewUrlParser:true,useUnifiedTopology: true})


module.exports = async (participants) =>{
    console.log("createConversation.js: Request arrived for :" + participants)
    return client.connect()
    .then(async db=>{
        try{
            var conv = new Conversation(participants).json();
            await client.db('User-Data')
                        .collection('Conversations')
                        .insertOne(conv)
            return conv
        }catch(err){
            console.log("getUserInfo.js: Try Block , err: ")
            throw err
        }
    })
    .catch(err=>{
        console.log("getUserInfo.js: Connection to MongoDB failed, err: ")
        throw err
    })
}
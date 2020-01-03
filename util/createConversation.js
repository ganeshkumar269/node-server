require('module-alias/register')

//importing packages
var MongoClient = require('mongodb').MongoClient;
var ObjectID  = require('mongodb').ObjectID


//importing custom files
var Conversation = require('@Conversation')
var config = require("@config")
const uri = config.DB_URI

//declaring app variables


module.exports = async (client,participants) =>{
    console.log("createConversation.js: Request arrived for :" + participants)
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
}
require('module-alias/register')

//importing packages
var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID

//importing custom files
var createConversation = require("@createConversation")
var uri = require("@mymongodbURI")
var getUserInfo = require("@getUserInfo")

//declaring app variables
const client = new MongoClient(uri,{useNewUrlParser:true,useUnifiedTopology: true})

module.exports = async(doc)=>{
    var timestamp = Date.now()
    try{
        var [recieverInfo,senderInfo] = await Promise.all([getUserInfo(doc.reciever) , getUserInfo(doc.sender)])
    }catch(err){
        console.log("sendMessage.js: Failed getUserInfo await ")
        throw err
    }
    if(doc.convId == null){
        try{
            var conv = await createConversation([senderInfo.userId,recieverInfo.userId])                         
        }catch(err){
            console.log("createMessage.js: Failed await createConversation")
            throw err
        }
        try{
            await client.connect()
            await Promise.all([
                client.db('User-Data')
                .collection('Messages')
                .insertOne({
                    convId:conv.convId,
                    msgId:new ObjectID().toHexString(),
                    creatorUserId:senderInfo.userId,
                    body:doc.message,
                    timestamp:timestamp
                }),

                client.db('User-Data')
                .collection('User-Info')
                .updateOne({userId:recieverInfo.userId},
                        {$push:{"pastConv":{convId:conv.convId,lastUsed:timestamp}}}
                ),

                client.db('User-Data')
                .collection('User-Info')
                .updateOne({userId:senderInfo.userId},
                        {$push:{"pastConv":{convId:conv.convId,lastUsed:timestamp}}}
                )])
            return conv.convId
        }catch(err){
            console.log("createMessage.js:Try-Catch, err "+ err)
            throw err
        }
    } else {
        await client.connect()
        client.db('User-Data')
        .collection('Messages')
        .insertOne({
            convId:doc.convId,
            msgId:new ObjectID().toHexString(),
            creatorUserId:senderInfo.userId,
            body:doc.message,
            timestamp:timestamp
        }),
        client.db('User-Data')
        .collection('User-Info')
        .updateOne({userId:recieverInfo.userId},
                {"pastConv":{$elemMatch:{convId:doc.convId}}},
                {$set:{"mails.$.lastUsed":timestamp}}
        ),

        client.db('User-Data')
        .collection('User-Info')
        .updateOne({userId:senderInfo.userId},
                {"pastConv":{$elemMatch:{convId:doc.convId}}},
                {$set:{"mails.$.lastUsed":timestamp}}
        )
        return doc.convId
    }
}
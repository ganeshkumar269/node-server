require('module-alias/register')

//importing packages
var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID

//importing custom files
var createConversation = require("@createConversation")
var uri = require("@mymongodbURI")
var getUserInfo = require("@getUserInfo")

//declaring app variables

module.exports = async(client,doc)=>{
    var timestamp = Date.now()
    try{
        var [recieverInfo,senderInfo] = await Promise.all([getUserInfo(client,doc.reciever) , getUserInfo(client,doc.sender)])
    }catch(err){
        console.log("sendMessage.js: Failed getUserInfo await ")
        throw err
    }
    console.log("createMessage.js: doc.convId : " + doc.convId)
    if(doc.convId == null){
        try{
            var conv = await createConversation(client,[senderInfo.userId,recieverInfo.userId])                         
        }catch(err){
            console.log("createMessage.js: Failed await createConversation")
            throw err
        }
        try{
            await Promise.all([
                client
                .collection('Messages')
                .insertOne({
                    convId:conv.convId,
                    msgId:new ObjectID().toHexString(),
                    creatorUserId:senderInfo.userId,
                    body:doc.message,
                    timestamp:timestamp
                }),

                client
                .collection('User-Info')
                .updateOne({userId:recieverInfo.userId},
                        {$push:{"pastConv":{convId:conv.convId,lastUsed:timestamp}}}
                ),

                client
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
        try {
        client
        .collection('Messages')
        .insertOne({
            convId:doc.convId,
            msgId:new ObjectID().toHexString(),
            creatorUserId:senderInfo.userId,
            body:doc.message,
            timestamp:timestamp
        }),
        client
        .collection('User-Info')
        .updateOne({userId:recieverInfo.userId,
                "pastConv":{$elemMatch:{convId:doc.convId}}},
                {$set:{"pastConv.$.lastUsed":timestamp}}
        ),

        client
        .collection('User-Info')
        .updateOne({userId:senderInfo.userId,
                "pastConv":{$elemMatch:{convId:doc.convId}}},
                {$set:{"pastConv.$.lastUsed":timestamp}}
        )
        return doc.convId
        }catch(err){
            console.log("createMessage.js: Try-Catch")
            throw err
        }
    }
}
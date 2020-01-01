require('module-alias/register')
var MongoClient = require('mongodb').MongoClient;
var uri = require("@mymongodbURI")
var getUserInfo = require('@getUserInfo')

module.exports = async (client,username,timestamp)=>{
    try{
        var user = await getUserInfo(client,username)
        var res = await client.db('User-Data')   // Find a user document whose userId is equal to whom we are looking for
                        .collection('User-Info')
                        .find({userId:user.userId})
                        .limit(1)
                        .toArray()
        if(res == undefined)
            return []
        var reply = []
        res[0].pastConv.forEach(el => {
            if(el.lastUsed > timestamp) reply.push(el)
        })
        return reply
    }catch(err){
        console.log("getPrevConv.js: Try-Catch, err " + err)
        throw err
    }
}
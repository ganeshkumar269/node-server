require('module-alias/register')
var MongoClient = require('mongodb').MongoClient;
var uri = require("@mymongodbURI")
var getUserInfo = require('@getUserInfo')

module.exports = async (client,username)=>{
    try{
        var user = await getUserInfo(client,username)
        var res = await clients.db('User-Data')
                        .collection('User-Info')
                        .find({userId:user.userId})
                        .limit(1)
                        .toArray()
        return res[0].pastConv
    }catch(err){
        console.log("getPrevConv.js: Try-Catch, err " + err)
        throw err
    }
}
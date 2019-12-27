require('module-alias/register')
var MongoClient = require('mongodb').MongoClient;
var uri = require("@mymongodbURI")
const client = new MongoClient(uri,{useNewUrlParser:true,useUnifiedTopology: true})
var getUserInfo = require('@getUserInfo')

module.exports = async (username)=>{
    try{
        await client.connect()
        var user = await getUserInfo(username)
        var res = await client.db('User-Data')
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
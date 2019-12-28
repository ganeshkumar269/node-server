require('module-alias/register')

//importing packages
var MongoClient = require('mongodb').MongoClient;
var ObjectID  = require('mongodb').ObjectID


//importing custom files
var uri = require("@mymongodbURI")


//declaring app variables


module.exports = async (client,username)=>{
    console.log("UserInfo Request arrived for "+ username)
    try{
        var user = await client
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
}

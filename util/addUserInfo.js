require('module-alias/register')

var uri = require("@mymongodbURI")
var MongoClient = require('mongodb').MongoClient;

const client = new MongoClient(uri,{useNewUrlParser:true,useUnifiedTopology: true });

module.exports = async (user)=>{
    await client.connect()
    client
    .db("User-Data")
    .collection("Credentials")
    .insertOne(user)
    .then(msg=>{
            console.log(`Successfully inserted ${user.username} credentials`)
            client
            .db('User-Data')
            .collection('User-Info')
            .insertOne({
                userId:user.userId,
                lastActive:null,
                pastConv:[]
            })
            .then(msg=>{
                console.log(`Successfully inserted ${user.username} info`)
                return {status:200,message:`Successfully inserted ${user.username} info`}
            }).catch(err=>{
                return {status:500,message:"internal DB error"}
                console.log(`Error occured inserting ${user.username} info`);
            })
    }).catch(msg=>{
        console.log(`Error occured inserting ${user.username} credentials`);
        return {status:500,message:"internal DB error"}
    });
}
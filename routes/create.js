var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var uri = require("../util/mymongodbURI.js")

const client = new MongoClient(uri,{useNewUrlParser:true});
var userExists = require('../util/userExists');


module.exports = (request,response) => {
    console.log("Incoming create Request");
    const user = request.body;
    if(user.username == "" || user.password == ""){
        console.log("create.js: Invalid Inputs, empty strings not allowed")
        response.json({status:401,message:"Empty string input"})
    } else {
    console.log(user);
    if(user.username === undefined)
        response.json({status:400,message:"Empty request body"});
    else {
        response.setHeader('Content-Type','application/json');
        
        userExists(user.username,(msg)=>{
            console.log(msg);
            if(msg === false){
                console.log("Username isnt in DB, inserting user to DB")
                client.connect()
                .then(db=>{
                    client
                    .db("expressDemo")
                    .collection("loginCredentials")
                    .insertOne(user)
                    .then(msg=>{
                            console.log(`Successfully inserted ${user.username} credentials`)
                            response.json({status:200,message:`Successfully inserted ${user.username} credentials`})
                    }).catch(msg=>{
                        response.json({status:500,message:"internal DB error"})
                        console.log(`Error occured inserting ${user.username} credentials`);
                    });
                })
                .catch(err=>{
                    console.log("create.js: Connection with MongoDB failed, err " + err)
                    response.josn({status:500,message:"Internal Error"})
                })
                
            }else {
            console.log("Username exists")
            response.json({status:401,message:"Username Exists, try another"})
        } 
        },err=>{
            console.log("create.js: Error at " + err)
            response.json({status:500,message:"Internal Error"})
        })
    }
    }
}
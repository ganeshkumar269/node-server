var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var MongoClient = require('mongodb').MongoClient;


var uri = require("../util/mymongodbURI.js")
const client = new MongoClient(uri,{useNewUrlParser:true});
var userExists = require('../util/userExists');



module.exports = (request,response) => {
    jwt.verify(request.token,'secretkey',(err,authData)=>{
        if(err){
            console.log("sendMessage.js: token verification failed " + err)
            response.json({status:401,message:"Token Verification failed"})
        }
        else {
            console.log("Token Verified");
            userExists(request.body.username, message => {
                    if(message === true){
                        var timestamp = Date.now();
                        const senderData = {
                            message:request.body.message,
                            reciever:request.body.username,
                            timestamp:timestamp
                        }
                        const recieverData = {
                            message:request.body.message,
                            sender:authData.user.username,
                            timestamp:timestamp
                        }
                        client.connect().then( db=>{
                            client
                            .db(authData.user.username)
                            .collection("sent")
                            .insertOne(senderData)
                            .then( res =>{
                                console.log("sendMessage.js:Message -s saved " + res);
                                client
                                    .db(request.body.username)
                                    .collection("recieved")
                                    .insertOne(recieverData)
                                    .then(res=>{
                                        console.log("sendMessage.js:Message -r saved " + res);
                                    })
                                    .catch(err =>{
                                        console.log("sendMessage.js:Message -r save failed " + err);

                                    })
                            })
                            .catch(err=>{
                                console.log("sendMessage.js:Message -s save failed " + err);

                            })
                        })
                        .catch(err=>{
                            console.log("sendMessage.js: Error connecting to mongo " + err)
                            response.json({status:500,message:"Internal Error"});
                        })
                        response.json({status:200,message:'Message Sent Successfully'});
                    } else {
                        response.json({status:401,message:'Message Sent Unsuccessful, Reciever doesnt Exist'});
                    }
                } , message => {
                    console.log(message);
                    response.json({status:500,message:"Internal Error"});
                })
        }});
}
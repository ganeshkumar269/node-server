var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var MongoClient = require('mongodb').MongoClient;


var uri = require("../util/mymongodbURI.js")
const client = new MongoClient(uri,{useNewUrlParser:true});
var userExists = require('../util/userExists');



module.exports = (request,response)=>{ // request.username , header.authorization - token
    console.log("Request Arrived");
    const user = request.query;
    console.log(user);
    response.setHeader('Content-Type','application/json');
    if(typeof user.username === 'undefined' || user.username == '' || user.password == ''){
        console.log("getMessages.js: Invalid inputs , user: " + user);
        response.json({status:403,message:'Invalid Inputs'});
    } else {
        const token = request.token;
        jwt.verify(token,"secretkey",(err,authData)=>{
            if(err){
                console.log("getMessages.js:Token Verification failed , err" + err);
                respose.json({status:403,message:"Token Verification failed"});
            } else {
                console.log(authData);
                userExists(user.username, msg =>{
                    if( msg === true){
                        client.connect()
                        .then(db=>{
                            client.db(authData.user.username)
                            .collection('recieved')
                            .find({"sender" : user.username})
                            .toArray()
                            .then(res=>{
                                if(res.length == 0){
                                    console.log("getMessages.js: messages empty")
                                    response.json({status:400,messages:"messages empty"})
                                } else {
                                    var messageJSON = {
                                        'messages' : []
                                    };
                                    res.forEach(element => {
                                        messageJSON['messages'].push(element);
                                    });
                                    response.json({status:200,message:"Retrieved Messages succesfully",data:messageJSON})
                                }
                            })
                            .catch(err=>{
                                console.log("getMessages.js: mongodb error, err " + err)
                                response.json({status:500,message:"Internal DB error"});
                            })
                        })
                        .catch(err=>{
                            console.log("getMessages.js: Connection to MongoDB failed, err" + err);
                            response.json({status:500,message:"Internal Error"})
                        })
                    } else {
                        response.json({status:404,message:"Reciever doesnt exist"});
                    }
                },msg =>{
                    console.log(msg);
                    res.status(500).send("Internal Error")
                });
            }
        });
    }
}
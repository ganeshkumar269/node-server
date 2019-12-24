var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var MongoClient = require('mongodb').MongoClient;


var uri = require("../util/mymongodbURI.js")
const client = new MongoClient(uri,{useNewUrlParser:true,useUnifiedTopology: true });
var userExists = require('../util/userExists');

module.exports = (req,response)=>{
    const user = req.body;
    console.log("Incoming login request");
    response.setHeader('Content-Type','application/json');
    userExists(user.username,msg=>{
        console.log(msg)
        if(msg === true){   
            client.connect().then(db=>{
                    client
                    .db('expressDemo')
                    .collection('loginCredentials')
                    .find({"username":user.username},{_id:0,username:1,password:1}).limit(1).toArray()
                    .then(res=>{
                            if (res.length == 0){
                                console.length("login.js: UserDoesnt exist " + user.username)
                                response.json({status:401,message:`User ${user.username} Doesnt Exist`})
                            } else {
                                if(res[0].password == user.password){
                                    console.log(`login.js: Login ${user.username} Successful`)
                                    jwt.sign({user}, "secretkey",(err,token)=>{
                                        if(err) {
                                            console.log("login.js:Error Occured while signing a token")
                                            response.json({status:500,message:"Error Occured while signing a token"})
                                        } else {
                                            response.json({status:200,message:token.toString()})
                                        }
                                    });
                                }
                                else{
                                    console.log(`login.js:Wrong ${user.username} up : ${user.password} rp : ${res.password}Password`);
                                    response.json({status:401,message:`Wrong ${user.username} Password`})

                                }
                            }
                    })
                    .catch(err=>{
                        console.log("login.js: Error in client.connect.find: " + err)
                        response.json({status:500,message:"Internal Error"})
                    })

            }).catch(err=>{
                console.log("login.js: Error in client.connect: " + err)
                response.json({status:500,message:"Internal Error"})
            })
        }else{
            console.log(user.username + " incorrect password Entered")
            response.json({status:401,message:"Incorrect Password"})

        }    
    },err=>{
        console.log(err)
        response.json({status:500,message:"Internal Error"})
    })
    //This code for implementing POW                            var initiatePOW = false;
                                                                // if(initiatePOW){
                                                                //     jwt.verify(req.headers['Hash-Key'],"secretkeyforhash",(err,authData)=>{
                                                                //         if(err) {
                                                                //             jwt.sign(randomString(),"secretkeyforhash",(err,token)=>{
                                                                //                 result.send(200,token.toString());
                                                                //             });
                                                                //         } else {
                                                                //             jwt.verify()
                                                                //         }
                                                                    
                                                                //     });
                                                                // }
}
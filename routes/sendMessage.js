//importing packages
require('module-alias/register')
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

//importing custom files
var userExists = require('@userExists')
var createMessage = require("@createMessage")


//declaring app variables


module.exports = async (request,response)=>{
    try{
        var authData = jwt.verify(request.token,"secretkey")
    }catch(err){
        console.log("sendMessage.js: err, "+err)
        response.json({status:400,message:"Invalid Token"})
    }
    try{
        var t = await userExists(request.body.username)
    }catch(err){
        console.log("sendMessage.js: await userExists, err " + err)
        response.json({status:500})
    }
    if(t == true){
        var t = request.headers['convid']
        var doc = {
            convId:t,
            sender:authData.user.username,
            reciever:request.body.username,
            message:request.body.message
        }
        try{
            createMessage(doc);
        }catch(err){
            console.log("sendMessage.js: Error in createMessage, err " + err)
            response.json({status:500})    
        } 
        response.json({status:200})
    }else{  // r-user doesnt exist
        console.log("sendMessages.js:R-User doenst exist")
        response.json({status:401,message:"R-User Doesnt Exist"})
    }
}
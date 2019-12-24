const HOME = "../"
var uri = require('../util/mymongodbURI');
var Mongoclient = require('../node_modules/mongodb').MongoClient;
const client = new Mongoclient(uri,{useNewUrlParser:true, useUnifiedTopology: true});

module.exports = (username,callbackOnResolve,callbackOnReject)=>{
    client.connect()
    .then(db=>{
        client
        .db("expressDemo")
        .collection("loginCredentials")
        .find({"username":username},{_id:0}).limit(1).toArray()
        .then(res=>{
            console.log("userExists.js: Type of response : " + typeof res);
            console.log(res.length);
            if(res.length < 1)
                callbackOnResolve(false);
            else 
                callbackOnResolve(true);
        })
        .catch(err=>callbackOnReject("userExists.js: Error occured: " + err));
    })
    .catch(err=>callbackOnReject("userExists.js: Error occured: " + err))
}
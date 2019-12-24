var jwt = require('../node_modules/jsonwebtoken')

module.exports = (request,response)=>{
    response.setHeader('Content-Type','application/json');
    jwt.verify(request.token,"secretkey",(err,authData)=>{
        if(err){
            response.status(403).send("Invalid Token");
            throw err;
        } else {
            console.log('Token verified');
            response.status(200).send('ping hasn\'t been implemented yet :(\nStay Tuned for further updates :)');
        }
    });
}
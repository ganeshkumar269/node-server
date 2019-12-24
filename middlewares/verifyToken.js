

module.exports = (request,response,next)=>{
    const  bearer = request.headers['authorization'];
    if(typeof bearer !== 'undefined'){
        const bearerToken = bearer.split(' ')[1];
        request.token = bearerToken;
        console.log(bearerToken);
        next();
    } else {
        console.log('Undefined Token');
        response.sendStatus(403);
    }
}
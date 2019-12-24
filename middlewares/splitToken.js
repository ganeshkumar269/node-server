

module.exports = (request,response,next)=>{
    const  bearer = request.header('authorization')
    console.log(bearer)
    if(typeof bearer !== 'undefined'){
        const bearerToken = bearer.split(' ')[1]
        request.token = bearerToken
        console.log(bearerToken)
        next()
    } else {
        console.log('splitToken.js: Undefined Token')
        response.json({status:403,message:"Undefined Token"})
    }
}
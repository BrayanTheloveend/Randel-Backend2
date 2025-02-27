//Imports
const jwt= require('jsonwebtoken');
require('dotenv').config()

//exports function
module.exports={

    generateTokenUser: (userData)=>{
        return jwt.sign({
            _id: userData._id,
            role: userData.role
        },
        process.env.JWT_SIGN_SECRET, {
            expiresIn: '1h'
        })
    },

    parseAuthorization: (authorization)=>{
        return (authorization != null) ? authorization.replace('Bearer ', '') : null
    },

    getUserId: (authorization)=>{
        let _id =  -1
        const token = module.exports.parseAuthorization(authorization)
        if(token != null){
            try{
                let jwtToken = jwt.verify(token, JWT_SIGN_SECRET)
                if(jwtToken != null){
                    return _id = jwtToken._id
                }
            }
            catch (err){
                
            }
        }
    }
}
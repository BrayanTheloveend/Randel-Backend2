const User = require('../Model/USER');
const bcrypt = require('bcrypt')
const multer = require('multer')
const nodemailer = require('nodemailer')
//const emailOptions = require('../handlebars')
const jwt = require('../Middleware/JWT')
const Waterfall = require('async').waterfall

module.exports={

    Login: (req, res)=>{
        const { email, password } = req.body

        if(!email  || !password ){
            return res.status(400).json({ 'message': 'missing parameters'})
        }
    
        Waterfall([
            (done)=>{
                User.findOne({ email: email })
                .then(found=> done(found))
                .catch(err => res.status(500).json({'message': err }))
            },
    
        ],(found)=>{
            console.log(found)
            if(found){
                if(found.statut==0){
                    return res.status(201).json({
                        data: {
                            role: found.role,
                            _id: found._id
                        },
                        message: 'Votre Compte n\'as pas été activée , Verifier votre Courriel'
                    })
                }else if(found.statut==1){
                    bcrypt.compare(password, found.password, (errBycrypt, resBycrypt)=>{
                        if(resBycrypt){
                            let token = jwt.generateTokenUser(found)
                            res.cookie('accessToken', token, { maxAge: 900000, httpOnly: true })
                            return res.status(200).json({
                                ...found._doc,
                                token: token,
                            })
                        }else{
                            return res.status(403).json({'message': "mot de passe incorrect" })
                        }
                    })
                }else{
    
                    return res.status(409).json({
                        'message': 'Votre compte a été bloqué. veuillez contactez l\'admin'
                    })
                }
            }else{
                return res.status(404).json({ "message": "Ce compte n'existe pas."})
            }}
        )
    
    }

}
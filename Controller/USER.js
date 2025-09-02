const User = require('../Model/USER');
const bcrypt = require('bcrypt')
const multer = require('multer')
const nodemailer = require('nodemailer');
const { uploadFile } = require('../Googlecloud/DRIVE');
const CATEGORIE = require('../Model/CATEGORIE');
const { sendMailAuth } = require('../Middleware/SENDMAIL');
require('dotenv').config()
// const emailOptions = require('../handlebars')
// const jwt = require('../Middleware/JWT')

//Upload File

let date = Date.now()
const storage = multer.diskStorage({
    destination: (req, file, callback)=>{
        return callback(null, "./Public")
    },

    filename: (req, file, callback)=>{
        return callback(null, `${date}_${file.originalname}`)
    }
})

const upload = multer({storage})

//Send Email
//OTP CODE Generator
function OTPGenerator(number){
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < number; i++ ) {
        OTP += digits[Math.floor(Math.random() * (digits.length))];
    }
    return OTP;
}


// Send Mail Transporter

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: "noubissibrayan@gmail.com",
      pass: "uzxcarvhlledzhma",
    },
  })


module.exports = {

    CreateUser: { 

        file: upload.single('file'),
        
        request : async (req, res)=>{
            const { name, surname, email, password, role } = req.body;
            const file = req.file;
            //let OTP = OTPGenerator(6)
            if (!email || !password) return res.status(400).json({ 'message': 'Username and password are required.' });
            
            // check for duplicate usernames in the db
             User.findOne({ email: email }).then( async found =>{

                if(found){ res.status(409).json({ 'message': 'Adresse email déjà utilisé' })}
                else{
                    if(file && file !== undefined){
                        await uploadFile(file, process.env.FOLDER_USER_IMAGE)
                        .then(file =>{
                            bcrypt.hash(password, 8, (err, bcryptedPassword)=>{
                                User.create({
                                    email: email,
                                    name: name,
                                    surname: surname,
                                    shopName: surname,
                                    role: role,
                                    statut: false,
                                    picture: `${file.data.name}_id${file.data.id}` ,
                                    password: bcryptedPassword,
                                })
                                .then(async ()=>{
                                    const isMailSended =  await sendMailAuth(email, 'Authentification', { name: name, email: email })
                                    if(isMailSended){
                                        return res.status(200).json({'message':'Compte enregistré'})
                                    }else{
                                        return res.status(409).json({'message': 'Erreur lors de l\'envoi du mail'})
                                    }
                                })
                                 .catch(err=> res.status(500).json({'message': err}))
                            })
                        }).catch(err=> res.status(409).json({'message': err}))

                    }else{
                        bcrypt.hash(password, 8, (err, bcryptedPassword)=>{
                            User.create({
                                email: email,
                                name: name,
                                surname: surname,
                                shopName: surname,
                                role: role,
                                statut: false,
                                picture: `__nopicture__` ,
                                password: bcryptedPassword,
                            })
                            .then(async ()=>{
                                const isMailSended =  await sendMailAuth(email, 'Authentification', { name: name, email: email })
                                if(isMailSended){
                                    return res.status(200).json({'message':'Compte enregistré'})
                                }else{
                                    return res.status(409).json({'message': 'Erreur lors de l\'envoi du mail'})
                                }
                            })
                            .catch(err=> res.status(500).json({'message': err}))
                        })
                    } 
                }
            })
            
            
        }
    },

    getUser: async (req, res)=>{
        try {
            await User.find({})
            .then(users => res.status(200).json(users))
        } catch (error) {
            res.status(404).json({'message': error.message })
        }
        
    },

    updateUser: (req, res)=>{
        User.findOne({'_id': req.body.id})
        .then(async (found)=>{
            if(found){
                User.updateOne({'_id': req.body.id},{
                    description: req.body.description,
                    country: req.body.country,
                    city: req.body.city,
                    facebook: req.body.facebook,
                    tiktok: req.body.tiktok
                }).then(()=> res.status(200).json({'message': 'updated'}))
                .catch(err=> res.status(500).json({'message': err}))
            }else{
                res.status(404).json({'message': 'user not found'})
            }
        }).catch(err=> res.status(500).json({'message': err}))
    }, 

    getUserById : async (req, res)=>{
        const userArticle = []
        const Category = await CATEGORIE.find({})
        User.findOne({'_id': req.params.id})
        .then(found=>{
            if(found){
                // console.log(Category)
                if(Category){
                    for (let i = 0; i < Category.length; i++) {
                        if(Category[i].article.length > 0){
                            for (let j = 0; j < Category[i].article.length; j++) {
                                if(Category[i].article[j].owner === req.params.id){
                                    userArticle.push(Category[i].article[j])
                                }
                            }
                        }
                    }
                }else{
                    return res.status(404).json({'message': 'unabled to get Article'})

                }
            return res.status(200).json({...found._doc, article: userArticle})
            }else{
                return res.status(404).json({'message': 'User not found'})
            }
        }).catch(err=> res.status(500).json({'message': err}))
    },

    ChangeUserStatus: (req, res)=>{

        User.findOne({'_id': req.params.id})
        .then(found=> {
            if(found){
                User.updateOne({'_id': req.params.id}, {'statut': found.statut ? false : true})
                .then(()=> res.status(200).json({'message': found.statut ? 'User Blocked': 'User Activated'}))
                .catch(err=> res.status(500).json({'message': err}))
                //send mail
                
            }else{
                return res.status(404).json({'message': 'User not found'})
            }
        }).catch(err=> res.status(500).json({'message': err}))
    },

    deleteUserById: (req, res)=>{
        User.deleteOne({'_id': req.params.id})
        .then(()=> res.status(200).json({'message': 'Successfully deleted'}))
        .catch(err=> res.status(500).json({'message': err}))
    }


   


}

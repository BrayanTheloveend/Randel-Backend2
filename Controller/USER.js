const User = require('../Model/USER');
const bcrypt = require('bcrypt')
const multer = require('multer')
const nodemailer = require('nodemailer');
const { uploadFile } = require('../Googlecloud/DRIVE');
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
            const { name, surname, email, password } = req.body;
            const file = req.file;
            //let OTP = OTPGenerator(6)
            if (!email || !password || !file) return res.status(400).json({ 'message': 'Username and password are required.' });
            
            // check for duplicate usernames in the db
             User.findOne({ email: email }).then( async found =>{

                if(found){ res.status(409).json({ 'message': 'Adresse email déjà utilisé' })}
                else{
                    await uploadFile(file, process.env.FOLDER_USER_IMAGE)
                    .then(file =>{
                        console.log(file)
                        bcrypt.hash(password, 8, (err, bcryptedPassword)=>{
                            User.create({
                                email: email,
                                name: name,
                                surname: surname,
                                statut: 1,
                                picture: `${file.data.name}_id${file.data.id}` ,
                                password: bcryptedPassword,
                            })
                            .then(()=> res.status(201).json({"message": 'compte crée avec success '}) )
                                
                            //    const transport = transporter.sendMail(emailOptions(email, 'Code de Verification', OTP))
                            //     .then(()=>{
                            //         return res.status(200).json({
                            //             'message': "vous avez reçu un code de verification a l'adresse e-mail ✅" + email
                            //         })
                            //     })
                            //     .catch(err=>{
                            //         return res.status(404).json({
                            //             'message': 'verifier votre connexion internet'
                            //         })
                            //     })
                                        
                            // )
        
                            //DO NOT FORGET TO SEND A EMAIL TO Admin
                            .catch(err=> res.status(500).json({'message': err}))
                        })

                    }).catch(err=>{
                        return res.status(409).json({'message': err})
                    })
                    
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

   


}

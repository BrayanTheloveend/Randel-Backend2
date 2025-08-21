const Promotion = require('../Model/PROMOTIONS')
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { uploadFile, deleteFile } = require('../Googlecloud/DRIVE')
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

module.exports = {

    createPromotion : {
        file: upload.single('file'),
        
        request : async (req, res)=>{

        const file = req.file;
        await uploadFile(file, process.env.FOLDER_USER_IMAGE).then(file =>{
            Promotion.create({
                _id: uuidv4(),
                name: req.body.name,
                price: req.body.price,
                picture: `${file.data.name}_id${file.data.id}`,
                createdAt: Date.now()

            }).then(()=>res.status(200).json({'message': 'Created'}))
            .catch(err=>res.status(409).json({'message': 'Cant fetch data target'}))
        }).catch(err=>res.status(409).json({'message': 'image error'}))
    }},

    ListPromotion : (req, res)=>{
        Promotion.find({}).sort({ createdAt: -1 })
        .then(data=>res.status(200).json(data))
        .catch(err=>res.status(409).json({'message': err}))
    },

    DeletePromotion: (req, res)=>{
        Promotion.deleteOne({'_id': req.params.id})
        .then(()=>res.status(200).json({'message': 'Deleted'}))
        .catch(err=>res.status(409).json({'message': 'Can\'t delete target'}))
    }
}
const Categorie = require('../Model/CATEGORIE')
const { uploadFile, deleteFile } = require('../Googlecloud/DRIVE')
const multer = require('multer')
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


module.exports ={

    createCategorie : { file: upload.single('file'),
    
    request : async (req, res)=>{
        const{ name, subtitle} = req.body
        const file = req.file;
        if (!name || !subtitle || !file) return res.status(400).json({ 'message': 'data are required.' });

        await uploadFile(file, process.env.FOLDER_USER_IMAGE)
        .then(file =>{
                Categorie.create({
                name: name,
                picture: `${file.data.name}_id${file.data.id}`,
                subtitle: subtitle,
                createdAt: Date.now()
            }).then(()=>res.status(200).json({'message': 'Categorie crée avec success'}))
            .catch(err=>res.status(409).json({'message': err}))
             }
        )
        .catch(err=>res.status(409).json({'message': 'image error'}))
        
    }},

    ReadCategorie: (req, res)=>{
        Categorie.find()
        .then(data=>res.status(200).json(data))
        .catch(err=>res.status(409).json({'message': err}))

    },
    
    UpdateCategorie : (req, res)=>{
        const {id, name, subtitle, picture} = req.body
        Categorie.updateOne({'_id': id}, {
            name: name,
            picture: picture,
            subtitle: subtitle,
        }).then(()=>res.status(200).json({'message': 'Categorie modifié avec success'}))
        .catch(err=>res.status(409).json({'message': err}))
    },

    DeleteCategorie: (req, res)=>{
        Categorie.deleteOne({'_id': req.params.id})
        .then(async()=>{
            await deleteFile(req.params.idPicture).then(()=>{
                console.log('File deleted from Google Drive')
                return res.status(200).json({'message': 'Categorie Supprimé avec success'})
            }).catch(err=>console.log(err))
        })
        .catch(err=>res.status(409).json({'message': err}))
    },

    GetCategoryById: (req, res)=>{
        Categorie.findById(req.params.id)
        .then(data=>res.status(200).json(data))
        .catch(err=>res.status(409).json({'message': err}))
    }
}

// ARTICLE MANAGEMENT


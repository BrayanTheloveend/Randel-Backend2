const Categorie = require('../Model/CATEGORIE')
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { uploadFile, deleteFile } = require('../Googlecloud/DRIVE');
const USER = require('../Model/USER');
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
        const { idCategory, name, price, oldPrice, provider, skill, owner, description, stock, country, rate, build} = req.body

        await uploadFile(file, process.env.FOLDER_USER_IMAGE).then(file =>{
            Categorie.updateOne({'_id': idCategory},{$push: {
                article: {
                    _id: uuidv4(),
                    idCategory: idCategory,
                    name: name,
                    price: price,
                    oldPrice: oldPrice,
                    discount: true,
                    owner: owner,
                    provider: provider,
                    country: country,
                    skill: skill,
                    picture: `${file.data.name}_id${file.data.id}`,
                    rate: rate,
                    build: build,
                    stock: stock,
                    description: description,
                    createdAt: Date.now()
                }}
            }).then(()=>res.status(200).json({'message': 'Created'}))
            .catch(err=>res.status(409).json({'message': 'Cant fetch data target'}))
        }).catch(err=>res.status(409).json({'message': 'Can\'t addde file GOOGLE DRIVE'}))
    }},

    ListPromotion : (req, res)=>{
        let articleSet = []
        Categorie.find({})
        .then(data=>{
        for (let i = 0; i < data.length; i++) {
            if(data[i].article.length > 0){
                for (let j = 0; j < data[i].article.length; j++) {
                    if(data[i].article[j].discount === true){
                        articleSet.push({...data[i].article[j], categoryName: data[i].name})
                    }
                }
            }
        }
        return res.status(200).json(articleSet)
        }).catch(err=>res.status(409).json({'message': err}))
    },

    UpdatePromotion : {
        file: upload.single('file'),    
        request : (req, res)=>{
        const {idCategory, _id, name, picture, oldPrice,  provider, price, description, stock, country, skill, build} = req.body
        const file = req.file;

        if(!file){
            Categorie.updateOne({'_id': idCategory, 'article': {$elemMatch: {'_id': _id}}}, {
                'article.$.provider': provider,
                'article.$.description': description,
                'article.$.stock': stock,
                'article.$.name': name,
                'article.$.price': price,
                'article.$.oldPrice': oldPrice,
                'article.$.skill': skill,
                'article.$.country': country,
                'article.$.build': build
            }).then(()=>res.status(200).json({'message': 'Article modifié avec success'}))
            .catch(err=>res.status(409).json({'message': err}))
        }else{
            uploadFile(file, process.env.FOLDER_USER_IMAGE).then(file =>{
                Categorie.updateOne({'_id': idCategory, 'article': {$elemMatch: {'_id': _id}}}, {
                    'article.$.provider': provider,
                    'article.$.description': description,
                    'article.$.stock': stock,
                    'article.$.name': name,
                    'article.$.price': price,
                    'article.$.oldPrice': oldPrice,
                    'article.$.skill': skill,
                    'article.$.country': country,
                    'article.$.build': build,
                    'article.$.picture': `${file.data.name}_id${file.data.id}`
                }).then(async()=>{
                    await deleteFile(picture.split('_id').pop().split('.')[0]).then(()=>{
                        console.log('File deleted from Google Drive')
                        res.status(200).json({'message': 'Article modifié avec success'})
                    }).catch(err=>res.status(409).json({'message': 'image error'}))
                        
                })
                .catch(err=>res.status(409).json({'message': err}))
            })
            .catch(err=>res.status(409).json({'message': 'image error'}))   
        }
    }},
    
    getPromotionByUserId: async(req, res)=>{
        let articleSet = []
        if(req.params.id){
        const Owner = await USER.findOne({'_id': req.params.id})
        Categorie.find({})
            .then(data=>{
            if(Owner){
                for (let i = 0; i < data.length; i++) {
                    if(data[i].article.length > 0){
                        for (let j = 0; j < data[i].article.length; j++) {
                            if(data[i].article[j]?.owner === req.params.id && data[i].article[j]?.discount === true ){
                                articleSet.push({...data[i].article[j], categoryName: data[i].name})
                            }
                        }
                    }
                }
                return res.status(200).json({...Owner._doc, 'article': articleSet})
            }
            
        })
            .catch(err=>res.status(409).json({'message': err}))
        }else{
            return res.status(409).json({'message': 'invalide params'})
        }
        
    },


   DeletePromotion: (req, res)=>{
        Categorie.updateOne({'_id': req.params.idCategory}, { $pull: { 'article': { _id: req.params.id } } })
        .then(async()=>{
            await deleteFile(req.params.idPicture).then(()=>{
                console.log('File deleted from Google Drive')
                return res.status(200).json({'message': 'Article Supprimé avec success'})
            }).catch(err=>console.log(err))
        })
        .catch(err=>res.status(409).json({'message': err}))
    },

}
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


module.exports ={

    // CREATE ARTICLE

    createArticle : {

        file: upload.single('file'),

        request : async (req, res)=>{

        const { idCategory, name, price, provider, skill, owner, description, stock, country, rate, build} = req.body
        const file = req.file;
        await uploadFile(file, process.env.FOLDER_USER_IMAGE).then(file =>{
            Categorie.updateOne({'_id': idCategory},{$push: {
            article: {
                _id: uuidv4(),
                idCategory: idCategory,
                name: name,
                price: price,
                likes: [],
                discount: false,
                owner: owner,
                provider: provider,
                country: country,
                skill: skill,
                picture: `${file.data.name}_id${file.data.id}`,
                rate: rate,
                build: build,
                stock: stock,
                description: description,
                createdAt: date
            }}
        }).then(()=>res.status(200).json({'message': 'Article crée avec success'}))
        .catch(err=>res.status(409).json({'message': 'Cant fetch data target'}))
        }).catch(err=>res.status(409).json({'message': 'image error'}))
    }},

    // LIST ARTICLE

     ListArticle: (req, res)=>{
        let articleSet = []
         Categorie.find({})
         .then(data=>{
            for (let i = 0; i < data.length; i++) {
                if(data[i].article.length > 0){
                    for (let j = 0; j < data[i].article.length; j++) {
                        if(data[i].article[j].discount !== true){
                        articleSet.push({...data[i].article[j], categoryName: data[i].name})
                        }
                    }
                }
            }
            return res.status(200).json(articleSet)
        })
         .catch(err=>res.status(409).json({'message': err}))
     },
    
    //  UPDATE ARTICLE 

     UpdateArticle : {

        file: upload.single('file'),    
        request : (req, res)=>{
        const {idCategory, _id, name, picture, provider, price, description, stock, country, skill, build} = req.body
        const file = req.file;

        if(!file){
            Categorie.updateOne({'_id': idCategory, 'article': {$elemMatch: {'_id': _id}}}, {
                'article.$.provider': provider,
                'article.$.description': description,
                'article.$.stock': stock,
                'article.$.name': name,
                'article.$.price': price,
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

     DeleteArticle: (req, res)=>{
         Categorie.updateOne({'_id': req.params.idCategory}, { $pull: { 'article': { _id: req.params.id } } })
         .then(async()=>{
            await deleteFile(req.params.idPicture).then(()=>{
                console.log('File deleted from Google Drive')
                return res.status(200).json({'message': 'Article Supprimé avec success'})
            }).catch(err=>console.log(err))
        })
         .catch(err=>res.status(409).json({'message': err}))
     },

     getArticleById: (req, res)=>{
         Categorie.findOne({'_id': req.params.idCategory})
         .then(data=>{
            const article = data.article.find(article => article._id === req.params.id);
            if(article) {
                return res.status(200).json(article);
            } else {
                return res.status(404).json({'message': 'Article not found'});
            }
         })
         .catch(err=>res.status(409).json({'message': err}))
     }, 

     getArticleByUserId: async(req, res)=>{
        let articleSet = []
        if(req.params.id){
        const Owner = await USER.findOne({'_id': req.params.id})
        Categorie.find({})
         .then(data=>{
            if(Owner){
                for (let i = 0; i < data.length; i++) {
                    if(data[i].article.length > 0){
                        for (let j = 0; j < data[i].article.length; j++) {
                            if(data[i].article[j]?.owner === req.params.id && data[i].article[j]?.discount !== true){
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

     getArticleBestseller : (req, res)=>{
        Categorie.find({})
        .then(data=>{            
            let ArticleBestSeller = []
            if(data.length !== 0){
                for(let i = 0; i < data.length ; i++){
                    if(data[i].article.length !== 0){
                        let noPromo = data[i].article.filter(elt=> elt?.discount !== true)
                        if(noPromo.length !== 0){
                            ArticleBestSeller.push({...noPromo.at(-1), categoryName: data[i].name})
                        }
                    }
                }   
            }
            res.status(200).json(ArticleBestSeller)
        }).catch(err=>res.status(409).json({'message': err}))
    },

    userLikedArticle: async (req, res)=>{
        const { userId, idArticle,idCategory } = req.body
        const Category = await Categorie.findOne({'_id': idCategory})
        const user = await USER.findOne({'_id': userId})
        if(Category && user){
            const article = Category.article.find(article => article._id === idArticle);
            if(article) {
                if(article.likes && article.likes.includes(userId)){
                    return res.status(200).json({'message': 'Article deja liked'})
                }else{
                    await Categorie.updateOne({'_id': idCategory, 'article': {$elemMatch: {'_id': idArticle}}}, {$pull: {'article.$.likes': userId}})
                    return res.status(200).json({'message': 'Article liked'})
                }
            } else {
                return res.status(404).json({'message': 'Article not found'});
            }
        }
        return res.status(404).json({'message': 'User or Category not found'});
    },


    


}
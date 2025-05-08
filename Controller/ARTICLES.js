const Article = require('../Model/ARTICLE')



module.exports ={
    createArticle : (req, res)=>{
        const{
            name, price, provider, owner, description, stock, country, picture, rate, build
        } = req.body

        Article.create({
            name: name,
            price: price,
            owner: owner,
            provider: provider,
            country: country,
            picture: picture,
            rate: rate,
            build: build,
            stock: stock,
            description: description,
            createdAt: Date.now()
        }).then(()=>res.status(200).json({'message': 'Article crée avec success'}))
        .catch(err=>res.status(409).json({'message': err}))
    },

    ReadArticle: (req, res)=>{
        Article.find()
        .then(()=>res.status(200).json({'message': 'Article crée avec success'}))
        .catch(err=>res.status(409).json({'message': err}))

    },
    
    UpdateArticle : (req, res)=>{
        const {id, provider, description, stock, country, picture, build} = req.body
        Article.updateOne({'_id': id}, {
            provider: provider,
            country: country,
            picture: picture,
            build: build,
            stock: stock,
            description: description,
        }).then(()=>res.status(200).json({'message': 'Article modifié avec success'}))
        .catch(err=>res.status(409).json({'message': err}))
    },

    deleteArticle: (req, res)=>{
        Article.deleteOne({'_id': id})
        .then(()=>res.status(200).json({'message': 'Article Supprimé avec success'}))
        .catch(err=>res.status(409).json({'message': err}))
    }
}
const Categorie = require('../Model/CATEGORIE')
const USER = require('../Model/USER');
const SYSTEM = require('../Model/SYSTEM');
const ORDER = require('..//Model/ORDER');
const WITHDRAW = require('../Model/WITHDRAW');
require('dotenv').config()
// const emailOptions = require('../handlebars')
// const jwt = require('../Middleware/JWT')



module.exports={
    getSystem : (req, res)=>{
        SYSTEM.find({})
        .then(data=> {
            if(data){
                USER.find({})
                .then(found=>{
                    console.log(found)
                    return res.status(200).json({...data, users: [...found]})
                })
                .catch(err=> res.status(409).json({'message': err}))
            }
        })
        .catch(err=> res.status(404).json({'message': 'not found'}))
    },

    getAllOrder: (req, res)=>{
        ORDER.find({}).sort({ createdAt: -1 })
        .then(data=> res.status(200).json(data))
        .catch(err=> res.status(409).json({'message': err}))
    },

    


}
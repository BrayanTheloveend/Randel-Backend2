const User = require('../Model/USER');
const Order = require('../Model/ORDER');
const System = require('../Model/SYSTEM');




module.exports =  {

    CreateOrder: (req, res)=>{
        const {name, email, picture} = req.body
        const array = req.file
        
        Order.create({
            name: name,
            email: email,
            picture: picture,
            statut: false,
            order: array,
            amount: amount,
            createdAt: Date.now()
        }).then(()=>{
            System.find().then(found=>{
                if(found.length === 0){
                    System.updateOne({
                        amount: amout,
                        createdAt: Date.now()})
                    .then(()=>res.status(200).json({'message': 'Commande effectué avec Success'}))
                    .catch(err=>res.status(409).json({'message': err }))
                }else{
                    System.create(
                        { "_id": found._id},
                        { amount: amout, createdAt: Date.now()})
                    .then(()=>res.status(200).json({'message': 'Commande effectué avec Success'}))
                    .catch(err=>res.status(409).json({'message': err }))
                }
            })
        })
    }

}
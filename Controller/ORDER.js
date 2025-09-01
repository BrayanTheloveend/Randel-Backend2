const User = require('../Model/USER');
const Order = require('../Model/ORDER');
const System = require('../Model/SYSTEM');
const { codeGenerator } = require('../Middleware/UTILS');
const { sendMailWithAttachment, sendMailCustomerTransaction, sendMailConfirmTransaction  } = require('../Middleware/SENDMAIL');
const CATEGORIE = require('../Model/CATEGORIE');



let date = Date.now()

module.exports =  {

    CreateOrder: (req, res)=>{

        const array = req.body.order
        const code = codeGenerator(8)

        User.findOne({'_id': req.body.id})
        .then(user=>{
            if(user){
                User.updateOne({'_id': req.body.id}, {
                    cni: req.body.cni,
                    delivreryAddress: req.body.delivreryAddress,
                    phone: req.body.phone,
                }).then(()=>{
                    Order.create({
                        customerId: user._doc._id,
                        name: user._doc.name,
                        email: user._doc.email,
                        code: code,
                        cni: req.body.cni,
                        delivreryAddress: req.body.delivreryAddress,
                        phone: req.body.phone,
                        picture: user._doc.picture,
                        verify: false,
                        statut: 'En attente',
                        order: array,
                        amount: req.body.amount,
                        createdAt: date
                    }).then(async()=>{
                        let total = req.body.amount + (req.body.amount * 0.25)
                        let message = `Bonjour je m'appélle ${user._doc.name}, j'ai effectué une commande sur CamerShop. Voici mon code de commande: ${code}. Montant total (avec frais 5%): ${total} FCFA.Je vous enverrai sous peu la capture de paiment. Merci de me confirmer la réception de ce message.`
                        //envoyé un mail pour initier le paiement du client 
                        const placeholder = {
                            name: user._doc.name,
                            code: code,
                            amount: total,
                            order: array,
                            picture: `https://lh3.googleusercontent.com/d/${user._doc.picture?.split('_id').pop().split('.')[0]}`,
                            date: date,
                            email: user._doc.email,
                            phone: req.body.phone,
                            whatsappPrefilledMessage: encodeURIComponent(message)
                        }
                        const isMailSended =  await sendMailWithAttachment(user._doc.email, 'Finalisation de votre commande', placeholder)
                        if(isMailSended){
                            res.status(200).json({'message': 'Commande effectuée avec succès'})
                        }else{
                            res.status(409).json({'message': 'Erreur lors de l\'envoi du mail'})
                        }
                    })
                })
                .catch(err=>res.status(409).json({'message': err}))
            }else{
                res.status(409).json({'message': 'Utilisateur non trouvé'}) 
        }})
        .catch(err=>res.status(409).json({'message': err}))
    },


    getOrder: (req, res)=>{   
        Order.find({'statut': 'En attente'}).sort({ createdAt: -1 })
        .then(data=>res.status(200).json(data))
        .catch(err=>res.status(409).json({'message': err}))
    },

    getOderByIdUser: (req, res)=>{   
        User.findOne({'_id': req.params.id})
        .then(async data=> {
            if(data?.role === 'Client'){
                const fetchOrder = await Order.find({'customerId': req.params.id}).sort({ createdAt: -1 })
                return res.status(200).json(fetchOrder)

            }else if(data?.role === 'Vendeur'){
                let ArrayOrder = []
                Order.find({'verify': true}).sort({ createdAt: -1 })
                .then(data=>{
                    if(data.length !== 0){
                        for(let i = 0; i < data.length; i++){
                            for(let j = 0; j < data[i].order.length; j++){
                                if(data[i].order[j].owner === req.params.id){
                                    ArrayOrder.push({...data[i], order: {...data[i].order[j]}})
                                }
                            }
                        }
                    }
                    return res.status(200).json(ArrayOrder)
                }).catch(err=>res.status(409).json({'message': err}))

            }else{
                const fetchOrder = await Order.find({}).sort({ createdAt: -1 })
                return res.status(200).json(fetchOrder)
            }
        })
        .catch(err=>res.status(409).json({'message': err}))
    },

    getOderByOwner :(req, res)=>{   
        let ArrayOrder = []
        Order.find({'verify': true}).sort({ createdAt: -1 })
        .then(data=>{
            if(data.length !== 0){
                for(let i = 0; i < data.length; i++){
                    for(let j = 0; j < data[i].order.length; j++){
                        if(data[i].order[j].owner === req.params.id){
                            ArrayOrder.push({...data[i].order[j]})
                        }
                    }
                }
            }
            return res.status(200).json(ArrayOrder)
        })
        .catch(err=>res.status(409).json({'message': err}))
    },

    VerifyOrderPayment: (req, res)=>{  
        //authorization required
        Order.findOneAndUpdate({'_id': req.params.id}, {
            verify: true,
            statut: 'En cours de livraison',
            createdAt: Date.now()
        }, {new: true, returnDocument: 'after'})
        //envoyé un mail pour attester le paiement du client
        .then(async (found)=>{
            const isMailSended =  await sendMailCustomerTransaction(found.email, 'Paiement de votre commande', { message : 'Votre commande a été enregistré en raison de la validation de votre paiement. Merci pour votre confiance et à bientôt sur CamerShop.', name: found.name, title:  'Paiement reçu', picture: `https://lh3.googleusercontent.com/d/${found.picture?.split('_id').pop().split('.')[0]}`, code: found.code, date: Date.now()  })
            if(isMailSended){
                System.find({})
                .then(system=>{
                    if(system){
                        System.updateOne({}, {$inc: {'earn': found.amount * 0.25, soldedAmount: found.amount}})
                        .then(async()=>{
                            let ArrayOrder = found._doc.order
                            console.log(ArrayOrder)
                            for(let i = 0; i < ArrayOrder.length; i++){
                                await CATEGORIE.updateOne({'_id': ArrayOrder[i].idCategory, 'article': {$elemMatch: {'_id': ArrayOrder[i]._id}}}, 
                                    {$push: {
                                        comments : {
                                            '_id': ArrayOrder[i]._id
                                        }
                                    }}
                                )
                            }
                            return res.status(200).json({'message': 'Paiement vérifié'})
                        })
                        .catch(err=>res.status(409).json({'message': err}))
                    }else{
                        System.create({
                            earn: found.amount * 0.25,
                            soldedAmount: found.amount,
                            createdAt: Date.now()
                        }).then(async()=>{
                            let ArrayOrder = found._doc.order
                            console.log(ArrayOrder)
                            for(let i = 0; i < ArrayOrder.length; i++){
                                await CATEGORIE.updateOne({'_id': ArrayOrder[i].idCategory, 'article': {$elemMatch: {'_id': ArrayOrder[i]._id}}}, 
                                    {$push: {
                                        comments : {
                                            '_id': ArrayOrder[i]._id
                                        }
                                    }}
                                )
                            }
                            return res.status(200).json({'message': 'Paiement vérifié'})
                        })
                        .catch(err=>res.status(409).json({'message': err}))
                    }
                })
                .catch(err=>res.status(409).json({'message': err}))
            }else{
                console.log('Erreur lors de l\'envoi du mail de confirmation de paiement')
            }   
            
        })
        .catch(err=>res.status(409).json({'message': err}))
    },

    OrderDelivered: (req, res)=>{
        let message =(name)=> {
            return {
                title: 'Notification de vente',
                body: `Vous avez effectué une commande. Article: ${name}`,
                createdAt: Date.now()
            }
        } 
        Order.updateOne({'_id': req.params.id}, {
            statut: 'Livrée',
            createdAt: Date.now()
        })
        .then(()=>{
            Order.findOne({'_id': req.params.id})
            .then(async data=>{
                if(data){
                    let totalQuantity = 0
                    let totalEarn = 0
                    for(let i = 0; i < data.order.length; i++){
                        totalQuantity += data.order[i].quantity
                        let totalTemp = data.order[i].price * data.order[i].quantity
                        totalEarn += totalTemp
                        await User.updateOne({'_id': data.order[i].owner}, {$inc: {account: totalTemp, earnMark:  totalTemp, solded: data.order[i].quantity, availableAmount:  totalTemp - totalTemp * 0.25 }, 'message': message(data.order[i].name)})
                        .then(()=>{})
                        .catch(err=>res.status(409).json({'message': err}))
                    }
                    const user = await User.updateOne({'_id': data.customerId}, {$inc: {spent: data.amount + data.amount * 0.25, bought: totalQuantity }})
                    .then(()=>
                        System.find({}).then(()=>{
                            if(foundSystem){
                                System.updateOne({'_id': foundSystem[0]._id}, {earn: totalEarn  * 0.25, soldedAmount: totalEarn})
                                .catch(err=>res.status(409).json({'message': err}))
                            }else{
                                System.create({
                                    earn: found.amount * 0.25,
                                    soldedAmount: totalEarn,
                                    createdAt: Date.now()
                                }).catch(err=>res.status(409).json({'message': err}))
                            }
                        }).catch(err=>res.status(409).json({'message': err}))
                    ).catch(err=>res.status(409).json({'message': err}))

                    if(user){
                        const isMailSended =  await sendMailConfirmTransaction(user.email, 'Camershop Livraison', { message : 'Votre commande a été livrée avec succès. Merci pour votre confiance et à bientôt sur CamerShop.', name: user.name, title:  'Livraison confirmé', picture: `https://lh3.googleusercontent.com/d/${user.picture?.split('_id').pop().split('.')[0]}`, code: data.code, date: Date.now() })
                        if(isMailSended && isMailSendedtoProvider){
                           return res.status(200).json({'message':'Livraison confirmé'})
                        }else{
                            return res.status(409).json({'message': 'Erreur lors de l\'envoi du mail'})
                        }
                    }
                    //envoyé un mail pour signaler le vendeur
                    return res.status(200).json({'message': 'Commande livrée'})
                }else{
                    return res.status(409).json({'message': 'Commande introuvable'})
                }
            })
            .catch(err=>res.status(409).json({'message': err}))
        })
        .catch(err=>res.status(409).json({'message': err}))
    },

    CancelOrderAfterDay: (req, res)=>{
        //cancel after 2 days 
        Order.findOne({'customerId': req.params.id, 'statut': 'En attente'})
        .then(data=>{
            if(new Date(new Date(data.createdAt).getMilliseconds()).getMilliseconds() + (2 * 24 * 60 * 60 * 1000) < Date.now() && data.statut === 'En attente'){
                Order.updateMany({'customerId': req.params.id, 'statut': 'En attente'}, {
                    statut: 'Annulée'
                })
                //envoyé un mail pour l'annulation automatique 
                .then(()=>res.status(200).json({'message': 'Commande annulée'}))
                .catch(err=>res.status(409).json({'message': err}))
            }
        })
        .catch(err=>res.status(409).json({'message': err}))
    },

    CancelOrderByUser: (req, res)=>{

        let message = {
            title: 'Annulation de commande',
            body: `Votre commande a été annulée avec succès.`,
            createdAt: Date.now()
        }
        Order.findOne({'_id': req.params.id, 'customerId': req.params.customerId})
        .then(data=>{
            if(data.statut === 'En attente'){
                Order.updateOne({'_id': req.params.id, 'customerId': req.params.customerId, 'statut': 'En attente'}, {
                statut: 'Annulée'
                })
                .then(()=>{
                    User.updateOne({'_id': req.params.customerId}, {$push: {'message': message}})
                    .then(()=> res.status(200).json({'message': 'Commande annulée'}))
                    .catch(err=>res.status(409).json({'message': err}))
                })
                .catch(err=>res.status(409).json({'message': err}))
            }else if(data.statut === 'En cours de livraison'){
                return res.status(409).json({'message': 'La commande est en cours de livraison, vous ne pouvez plus l\'annuler'})
            }
        
        })
        .catch(err=>res.status(409).json({'message': err}))
        
    },

    DeleteCancelledOrderAfterDay: (req, res)=>{
        //delete after 5 days 
        Order.findOne({'customerId': req.params.id, 'statut': 'Annulée'})
        .then(data=>{
            if(new Date(data.createdAt).getMilliseconds() + (5 * 24 * 60 * 60 * 1000) < Date.now()){
                Order.deleteMany({'customerId': req.params.id, 'statut': 'Annulée'})
                .then(()=>res.status(200).json({'message': 'Commande supprimée'}))
                .catch(err=>res.status(409).json({'message': err}))
            }
        })
        .catch(err=>res.status(409).json({'message': err}))
    },

    DeleteOrderByUser : async(req, res)=>{
        const order = await Order.findOne({'_id': req.params.id, 'customerId': req.params.customerId})
        if(order.statut === 'En cours de livraison'){
            return res.status(409).json({'message': 'Vous ne pouvez pas supprimer cette commande'})
        }else{    
            Order.deleteOne({'_id': req.params.id, 'customerId': req.params.customerId, 'verify': 'false' })
            .then(()=> res.status(200).json({'message': 'Commande supprimée'}))
            .catch(err=>res.status(409).json({'message': err}))
        }

    },
    
    AdminDeleteOrder: (req, res)=>{
        Order.findOne({'_id': req.params.id}).then(data=>{
            if(data){
                if(data.statut === 'En cours de livraison'){
                    return res.status(409).json({'message': 'Vous ne pouvez pas supprimer cette commande'})
                }else{    
                    data.deleteOne({'_id': req.params.id, 'verify': 'false' })
                    .then(()=> {
                        User.updateOne({'_id': req.params.customerId}, {$push : {'message': 
                            {
                                title: 'Suppression',
                                body: `Votre commande a été supprimer en raison de inachévement.`,
                                createdAt: Date.now()
                            }
                        }})
                        .then(()=> res.status(200).json({'message': 'Commande Supprimmé'}))
                        .catch(err=>res.status(409).json({'message': err}))
                    })
                    .catch(err=>res.status(409).json({'message': err}))
                }
            }else{
                return res.status(404).json({'message': 'no found'})
            }
        })
       
        

    },





}
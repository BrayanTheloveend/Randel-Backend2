const { sendMailPayout } = require("../Middleware/SENDMAIL")
const { codeGenerator } = require("../Middleware/UTILS")
const PAYOUT = require("../Model/PAYOUT")
const USER = require("../Model/USER")

module.exports = {


    CreatePayout: (req, res)=>{
        USER.findOne({'_id': req.body.id, role: 'Vendeur'})
        .then(found=>{
            const generatedCode = codeGenerator(8)
            if(found){

                if(found.soldedAmount >= req.body.amount){
                    PAYOUT.create({
                        name: found._doc.name,
                        email: found._doc.email,
                        picture: found._doc.picture,
                        amount: found._doc.amount,
                        cni: found._doc.cni ?  found._doc.cni  : req.body.cni,
                        statut: 'En attente',
                        createdAt : Date.now(),
                        code: generatedCode,
                    }).then(()=>{
                        USER.updateOne({'_id': req.body.id}, {$inc : {soldedAmount: -req.body.amount}, amount: found.soldedAmount - req.body.amount })
                        .then(async()=>{
                            const isMailSended =  await sendMailPayout(req.body.email, 'Camershop Payout', { id: found._doc._id, message : 'Vous venez d\'initié une demande de Retrait depuis votre compte sur CamerShop.', name: found._doc.name, title:  'Demande de Retrait', picture: `https:lh3.googleusercontent.com/d/${found._doc.picture?.split('_id').pop().split('.')[0]}`, code: generatedCode, date: Date.now(), amount: req.body.amount })
                            //isMailSendedtoProvider
                            if(isMailSended){
                                return res.status(200).json({'message':'Livraison confirmé'})
                            }else{
                                return res.status(409).json({'message': 'Erreur lors de l\'envoi du mail'})
                            }
                        }).catch(err=> res.status(409).json({'message': err}))
                    })
                }else{
                    res.status(201).json({'message': 'Solde Insuffisant'})
                }

            }else{
                return res.status(404).json({'message': 'User not found'})
            }
        })
    },


    VerifyPayout: (req, res)=>{
        const {code, id} = req.params
        PAYOUT.findOne({'code': code, 'statut': 'En attente'})
        .then(found=>{
            if(found){
                PAYOUT.updateOne({'_id': found._doc._id}, {'statut': 'Verifiée'})
                .then(()=>{
                    USER.updateOne({'_id': id},{$push: {
                        message: {
                            title: 'Notification de vente',
                            body: `Retrait en cour de traitement. Montant: ${found._doc.amount}`,
                            createdAt: Date.now()
                        }
                    }}).then(()=> res.status(200).json({'message': 'Retrait verifié'}))
                    .catch(err=> res.status(409).json({'message': err}))
                })
            }else{
                return res.status(200).json({'message': 'Commande invalide ou deja Authentifié'})
            }
        })
        .catch(err=> res.status(409).json({'message': err}))
    },

    ApprovPayout: (req, res)=>{
        
    }

}
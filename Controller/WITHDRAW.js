const { sendMailWithAttachment } = require("../Middleware/SENDMAIL")
const USER = require("../Model/USER")
const WITHDRAW = require("../Model/WITHDRAW")






module.exports ={

    getWidthdrawRequest: (req, res)=>{
        WITHDRAW.find({})
        .then(data=> res.status(200).json(data))
        .catch(err=> res.status(409).json({'message': err}))
    },

    ApprovWithdraw: (req, res)=>{
        
        WITHDRAW.findOne({'_id': req.params.id, statut : 'En attente'})
        .then(data=> {
            const placeholer = {
                title: '',
                message: '',
                amount: data.amount
            }

            if(data){
                WITHDRAW.updateOne({'_id': req.params.id}, {'statut': 'Approved'})
                .then(()=> {

                    USER.updateOne({'_id': data.owner, account: { $gte: data.amount }}, {$inc : {'account': -data.amount}})
                    .then(async ()=>{
                        const isMailSended =  await sendMailWithAttachment(data.email, 'Retrait de fonds', placeholer)
                        if(isMailSended){
                            res.status(200).json({'message': 'Success Approved'})
                        }else{
                            res.status(409).json({'message': 'Erreur lors de l\'envoi du mail'})
                        } 
                    }).catch(err=> res.status(409).json({'message': err}))
                     
                })
                .catch(err=> res.status(409).json({'message': err}))
            }
        })
        .catch(err=> res.status(409).json({'message': err}))
    },

    DeleteApprovedAndCancelledWithdrawAfterDay : (req, res)=>{
        //if(data.createdAt + (2 * 24 * 60 * 60 * 1000) < Date.now() && data.statut === 'En attente'){
        WITHDRAW.find({})
        .then( async found=>{
            if(found.length !== 0){
                for (let index = 0; index < array.length; index++) {
                   if(new Date(found.createdAt).getMilliseconds() + (5 * 24 * 60 * 60 * 1000) < Date.now()){
                    await WITHDRAW.deleteOne({'statut': { $in:  ['Approuved', 'Refused']}})
                    .catch(err=> res.status(409).json({'message': err}))
                   }
                }
            }
        }).catch(err=> res.status(409).json({'message': err}))
        
    },


    getWithdrawRequestByIdOwner : (req, res)=>{
        WITHDRAW.find({'owner': req.params.id})
        .then(data=> res.status(200).json(data))
        .catch(err=> res.status(409).json({'message': err}))
    }



}
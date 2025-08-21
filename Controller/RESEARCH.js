const Research  = require('../Model/RESEARCHED')




module.exports = {
    CreateHistoryResearch: (req, res)=>{
        Research.findOne({'name': req.body.name}).
        then(found =>{
            if(!found){
                 Research.create({
                    name: req.body.name,
                    attachement: req.body.attachement,
                    createdAt: Date.now()
                }).then(()=>res.status(200).json({'message': 'Created'}))
                .catch(err=>res.status(409).json({'message': err}))
            }else{
                return res.status(401).json({'message': 'data already exist'})
            }
        })
        .catch(err=>res.status(409).json({'message': 'failed to fetch'}))
       
    },

    ListResearchHistory: (req, res)=>{
        Research.find({}).sort({ createdAt: -1 })
        .then(data=>res.status(200).json(data))
        .catch(err=>res.status(409).json({'message': err}))
    },

}
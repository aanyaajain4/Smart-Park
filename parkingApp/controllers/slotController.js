const models = require('../models');
const FastestValidator = require('fastest-validator');

function findById(req, res){
    const typeId = req.params.id;
    models.Slot.findByPk(req.params.id).then((result)=>{
        if(result != null){
            res.status(202).json({
                'id':result.id,
                'number':result.number,
                'typeId':result.typeId,
                'isActive':result.isActive,
                'isFree':result.isFree
            });
        }
        else{
            res.status(400).json({
                message:'No slot exists with the id '+ typeId
            }); 
        }

    }).catch((err)=>{
        res.status(500).json({
            message:'Could not look up the slot.',
            error:err
        });
    });
}

function activeCountByTypeId(req, res){
    const typeId = req.params.typeId;
    models.Slot.count({where:{typeId:typeId, isActive:true}}).then((result)=>{
        if(result != null){
            res.status(200).json({
                slots:result
            });
        }
        else{
            res.status(400).json({
                message:'No active slot exists for the id '+ typeId
            });
        }
    }).catch((err)=>{
            res.status(500).json({
                message: 'Could not find active slots.',
                error:err
            });
    });
}

function freeCountByTypeId(req, res){
    const typeId = req.params.typeId;
    models.Slot.count({where:{typeId:typeId, isActive:true, isFree:true}}).then((result)=>{
        if(result != null){
            res.status(200).json({
                slots:result
            });
        }
        else{
            res.status(400).json({
                message:'No active slot is free for typeId '+ typeId
            });
        }
    }).catch((err)=>{
            res.status(500).json({
                message: 'Could not find active free slots.',
                error:err
            });
    });
}

function reserve(req, res){
    const typeId = req.params.typeId;
    models.Slot.findOne({where:{typeId:typeId, isActive:true, isFree:true}}).then((dbResult)=>{
        if(dbResult != null){ 
            models.Slot.update({isFree:false}, {where:{id:dbResult.id}})
            .then((result)=>{
                if(result[0] != 0){
                    res.status(202).json({
                        message: 'Reserved a slot.',
                        number:dbResult.number
                    });
                }else{
                    res.status(409).json({
                        message: 'Could not reserve a parking slot.'
                    });
                }
            }).catch((err)=>{
                res.status(500).json({
                    message: 'Could not reserve a parking slot.',
                    error: err
                });
            });
        }
        else{
         res.status(404).json({
            message:'No active slot is free to reserve for typeId '+ typeId
         });
        }
     }).catch((err)=>{
         res.status(500).json({
             message: 'Could not reserve a parking slot.',
             error:err
         });
    });
}

function free(slotId){
    models.Slot.update({isFree:true}, {where:{id:slotId, isActive:true, isFree:false}})
    .then((result)=>{
        if(result[0] != 0){
            console.log('Freed the slot ' + slotId);
        }else{
            console.log('No occupied active slot found with id ' + result);
        }
    }).catch((err)=>{
        console.log('Could not free the parking slot.');
    });
}


module.exports.findById=findById;
module.exports.activeCountByTypeId=activeCountByTypeId;
module.exports.freeCountByTypeId=freeCountByTypeId;
module.exports.reserve=reserve;
module.exports.free=free;
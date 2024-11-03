const requireNew = require('require-new');
const config = require('config');
const FastestValidator = require('fastest-validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {Op} = require('sequelize');
const utils = requireNew('../utils/util.js');
const vehicleController = require('../controllers/vehicleController.js');
const slotController = require('../controllers/slotController.js');
const models = require('../models');

function book(req, res){
    // if(req.file == null){
    //     return res.status(400).json({
    //         message: 'Vehicle image missing.'
    //     });
    // }
    const vehicleObj = {
        typeId:req.body.typeId,
        regNum:req.body.regNum,
        // image:req.file.buffer.toString('base64')
    };
    const schema = {
        typeId:{type:"string", optional:false, numeric: true},
        regNum:{type:"string", optional:false, max:"100"}
    };
    const validator = new FastestValidator();
    const validationResult = validator.validate(vehicleObj, schema);
    if(validationResult != true){
        res.status(400).json({
            message: 'Input validation failed',
            error:validationResult
        });
    }
    else{ // data json validated
        models.Vehicle.findOne({where:{regNum:req.body.regNum}}).then((result)=>{
            if(result != null){
                res.status(409).json({
                    message: 'Vehicle already exists.'
                });
            }
            else{
                // Creating new vehicle.
                models.Vehicle.create(vehicleObj).then((vehResult)=>{
                    console.log('Vehicle record created for '+ vehResult.regNum);
                    // Vehicle record has been created. Now let's reserve a parking slot for the vehicle.
                    models.Slot.findOne({where:{typeId:vehicleObj.typeId, isActive:true, isFree:true}}).then((slotResult)=>{
                        if(slotResult != null){ 
                            // Got a free slot.. let's reserve it.
                            models.Slot.update({isFree:false}, {where:{id:slotResult.id}})
                            .then((result)=>{
                                if(result[0] != 0){
                                    console.log('Reserved a slot '+slotResult.number);
                                    // Now that, vehicle record has been creted and slot has been reserved.
                                    // Let's create a transaction record, opened by this user.
                                    const txnObj = {
                                        timeIn: new Date(),
                                        typeId: vehResult.typeId,
                                        vehicleId: vehResult.id,
                                        slotId: slotResult.id,
                                        bookedBy: req.params.tokenUserCode
                                    };
                                    models.Transaction.create(txnObj).then((txnResult)=>{
                                        res.status(202).json({
                                            message: 'Reserved a slot.',
                                            number:slotResult.number
                                        });
                                    }).catch((err)=>{
                                        // Could not create a transaction record. 
                                        // Delete the Vehicle record and free the parking slot.
                                        vehicleController.remove(vehResult.regNum);
                                        slotController.free(slotResult.number);
                                        console.log('Error while creating a transaction record.');
                                        res.status(500).json({
                                            message: 'Could not record a transaction.',
                                            error: err
                                        });
                                    });
                                }else{
                                    // Could not reserve a parking slot. Delete the Vehicle record.
                                    vehicleController.remove(vehResult.regNum);
                                    console.log('Failed to update the slot status isFree=false.');
                                    res.status(409).json({
                                        message: 'Could not reserve a parking slot.'
                                    });
                                }
                            }).catch((err)=>{
                                // Could not reserve a parking slot. Delete the Vehicle record.
                                vehicleController.remove(vehResult.regNum);
                                console.log('Error while reserving the slot.');
                                res.status(500).json({
                                    message: 'Could not reserve a parking slot.',
                                    error: err
                                });
                            });
                        }
                        else{
                         // No active slot is free. Delete the Vehicle record.
                         vehicleController.remove(vehResult.regNum);
                         console.log('No active slot is free to reserve for typeId '+ vehicleObj.typeId);
                         res.status(404).json({
                            message:'No active slot is free to reserve for typeId '+ vehicleObj.typeId
                         });
                        }
                     }).catch((err)=>{
                        // Could not reserve a parking slot. Delete the Vehicle record.
                        vehicleController.remove(vehResult.regNum);
                        console.log('Error while finding a free slot.');
                        res.status(500).json({
                             message: 'Could not reserve a parking slot.',
                             error:err
                        });
                    });
                }).catch((err)=>{
                    console.log('Error while creating a vehicle record.');
                    res.status(500).json({
                        message: 'Could not reserve a parking slot.',
                        error:err
                    });
                });
            }
        })
        .catch((err)=>{
            console.log('Error while finding the vehicle in existing vehicle records.');
            res.status(500).json({
                message: 'Could not create the vehicle record.',
                error:err
            });
        });
    }    
}
function payment(req, res){
    return archiveTransaction(req, res, config.get("ARCHIVAL_REASON.COMPLETE"));
}
function cancel(req, res){
    return archiveTransaction(req, res, config.get("ARCHIVAL_REASON.CANCELLED"));
}

function archiveTransaction(req, res, reason){
    /*
     * 1. Find the transaction for regNum
     * 2. Calculate charges
     * 3. Create ArchiveTransaction record for provided regNum, reason and the charges calculated
     * 4. Delete the transaction record 
     * 5. Delete the vehicle record for the regNum 
     * 6. Free the parking slot
     */
    
    //1. Find the transaction for regNum
    const regNum = req.params.regNum;
    models.Vehicle.findOne({where:{regNum:regNum}}).then((result)=>{
        if(result != null){
            models.Transaction.findOne({where:{vehicleId:result.id}}).then((txnResult)=>{
                if(txnResult != null){
                    // 2. Calculate charges
                    const timeIn = txnResult.timeIn;
                    const timeOut = new Date();
                    const typeId = result.typeId;
                    let charges = 0;
                    console.log('ARCHIVAL_REASON='+config.get("ARCHIVAL_REASON.COMPLETE"));
                    models.Type.findOne({where:{id:typeId}}).then((typeResult)=>{
                        if(result != null){
                            if(reason == config.get("ARCHIVAL_REASON.COMPLETE")){
                                const rate = typeResult.chargeRate;
                                const hrs = Math.ceil((timeOut - timeIn) / (1000 * 60 * 60));
                                console.log('timeIn='+timeIn+'  timeOut='+timeOut+'  rate='+rate+'  hrs='+hrs);
                                charges = rate * hrs;
                            }
                            // 3. Create ArchiveTransaction record
                            const archTxnObj = {
                                regNum: regNum,
                                typeId: typeId,
                                timeIn: timeIn,
                                timeOut: timeOut,
                                reason: reason,
                                charges: charges
                            };
                            models.ArchivedTransaction.create(archTxnObj).then((result)=>{
                                remove(txnResult.vehicleId);     // 4. Delete the transaction record
                                vehicleController.remove(regNum);     // 5. Delete the vehicle record
                                slotController.free(txnResult.slotId);   // 6. Free the parking slot

                                res.status(201).json({
                                    status:'success',
                                    message:'ArchivedTransaction record created.',
                                    result:result
                                });
                            }).catch((err)=>{
                                console.log('Error-TransactionController.archiveTransaction() : While creating the archTransaction record for regNum=' + regNum);
                                res.status(500).json({
                                    message: 'Could not create the ArchivedTransaction record.',
                                    error:err
                                });
                            });
                        }
                        else{
                            console.log('TransactionController.archiveTransaction() : No type found with id '+ typeId);
                            res.status(400).json({
                                message: 'No type found with id '+ typeId
                            }); 
                        }
                    }).catch((err)=>{
                        console.log('Error-TransactionController.archiveTransaction() : While finding charges for the type.');
                        res.status(500).json({
                            message:'Could not find the charges.',
                            error:err
                        });
                    });
                }
                else{
                    console.log('TransactionController.archiveTransaction() : No transaction found with regNum '+ regNum);
                    res.status(400).json({
                        message:'No transaction exists with vehicle regNum '+ regNum
                    }); 
                }
            }).catch((err)=>{
                console.log('Error-TransactionController.archiveTransaction() : while finding transaction for regNum '+ regNum);
                res.status(500).json({
                    message:'Could not find the trasaction.',
                    error:err
                });
            });
        }
        else{
            console.log('TransactionController.archiveTransaction() : No Vehicle exists with vehicle regNum '+ regNum);
            res.status(400).json({
                message:'No Vehicle exists with vehicle regNum '+ regNum
            }); 
        }
       })
       .catch((err)=>{
        console.log('Error-TransactionController.archiveTransaction() : while finding vehicle for regNum '+ regNum);
            res.status(500).json({
                message:'Could not find the vehicle.',
                error:err
            });
        });
}

function findById(req, res){
    const txnId = req.params.id;
    models.Transaction.findByPk(req.params.id).then((result)=>{
        if(result != null){
            res.status(202).json({
                'id':result.id,
                'typeId':result.typeId,
                'timeIn':result.timeIn,
                'vehicleId':result.vehicleId,
                'slotId':result.slotId,
                'bookedBy':result.bookedBy,
                'createdAt':result.createdAt
            })
        }
        else{
            res.status(400).json({
                message:'No transaction found with the id '+ txnId
            }); 
        }

    }).catch((err)=>{
        res.status(500).json({
            message:'Could not find the txnId.',
            error:err
        });
    });
}
function findByRegNum(req, res){
    const regNum = req.params.regNum;
    models.Vehicle.findOne({where:{regNum:regNum}}).then((result)=>{
        if(result != null){
            models.Transaction.findOne({where:{vehicleId:result.id}}).then((txnResult)=>{
                if(txnResult != null){
                   res.status(202).json({
                        'id':txnResult.id,
                        'typeId':result.typeId,
                        'timeIn':txnResult.timeIn,
                        'vehicleId':txnResult.vehicleId,
                        'slotId':txnResult.slotId,
                        'bookedBy':txnResult.bookedBy
                    });
                }
                else{
                    res.status(400).json({
                        message:'No transaction exists with vehicle regNum '+ regNum
                    }); 
                }
            }).catch((err)=>{
                res.status(500).json({
                    message:'Could not find the trasaction.',
                    error:err
                });
            });
        }
        else{
            res.status(400).json({
                message:'No Vehicle exists with vehicle regNum '+ regNum
            }); 
        }
       })
       .catch((err)=>{
            res.status(500).json({
                message:'Could not find the vehicle.',
                error:err
            });
        });
}
function remove(vehicleId){
    models.Transaction.destroy({where:{vehicleId:vehicleId}}).then((txnResult)=>{
        if(txnResult != 0){
            console.log('Deleted the transaction record with vehicleId '+ vehicleId);
         }
        else{
            console.log('TransactionController:remove Could not delete transaction record. No vehicle transaction exists with the vehicleId '+ vehicleId);
        }
    }).catch((err)=>{
        console.log('Error-TransactionController:remove While deleting the transaction record for vehicleId=' + vehicleId);
    });
}
function getAll(req,res){
    models.Transaction.findAll({where:{typeId:req.params.typeId}}).then((result)=>{
        if(result != null){
            res.status(200).json({
                transactions:result
            });
        }
        else{
            res.status(400).json({
                message:'No transaction found.'
            });
        }
    }).catch((err)=>{
            res.status(500).json({
                message: 'Could not find transactions.',
                error:err
            });
    });
}
function count(req, res){
    models.Transaction.count({where:{typeId:req.params.typeId}}).then((result)=>{
        if(result != 0){
            res.status(200).json({
                typeId:req.params.typeId,
                count:result
            });
        }
        else{
            res.status(400).json({
                message:'No transaction found of the typeId '+ req.params.typeId
            }); 
        }

    }).catch((err)=>{
        res.status(500).json({
            message:'could not count.',
            error:err
        });
    });
}
function countByFromTypeId(req,res){
    const from = req.params.from;
    const typeId = req.params.typeId;
    models.Transaction.findAll({
        where:{
            typeId:req.params.typeId,
            createdAt: {
                [Op.gte]: from
            }
        }}).then((result)=>{
        if(result != null){
            res.status(200).json({
                transactions:result
            });
        }
        else{
            res.status(400).json({
                message:'No transaction found.'
            });
        }
    }).catch((err)=>{
            res.status(500).json({
                message: 'Could not find transactions.',
                error:err
            });
    });
}

module.exports.book=book;
module.exports.payment=payment;
module.exports.cancel=cancel;
module.exports.findById=findById;
module.exports.findByRegNum=findByRegNum;
module.exports.getAll=getAll;
module.exports.remove=remove;
module.exports.count=count;
module.exports.countByFromTypeId=countByFromTypeId;
const requireNew = require('require-new');
const utils = requireNew('../utils/util.js');
const config = require('config');
const FastestValidator = require('fastest-validator');
const {Op} = require('sequelize');
const txnController = require('../controllers/transactionController.js');
const vehicleController = require('../controllers/vehicleController.js');
const slotController = require('../controllers/slotController.js');
const models = require('../models');

function create(req, res){
    //console.log(config.get("ARCHIVAL_REASON").COMPLETE)  O/P:COMPLETE
    const inputDataObj = {
        txnId:req.params.txnId,
        charges:req.body.charges,
        reason:req.body.reason,
    };
    const schema = {
        txnId:{type:"string", optional:false, numeric: true},
        charges:{type: "number", positive: true, integer: true},
        reason:{type:"string", optional:false, max:"100"}
    };
    const validator = new FastestValidator();
    const validationResult = validator.validate(inputDataObj, schema);
    // validation
    if(validationResult != true){
        res.status(400).json({
            message: 'Input validation failed',
            error:validationResult
        });
    }
    else{
        models.Transaction.findByPk(inputDataObj.txnId).then((txnResult)=>{
            if(txnResult != null){
                // Found the transaction. Let's archive it.
                models.Vehicle.findOne({where:{id:txnResult.vehicleId}}).then((vehResult)=>{
                    if(vehResult != null){
                        const archTxnObj = {
                            regNum:vehResult.regNum,
                            typeId:txnResult.typeId,
                            timeIn:txnResult.timeIn,
                            timeOut: new Date(),
                            reason:req.body.reason,
                            charges:req.body.charges,
                        };
                        models.ArchivedTransaction.create(archTxnObj).then((result)=>{
                            res.status(201).json({
                                message:'Created.',
                                archivedTransaction:result
                            });
                        }).catch((err)=>{
                            res.status(500).json({
                                message: '1Could not archive the transaction.',
                                error:err
                            });
                        });
                    }
                    else{
                        res.status(400).json({
                            message: 'No vehicle exists for the transaction id ' + inputDataObj.txnId
                        });
                    }
                }).
                catch((err)=>{
                    res.status(500).json({
                        message: '5Could not archive the transaction record.',
                        error:err
                    });
                });
            }
            else{
                res.status(400).json({
                    message: 'No vehicle exists for the transaction id ' + inputDataObj.txnId
                });
            }
        }).catch((err)=>{
            res.status(500).json({
                message: 'Could not archive the transaction record.',
                error:err
            });
        });
    }
}
function countByFromToTypeId(req,res){
    models.ArchivedTransaction.findAll({
        where:{
            typeId:req.params.typeId,
            createdAt: {
                [Op.gte]: req.params.from,
                [Op.lte]: req.params.to
            }
        }}).then((result)=>{
        if(result != null){
            res.status(200).json({
                archivedTransactions:result
            });
        }
        else{
            res.status(400).json({
                message:'No archived transaction found.'
            });
        }
    }).catch((err)=>{
            res.status(500).json({
                message: 'Could not find archived transactions.',
                error:err
            });
    });
}
function earningByFromToTypeId(req,res){
    models.ArchivedTransaction.findAll({
        where:{
            typeId:req.params.typeId,
            createdAt: {
                [Op.gte]: req.params.from,
                [Op.lte]: req.params.to
            }
        }}).then((result)=>{
            let total = 0;
            result.forEach( 
                (archTxn) => { 
                  total = total + archTxn.charges;
                }
              );

        if(result != null){
            res.status(200).json({
                earning:total
            });
        }
        else{
            res.status(400).json({
                message:'No archived transaction found.'
            });
        }
    }).catch((err)=>{
            res.status(500).json({
                message: 'Could not find archived transactions.',
                error:err
            });
    });
}
function totalEarningByFromTo(req,res){
    models.ArchivedTransaction.findAll({
        where:{
            createdAt: {
                [Op.gte]: req.params.from,
                [Op.lte]: req.params.to
            }
        }}).then((result)=>{
            let total = 0;
            result.forEach( 
                (archTxn) => { 
                  total = total + archTxn.charges;
                }
              );

        if(result != null){
            res.status(200).json({
                earning:total
            });
        }
        else{
            res.status(400).json({
                message:'No archived transaction found.'
            });
        }
    }).catch((err)=>{
            res.status(500).json({
                message: 'Could not find archived transactions.',
                error:err
            });
    });
}

module.exports.create=create;
module.exports.countByFromToTypeId=countByFromToTypeId;
module.exports.earningByFromToTypeId=earningByFromToTypeId;
module.exports.totalEarningByFromTo=totalEarningByFromTo;
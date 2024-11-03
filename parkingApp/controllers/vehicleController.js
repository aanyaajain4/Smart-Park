                        const models = require('../models');
const FastestValidator = require('fastest-validator');

function create(req, res){
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
                models.Vehicle.create(vehicleObj).then((result)=>{
                    res.status(201).json({
                        status:'success',
                        message:'Vehicle record created.',
                        result:result
                    });
                }).catch((err)=>{
                    res.status(500).json({
                        message: 'Could not create the vehicle record.',
                        error:err
                    });
                });
            }
        })
        .catch((err)=>{
                res.status(500).json({
                message: 'Could not create the vehicle record.',
                error:err
            });
        });
    }
}

function findById(req, res){
    const vehicleId = req.params.id;
    models.Vehicle.findByPk(req.params.id).then((result)=>{
        if(result != null){
            res.status(202).json({
                'id':result.id,
                'regNum':result.regNum,
                'typeId':result.typeId,
                'image':result.image
            })
        }
        else{
            res.status(400).json({
                message:'No vehicle found with the id '+ vehicleId
            }); 
        }

    }).catch((err)=>{
        res.status(500).json({
            message:'Could not find the vehicle.',
            error:err
        });
    });
}

function getAll(req,res){
    models.Vehicle.findAll({where:{typeId:req.params.typeId}}).then((result)=>{
        if(result != null){
            res.status(200).json({
                vehicels:result
            });
        }
        else{
            res.status(400).json({
                message:'No vehicle found.'
            });
        }
    }).catch((err)=>{
            res.status(500).json({
                message: 'Could not find vehicles.',
                error:err
            });
    });
}
function remove(regNum){
    models.Vehicle.destroy({where:{regNum:regNum}}).then((result)=>{
        if(result != 0){
            console.log('Deleted the vehicle record with regNum '+ regNum);
        }
        else{
            console.log('No vehicle record exists with the regNum '+ regNum);
        }
    }).catch((err)=>{
        console.log('could not delete vehicle record.');
        console.log(err)
    });
}

function count(req, res){
    models.Vehicle.count({where:{typeId:req.params.typeId}}).then((result)=>{
        if(result != 0){
            res.status(200).json({
                typeId:req.params.typeId,
                count:result
            });
        }
        else{
            res.status(400).json({
                message:'No vehicle found of the typeID '+ req.params.typeId
            }); 
        }

    }).catch((err)=>{
        res.status(500).json({
            message:'could not count.',
            error:err
        });
    });
}

module.exports.create=create;
module.exports.remove=remove;
module.exports.findById=findById;
module.exports.getAll=getAll;
module.exports.count=count;
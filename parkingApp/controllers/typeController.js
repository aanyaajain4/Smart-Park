const models = require('../models');
const config = require('config');
const FastestValidator = require('fastest-validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');


function findById(req, res){
    const typeId = req.params.id;
    models.Type.findByPk(req.params.id).then((result)=>{
        if(result != null){
            res.status(202).render('userProfile', {
                'typeId':result.id,
                'name':result.name,
                'chargeRate':result.chargeRate
            })
        }
        else{
            res.status(400).json({
                message:'No type exists with the id '+ typeId
            }); 
        }

    }).catch((err)=>{
        res.status(500).json({
            message:'Could not find the type.',
            error:err
        });
    });
}

function getAll(req,res){
    models.Type.findAll().then((result)=>{
        if(result != null){
            res.status(200).json({
                types:result
            });
        }
        else{
            res.status(400).json({
                message:'no type found'
            });
        }
    }).catch((err)=>{
            res.status(500).json({
                message: 'Could not find type.',
                error:err
            });
    });
}

module.exports.getAll=getAll;

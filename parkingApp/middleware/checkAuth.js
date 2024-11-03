const model = require('../models/');
const config = require('config');
const jwt = require('jsonwebtoken');
const {Op} = require('sequelize');

function checkAuth(req, res, next){
    try{
        const token = req.headers.authorization.split(" ")[1];              //Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey
        const verifyToken = jwt.verify(token, config.get("SECRET"));        // verify incoming token
        const currentDate = new Date();
        model.User.findOne({where:{
                code:verifyToken.code,
                token:token,
                expiresAt: {
                    [Op.gte]: currentDate
                }
            }}).then((dbResult)=>{
                if(dbResult != null){
                    req.params.tokenUserCode = verifyToken.code;
                    next();
                }
                else{
                    return res.status(401).json({
                        message:"Invalid or expired token.",
                    });
                }
            });
    }catch(err){
        return res.status(401).json({
            message:"Invalid or expired token.",
        });
    }
}

function checkAdminAuth(req, res, next){
    try{
        const token = req.headers.authorization.split(" ")[1];    //Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey
        const verifyToken = jwt.verify(token, config.get("SECRET"));
        const currentDate = new Date();
        model.User.findOne({where:{
            code:verifyToken.code,
            token:token,
            expiresAt: {
                [Op.gte]: currentDate
            }
        }}).then((dbResult)=>{
            if(dbResult != null){
                if(verifyToken.type == config.get("USER_TYPE").ADMIN){
                    req.params.tokenUserCode = verifyToken.code;
                    next();
                }
                else{ 
                    res.status(401).json({
                        message:"User NOT ADMIN"
                    });
                }
            }
            else{
                return res.status(401).json({
                    message:"Invalid or expired token.",
                });
            }
        });
    }catch(err){
        return res.status(401).json({
            message:"Invalid or expired token.",
            error:err
        });
    }   
}

function updateTokenLife(req, res, next){
    const code = req.params.tokenUserCode;
    const tokenLifeInMin = config.get('TOKEN_VALIDITY_MIN');
    const currentDate = new Date();
    const expiresAt = new Date(currentDate.getTime() + tokenLifeInMin * 60 * 1000);
    const userObj = {expiresAt:expiresAt};
    model.User.update(userObj, {
            where:{
                code:code, 
                isActive:true,
                expiresAt: {
                    [Op.gte]: currentDate
                }
            }})
        .then((result)=>{
            if(result[0] != 0){
                next();
            }else{
                return res.status(401).json({
                    message:"Invalid or expired token.",
                });
            }
        }).catch((err)=>{
            return res.status(500).json({
                message: 'Token life updation failed.',
                error: err
            });
        });
}

module.exports.checkAuth=checkAuth;
module.exports.checkAdminAuth=checkAdminAuth;
module.exports.updateTokenLife=updateTokenLife;
const models = require('../models');
const config = require('config');
const FastestValidator = require('fastest-validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

function signup(req, res){

    const userObj = {
        code:req.body.code,
        password:req.body.password,
        type:req.body.type,
        name:req.body.name,
        image:'',
        isActive:(req.body.isActive == "true")
    };
    const schema = {
        code:{type:"string", optional:false, max:"100"},
        password:{type:"string", optional:false, max:"100"},
        type:{type:"string", optional:false, max:"100"},
        name:{type:"string", optional:false, max:"100"},
        isActive:{type:"boolean", optional:false, defaultValue: true}
    };
    const validator = new FastestValidator();
    const validationResult = validator.validate(userObj, schema);
    if(validationResult != true){
        res.status(400).json({
            message: 'Input validation failed',
            error:validationResult
        });
    }
    else{ // data json validated
        const foundUser = models.User.findOne({where:{code:req.body.code}}).then((result)=>{
            if(result != null){
                res.status(409).json({
                    message: 'User already exists.'
                });
            }
            else{
                // Creating new user.
                bcryptjs.genSalt(10, function(err, salt){
                    const plainPassword = userObj.password;
                    bcryptjs.hash(plainPassword, salt, function(err, hash){
                        userObj.password = hash;
                        if(req.file != null){
                            userObj.image = req.file.buffer.toString('base64');
                        }
                        models.User.create(userObj).then((result)=>{
                            res.status(201).json({
                                message:'Created.',
                                user:result
                            });
                        }).catch((err)=>{
                            res.status(500).json({
                                message: 'Could not create the user.',
                                error:err
                            });
                        });
                    })
                });
            }
        })
        .catch((err)=>{
                res.status(500).json({
                message: 'Could not create the user.',
                error:err
                });
        });
    }
}

function login(req, res){
    const loginObj = {
        code:req.body.code,
        password:req.body.password
    };
    const schema = {
        code:{type:"string",optional:false,max:"100"},
        password:{type:"string",optional:false,max:"100"}
    };
    const validator = new FastestValidator();
    const validationResult = validator.validate(loginObj, schema);
    if(validationResult != true){
        res.status(400).json({
            message:'Input validation failed.',
            error:validationResult
        });
    }
    else{
        models.User.findOne({where:{code:loginObj.code, isActive:true}}).then((dbResult)=>{
            if(dbResult!=null){
                bcryptjs.compare(loginObj.password, dbResult.password, function(err,result){
                    if(result){
                        const token = jwt.sign({code:loginObj.code, type:dbResult.type}, config.get("SECRET"), function(err, token){
                            // update token and time in DB
                            const tokenLifeInMin = config.get('TOKEN_VALIDITY_MIN');
                            const expiresAt = new Date(new Date().getTime() + tokenLifeInMin * 60 * 1000);
                            const userObj = {token:token, expiresAt:expiresAt};
                            models.User.update(userObj, {where:{code:loginObj.code, isActive:true}})
                            .then((result)=>{
                                if(result[0] != 0){
                                    // If token inserted in DB then return it to persist at client
                                    res.status(200).json({
                                        message: 'Login_successful',
                                        jwtToken:token,
                                        type:dbResult.type
                                    });
                                }else{
                                    res.status(400).json({
                                        message: 'No active user found with the code '+ loginObj.code
                                    });
                                }
                            }).catch((err)=>{
                                return res.status(500).json({
                                    message: 'Login failed',
                                    error: err
                                });
                            });
                        });
                    }else{
                        res.status(400).json({
                            message: 'Credentials not valid.'
                        });
                    }
                });
            }else{
                res.status(400).json({
                    message: 'No active user found with the code '+ loginObj.code
                });
            }
        }).catch((err)=>{
            res.status(500).json({
                message:'Could not process login',
                error:err
            });
        });
    }
}

function findById(req, res){
    const userId = req.params.id;
    models.User.findByPk(req.params.id).then((result)=>{
        if(result != null){
            res.status(202).render('userProfile', {
                'userId':result.id,
                'code':result.code,
                'password':result.password,
                'type':result.type,
                'name':result.name,
                'isActive':result.isActive,
                'image':result.image
            })
        }
        else{
            res.status(400).json({
                message:'No user exists with the id '+ userId
            }); 
        }

    }).catch((err)=>{
        res.status(500).json({
            message:'Could not find the user.',
            error:err
        });
    });
}

function findByCode(req, res){
    const code = req.params.code;
    models.User.findOne({where:{code:code, isActive:true}}).then((result)=>{
        if(result != null){
            res.status(202).json( {
                'userId':result.id,
                'code':result.code,
                'password':result.password,
                'type':result.type,
                'name':result.name,
                'isActive':result.isActive,
                'token':result.token,
                'expiresAt':result.expiresAt,
                'image':result.image
            })
        }
        else{
            res.status(400).json({
                message:'No user exists with the code '+ code
            }); 
        }

    }).catch((err)=>{
        res.status(500).json({
            message:'Could not find the user.',
            error:err
        });
    });
}

function getAll(req,res){
    models.User.findAll().then((result)=>{
        if(result != null){
            res.status(200).json({
                users:result
            });
        }
        else{
            res.status(400).json({
                message:'no user'
            });
        }
    }).catch((err)=>{
            res.status(500).json({
                message: 'Could not find users.',
                error:err
            });
    });
}

function resetPassword(req,res){
    const details = {
        code:req.body.code,
        oldPassword:req.body.oldPassword,
        newPassword:req.body.newPassword
    };

    const schema = {
        code:{type:"string", optional:false, max:"100"},
        oldPassword:{type:"string", optional:false, max:"100"},
        newPassword:{type:"string", optional:false, max:"100"}
    };

    const validator = new FastestValidator();
    const validationResult = validator.validate(details,schema);
    if(validationResult != true){
        res.status(400).json({
            message: 'Input validation failed',
            error:validationResult
        });
    }
    else{
        if(req.params.tokenUserCode != details.code){
            return res.status(401).json({
                message:"Operation not allowed for different user"
            });
        }
        if(details.oldPassword == details.newPassword){
            return res.status(400).json({
                message:"New password must be different from the Old password."
            });
        }
        // encrypt the new password and update into table
        bcryptjs.genSalt(10, function(err,salt){
            bcryptjs.hash(details.newPassword, salt, function(err, hash){
                models.User.findOne({where:{code:details.code, isActive:true}}).then((dbResult)=>{
                   if(dbResult != null){ 
                    bcryptjs.compare(details.oldPassword, dbResult.password, function(err,result){
                        if(result){
                            const userObj = {password:hash};
                            models.User.update(userObj, {where:{code:details.code, password:dbResult.password}})
                            .then((result)=>{
                                if(result[0] != 0){
                                    res.status(202).json({
                                        message: 'reset done'
                                    });
                                }else{
                                    res.status(400).json({
                                        message: 'Credentials not valid.'
                                    });
                                }
                            }).catch((err)=>{
                                res.status(500).json({
                                    message: 'Reset failed',
                                    error: err
                                });
                            });
                        }
                        else{
                            res.status(401).json({
                                message: 'Old password does not match.'
                            });
                        }
                    });
                   }
                   else{
                    res.status(401).json({
                        message:'No active user found'
                    });
                   }
                }).catch((err)=>{
                    res.status(500).json({
                        message: 'Could not reset password.',
                        error:err
                    });
                });
            });
        });
    }
}

function deactivate(req, res){
    const code = req.params.code;

    if(req.params.tokenUserCode == code){
        return res.status(400).json({
            message:"Can not deactivate self"
        });
    }
    
    const updateObj = {
        isActive:false,
        token:'',
        expiresAt: new Date()
    };
    models.User.update(updateObj, {where:{code:code, isActive:true}})
    .then((result)=>{
        if(result[0] != 0){
            res.status(202).json({
                message: 'User deactivated with code ' + code
            });
        }else{
            res.status(400).json({
                message: 'No active user found with code ' + code
            });
        }
    }).catch((err)=>{
        res.status(500).json({
            message: 'Could not deactivate the user.',
            error: err
        });
    });
}

function activate(req, res){
    const code = req.params.code;

    if(req.params.tokenUserCode == code){
        return res.status(400).json({
            message:"Can not activate self"
        });
    }
    
    const updateObj = {
        isActive:true, 
        token:'',
        expiresAt: new Date()
    };
    models.User.update(updateObj, {where:{code:code, isActive:false}})
    .then((result)=>{
        if(result[0] != 0){
            res.status(202).json({
                message: 'User activated with code ' + code
            });
        }else{
            res.status(400).json({
                message: 'No user found with code ' + code
            });
        }
    }).catch((err)=>{
        res.status(500).json({
            message: 'Could not activate the user.',
            error: err
        });
    });
}

function logout(req, res){
    const code = req.params.tokenUserCode;
    const updateObj = {
        token:'',
        expiresAt: new Date()
    };
    models.User.update(updateObj, {where:{code:code, isActive:true}})
    .then((result)=>{
        if(result[0] != 0){
            res.status(202).render('loginpage', {'from':'logout', message: ''});
        }else{
            res.status(400).render('loginpage',{
                'from':'logout',
                message: 'No active user found with code ' + code
            });
        }
    }).catch((err)=>{
        res.status(500).render('loginpage',{
            'from':'logout',
            message: 'Could not successfully logout the user.',
            error: err
        });
    });
}

module.exports.signup=signup;
module.exports.findById=findById;
module.exports.findByCode=findByCode;
module.exports.resetPassword=resetPassword;
module.exports.login=login;
module.exports.getAll=getAll;
module.exports.deactivate=deactivate;
module.exports.logout=logout;
module.exports.activate=activate;
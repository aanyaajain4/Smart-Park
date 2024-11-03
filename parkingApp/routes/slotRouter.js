const slotController = require('../controllers/slotController.js');
const checkAuth = require('../middleware/checkAuth.js');
const imgaeUploader = require('../middleware/imageUpload.js');
const express = require('express');
const router = express.Router();

router.get('/id/:id', checkAuth.checkAuth, (req, res)=>{
    slotController.findById(req,res);
});
router.get('/activeCount/:typeId', checkAuth.checkAuth, (req, res)=>{
    slotController.activeCountByTypeId(req,res);
});
router.get('/freeCount/:typeId', checkAuth.checkAuth, (req, res)=>{
    slotController.freeCountByTypeId(req,res);
});

/*
router.get('/reserve/:typeId', checkAuth.checkAuth, (req, res)=>{
    slotController.reserve(req,res);
});
router.get('/free/:slotId', checkAuth.checkAuth, (req, res)=>{
    slotController.free(req.params.slotId);
});*/


module.exports=router;

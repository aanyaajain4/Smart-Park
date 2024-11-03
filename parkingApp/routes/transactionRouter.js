const txnController = require('../controllers/transactionController.js');
const checkAuth = require('../middleware/checkAuth.js');
const imgaeUploader = require('../middleware/imageUpload.js');
const express = require('express');
const router = express.Router();

router.post('/book', checkAuth.checkAuth, checkAuth.updateTokenLife, imgaeUploader.upload.single('image'), (req, res)=>{
    txnController.book(req, res); 
});
router.get('/payment/:regNum', checkAuth.checkAuth, checkAuth.updateTokenLife, imgaeUploader.upload.single('image'), (req, res)=>{
    txnController.payment(req, res); 
});
router.get('/cancel/:regNum', checkAuth.checkAuth, checkAuth.updateTokenLife, imgaeUploader.upload.single('image'), (req, res)=>{
    txnController.cancel(req, res); 
});
router.get('/id/:id', checkAuth.checkAuth, (req, res)=>{
    txnController.findById(req, res); 
});
router.get('/regNum/:regNum', checkAuth.checkAuth, (req, res)=>{
    txnController.findByRegNum(req, res); 
});
router.get('/typeId/:typeId', checkAuth.checkAuth, (req, res)=>{
    txnController.getAll(req, res); 
});
router.get('/count/typeId/:typeId', checkAuth.checkAuth, (req, res)=>{
    txnController.count(req, res); 
});
router.get('/count/from/:from/typeId/:typeId', checkAuth.checkAuth, (req, res)=>{
    txnController.countByFromTypeId(req, res); 
});

module.exports=router;

const vehicleController = require('../controllers/vehicleController.js');
const checkAuth = require('../middleware/checkAuth.js');
const imgaeUploader = require('../middleware/imageUpload.js');
const express = require('express');
const router = express.Router();


router.get('/:id', checkAuth.checkAuth, (req, res)=>{
    vehicleController.findById(req,res);
});
router.get('/typeId/:typeId', checkAuth.checkAuth, (req, res)=>{
    vehicleController.getAll(req,res);
});
router.get('/count/:typeId', checkAuth.checkAuth, (req, res)=>{
    vehicleController.count(req, res); 
});

router.post('/', checkAuth.checkAuth, imgaeUploader.upload.single('image'), (req, res)=>{
    vehicleController.create(req, res); 
});
router.delete('/:regNum', checkAuth.checkAuth, (req, res)=>{
    vehicleController.remove(req, res); 
});


module.exports=router;
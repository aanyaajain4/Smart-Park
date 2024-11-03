const userController = require('../controllers/userController.js');
const checkAuth = require('../middleware/checkAuth.js');
const imgaeUploader = require('../middleware/imageUpload.js');
const express = require('express');
const router = express.Router();

router.post('/create', checkAuth.checkAdminAuth, checkAuth.updateTokenLife, imgaeUploader.upload.single('image'), (req, res)=>{
    userController.signup(req, res); 
});
router.post('/login', (req, res)=>{

    userController.login(req,res);
});
router.get('/id/:id', checkAuth.checkAuth, (req, res)=>{
    userController.findById(req,res);
});
router.get('/code/:code', checkAuth.checkAuth, checkAuth.updateTokenLife, (req, res)=>{
    userController.findByCode(req,res);
});
router.get('/', checkAuth.checkAdminAuth, checkAuth.updateTokenLife, (req, res)=>{
    userController.getAll(req,res);
});
router.patch('/', checkAuth.checkAuth, checkAuth.updateTokenLife, (req, res)=>{
    userController.resetPassword(req,res);
})
router.put('/:code', checkAuth.checkAdminAuth, checkAuth.updateTokenLife, (req, res)=>{
    userController.deactivate(req, res); 
});
router.put('/active/:code', checkAuth.checkAdminAuth, checkAuth.updateTokenLife, (req, res)=>{
    userController.  activate(req, res); 
});
router.get('/logout', checkAuth.checkAuth, (req, res)=>{
    userController.logout(req,res);
});


module.exports=router;

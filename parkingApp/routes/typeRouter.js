const typeController = require('../controllers/typeController.js');
const checkAuth = require('../middleware/checkAuth.js');
const express = require('express');
const router = express.Router();

router.get('/', checkAuth.checkAuth, checkAuth.updateTokenLife, (req, res)=>{
    typeController.getAll(req,res);
});

module.exports=router;
const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) =>{
    if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg' || file.mimetype == 'image/png'){
        callback(null, true);
    }else{
        callback(new Error('Unsupported file types.', false));
    }
};

const upload = multer({
    storage:storage,
    fileFilter:fileFilter,
    limits:{
        fileSize:1024*1024*100
    }
});

module.exports.upload =upload;

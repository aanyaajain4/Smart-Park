const models = require('../models');
const FastestValidator = require('fastest-validator');



// creates a promise based function for a provided function. Param successCode is the response code for success. 
function promiseCreater(req, res, successCode, func){
    return new Promise(function(resolve, reject) {
        func(req, res); // acctual function call with req, res
        const defaultWrite = res.write;
        const defaultEnd = res.end;
        const chunks = [];
      
        res.write = (...restArgs) => {
          chunks.push(new Buffer(restArgs[0]));
          defaultWrite.apply(res, restArgs);
        };
      
        res.end = (...restArgs) => {
            if (restArgs[0]) {
                chunks.push(new Buffer(restArgs[0]));
            }
            const body = Buffer.concat(chunks).toString('utf8');
            defaultEnd.apply(res, restArgs);
            //console.log('res.statusCode='+res.statusCode);
          
            if(res.statusCode == successCode){
                resolve(body);
            }
            else{
                reject("Error while creating promise."); 
            }
        };
    });
}


module.exports.promiseCreater=promiseCreater;


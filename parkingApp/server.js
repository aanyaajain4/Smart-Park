const config = require('config');
const path = require('path');
const express = require('express');
const app = express();
const logo = require('./startupLogo.js');

const mode = process.env.NODE_ENV || 'development';
const port = config.get("PORT");


app.listen(port);
app.set('view engine', 'ejs');

logo.displayStatupLogo();                            // prints logo at startup console
console.log('Started in '+mode+ ' mode at port ' +port+ '.\n\n');

// middleware functions
app.use((req, res, next)=>{                          // to log request url
    console.log(req.originalUrl);
    next();
});                                                  

app.use(express.static('public'));                   // to match the url of html page from public folder 
app.use(express.urlencoded( {extended:true} ));      // to access req body in case being called from form
app.use(express.json());                             // to access req body in case being called from json

// import routers
const userRouter = require('./routes/userRouter.js');
app.use('/users', userRouter);
const typeRouter = require('./routes/typeRouter.js');
app.use('/types', typeRouter);
const vehicleRouter = require('./routes/vehicleRouter.js');
app.use('/vehicles', vehicleRouter);
const slotRouter = require('./routes/slotRouter.js');
app.use('/slots', slotRouter);
const txnRouter = require('./routes/transactionRouter.js');
app.use('/txn', txnRouter);
const archtxnRouter = require('./routes/archiveTransactionRouter.js');
app.use('/archtxn', archtxnRouter);
const path = require("path");
const express = require("express");
require("./db");
const app = express();
const dotenv = require("dotenv");
const routes = require('./routes/stores'); 
const cors = require("cors"); 
const expressSanitize = require('express-mongo-sanitize');

//load env vars
dotenv.config({ path: "./config/config.env" });

/************** Middlewares ****************/
app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({ extended: true })); 
app.use(expressSanitize());

let corsOptions = {
  origin: '*',
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));



/************** Routes ****************/
app.use('/' ,routes); /*** Application Route ***/ 

// Handle invalid routes
app.all('*', (req, res, next) => {
    res.status(404).send({ message: 'Invalid Route' });
  });

/*** Listen to Port ***/
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
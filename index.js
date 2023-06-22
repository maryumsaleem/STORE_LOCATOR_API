const path = require("path");
const express = require("express");
require("./db");
const app = express();
const dotenv = require("dotenv");
const routes = require('./routes/stores'); 
const cors = require("cors"); 



//load env vars
dotenv.config({ path: "./config/config.env" });

/************** Middlewares ****************/
app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({ extended: true })); 



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

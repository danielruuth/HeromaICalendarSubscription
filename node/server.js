const https = require("https");
const fs = request("fs");
const moment = require("moment");
const auth = require("auth")
const schedule = require("calendar")
moment().format(); 

// Import the express module
const express = require("express");

// Instantiate an Express application
const app = express();

// Create a NodeJS HTTPS listener on port 4000 that points to the Express app
https
  .createServer(app)
  .listen(4000, ()=>{
    console.log('ical server is runing at port 4000')
  });

app.get('/', (req,res)=>{
    res.send("Hello from express server.")
})

app.get('/ical/:user/:password/:months', (req, res) =>{
  
  try{
    const {token, verificationToken} = await auth(req.params.user, req.params.password);
    const calendarData = schedule(verificationToken, token, req.params.months)
    
    res.setHeader('Content-Type', 'text/calendar');
    res.send(calendarData);
   }catch(erro){
    console.error(erro)
     res.status(500).res('Error');
   }
})

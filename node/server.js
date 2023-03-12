const https = require("https");
const fs = request("fs");
const moment = require("moment");
const auth = require("auth")
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
  
  const {token, verificationToken} = await auth(req.params.user, req.params.password);
  
  const now = moment();
  const end = moment().add(months, 'months');
  
  const postData = JSON.stringify({
    StartString: now.format('YYYY-MM-DD'), //YYYY-mm-dd
    StopString: end.format('YYYY-MM-DD'), //YYYY-mm-dd
    ShowWork: true,
    ShowAbs: true,
    ShowApp: true,
    ShowTCall: true,
    ShowTaskWeekComments: true,
    ShowTaskWeekStaffComments: true,
    ShowWeekStaff: true,
    __RequestVerificationToken: verificationToken //This should be VerificationToken from cookie
  });
  
  const options = {
    hostname: 'https://heroma.vgregion.se',
    path: '/Webbklient/api/APCalendarApi/getCalendarFile',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Cookie': token, //This should be the cookie token from loggin
    },
  };
  const request = http.request(options, (response) => {
    response.setEncoding('utf8');

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      console.log(data); //This should be served as an ics file
    });
  });

  // Log errors if any occur
  request.on('error', (error) => {
    console.error(error);
  });

  // End the request
  request.write(postData)
  request.end();
})

const https = require("https");
const fs = request("fs");
const moment = require("moment");
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

const auth = async function(username, password){
  const authURL = 'https://heroma.vgregion.se/Webbklient/Account/Login';
  
  /*
  driver.FindElement(By.XPath("//input[@id='Username']")).SendKeys(username);
            driver.FindElement(By.XPath("//input[@id='Password']")).SendKeys(password);
            
            driver.FindElement(By.XPath("//button[@type='submit']")).Click();

            string verificationToken = driver.FindElement(By.XPath("//input[@name='__RequestVerificationToken']")).GetAttribute("value");
            var cookies = driver.Manage().Cookies.AllCookies;

            driver.Close();
            driver.Dispose();
            driver.Quit();
            string token = "";
            foreach(var cookie in cookies)
            {
                token += $"{cookie.Name}={cookie.Value}; ";
            }

            if (!token.Contains("AspNetWebClientCookie_heroma.vgregion.se"))
                throw new Exception("Unsuccessful login");
            else
                log.LogInformation("Succesfully retrieved tokens!");

            return new CookieModel
            {
                Token = token,
                VerificationToken = verificationToken
            };
  */
}

app.get('/ical/:user/:password/:months', (req, res) =>{
  
  const auth = authenticate(req.params.user, req.params.password)
  
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
    __RequestVerificationToken: auth.VerificationToken //This should be VerificationToken from cookie
  });
  
  const options = {
    hostname: 'https://heroma.vgregion.se',
    path: '/Webbklient/api/APCalendarApi/getCalendarFile',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Cookie': auth.cookie, //This should be the cookie token from loggin
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

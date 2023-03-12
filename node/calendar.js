const puppeteer = require('puppeteer');

const Schedule = function(verificationToken, token, months){
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
  
  // Create browser instance, and give it a first tab
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on('request', interceptedRequest => {
    var data = {
      'method': 'POST',
      'postData': postData,
      'headers':options.headers
    };

    // Request modified... finish sending! 
    interceptedRequest.continue(data);
  });

  const response = await page.goto(options.hostname + options.path);     
  const responseBody = await response.text(); //This should be ics data
  console.log(responseBody);

  // Close the browser - done! 
  await browser.close();
  return responseBody
}

module.exports = Schedule

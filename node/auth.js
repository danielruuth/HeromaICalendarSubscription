const puppeteer = require('puppeteer');


const auth = async function(username, password){
  const authURL = 'https://heroma.vgregion.se/Webbklient/Account/Login';
  const browser = await puppeteer.launch({
      headless: false
  });
  const page = await browser.newPage();
  await page.goto(authURL);
  
  await page.type('#Username', username);
  await page.type('#Password', password);
  await page.click('input[name=LoginType]');
  await page.waitForTimeout(5000); // wait for 5 seconds
  let currentCookies = await page._client.send("Network.getAllCookies");
  
  let tokenString = "";
  currentCookies.forEach((cookie)=>{
    token += `${cookie.Name}=${cookie.Value};`;
  })
  if (!token.includes("AspNetWebClientCookie_heroma.vgregion.se")){
    throw Error('Unsuccessfull login')
  }else{
      console.log("Succesfully retrieved tokens!");
  }
  
  //Get the VerificationToken from the page
  const verificationToken = await page.$eval('input[name=__RequestVerificationToken]', element => element.value);
  
  await browser.close();
  
  return {verificationToken, token}
}

module.exports = auth;

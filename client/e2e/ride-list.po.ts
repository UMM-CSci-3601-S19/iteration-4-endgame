import {browser, element, by, promise, ElementFinder, protractor} from 'protractor';
import {Key} from 'selenium-webdriver';

let fs = require('fs');
let secretObject;

export class RidePage {

  get_access_token_using_saved_refresh_token(): void {

    /////////////////////////////////////////////////////////////////////////////////
    // from the oauth playground
    const refresh_token = null; //add a fxn to extract from file

    // from the API console
    const client_id = null; // use existing fxnlty to get this stuff
    const client_secret = null;// same thing

    const refresh_url = "https://www.googleapis.com/oauth2/v4/token";

    const post_body = `grant_type=refresh_token&client_id=${
      encodeURIComponent(client_id)}&client_secret=${
      encodeURIComponent(client_secret)}&refresh_token=${
      encodeURIComponent(refresh_token)}`;

    let refresh_request = {
      body: post_body,
      method: "POST",
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };

    // post to the refresh endpoint, parse the json response and use the
    // access token to call files.list
    fetch(refresh_url, refresh_request).then( response => {
      return(response.json());
    }).then( response_json =>  {
      console.log(response_json);
      console.log("Above is response, below is .acces_token");
      console.log(response_json.access_token);
    });

  }

  navigateTo(): promise.Promise<any> {
    fs.readFile('./e2e/googleSecrets.json', function read(err, data) {
      if (err) {
        throw err;
    }
    secretObject = data;
      let secretJSON = JSON.parse( secretObject.toString() );
      let refresh_token = secretJSON['refresh_token'];
      let client_id = secretJSON['client_id'];
      let client_secret = secretJSON['client_secret'];
      console.log("refresh_token = " + refresh_token);
      console.log("client_id = " + client_id);
      console.log("client_secret = " + client_secret);
    });
    return browser.get('/rides');
  };
  //////////////////////////////////////////////////////////////////////////////////////////////



  highlightElement(byObject) {
    function setStyle(element, style) {
      const previous = element.getAttribute('style');
      element.setAttribute('style', style);
      setTimeout(() => {
        element.setAttribute('style', previous);
      }, 200);
      return 'highlighted';
    }

    return browser.executeScript(setStyle, element(byObject).getWebElement(), 'color: red; background-color: yellow;');
  }

  getElementById(id: string) {
    return element(by.id(id));
  }

  getTitle(){
    const title = element(by.id('ride-list-title')).getText();
    this.highlightElement(by.id('ride-list-title'));

    return title;
  }

  typeADestination(destination: string) {
    const input = element(by.id('rideDestination'));
    input.click();
    input.sendKeys(destination);
  }

  backspace() {
    browser.actions().sendKeys(Key.BACK_SPACE).perform();
  }

  getUniqueRide(id: string) {
    const ride = element(by.id(id)).getText();
    this.highlightElement(by.id(id));
    return ride;
  }

  getRideByDestination(destination: string) {
    const ride = element(by.id(destination)).getText();
    this.highlightElement(by.id(destination));
    return ride;
  }

  elementExistsWithId(idOfElement: string): promise.Promise<boolean> {
    if (element(by.id(idOfElement)).isPresent()) {
      this.highlightElement(by.id(idOfElement));
    }
    return element(by.id(idOfElement)).isPresent();
  }

  elementExistsWithCss(cssOfElement: string): promise.Promise<boolean> {
    return element(by.css(cssOfElement)).isPresent();
  }

  elementExistsWithClass(classOfElement: string): promise.Promise<boolean> {
    return element(by.className(classOfElement)).isPresent();
  }

  click(idOfButton: string): promise.Promise<void> {
    this.highlightElement(by.id(idOfButton));
    return element(by.id(idOfButton)).click();
  }

  field(idOfField: string) {
    return element(by.id(idOfField));
  }

  button(idOfButton: string) {
    this.highlightElement(by.id(idOfButton));
    return element(by.id(idOfButton));
  }

  selectDropdown(targetField: string) {
    return element(by.css(targetField)).click();
  }

  selectDownKey() {
    browser.actions().sendKeys(Key.ARROW_DOWN).perform();
  }

  selectEnterKey() {
    browser.actions().sendKeys(Key.ENTER).perform();
  }

  selectTabKey() {
    browser.actions().sendKeys(Key.TAB).perform();
  }

  getTextFromField(idOfField: string) {
    this.highlightElement(by.id(idOfField));
    return element(by.id(idOfField)).getText();
  }

  slowTime(ms: number) {
    return browser.sleep(ms);
  }

}

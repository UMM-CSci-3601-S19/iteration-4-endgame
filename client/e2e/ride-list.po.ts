import {browser, element, by, promise, ElementFinder, protractor} from 'protractor';
import {Key} from 'selenium-webdriver';

let fs = require('fs');
let secretObject;

let username = '';
let password = '';

export class RidePage {

  get_username_and_password(): void {

    fs.readFile('./e2e/googleSecrets.json', function read(err, data) {
      if (err) {
        throw err;
      }

      secretObject = data;
      let secretJSON = JSON.parse( secretObject.toString() );
      username = secretJSON['username'];
      password = secretJSON['password'];
      console.log("username = " + username);
      console.log("password = " + password);
    });

  }

  logIn(): void {
    this.get_username_and_password();
    // Get to home page
    browser.get('/');
    // Click on Sign In button
    element(by.id("signIn")).click();
    // handlesPromise is getting all the windows that are open
    let handlesPromise = browser.driver.getAllWindowHandles();
    handlesPromise.then(function(handles){
      // We switch to the sign in window
      let signInHandle = handles[1];
      browser.driver.switchTo().window(signInHandle);
      browser.waitForAngularEnabled(false);
      element(by.id("identifierId")).sendKeys(username);
      browser.actions().sendKeys(Key.ENTER).perform();
      //element(by.id("identifierNext")).click();
      element(by.name("password")).sendKeys(password);
      browser.actions().sendKeys(Key.ENTER).perform();
      //element(by.id("passwordNext")).click();
      // We switch back to the first window
      browser.driver.switchTo().window(handles[0]);
    })
  };

  navigateTo(): promise.Promise<any> {
    return browser.get('/rides');
  };


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

import {browser, element, by, promise, ElementFinder, protractor} from 'protractor';
import {Key} from 'selenium-webdriver';

export class RidePage {
  navigateTo(): promise.Promise<any> {
    const input = element(by.id('signIn'));
    input.click();
    return browser.get('/rides');
  }

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

import {browser, element, by, promise, ElementFinder, protractor} from 'protractor';
import {Key} from 'selenium-webdriver';

export class UserPage {
  navigateTo(): promise.Promise<any> {
    return browser.get('/rides/users/5cb8bee01faacab569eac688');
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

  getPageElement() {
    const title = element(by.id('user-list-title')).getText();
    this.highlightElement(by.id('user-list-title'));

    return title;
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

  slowTime(ms: number) {
    return browser.sleep(ms);
  }

  getUniqueUser(name: string) {
    const ride = element(by.id(name)).getText();
    this.highlightElement(by.id(name));
    return ride;
  }

  elementExistsWithCss(cssOfElement: string): promise.Promise<boolean> {
    return element(by.css(cssOfElement)).isPresent();
  }

  elementExistsWithId(idOfElement: string): promise.Promise<boolean> {
    if (element(by.id(idOfElement)).isPresent()) {
      this.highlightElement(by.id(idOfElement));
    }
    return element(by.id(idOfElement)).isPresent();
  }

  click(idOfButton: string): promise.Promise<void> {
    this.highlightElement(by.id(idOfButton));
    return element(by.id(idOfButton)).click();
  }

  getTextFromField(idOfField: string) {
    this.highlightElement(by.id(idOfField));
    return element(by.id(idOfField)).getText();
  }

  getBio() {
    const profile = element(by.id('nameBox')).getText();
    this.highlightElement(by.id('nameBox'));
    return profile;
  }

  getPhoneNumber() {
    const profile = element(by.id('contactInfoBox')).getText();
    this.highlightElement(by.id('contactInfoBox'));
    return profile;
  }

}

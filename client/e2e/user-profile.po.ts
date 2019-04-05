import {browser, element, by, promise, ElementFinder, protractor} from 'protractor';
import {Key} from 'selenium-webdriver';

export class UserPage {
  navigateTo(): promise.Promise<any> {
    return browser.get('/users');
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
    return protractor.promise.delayed(ms);
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

}

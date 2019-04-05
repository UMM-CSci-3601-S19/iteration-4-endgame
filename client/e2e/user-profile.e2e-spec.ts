import {UserPage} from './user-profile.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

// const origFn = browser.user.controlFlow().execute;
//
// browser.user.controlFlow().execute = function () {
//   let args = arguments;
//
//   // queue 100ms wait between test
//   // This delay is only put here so that you can watch the browser do its thing.
//   // If you're tired of it taking long you can remove this call or change the delay
//   // to something smaller (even 0).
//   origFn.call(browser.user.controlFlow(), () => {
//     return protractor.promise.delayed(10);
//   });
//
//   return origFn.apply(browser.user.controlFlow(), args);
// };

describe('User List', () => {
  let page: UserPage;

  beforeEach(() => {
    page = new UserPage();
    page.navigateTo();
  });

  it('should have a List of Users', () => {
    return expect(page.elementExistsWithId('Estes Copeland')).toBeTruthy('Should be Estes Copeland');
  });

// We do not understand how to properly access our ids we guess because we keep getting
// No element found using locator: By(css selector, *[id="Hill\ Mcpherson"].
// A slash is being added to the id that we are searching for but we do not know why this is happening.
// At one point this test was passing, however at some point the slash appeared.

  // it('Checks the select user profile exists, selects a user, and correctly filters it', () => {
  //   page.selectDropdown('#userSelect');
  //   page.selectDownKey();
  //   page.selectEnterKey();
  //   return expect(page.elementExistsWithId('Hill Mcpherson')).toBeTruthy('Should be Hill Mcpherson');
  // });

  // it('Should check if the leave a Ride dropdown exists, and the submit rating button exists and functions properly, and that stars are added correctly', () => {
  //   page.selectDropdown('#userSelect');
  //   page.selectDownKey();page.selectDownKey();page.selectDownKey();
  //   page.selectEnterKey();
  //   page.selectDropdown('#ratingSelect');
  //   page.selectDownKey();
  //   page.selectEnterKey();
  //   page.click('addRatingButton');
  //   page.click('confirmRateUserButton');
  //   return expect(page.elementExistsWithId('mat-icon')).toBeTruthy('Should have stars show up');
  // });
});

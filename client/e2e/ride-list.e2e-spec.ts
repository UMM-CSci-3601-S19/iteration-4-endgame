import {RidePage} from './ride-list.po';
import {browser, protractor, element, by} from 'protractor';
import {By, Key, until, WebDriver} from 'selenium-webdriver';
import {RideListComponent} from "../src/app/rides/ride-list.component";
import {AuthService} from "../src/app/auth.service";

const origFn = browser.driver.controlFlow().execute;

browser.driver.controlFlow().execute = function () {
  let args = arguments;
  origFn.call(browser.driver.controlFlow(), () => {
    return protractor.promise.delayed(300);
  });
  return origFn.apply(browser.driver.controlFlow(),args);
};

describe('Ride List', () => {
  let page: RidePage;

  beforeAll(() => {
    page = new RidePage();
    page.logIn();
    element(by.id("MoRide")).click();
    element(by.id("menuButton")).click();
    browser.driver.sleep(1000);
  });

  // beforeEach(()=> {
  //
  // });

  it('should have a Rides title', () => {
    element(by.id("navRides")).click();
    return expect(page.getTitle()).toEqual('Available Listings');
    browser.driver.sleep(1000);
  });


  it('should type something in Filter by Destination box and check that it returned correct element', () => {
    page.typeADestination('dul');
    let exp1 = expect(page.getUniqueRide('1234567890abcdeffedcba09')).toMatch('Union Street.*');
    page.backspace();page.backspace();page.backspace();
    page.typeADestination('Alexandria');
    let exp2 = expect(page.getUniqueRide('0987654321fedcbaabcdef90')).toMatch('Ryder Street.*');
    var i;
    for (i=0; i < 10; i++) {
      page.backspace();
    }
    return exp1 && exp2;
  });

  it('Should have an add ride button', () => {
    return expect(page.elementExistsWithId('addNewRide')).toBeTruthy();
  });

  it('Should open a dialog box when add ride button is clicked', () => {
    let exp1 = expect(page.elementExistsWithCss('add-ride')).toBeFalsy('There should not be a modal window yet');
    page.click('addNewRide');
    let exp2 = expect(page.elementExistsWithCss('add-ride')).toBeTruthy('There should be a modal window now');
    return exp1 && exp2;
  });

  describe('Add Ride', () => {

    it('Should actually add the ride with the information we put in the fields', () => {
      page.field('destinationField').sendKeys('New York');
      page.slowTime(1000);

      page.field('dateField').sendKeys('5/31/2025');
      page.slowTime(500);
      page.field('timeField').sendKeys('1250PM');
      page.slowTime(500);

      page.field('originField').sendKeys('Morris');
      page.slowTime(500);
      page.field('mpgField').sendKeys('40');
      page.slowTime(500);
      page.field('notesField').sendKeys('I do not pick up my trash');
      page.slowTime(500);
      page.click('roundTripCheckBox');
      page.slowTime(500);
      let exp1 = expect(page.button('confirmAddRideButton').isEnabled()).toBe(true);
      page.click('confirmAddRideButton');

      const new_york_element = element(by.id('New York'));
      browser.wait(protractor.ExpectedConditions.presenceOf(new_york_element), 10000);

      let exp2 = expect(page.getRideByDestination('New York')).toMatch('New York.*');
      return exp1 && exp2;
    });

    describe('Add Ride (Validation)', () => {

      beforeEach(()=> {
        page.click('addNewRide');
      });

      afterEach(() => {
        page.click('exitWithoutAddingButton');
      });

      it('Should allow us to put information into the fields of the add ride dialog', () => {

        let exp2 = expect(page.field('notesField').isPresent()).toBeTruthy('There should be a notes field');
        page.field('notesField').sendKeys('Test Notes');
        let exp3 = expect(page.field('originField').isPresent()).toBeTruthy('There should be an origin field');
        page.field('originField').sendKeys('Pickup Location');
        let exp4 = expect(page.field('destinationField').isPresent()).toBeTruthy('There should be a destination field');
        page.field('destinationField').sendKeys('Dropoff Location');

        let exp6 = expect(page.field('dateField').isPresent()).toBeTruthy('There should be a date field');
        page.field('dateField').sendKeys('5/31/2019');
        let exp7 = expect(page.field('timeField').isPresent()).toBeTruthy('A time field should exist');
        page.click('timeField');
        page.field('timeField').sendKeys('1203PM');

        let exp5 = expect(page.field('mpgField').isPresent()).toBeTruthy('MPG must be a number');
        page.field('mpgField').sendKeys('20');
        return exp2 && exp3 && exp4 && exp6 && exp7 && exp5;
      });


      it('Should show the validation error message about origin format', () => {
        let exp1 = expect(element(by.id('originField')).isPresent()).toBeTruthy('There should be a origin field');
        page.field('originField').sendKeys('#@$@$#');
        let exp2 = expect(page.button('confirmAddRideButton').isEnabled()).toBe(false);
        //clicking somewhere else will make the error appear
        page.field('destinationField').click();
        let exp3 = expect(page.getTextFromField('origin-error')).toBe('Origin contains an unaccepted character');
        return exp1 && exp2 && exp3;
      });

      it('Should show the validation error message about the format of destination', () => {
        let exp1 = expect(element(by.id('destinationField')).isPresent()).toBeTruthy('There should be a destination field');
        page.field('destinationField').sendKeys('@$@$');
        let exp2 = expect(page.button('confirmAddRideButton').isEnabled()).toBe(false);
        page.field('mpgField').click();
        let exp3 = expect(page.getTextFromField('destination-error')).toBe('Destination contains an unaccepted character');
        return exp1 && exp2 && exp3;
      });

      it('Should show the validation error message about the format of Date field', () => {
        let exp1 = expect(element(by.id('dateField')).isPresent()).toBeTruthy('There should be a date field');
        page.field('dateField').sendKeys('5/03/2017');
        let exp2 = expect(page.button('confirmAddRideButton').isEnabled()).toBe(false);
        page.field('mpgField').click();
        let exp3 = expect(page.getTextFromField('departureDate-error')).toBe('Date of departure cannot have already occurred');
        return exp1 && exp2 && exp3;
      });

      it('Should show the validation error message about the format of mpg', () => {
        let exp1 = expect(element(by.id('mpgField')).isPresent()).toBeTruthy('MPG must be a number');
        page.field('mpgField').sendKeys('A');
        let exp2 = expect(page.button('confirmAddRideButton').isEnabled()).toBe(false);
        page.field('notesField').click();
        let exp3 = expect(page.getTextFromField('mpg-error')).toBe('MPG must be a number');
        return exp1 && exp2 && exp3;
      });

      it('Should show the validation error message about the format of notes', () => {
        let exp1 = expect(element(by.id('notesField')).isPresent()).toBeTruthy('Notes must contain only english and certain symbols');
        page.field('notesField').sendKeys('アニメは間違いだった');
        let exp2 = expect(page.button('confirmAddRideButton').isEnabled()).toBe(false);
        page.field('mpgField').click();
        let exp3 = expect(page.getTextFromField('notes-error')).toBe('Notes must contain only english and certain symbols');
        return exp1 && exp2 && exp3;
      });
    });
  });

  describe('Edit Ride', () => {

    it('Should edit the first ride in the list', () => {

      page.typeADestination('Maplegrove');
      page.slowTime(100);
      page.click('Maplegrove');
      page.slowTime(1000);
      page.click('editRide');

      page.field('destinationField').clear();
      page.field('destinationField').sendKeys('Japan');
      page.slowTime(1000);
      page.field('dateField').clear();
      page.field('dateField').sendKeys('5/31/2020');
      page.slowTime(500);
      page.field('timeField').clear();
      page.field('timeField').sendKeys('1250PM');
      page.slowTime(500);
      page.field('originField').clear();
      page.field('originField').sendKeys('America');
      page.slowTime(500);
      page.field('mpgField').clear();
      page.field('mpgField').sendKeys('199');
      page.slowTime(500);
      page.field('notesField').clear();
      page.field('notesField').sendKeys('We be travelin by map');
      page.slowTime(500);
      page.click('roundTripCheckBox');
      page.slowTime(500);
      page.click('drivingCheckBox');
      page.slowTime(500);

      let exp1 = expect(page.button('confirmEditRideButton').isEnabled()).toBe(true);
      page.click('confirmEditRideButton');
      page.slowTime(500);

      page.field('rideDestination').clear();
      page.typeADestination('Japan');

      const japan_element = element(by.id('Japan'));
      browser.wait(protractor.ExpectedConditions.presenceOf(japan_element), 10000);

      let exp2 = expect(page.getRideByDestination('Japan')).toMatch('Japan.*');
      var i;
      for (i=0; i < 5; i++) {
        page.backspace();
      }
      page.click("editRide");
      page.field('destinationField').clear();
      page.field('destinationField').sendKeys('Maplegrove');
      page.click('confirmEditRideButton');
      page.field('rideDestination').click();
      page.typeADestination('Maplegrove');
      page.click("editRide");
      return exp1 && exp2;
    });

    describe('Edit Ride (Validation)', () => {

      afterAll(() => {
        page.click('exitWithoutEditingButton');
        });

      afterEach(() => {
        page.click('exitWithoutEditingButton');
        page.click("editRide");
      });

      it('Should allow us to put information into the fields of the edit ride dialog', () => {

        let exp1 = expect(page.field('destinationField').isPresent()).toBeTruthy('There should be a destination field');
        let exp2 = expect(page.field('originField').isPresent()).toBeTruthy('There should be an origin field');
        let exp5 = expect(page.field('dateField').isPresent()).toBeTruthy('There should be a date field');
        let exp3 = expect(page.field('mpgField').isPresent()).toBeTruthy('MPG must be a number');
        let exp4 = expect(page.field('notesField').isPresent()).toBeTruthy('There should be a notes field');
        return exp1 && exp2 && exp5 && exp3 && exp4;
      });

      it('Should show the validation error message about origin format when editing a ride', () => {
        let exp1 = expect(element(by.id('originField')).isPresent()).toBeTruthy('There should be a origin field');
        page.field('originField').sendKeys('#@$@$#');
        let exp2 = expect(page.button('confirmEditRideButton').isEnabled()).toBe(false);
        //clicking somewhere else will make the error appear
        page.field('destinationField').click();
        let exp3 = expect(page.getTextFromField('origin-error')).toBe('Origin contains an unaccepted character');
        return exp1 && exp2 && exp3;
      });

      it('Should show the validation error message about the format of destination when editing a ride', () => {
        let exp1 = expect(element(by.id('destinationField')).isPresent()).toBeTruthy('There should be a destination field');
        page.field('destinationField').sendKeys('@$@$');
        let exp2 = expect(page.button('confirmEditRideButton').isEnabled()).toBe(false);
        page.field('mpgField').click();
        let exp3 = expect(page.getTextFromField('destination-error')).toBe('Destination contains an unaccepted character');
        return exp1 && exp2 && exp3;
      });

      // TODO: Sometimes fails due to date being entered in origin field
      it('Should show the validation error message about the format of dateField when editing a ride', () => {
        let exp1 = expect(element(by.id('dateField')).isPresent()).toBeTruthy('There should be a departureDate field');
        page.field('dateField').clear();
        page.field('dateField').sendKeys('12/12/2010');
        page.slowTime(500);
        let exp2 = expect(page.button('confirmEditRideButton').isEnabled()).toBe(false);
        page.field('mpgField').click();
        let exp3 = expect(page.getTextFromField('departureDate-error')).toBe('Date of departure cannot have already occurred');
        return exp1 && exp2 && exp3;
      });

      it('Should show the validation error message about the format of mpg when editing a ride', () => {
        let exp1 = expect(element(by.id('mpgField')).isPresent()).toBeTruthy('MPG must be a number');
        page.field('mpgField').sendKeys('A');
        let exp2 = expect(page.button('confirmEditRideButton').isEnabled()).toBe(false);
        page.field('notesField').click();
        let exp3 = expect(page.getTextFromField('mpg-error')).toBe('MPG must be a number');
        return exp1 && exp2 && exp3;
      });

      it('Should show the validation error message about the format of notes when editing a ride', () => {
        let exp1 = expect(element(by.id('notesField')).isPresent()).toBeTruthy('notes must contain only english and certain symbols');
        page.field('notesField').sendKeys('片仮名');
        let exp2 = expect(page.button('confirmEditRideButton').isEnabled()).toBe(false);
        page.field('mpgField').click();
        let exp3 = expect(page.getTextFromField('notes-error')).toBe('notes must contain only english and certain symbols');
        return exp1 && exp2 && exp3;
      });
    });

  });

  describe('User Information Redirect', () => {
    beforeEach(() => {
      page.field('rideDestination').clear();
      page.slowTime(100);
      page.typeADestination('Duluth');
      page.slowTime(100);
      page.click('1234567890abcdeffedcba09');
    });

    it('Redirects to a specific User Profile', () => {
      page.click('goToUser');

      page.slowTime(1000);
      return expect(page.elementExistsWithId('Meghan Sweeney')).toBeTruthy("The Profile of Meghan Sweeney was not found");
    })
  });

  describe('Delete Ride', () => {

    beforeAll(()=>{
      element(by.id("menuButton")).click();
      element(by.id("navRides")).click();
    });

    beforeEach(() => {
      page.field('rideDestination').clear();
      page.slowTime(100);
      page.typeADestination('Maplegrove');
      page.slowTime(100);
    });

    it('Deletes an existing ride', () => {
      page.click('deleteRide');

      page.click('confirmDeleteRideButton');
      page.slowTime(1000);
      return expect(page.elementExistsWithCss('America')).toBeFalsy("The ride should not exist as it was deleted");
    });
  });
});

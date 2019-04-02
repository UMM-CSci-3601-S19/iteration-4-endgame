import {RidePage} from './ride-list.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

const origFn = browser.driver.controlFlow().execute;

browser.driver.controlFlow().execute = function () {
 let args = arguments;

 // queue 100ms wait between test
 // This delay is only put here so that you can watch the browser do its thing.
 // If you're tired of it taking long you can remove this call or change the delay
 // to something smaller (even 0).
 origFn.call(browser.driver.controlFlow(), () => {
   return protractor.promise.delayed(10);
 });

 return origFn.apply(browser.driver.controlFlow(), args);
};

describe('Ride List', () => {
  let page: RidePage;

  beforeEach(() => {
    page = new RidePage();
    page.navigateTo();
  });

  it('should have a Rides title', () => {
    return expect(page.getTitle()).toEqual('Rides');
  });

  it('should type something in Filter by Destination box and check that it returned correct element', () => {
    page.typeADestination('d');
    expect(page.getUniqueRide('Duluth')).toMatch('Oliver Street.*');
    page.backspace();
    page.typeADestination('Alexandria');
    return expect(page.getUniqueRide('Alexandria')).toMatch('Kings Place.*');
  });

  it('Should have an add ride button', () => {
    page.navigateTo();
    return expect(page.elementExistsWithId('addNewRide')).toBeTruthy();
  });

  it('Should open a dialog box when add ride button is clicked', () => {
    page.navigateTo();
    expect(page.elementExistsWithCss('add-ride')).toBeFalsy('There should not be a modal window yet');
    page.click('addNewRide');
    return expect(page.elementExistsWithCss('add-ride')).toBeTruthy('There should be a modal window now');
  });

  describe('Add Ride', () => {

    beforeEach(() => {
      page.click('addNewRide');
    });

    it('Should actually add the ride with the information we put in the fields', () => {
      page.field('destinationField').sendKeys('New York');
      page.slowTime(100);
      page.field('driverField').sendKeys('Bob');
      page.slowTime(100);
      page.field('departureTimeField').sendKeys('In the morning');
      page.slowTime(100);
      page.field('originField').sendKeys('Morris');
      page.slowTime(100);
      page.field('mpgField').sendKeys('40');
      page.slowTime(100);
      page.field('notesField').sendKeys('I do not pick up my trash');
      page.slowTime(100);
      page.click('roundTripCheckBox');
      page.slowTime(100);
      expect(page.button('confirmAddRideButton').isEnabled()).toBe(true);
      page.click('confirmAddRideButton');

      const new_york_element = element(by.id('New York'));
      browser.wait(protractor.ExpectedConditions.presenceOf(new_york_element), 10000);

      return expect(page.getUniqueRide('New York')).toMatch('New York.*');
    });

    describe('Add Ride (Validation)', () => {

      afterEach(() => {
        page.click('exitWithoutAddingButton');
      });

      it('Should allow us to put information into the fields of the add ride dialog', () => {
        expect(page.field('driverField').isPresent()).toBeTruthy('There should be a driver field');
        page.field('driverField').sendKeys('Dana Jones');
        expect(page.field('notesField').isPresent()).toBeTruthy('There should be a notes field');
        page.field('notesField').sendKeys('Test Notes');
        expect(page.field('originField').isPresent()).toBeTruthy('There should be an origin field');
        page.field('originField').sendKeys('Pickup Location');
        expect(page.field('destinationField').isPresent()).toBeTruthy('There should be a destination field');
        page.field('destinationField').sendKeys('Dropoff Location');
        expect(page.field('departureTimeField').isPresent()).toBeTruthy('There should be a date field');
        page.field('departureTimeField').sendKeys('3/27/2019');
      });

      it('Should show the validation error message about the format of driver', () => {
        expect(element(by.id('driverField')).isPresent()).toBeTruthy('There should be a driver field');
        page.field('driverField').sendKeys('Don@ld Jones');
        expect(page.button('confirmAddRideButton').isEnabled()).toBe(false);
        //clicking somewhere else will make the error appear
        page.field('notesField').click();
        expect(page.getTextFromField('driver-error')).toBe('Driver must contain only numbers and letters');
      });

      it('Should show the validation error message about pickup format', () => {
        expect(element(by.id('originField')).isPresent()).toBeTruthy('There should be a pickup field');
        page.field('originField').sendKeys('#@$@$#');
        expect(page.button('confirmAddRideButton').isEnabled()).toBe(false);
        //clicking somewhere else will make the error appear
        page.field('driverField').click();
        expect(page.getTextFromField('origin-error')).toBe('Origin must contain only numbers, letters, dashes, underscores, and dots');
      });
    });
  });

  describe('Edit Ride', () => {

    beforeEach(() => {
      page.click('Maplegrove');
      page.click('editRide');
    });

    it('Should edit the first ride in the list', () => {
      page.field('destinationField').clear();
      page.field('destinationField').sendKeys('Japan');
      page.slowTime(100);
      page.field('driverField').clear();
      page.field('driverField').sendKeys('Kermit');
      page.slowTime(100);
      page.field('departureTimeField').clear();
      page.field('departureTimeField').sendKeys('By the night');
      page.slowTime(100);
      page.field('originField').clear();
      page.field('originField').sendKeys('America');
      page.slowTime(100);
      page.field('mpgField').clear();
      page.field('mpgField').sendKeys('199');
      page.slowTime(100);
      page.field('notesField').clear();
      page.field('notesField').sendKeys('We be travelin by map');
      page.slowTime(100);
      page.click('roundTripCheckBox');
      page.slowTime(100);
      page.click('drivingCheckBox');
      page.slowTime(100);
      expect(page.button('confirmEditRideButton').isEnabled()).toBe(true);
      page.click('confirmEditRideButton');

      const japan_element = element(by.id('Japan'));
      browser.wait(protractor.ExpectedConditions.presenceOf(japan_element), 10000);

      return expect(page.getUniqueRide('Japan')).toMatch('Japan.*');
    });
  });

  describe('Delete Ride', () => {

    beforeEach(() => {
      page.click('Japan');

    });

    it('Deletes a newly created ride', () => {
      page.click('deleteRide');

      page.click('confirmDeleteRideButton');
      page.slowTime(1000);
      return expect(page.elementExistsWithCss('Japan')).toBeFalsy('There should not no ride that matches');
    });
  });
});

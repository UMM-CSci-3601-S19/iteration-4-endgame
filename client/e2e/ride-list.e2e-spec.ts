import {RidePage} from './ride-list.po';
import {browser, protractor, element, by} from 'protractor';

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
    return expect(page.getTitle()).toEqual('Available Listings');
  });


  it('should type something in Filter by Destination box and check that it returned correct element', () => {
    page.typeADestination('dul');
    let exp1 = expect(page.getUniqueRide('5cb129c060bd26f72fbc2958')).toMatch('Grand Street.*');
    page.backspace();page.backspace();page.backspace();
    page.typeADestination('Alexandria');
    let exp2 = expect(page.getUniqueRide('5cb129c060bd26f72fbc294a')).toMatch('Folsom Place.*');
    return exp1 && exp2;
  });

  it('Should have an add ride button', () => {
    page.navigateTo();
    return expect(page.elementExistsWithId('addNewRide')).toBeTruthy();
  });

  it('Should open a dialog box when add ride button is clicked', () => {
    page.navigateTo();
    let exp1 = expect(page.elementExistsWithCss('add-ride')).toBeFalsy('There should not be a modal window yet');
    page.click('addNewRide');
    let exp2 = expect(page.elementExistsWithCss('add-ride')).toBeTruthy('There should be a modal window now');
    return exp1 && exp2;
  });

  describe('Add Ride', () => {

    beforeEach(() => {
      page.click('addNewRide');
    });

    it('Should actually add the ride with the information we put in the fields', () => {
      page.field('destinationField').sendKeys('New York');
      let st1 = page.slowTime(1000);
      page.selectDropdown('#ownerField');
      page.selectDownKey();
      page.selectEnterKey();
      let st2 = page.slowTime(500);

      page.field('dateField').sendKeys('5/31/2025');
      let st3 = page.slowTime(500);
      page.field('timeField').sendKeys('1250PM');
      let st8 = page.slowTime(500);

      page.field('originField').sendKeys('Morris');
      let st4 = page.slowTime(500);
      page.field('mpgField').sendKeys('40');
      let st5 = page.slowTime(500);
      page.field('notesField').sendKeys('I do not pick up my trash');
      let st6 = page.slowTime(500);
      page.click('roundTripCheckBox');
      let st7 = page.slowTime(500);
      let exp1 = expect(page.button('confirmAddRideButton').isEnabled()).toBe(true);
      page.click('confirmAddRideButton');

      const new_york_element = element(by.id('New York'));
      browser.wait(protractor.ExpectedConditions.presenceOf(new_york_element), 10000);

      let exp2 = expect(page.getRideByDestination('New York')).toMatch('New York.*');
      return st1 && st2 && st3 && st8 && st4 && st5 && st6 && st7 && exp1 && exp2;
    });

    describe('Add Ride (Validation)', () => {

      afterEach(() => {
        page.click('exitWithoutAddingButton');
      });

      it('Should allow us to put information into the fields of the add ride dialog', () => {
        let exp1 = expect(page.elementExistsWithId('ownerField')).toBeTruthy('There should be an owner field');
        page.selectDropdown('#ownerField');
        page.selectDownKey();
        page.selectEnterKey();
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
        return exp1 && exp2 && exp3 && exp4 && exp6 && exp7 && exp5;
      });

      it('Should show the validation error message about the requirement of owner', () => {
        let exp1 = expect(page.elementExistsWithId('ownerField')).toBeTruthy('There should be a owner field');
        page.selectDropdown('#ownerField');
        let st1 = page.slowTime(500);
        page.selectTabKey();
        let st2 = page.slowTime(500);
        let exp2 = expect(page.button('confirmAddRideButton').isEnabled()).toBe(false);
        //clicking somewhere else will make the error appear
        let exp3 = expect(page.getTextFromField('owner-error')).toBe('Owner is required');
        return st1 && st2 && exp1 && exp2 && exp3;
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
        let exp1 = expect(element(by.id('notesField')).isPresent()).toBeTruthy('notes must contain only english and certain symbols');
        page.field('notesField').sendKeys('片仮名');
        let exp2 = expect(page.button('confirmAddRideButton').isEnabled()).toBe(false);
        page.field('notesField').click();
        let exp3 = expect(page.getTextFromField('notes-error')).toBe('notes must contain only english and certain symbols');
        return exp1 && exp2 && exp3;
      });
    });
  });

  describe('Edit Ride', () => {

    let st1;
    let st2;

    beforeEach(() => {
      page.typeADestination('Maplegrove');
      st1 = page.slowTime(100);
      page.click('Maplegrove');
      st2 = page.slowTime(1000);
      page.click('editRide');
    });

    it('Should edit the first ride in the list', () => {

      page.field('destinationField').clear();
      page.field('destinationField').sendKeys('Japan');
      let st3 = page.slowTime(100);
      page.field('dateField').clear();
      page.field('dateField').sendKeys('5/31/2020');
      let st10 = page.slowTime(100);
      page.field('timeField').clear();
      page.field('timeField').sendKeys('1250PM');
      let st11 = page.slowTime(100);
      page.field('originField').clear();
      page.field('originField').sendKeys('America');
      let st4 = page.slowTime(100);
      page.field('mpgField').clear();
      page.field('mpgField').sendKeys('199');
      let st5 = page.slowTime(100);
      page.field('notesField').clear();
      page.field('notesField').sendKeys('We be travelin by map');
      let st6 = page.slowTime(100);
      page.click('roundTripCheckBox');
      let st7 = page.slowTime(100);
      page.click('drivingCheckBox');
      let st8 = page.slowTime(100);

      let exp1 = expect(page.button('confirmEditRideButton').isEnabled()).toBe(true);
      page.click('confirmEditRideButton');
      let st9 = page.slowTime(100);

      page.field('rideDestination').clear();
      page.typeADestination('Japan');

      const japan_element = element(by.id('Japan'));
      browser.wait(protractor.ExpectedConditions.presenceOf(japan_element), 10000);

      let exp2 = expect(page.getUniqueRide('Japan')).toMatch('Japan.*');
      return st1 && st2 && st3 && st10 && st11 && st4 && st5 && st6 && st7 && st8 && st9 && exp1 && exp2;
    });

    describe('Edit Ride (Validation)', () => {

      afterEach(() => {
        page.click('exitWithoutEditingButton');
        page.field('rideDestination').clear();
        page.typeADestination('Maplegrove');
      });

      it('Should allow us to put information into the fields of the edit ride dialog', () => {

        let exp1 = expect(page.field('destinationField').isPresent()).toBeTruthy('There should be a destination field');
        page.field('destinationField').sendKeys('Dropoff Location');
        let exp2 = expect(page.field('originField').isPresent()).toBeTruthy('There should be an origin field');
        page.field('originField').sendKeys('Pickup Location');
        let exp5 = expect(page.field('dateField').isPresent()).toBeTruthy('There should be a date field');
        page.field('dateField').sendKeys('3/27/2020');
        let exp3 = expect(page.field('mpgField').isPresent()).toBeTruthy('MPG must be a number');
        page.field('mpgField').sendKeys('20');
        let exp4 = expect(page.field('notesField').isPresent()).toBeTruthy('There should be a notes field');
        page.field('notesField').sendKeys('Test Notes');
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

      it('Should show the validation error message about the format of dateFiled when editing a ride', () => {
        let exp1 = expect(element(by.id('dateField')).isPresent()).toBeTruthy('There should be a departureDate field');
        page.field('dateField').clear();
        page.field('dateField').sendKeys('5');
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
        page.field('notesField').click();
        let exp3 = expect(page.getTextFromField('notes-error')).toBe('notes must contain only english and certain symbols');
        return exp1 && exp2 && exp3;
      });
    });

  });

  describe('Delete Ride', () => {

    let st1;
    let st2;

    beforeEach(() => {
      page.field('rideDestination').clear();
      st1 = page.slowTime(100);
      page.typeADestination('Japan');
      st2 = page.slowTime(100);
      page.click('Japan');

    });

    it('Deletes a newly created ride', () => {
      page.click('deleteRide');

      page.click('confirmDeleteRideButton');
      let st3 = page.slowTime(1000);
      let exp1 = expect(page.elementExistsWithCss('Japan')).toBeFalsy('There should not no ride that matches');
      return st1 && st2 && st3 && exp1;
    });
  });
});

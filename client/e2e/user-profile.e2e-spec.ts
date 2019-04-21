import {UserPage} from './user-profile.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

describe('User List', () => {
  let page: UserPage;

  beforeEach(() => {
    page = new UserPage();
    page.navigateTo();
  });

  it('Should have a specific User', () => {
    return expect(page.elementExistsWithId('Weeks Boyle')).toBeTruthy('Should be Weeks Boyle\'s profile');
  });

  describe('Should be able to edit a profile', () => {
    beforeEach(() => {
      page.click('editProfile');
    });

    it('Should edit the profile in the list', () => {
      page.field('bioField').clear();
      page.field('bioField').sendKeys('Hey, what\'s up Youtube, it\'s yah boi; Weeks Boyle! Don\'t forget to like and subscribe!');
      page.slowTime(1000);
      page.field('phoneNumberField').clear();
      page.field('phoneNumberField').sendKeys('1234567890');
      page.slowTime(500);


      let exp1 = expect(page.button('confirmEditInfoButton').isEnabled()).toBe(true);
      page.click('confirmEditInfoButton');
      page.slowTime(500);

      let exp2 = expect(page.getBio()).toMatch('Hey, what\'s up Youtube, it\'s yah boi; Weeks Boyle! Don\'t forget to like and subscribe!.*');
            return exp1 && exp2
    });

    describe('Edit Profile (Validation)', () => {

      afterEach(() => {
        page.click('exitWithoutEditingButton');
      });

      it('Should allow us to put information into the fields of the edit ride dialog', () => {

        let exp1 = expect(page.field('bioField').isPresent()).toBeTruthy('There should be a bio field');
        page.field('bioField').sendKeys('ENTER SOME INFORMATION');
        let exp2 = expect(page.field('phoneNumberField').isPresent()).toBeTruthy('There should be a phoneNumber field');
        page.field('phoneNumberField').sendKeys('1234567890');
        return exp1 && exp2;
      });

      it('Should show the validation error message about length when editing a bio', () => {
        let exp1 = expect(element(by.id('bioField')).isPresent()).toBeTruthy('There should be a bio field');
        page.field('bioField').clear();
        page.field('bioField').sendKeys('hi every1 im new!!!!!!! holds up spork my name is katy but u can call me t3h PeNgU1N oF d00m!!!!!!!! lol…as u can see im very random!!!! thats why i came here, 2 meet random ppl like me … im 13 years old (im mature 4 my age tho!!) i like 2 watch invader zim w/ my girlfreind (im bi if u dont like it deal w/it) its our favorite tv show!!! bcuz its SOOOO random!!!! shes random 2 of course but i want 2 meet more random ppl =) like they say the more the merrier!!!! lol…neways i hope 2 make alot of freinds here so give me lots of commentses!!!! DOOOOOMMMM!!!!!!!!!!!!!!!! <--- me bein random again ^ hehe…toodles!!!!!\n' +
          '\nlove and waffles, t3h PeNgU1N oF d00m' +
          '\nhi evewy1 im new!!!!!!! howds up spowk my name is katy but u can caww me t3h PeNgU1N oF d00m!!!!!!!! wow…as u can see im vewy wandom!!!! thats why i came hewe, 2 meet wandom ppw wike me … im 13 yeaws owd (im matuwe 4 my age tho!!) i wike 2 watch invadew zim w/ my giwwfweind (im bi if u dont wike it deaw w/it) its ouw favowite tv show!!! bcuz its SOOOO wandom!!!! shes wandom 2 of couwse but i want 2 meet mowe wandom ppw =) wike they say the mowe the mewwiew!!!! wow…neways i hope 2 make awot of fweinds hewe so give me wots of commentses!!!! DOOOOOMMMM!!!!!!!!!!!!!!!! <--- me bein wandom again ^ hehe…toodwes!!!!!\n' +
          '\nwove and waffwes, t3h PeNgU1N oF d00m' +
          '\nWe need 164 more CHARACTERS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        page.slowTime(1000);
        let exp2 = expect(page.button('confirmEditInfoButton').isEnabled()).toBe(false);
        page.field('phoneNumberField').click();
        page.slowTime(500);
        let exp3 = expect(page.getTextFromField('bio-error')).toBe('Limit of 1500 characters');
        return exp1 && exp2 && exp3;
      });
    });
  });

  it('Should check if the leave a rating dropdown exists, and the submit rating button exists and functions properly, and that stars are added correctly', () => {
    page.selectDropdown('#ratingSelect');
    page.selectEnterKey();
    page.slowTime(500);
    page.click('addRatingButton');
    page.slowTime(100);
    page.click('confirmRateProfileButton');
    page.slowTime(1000);
    return expect(page.elementExistsWithId('starID1')).toBeTruthy('Should have one star show up');
  });

  it('Should average the stars when another rating is added', () => {
    page.selectDropdown('#ratingSelect');
    page.selectDownKey();
    page.selectDownKey();
    page.selectDownKey();
    page.selectDownKey();
    page.selectEnterKey();
    page.slowTime(500);
    page.click('addRatingButton');
    page.slowTime(100);
    page.click('confirmRateProfileButton');
    page.slowTime(1000);
    let exp1 = expect(page.elementExistsWithId('starID1')).toBeTruthy('Should have a first star show up');
    let exp2 = expect(page.elementExistsWithId('starID2')).toBeTruthy('Should have a second star show up');
    let exp3 = expect(page.elementExistsWithId('starID3')).toBeTruthy('Should have a third star show up');
    return exp1 && exp2 && exp3;
  });
});

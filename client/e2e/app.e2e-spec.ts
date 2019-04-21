import {AppPage} from './app.po';

describe('Mo-Ride', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should load', () => {
    page.navigateTo();
  });
});

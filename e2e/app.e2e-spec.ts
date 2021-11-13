import { InterrogatorWebPage } from './app.po';

describe('interrogator-web App', function() {
  let page: InterrogatorWebPage;

  beforeEach(() => {
    page = new InterrogatorWebPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

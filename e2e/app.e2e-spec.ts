import { AppVentasClientePage } from './app.po';

describe('app-ventas-cliente App', () => {
  let page: AppVentasClientePage;

  beforeEach(() => {
    page = new AppVentasClientePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});

import { WebappsRecipeappPage } from './app.po';

describe('webapps-recipeapp App', () => {
  let page: WebappsRecipeappPage;

  beforeEach(() => {
    page = new WebappsRecipeappPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});

import { FileConverterPage } from './app.po';

describe('file-converter App', () => {
  let page: FileConverterPage;

  beforeEach(() => {
    page = new FileConverterPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

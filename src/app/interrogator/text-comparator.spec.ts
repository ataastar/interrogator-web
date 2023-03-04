import { TextComparator } from './text-comparator';

describe('Service: Auth', () => {

  let component: TextComparator;

  beforeEach(() => {
    component = new TextComparator();
  });

  afterEach(() => {
    component = null;
  });

  it('should return dd', () => {
    component.replaceAbbreviation('dddd');
  });

  it('should return WHAT IS', () => {
    component.replaceAbbreviation('what\'s');
  });

});

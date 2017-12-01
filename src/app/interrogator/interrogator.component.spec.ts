import { InterrogatorComponent } from './interrogator.component';

describe('Service: Auth', () => {

    let component: InterrogatorComponent;

    beforeEach(() => {
        component = new InterrogatorComponent(null, null, null);
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

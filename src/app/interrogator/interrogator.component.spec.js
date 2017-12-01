"use strict";
var interrogator_component_1 = require("./interrogator.component");
describe('Service: Auth', function () {
    var component;
    beforeEach(function () {
        component = new interrogator_component_1.InterrogatorComponent(null, null, null);
    });
    afterEach(function () {
        component = null;
    });
    it('should return dd', function () {
        component.replaceAbbreviation('dd');
    });
    it('should return WHAT IS', function () {
        component.replaceAbbreviation('what\'s');
    });
});
//# sourceMappingURL=interrogator.component.spec.js.map
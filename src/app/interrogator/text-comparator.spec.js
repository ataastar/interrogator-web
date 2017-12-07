"use strict";
var text_comparator_1 = require("./text-comparator");
describe('Service: Auth', function () {
    var component;
    beforeEach(function () {
        component = new text_comparator_1.TextComparator();
    });
    afterEach(function () {
        component = null;
    });
    it('should return dd', function () {
        component.replaceAbbreviation('dddd');
    });
    it('should return WHAT IS', function () {
        component.replaceAbbreviation('what\'s');
    });
});
//# sourceMappingURL=text-comparator.spec.js.map
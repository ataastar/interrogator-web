"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var common_1 = require("@angular/common");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var interrogator_component_1 = require("./interrogator.component");
var group_selector_component_1 = require("./group-selector.component");
var InterrogatorModule = (function () {
    function InterrogatorModule() {
    }
    return InterrogatorModule;
}());
InterrogatorModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule,
            forms_1.FormsModule,
            http_1.HttpModule,
            ng_bootstrap_1.NgbModule
        ],
        declarations: [
            interrogator_component_1.InterrogatorComponent,
            group_selector_component_1.GroupSelectorComponent
        ],
        exports: [
            interrogator_component_1.InterrogatorComponent,
            group_selector_component_1.GroupSelectorComponent,
            ng_bootstrap_1.NgbModule
        ],
        entryComponents: []
    })
], InterrogatorModule);
exports.InterrogatorModule = InterrogatorModule;
//# sourceMappingURL=interrogator.module.js.map
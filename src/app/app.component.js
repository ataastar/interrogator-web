"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
require("../assets/css/styles.css");
require("../../node_modules/primeng/resources/themes/omega/theme.css");
require("../../node_modules/primeng/resources/primeng.min.css");
require("../../node_modules/font-awesome/css/font-awesome.min.css");
var router_1 = require("@angular/router");
var AppComponent = (function () {
    function AppComponent(router, activatedRoute) {
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.hasActiveRoute = false;
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.activatedRoute.url.subscribe(function (url) { _this.hasActiveRoute = true; console.log(url); });
        console.log(this.router.url);
    };
    AppComponent.prototype.ngOnChange = function () {
        var _this = this;
        this.activatedRoute.url.subscribe(function (url) { _this.hasActiveRoute = true; console.log(url); });
        console.log(this.router.url);
    };
    AppComponent.prototype.interrogate = function (key) {
        this.router.navigate(['/test', key]);
    };
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'learn-english-app',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.css'],
    }),
    __metadata("design:paramtypes", [router_1.Router, router_1.ActivatedRoute])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map
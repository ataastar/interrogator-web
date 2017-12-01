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
var http_1 = require("@angular/http");
var WordService = (function () {
    function WordService(http) {
        this.http = http;
    }
    WordService.prototype.getWords = function (key) {
        return this.http.get('src/app/resources/data/words' + key + '.json')
            .toPromise()
            .then(function (res) { return res.json().data; })
            .then(function (data) { return data; });
    };
    WordService.prototype.getWords2 = function (key) {
        return this.http.get('http://localhost:3000/words/' + key)
            .toPromise()
            .then(function (res) { return res.json(); });
    };
    WordService.prototype.getGroups = function () {
        return this.http.get('http://localhost:3000/word_groups')
            .toPromise()
            .then(function (res) { return res.json(); });
    };
    return WordService;
}());
WordService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], WordService);
exports.WordService = WordService;
//# sourceMappingURL=word-service.js.map
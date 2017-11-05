"use strict";
var router_1 = require("@angular/router");
var interrogator_component_1 = require("./interrogator/interrogator.component");
var appRoutes = [
    {
        path: 'test/:id',
        component: interrogator_component_1.InterrogatorComponent
    }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map
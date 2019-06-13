"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a = require('../src/tools.js'), updateRouteLayout = _a.updateRouteLayout, checkRoutesOuterHashPath = _a.checkRoutesOuterHashPath, initParentRoutes = _a.initParentRoutes, setBlankRoutes = _a.setBlankRoutes, updatePrefix = _a.updatePrefix, set_layoutRoute = _a.set_layoutRoute;
module.exports = function (api, options) {
    api.modifyRoutes(function (routes) {
        updateRouteLayout(routes, routes);
        setBlankRoutes(routes, routes);
        updatePrefix(routes, options.prefix || '');
        set_layoutRoute(routes, routes);
        return routes;
    });
};
//# sourceMappingURL=index.js.map
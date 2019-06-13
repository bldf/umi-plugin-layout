"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var remove_1 = __importDefault(require("lodash/remove"));
var path = require('path');
/**
 *判断路由是否包含某个path, 只是做外层验证，子路由不做验证
 *
 * @param {IRoute} route
 * @param {string} path
 * @returns {(IRoute | boolean)}
 */
var checkRoutesOuterHashPath = function (route, path) {
    for (var a = 0, d = void 0; d = route[a]; a++) {
        if (d.path === path) {
            return d;
        }
    }
    return false;
};
/**
 * 添加子路由
 * @param {*} route
 * @param {*} ro
 */
var addChildRoutes = function (route, ro) {
    if (route.routes) {
        ro.path = ro.path || '';
        ro.path = ro.path.replace('/layout_', '/');
        route.routes.push(ro);
    }
    return route;
};
/**
 * 为路由数组中的第0个位置添加一个路由 , 并且返回当前添加的这个路由
 *
 * @param {IRoute[]} routes
 * @param {string} subPath
 * @returns {IRoute}
 */
var initParentRoutes = function (routes, subPath) {
    var route = {
        path: subPath,
        component: path.resolve('src/layouts/') + subPath,
        routes: []
    };
    routes.splice(0, 0, route);
    return route;
};
/**
 *设置空白页面 , 如果有路由 为 b_开始的，那就说明这是一个空白页面，将这个空白页面放到外层去
 *
 * @param {IRoute[]} routes
 * @param {IRoute[]} allRoutes
 * @returns
 */
var setBlankRoutes = function (routes, allRoutes) {
    for (var a = 0, d; d = routes[a]; a++) {
        var path_1 = d.path || '';
        if (d.path) {
            var ar = path_1.split('/'), lastPath = ar[ar.length - 1];
            if (lastPath.substring(0, 2) == 'b_') {
                ar[ar.length - 1] = lastPath.substring(2);
                d.path = ar.join('/');
                allRoutes.splice(0, 0, d);
                if (remove_1.default(routes, function (ck) { return ck.path === d.path; }).length == 1) {
                    a--;
                }
            }
        }
        if (d.routes) {
            setBlankRoutes(d.routes, allRoutes);
        }
    }
    return routes;
};
/**
*
*修改所有路由中，只要是包含 layout_op , 将该文件夹下的所有路由的layout设置为op, op只是一个例子 ， 具体名称自己命名
* 按照约定 layout_op 只能在 pages统计目录下边，否则无效
* @param {IRoute[]} routes
* @param {IRoute[]} allRoutes
*/
var updateRouteLayout = (function (routes, allRoutes) {
    for (var a = 0, d; d = routes[a]; a++) {
        if (d.path) {
            if (d.path.substring(0, 8) === "/layout_") { //如果是使用了模板
                var str = '/' + (d.path.replace('/layout_', '').replace(/\/.*/gi, '')); //截取layout后的字符串, /layout_opc/order 比如截取后为： "opc"
                var route = checkRoutesOuterHashPath(allRoutes, str);
                !route && (route = initParentRoutes(allRoutes, str));
                addChildRoutes(route, d);
                if (remove_1.default(routes, function (ch) { return ch.path == d.path; }).length == 1) {
                    a--;
                }
            }
        }
        if (d.routes) {
            updateRouteLayout(d.routes, allRoutes);
        }
    }
});
/**
 * 为所有的路由添加前缀比如： prefix = '/pms' ， 并且将 /order/b_index 这种路由改为  /order/index 这种路由
 *
 * @param {IRoute[]} routes
 * @param {string} prefix
 */
var updatePrefix = function (routes, prefix) {
    for (var a = 0, d; d = routes[a]; a++) {
        if (d.path) {
            var arr = d.path.split('/');
            if (arr[arr.length - 1] === 'index') {
                arr.pop();
                d.path = arr.join('/');
            }
            d.path = prefix + d.path;
        }
        if (d.routes) {
            updatePrefix(d.routes, prefix);
        }
    }
};
/**
 *查找路由，是否包含某个路由 ，如果包含，返回当初传递的空数组
 *
 * @param {IRoute[]} routes
 * @param {string} path 要查找的路由路径
 * @param {IRoute[]} reRoutes 查找成功后返回的空数组
 */
var findRouteByPath = function (routes, path, reRoutes) {
    for (var a = 0, d; d = routes[a]; a++) {
        if (d.path === path) {
            if (!d.component || (d.component && !~d.component.indexOf('index'))) {
                throw new Error('有 l_ 开始的路由， 但是没有 index 组件 因为 l_ 默认是找 index 或者 b_index 作为模板使用的');
            }
            reRoutes.push(d);
            break;
        }
        if (d.routes) {
            findRouteByPath(d.routes, path, reRoutes);
        }
    }
};
/**
 *修改 l_开始的路由 ， 如果出现该路由就添加到该路由的
 *
 * @param {IRoute[]} routes
 * @param {IRoute[]} allRoutes
 */
var set_layoutRoute = function (routes, allRoutes) {
    for (var a = 0, d; d = routes[a]; a++) {
        var path_2 = d.path || '';
        if (d.path) {
            var ar = path_2.split('/'), lastPath = ar[ar.length - 1], checkArr = [];
            if (lastPath.substring(0, 2) == 'l_') { //如果当前页面是具有私有模板的页面。 
                ar[ar.length - 1] = lastPath.substring(2);
                d.path = ar.join('/');
                ar.pop();
                findRouteByPath(allRoutes, ar.join('/'), checkArr);
                if (checkArr.length) { // 如果找到了
                    if (!checkArr[0].routes) {
                        checkArr[0].routes = [];
                        checkArr[0].exact = false;
                    }
                    else {
                        throw new Error('有 l_ 开始的路由， 但是没有 对应的父级');
                    }
                    checkArr[0].routes.splice(0, 0, d);
                }
                if (remove_1.default(routes, function (ck) { return ck.path === d.path; }).length == 1) {
                    a--;
                }
            }
        }
        if (d.routes) {
            set_layoutRoute(d.routes, allRoutes);
        }
    }
};
module.exports = {
    checkRoutesOuterHashPath: checkRoutesOuterHashPath,
    addChildRoutes: addChildRoutes,
    initParentRoutes: initParentRoutes,
    setBlankRoutes: setBlankRoutes,
    updateRouteLayout: updateRouteLayout,
    updatePrefix: updatePrefix,
    set_layoutRoute: set_layoutRoute
};
//# sourceMappingURL=tools.js.map
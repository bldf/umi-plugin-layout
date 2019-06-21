import { IApi,IRoute } from 'umi-types';
const { updateRouteLayout,set_layoutOrder,checkRoutesOuterHashPath,initParentRoutes,setBlankRoutes,updatePrefix,set_layoutRoute } = require('./tools.js');
interface IOpts {
  prefix: string; // 所有路由添加前缀， 默认添加为空
}
module.exports = function(api:IApi,options:IOpts){
  api.modifyRoutes((routes:IRoute[]) => {
    updateRouteLayout(routes,routes) ; 
    setBlankRoutes(routes,routes) ;
    updatePrefix(routes,options.prefix || '') ;
    set_layoutRoute(routes,routes); 
    return set_layoutOrder(routes) ;
  })
} ;
const assert = require('assert').strict;
const cloneDeep = require("lodash/cloneDeep") ;

const { updateRouteLayout,set_layoutOrder,checkRoutesOuterHashPath,initParentRoutes,setBlankRoutes,updatePrefix,set_layoutRoute } = require('../dist/tools.js');
const TestRoutesArr = [{"path":"/","component":"./src/layouts/index.tsx","routes":[{"path":"/b_404","exact":true,"component":"./src/pages/b_404.js","Routes":["./src/components/Authorized/AuthorizedRoute.tsx"]},{"path":"/drag","exact":true,"component":"./src/pages/drag.tsx","Routes":["./src/components/Authorized/AuthorizedRoute.tsx"]},{"path":"/layout_admin/backs/authoritymanage","exact":true,"component":"./src/pages/layout_admin/backs/authoritymanage.tsx","Routes":["./src/components/Authorized/AuthorizedRoute.tsx"]},{"path":"/layout_admin/backs/backstage","exact":true,"component":"./src/pages/layout_admin/backs/backstage.tsx","Routes":["./src/components/Authorized/AuthorizedRoute.tsx"]},{"path":"/layout_admin/backs/kanbansettings","exact":true,"component":"./src/pages/layout_admin/backs/kanbansettings.tsx","Routes":["./src/components/Authorized/AuthorizedRoute.tsx"]},{"path":"/layout_admin/backs/rolemanage","exact":true,"component":"./src/pages/layout_admin/backs/rolemanage.tsx","Routes":["./src/components/Authorized/AuthorizedRoute.tsx"]},{"path":"/layout_admin/backs/systemsettings","exact":true,"component":"./src/pages/layout_admin/backs/systemsettings.tsx","Routes":["./src/components/Authorized/AuthorizedRoute.tsx"]},{"path":"/layout_admin/backs/usermanage","exact":true,"component":"./src/pages/layout_admin/backs/usermanage.tsx","Routes":["./src/components/Authorized/AuthorizedRoute.tsx"]},{"path":"/layout_manager/b_index","exact":true,"component":"./src/pages/layout_manager/b_index.tsx","Routes":["./src/components/Authorized/AuthorizedRoute.tsx"]},{"path":"/layout_manager/order","exact":true,"component":"./src/pages/layout_manager/order/index.tsx","Routes":["./src/components/Authorized/AuthorizedRoute.tsx"]},{"path":"/layout_manager/:blank/black","exact":true,"component":"./src/pages/layout_manager/$blank/black.tsx","Routes":["./src/components/Authorized/AuthorizedRoute.tsx"]},{"path":"/layout_op/b_index","exact":true,"component":"./src/pages/layout_op/b_index.tsx","Routes":["./src/components/Authorized/AuthorizedRoute.tsx"]},{"path":"/layout_op/center","exact":true,"component":"./src/pages/layout_op/center/index.tsx","Routes":["./src/components/Authorized/AuthorizedRoute.tsx"]},{"path":"/layout_op/center/report/capacity","exact":true,"component":"./src/pages/layout_op/center/report/capacity.tsx","Routes":["./src/components/Authorized/AuthorizedRoute.tsx"]},{"path":"/layout_op/production/b_index","exact":true,"component":"./src/pages/layout_op/production/b_index.tsx","Routes":["./src/components/Authorized/AuthorizedRoute.tsx"]},{"path":"/layout_op/production/l_inspect","exact":true,"component":"./src/pages/layout_op/production/l_inspect.tsx","Routes":["./src/components/Authorized/AuthorizedRoute.tsx"]},{"path":"/login/b_index","exact":true,"component":"./src/pages/login/b_index.tsx","title":"仕点智能科技-生产管理系统-登录","Routes":["./src/components/Authorized/AuthorizedRoute.tsx"]},{"component":"() => React.createElement(require('D:/yxl/project/svnpro/web_pc3/node_modules/_umi-build-dev@1.9.3@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: false })"}]},{"component":"() => React.createElement(require('D:/yxl/project/svnpro/web_pc3/node_modules/_umi-build-dev@1.9.3@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: false })"}];




//******** Begin 测试 checkRoutesOuterHashPath */
assert.deepEqual( checkRoutesOuterHashPath([{path:'/abc'},{path:'/opc'},{path:'/abc'}],'/abc') ,{path:'/abc'})
assert.deepEqual( checkRoutesOuterHashPath([{path:'/abc'},{path:'/opc'},{path:'/abc'}],'/bc') ,false)
assert.deepEqual( checkRoutesOuterHashPath([{path:'/abc'},{path:'/opc'},{path:'/abc'}],'/opc') ,{path:'/opc'})
assert.deepEqual( checkRoutesOuterHashPath([{path:'/abc'},{path:'/opc'},{path:'/abc'}],'opc') ,false)
//********  测试 checkRoutesOuterHashPath  End*/


//******** Begin 测试 testInitParentRoutes */
function testInitParentRoutes(){
    let arr = [{path:'/abc'}] ;
    let route =  initParentRoutes(arr,'opc') ; 
    delete route.component ; 
    assert.deepEqual ( route , {path:'opc',routes:[]})
    assert.deepEqual ( arr ,[{path:'opc',routes:[]},{path:'/abc'}] )
}
testInitParentRoutes() ;
//********  测试 testInitParentRoutes  End*/



//******** Begin 测试 updateRouteLayout */
const testUpdateRouteLayout=()=>{
    let routes = cloneDeep(TestRoutesArr) ;
    updateRouteLayout(routes,routes) ; 
    var ck=(arr)=>{
        arr.forEach(d => {
              if( d.path && d.path.substring(0,0) ==='/layout_' ){//
                assert.fail('包含路径'+d.path+'失败');
              }
              if(d.routes){
                  ck(d.routes)
              }
        });
    }
    ck(routes) ;

    let routes2 = [
        {
            path:'/',
            component:'',
            routes:[
                {
                    path:'/layout_op/order',
                    component:'-' 
                }
            ]
        }
    ]
    updateRouteLayout(routes2,routes2) ;

    var rmC = (arr)=>{ // component 不测试
        arr.forEach(d=>{
            delete d.component  ; 
            if(d.routes){
                rmC(d.routes) ;
            }
        })
    }
    rmC(routes2) ;

    assert.deepEqual(routes2,[
        {
            path:'/op',
            routes:[
                {
                    path:'/op/order',
                }
            ]
        },
        {
            path:'/',
            routes:[
            ]
        }
    ])
    console.log("测试工具函数修改/layout_成功", routes2)
    // assert.deepEqual()
}; 

(()=>{
    testUpdateRouteLayout() ;
})();

//********  测试 updateRouteLayout  End*/

//******** Begin 测试 blankPageRoutes */
(()=>{
    let routes = cloneDeep(TestRoutesArr) ;
    updateRouteLayout(routes,routes) ; 
    setBlankRoutes(routes,routes) ;
    var ck=(arr)=>{
        arr.forEach(d => {
            var path = d.path || '' ; 
            let ar = path.split('/'), lastPath = ar[ar.length - 1];
            if (lastPath.substring(0, 2) == 'b_') {
                assert.fail('包含路径  ____ b_    空白页面'+d.path+'失败');
            }
              if(d.routes){
                  ck(d.routes)
              }
        });
    }
    ck(routes) ;
    console.log("， 和空白页面移动成功", routes)
})();
//********  测试 blankPageRoutes  End*/

//********  Begin 测试 updatePrefix  */
(()=>{
    let routes = cloneDeep(TestRoutesArr) ;
    updateRouteLayout(routes,routes) ; 
    setBlankRoutes(routes,routes) ;
    updatePrefix(routes,'/pms') ;
    var ck=(arr)=>{
        arr.forEach(d => {
            var path = d.path || '' ; 
            if(d.path && path.substring(0,4)!=='/pms'){
                assert.fail('统一添加前缀失败     '+d.path+'失败');
            }
              if(d.routes){
                  ck(d.routes)
              }
        });
    }
    ck(routes) ;
    
    console.log("测试统一添加前缀成功", routes)
})();
//********  测试 updatePrefix  End*/

//********  Begin 测试 set_layoutRoute  */
(()=>{
    let routes = cloneDeep(TestRoutesArr) ;
    updateRouteLayout(routes,routes) ; 
    setBlankRoutes(routes,routes) ;
    updatePrefix(routes,'/pms') ;
    set_layoutRoute(routes,routes)

    var ck=(arr)=>{
        arr.forEach(d => {
            var path = d.path || '' ; 
            if(d.path && path.substring(0,2)=='l_'){
                assert.fail('统一添加前缀失败  添加私有layout    页面'+d.path+'失败');
            }
              if(d.routes){
                  ck(d.routes)
              }
        });
    }
    ck(routes) ;
    // console.log("TCL: routes", routes)
    console.log("整体测试成功TCL: routes", routes)
})();

//********  测试 set_layoutRoute  End*/

//********  测试 set_layoutRoute  End*/
(()=>{
    // var arr = [{}]
    // set_layoutOrder
})();

//********  测试 set_layoutRoute  End*/

// console.log("TCL: arr", TestRoutesArr)






// updateRoute()

// updateRouteLayout(arr, arr);


// console.log("TCL: arr", arr)

// console.log("TCL: arr", arr)


// assert.deepEqual([[[1, 2, 3]], 4, 5], [[[1, 2, '3']], 4, 5]);
// assert.equal(1,2,[console.log('ok')]);
// assert.equal(1,2,['not equal']);

# umi-plugin-layout
解决 umi 只有一个模板 和 所有页面都要使用一个模板的问题
### 1.安装

```
npm nstall --save-dev umi-plugin-layout
```
### 2.在umi.js中添加插件
```
 plugins: [
    ['umi-plugin-layout', {
      prefix: '/pms'//给所有路由添加前缀 /pms
    }]
  ]
```
#### 修改所有路由以layout_开始的路由,添加layout模板为 layout_op   layout/op.jsx 为模板。 layout_op 中的op是例子
#### 修改所有路由以b_开始的路由,将 以b_开始的路由为一个新的路由不带任何模板
#### 修改所有路由以l_开始的路由,将当前文件夹的index 或者 b_index 作为模板


- pages 
    -  login
        -   b_index.tsx  ==// 路由为 /pms/login==(这是一个新页面，没有嵌套layout)
    -  layout_op
        -   pro.tsx ==// 路由为 /pms/op/pro==(路由模板为 layout/op.tsx)
        -   product
            -   b_index.tsx     ==//路由为  /pms/op/product==
            -   l_order.tsx  ==// 路由为 /pms/op/order (它的模板是 当前目录的b_index,*b_index是一个新页面没有模板*)==
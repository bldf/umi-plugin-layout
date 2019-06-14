# umi-plugin-layout
解决 umi 只有一个模板 和 所有页面都要使用一个模板的问题\
#### 修改所有路由,添加 所有路由以 ==layout_== 开头的为一个新模板
#### 修改所有路由,添加 所有路由以 ==b_== 开头的为一个新的空白页面
#### 修改所有路由,添加 所有路由以 ==l_== 开头的将当前文件夹的index 或者 b_index 作为模板

```
 plugins: [
    ['umi-plugin-layout', {
      prefix: '/pms'//给所有路由添加前缀 /pms
    }]
  ]
```
- pages 
    -  login
        -   b_index.tsx  ==// 路由为 /pms/login==
    -  layout_op
        -   pro.tsx ==// 路由为 /pms/op/pro==
        -   product
            -   b_index.tsx     ==//路由为  /pms/op/product==
            -   l_order.tsx  ==// 路由为 /pms/op/order (它的模板是 当前目录的b_index,*b_index是一个新页面没有模板**)==
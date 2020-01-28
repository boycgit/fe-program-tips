## 第 5 期 - 将异步函数 promise 化 {docsify-ignore-all}

## 视频讲解
<iframe class="article-video" src="" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

## 文字讲解

本期学习一则代码片段，用于 **将异步函数 promise 化*

> 为什么需要 promise 化？可参考 [promise 的优缺点？](https://github.com/es6-org/exploring-es6/blob/master/md/24.10.md)

### 1、代码片段

先给出代码片段源码：
```js
const promisify = func => (...args) =>
    new Promise((resolve, reject) =>
        func(...args, (err, result) => (err ? reject(err) : resolve(result)))
    );
```

可以直接将代码粘贴到控制台中去查看效果：（以下代码片段将延迟两秒打印出 “Hi”）
```js
const delay = promisify((d, cb) => setTimeout(cb, d));
delay(2000).then(() => console.log('Hi!')); 
```

### 2、对所要转化的异步函数是有要求的

上述工具代码片段 **对所要转化的异步函数是有要求的**：

 1. 异步函数 **最后一个入参** 必须是回调函数（callback）
 2. 该 callback 的入参形式为 **(err, ...values) => {…}**

为什么有这样的要求？

此代码片段是从 Node.js 代码程序中总结出来的。写过 Node.js 程序的人都知道，异步操作是 Node.js 中非常常见的操作，所以很有必要提取出将异步函数 promisify 的操作工具函数。

其次，在 Node 中异步回调有一个约定：**Error first**，也就是说 **回调函数中的第一个参数一定要是 Error 对象**，其余参数才是正确时的数据。这样的约定统一了异步函数的形式，对第三方工具、Node.js 体系自身的演化一致性起到重要作用 —— 这也是编程思想中 **“约定优于配置”** 的一种具体体现，能省略很多预处理的逻辑判断。

### 3、适用范围

上述代码片段可以正常运行在 **现代浏览器、Node.js** 环境中。

其实如果你所使用的 Node.js 版本在 v8.0.0+ 以上，就可以直接使用官方提供的 [util.promisify](https://nodejs.org/api/util.html#util_util_promisify_original)，不用上述代码片段 —— 虽说两者起到的功能是一样的，但能用官方的就 **优先使用官方提供的工具函数** 。

### 4、扩展 promisify 适用函数

上述的 promisify 工具函数对入参有条件，那如何扩展到任意异步函数呢？

如果是上述自定义的工具代码片段，只需要根据实际情况修改源码以下 1、2 两处标志处的代码即可：


如果是在 Node.js 中使用 [util.promisify](https://nodejs.org/api/util.html#util_util_promisify_original)，可以利用其提供的 Symbol 类型的 key - [util.promisify.custom](https://nodejs.org/api/util.html#util_custom_promisified_functions) 来自定义 promisify 行为，比如：

```js
const util = require('util');

function doSomething(foo, callback) {
  // ...
}

// 利用 util.promisify.custom 这个 key 自定义 promisify 行为
doSomething[util.promisify.custom] = (foo) => {
  return getPromiseSomehow();
};

// 调用 util.promisify 方法
const promisified = util.promisify(doSomething);

// 返回的 promisified 就是刚才自定义的 doSomething[util.promisify.custom] 函数
console.log(promisified === doSomething[util.promisify.custom]);
// prints 'true'
```


## 参考文档
 - [promisify](https://www.30secondsofcode.org/js/s/promisify)：30 seconds of code 中的代码片段
 - [util.promisify(original)](https://nodejs.org/api/util.html#util_util_promisify_original)：官方文档
 - [util.promisify 的那些事儿](https://juejin.im/post/5bc76ff56fb9a05cee1e14a9)：推荐阅读，util.promisify是在node.js 8.x版本中新增的一个工具，用于将老式的Error first callback转换为Promise对象，让老项目改造变得更为轻松
 - [[译] Node.js 8: util.promisify()](https://segmentfault.com/a/1190000009743481)：详细讲解 util.promisify 这个方法
 - [Custom promisified functions](https://nodejs.org/api/util.html#util_custom_promisified_functions)：官方的 `util.promisify.custom` API 文档
 - [Promise 的优缺点](https://github.com/es6-org/exploring-es6/blob/master/md/24.10.md)：简要罗列了 promise 的优缺点
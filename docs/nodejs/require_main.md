## 第 1 期 - require.main === module {docsify-ignore}


[视频讲解](https://v.qq.com/txp/iframe/player.html?vid=i3007g3ko4i ':include :type=iframe width=100% height=480px')

### 正文
今天要学习的是 **Node.js** 的 tips，是关于 `require.main === module` 这个条件判断语句的用处。

先了解两个前提知识：
 1. 当 Node.js 直接运行一个文件时，`require.main` 会被设为该文件模块的 `module`变量。 
 2. 在每个模块里面， `module` 表示指向当前模块的变量对象（可以理解成某种意义上的 `this` 变量）；注意 `module` 并不是全局对象，是局部变量。

这意味着可以通过 `require.main === module` 来判断一个文件是否被直接运行。


Node.js 官网 “[Accessing the main module](https://nodejs.org/api/modules.html#modules_accessing_the_main_module)” 中有言：

![require.main](https://raw.githubusercontent.com/boycgit/web-image/master/blog20191219200623.png)

简单翻译一下就是：
**可以通过 `require.main === module` 来判断当前文件是否直接被 node.js 执行，比如对 `foo.js` 文件，如果你执行了 `node foo.js`，那么这个条件语句结果是 `true`，如果是被其他文件以 `require('./foo')` 引用则为 `false`**

这个 `require.main === module` 判断语句，经常用在代码演示中（或者自测），比如我最近正在看 [loopback-next/context example 代码](https://github.com/strongloop/loopback-next/blob/master/examples/context/src/) 中的每个 js 文件文末最后都会有这样的代码：

![require.main](https://raw.githubusercontent.com/boycgit/web-image/master/blog20191217194932.png)

这就是为了用户可以方便单个直接执行该文件时（调用文件内定义的 `main` 函数）的运行输出结果。




### 参考文章
 - [Node.js, require.main === module](https://stackoverflow.com/questions/45136831/node-js-require-main-module)：如果想直接在 node.js 中运行代码，一般用这个条件
 - [require.main](https://nodejs.org/api/modules.html#modules_require_main)：官方文档对 require.main 的解释



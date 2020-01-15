
## 第 4 期 - 用 process.hrtime 获取纳秒级的计时精度 {docsify-ignore-all}

## 视频讲解
<iframe class="article-video" src="//player.bilibili.com/player.html?aid=83455727&cid=142771778&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

## 文字讲解

如果去**测试代码运行的时长**，你会选择哪个**时间函数**？ 一般第一时间想到的函数是 `Date.now` 或 `Date.getTime`。

### 1、先讲结论

在 Node.js 程序中，优先选 [process.hrtime](http://nodejs.cn/api/process/process_hrtime_time.html)，其次选 [performance.now](https://nodejs.org/api/perf_hooks.html#perf_hooks_performance_now)，最后才会是 [Date.now](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date)

之所以这么选，是基于 **精度** 和 **时钟同步** 两方面考虑的。

### 2、知识讲解

首先看一下 `Date.now` 的缺点
 1. 返回的时间精度为 **毫秒**（10^-3）级别，精度不够；
 2. 受到系统时间影响，也有可能被其他软件调整所影响

为了获得更高精度、且和系统时间无关的时间，W3C 制定了 [High Resolution Time Level 2](https://www.w3.org/TR/hr-time-2/) 标准，其中的 [6. Monotonic Clock](https://www.w3.org/TR/hr-time-2/#sec-monotonic-clock) 章节就规定了标准实现方需要提供 “单调递增” 的全局系统时钟：

![单调递增时钟](https://img.alicdn.com/tfs/TB1l7ypt2b2gK0jSZK9XXaEgFXa-881-323.png)

在 Node.js 和 浏览器中都实现了该标准，具体的实现就是 `performance` 对象。我们可以通过 [performance.now](https://nodejs.org/api/perf_hooks.html#perf_hooks_performance_now) 获取相对起点的时间戳，具备以下几个特性：
 1. 和 JS 中其他可用的时间类函数（比如 `Date.now` ）不同的是，`performance.now()` 返回的时间使用了一个浮点数来达到 **微秒（10^-6）** 级别的精确度
 2. 时间以一个 **恒定的速率** 慢慢 **增加** 的，它不会受到系统时间的影响（不会被其他软件所调整）
 3. 从标准定义看，可以存在 `clock drift` （允许时钟漂移）

![时钟漂移](https://img.alicdn.com/tfs/TB17uWst.T1gK0jSZFhXXaAtVXa-870-268.png)

> 这里大致说一下 `clock drift` 的概念，它是源于 **时钟同步** 概念。时钟同步（`Clock synchronization`）是计算机科学与工程学中的一个概念，旨在协调多个独立的时钟。现实中的多个时钟，即使时间已调至一致，但在一段时间后依然会因为时钟漂移（即`clock drift`）而显示不同的时间，因为它们计时的速率会略有差异。

是否有更精细的时钟存在呢？

有的，在 Node.js 环境中就提供了 [process.hrtime](http://nodejs.cn/api/process/process_hrtime_time.html) 方法：
 1. 在 node v0.7.6 版本中新增，兼容性很好（毕竟现在都 v12 LTS 版本了）
 2. 精度高达 **纳秒（10^-9）** 级别
 3. 不存在 **时钟漂移 (clock drift)**

可以说 `process.hrtime` 方法是 **专为测量时间间隔而打造** 的。
> 注：浏览器环境没有这个 `hrtime` 方法，因此浏览器环境所能达到的最高精度也就用 `performance.now` 的微秒级别（当然各个浏览器实现也是有差异）

只不过这个方法使用需要注意一下，首次调用返回的 `time` 需要作为后面调用的入参：

```js
const NS_PER_SEC = 1e9;
const time = process.hrtime(); // 这里第一次调用，返回 time 变量
// [ 1800216, 25 ]

setTimeout(() => {
  const diff = process.hrtime(time); // 用第一次返回的 time 变量作为入参放在第二次调用中，从而获取 diff 时间差值
  // [ 1, 552 ]

  console.log(`Benchmark took ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds`);
  // Benchmark took 1000000552 nanoseconds
}, 1000);
```

到这里本节主要内容讲完了，也就自然而然获得本节刚开始的结论。

### 3、小知识

如果你使用 Node.js **V10.7.0** 以上的版本，还可以使用 [hrtime.bigint](https://nodejs.org/api/process.html#process_process_hrtime_bigint) 方法，它是 `process.hrtime` 的 `bigint` 版本（`bigint` 类型从 v10.4 开始支持），返回当前的高精度实际时间。

这方法使用起来比 `process.hrtime` 更加方便，因为它不用额外的 `time` 入参，直接通过两次调用结果相减就能获得计算时间差：

```js
const start = process.hrtime.bigint();
// 191051479007711n

setTimeout(() => {
  const end = process.hrtime.bigint();
  // 191052633396993n

  console.log(`基准测试耗时 ${end - start} 纳秒`);
  // 基准测试耗时 1154389282 纳秒
}, 1000);
```

### 4、参考文章
 - [High Resolution Time Level 2](https://www.w3.org/TR/hr-time-2/)：w3c 中高精度时间的标准
 - [MDN - Performance.now](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance/now)：MDN 上 performance.now 的 API 文档
 - [Creating a timestamp](https://mythbusters.js.org/#/date/timestamp)：言简意赅的总结，本文的选材最初就是来源于此
 - [如何理解 clock drift 和 clock skew 这两个概念呢？](https://www.zhihu.com/question/274957596)：知乎上对这两个概念的回答
 - [Measure process time with Node Js?](https://stackoverflow.com/questions/48768758/measure-process-time-with-node-js)：SOF 上对该问题的解答，也是用 process.hrtime 进行高精度时间测量
 - [如何在Node.js中获得微时间？](https://cloud.tencent.com/developer/ask/84570)：可以看一下这个问题
 - [初探 performance – 监控网页与程序性能](http://www.alloyteam.com/2015/09/explore-performance/)：window.performance 提供了一组精确的数据，经过简单的计算就能得出一些网页性能数据
 - [页面性能监测之performance](https://juejin.im/post/5d53a1056fb9a06b1d213ac7)：详细介绍如何利用 performance 对象来评测页面性能

 
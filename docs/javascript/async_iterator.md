## 第 6 期 - 在 async iterator 上使用 for-await-of 语法糖 {docsify-ignore-all}

## 视频讲解
<iframe class="article-video" src="//player.bilibili.com/player.html?aid=95063109&cid=162283777&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

## 文字讲解

本期主要是讲解如何使用 `for-await-of` 语法糖进行异步操作迭代，让组织异步操作的代码更加简洁易读。

### 场景简述

以下代码中的 `for...of` 操作，打印顺序 "2、3、4"（总共耗费时间 4s）:
```js
const delay = (time) => () => setTimeout(() => { console.log(time) }, time * 1000);

const delays = [delay(3), delay(2), delay(4)];

for (cur of delays) {
    cur();
}
```
但我们想要以数组顺序打印 “3、2、4”（总共耗时9s），请问该如何实现？

### 同步迭代器

以常见的数组打印为例，下述代码会依次打印出 "0、1"：
```js
for(const cur of [0, 1]){
    console.log(cur);
}
```

那么如何用 **同步迭代器** 实现上述同等输出？

`Iterator` 是 ECMAScript 2015 引进的功能，它就是一个 `function`，只不过对这个 `function` 的形式有特殊的规定：
 1. 返回对象必须包含 `next` 属性，该属性也是 `function`
 2. 该 `next` 函数返回值必须返回包含 `done` 和 `value` 这两个字段的对象

有了 `Iterator`，就可以借助 `[Symbol.iterator]` 构造出 **可迭代对象（Iteratable）**：
```js
// 返回一个可迭代对象，注意 [Symbol.iterator] 这个 key 
const someIteratable = {
    [Symbol.iterator]: someIterator 
}
```

凡是可迭代对象就可以使用 `for...of` 语法，所以这是一种层层迭进的关系。

### 使用迭代器实现数组打印

知道了迭代器的概念后，就可以借助迭代器实现上述的数组打印功能，首先自定义构造出 `countIterator` 迭代器
```js
let count = 0;
function countIterator() {
    // 返回一个迭代器对象，对象的属性是一个 next 方法
    return {
        next: function () {
            if (count < 2) {
                // 当没有到达末尾时，返回当前值，并把索引加1
                return { value: count++, done: false };
            }

            // 到达末尾，done 属性为 true
            return { value: count, done: true };
        }
    };
}
```

然后创建出可迭代对象，由于该对象的行为和 `[0,1]` 这个数组类似，所以起名为 `customArray`：
```js
// 返回一个可迭代对象，注意 [Symbol.iterator] 这个 key 
const customArray = {
    [Symbol.iterator]: countIterator 
}
```

最后给这个可迭代对象应用 `for...of` 即可，就能打印出 `0、1` 内容：
```js
for (const cur of customArray) {
    console.log(cur)
}
```

通过这个例子你就应该比较容易迭代器的理解，其实 JS 原生的`String`、`Array`、`Map` 和 `Set` 等都是可迭代对象，**因为它们的原型对象都有一个 `Symbol.iterator` 方法**。

### 异步迭代器

理解了同步迭代器，那么 **异步迭代器**（Async Iterator）也就很容易理解了，它和同步迭代器的差别在于：
 1. 异步迭代器必须返回 **Promise** 对象，且该 Promise 返回 `{ value, done }` 格式对象
 2. 异步可迭代对象（Async Iteratable）用 **Symbol.asyncIterator** 作为 key
 3. 异步可迭代对象（Async Iteratable）可用 `for-await-of` 进行迭代

> Async iterator 是 ECMAScript 2018 引进的

借助异步迭代器就可以实现本期开头所讲的功能，实现自定义的 `delayIteraterable` 可迭代对象，它使用 `[Symbol.asyncIterator]` 作为 key，其 value 就是异步迭代器：
```js
const promisify = func => (...args) =>
    new Promise((resolve, reject) =>
        func(...args, (err, result) => (err ? reject(err) : resolve(result)))
    );

const delayIteraterable = {
    [Symbol.asyncIterator]: () => {
        return {
            next: () => {
                const cur = promisify(delays.shift());
                return cur().then(res => {
                    return {
                        done: delays.length === 0,
                        value: res
                    }
                });
            }
        }
    }
}
```
> 这里用到的 promisify 函数，具体可参考[前端 Tips - 第 5 期](./promisify.md)的内容讲解。

然后直接搭配 `for-await-of` 语法糖使用，就能进行异步迭代，按我们的要求依次输出 “3、2、4”（总共耗时9s）
```js
const execIt = async function () {
    for await (const cur of delayIteraterable) {
        console.log(cur);
    }
}
execIt();
```

### 扩展：Generator & Async Generator 

除了用迭代器生成 **可迭代对象** 外，还能用 `Generator`（生成器）生成 **可迭代对象**，而且一般来讲代码实现也更为紧凑。

由于时间关系就不展开了，感兴趣的可阅读文末的参考文章自行学习。本期的例子也提供了 generator 的版本可供参考，链接：https://github.com/boycgit/fe-program-tips/blob/master/src/6-async-iterator/async-yield.js


### 参考文档
 - [for await...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of)：官方 `for await...of` 教程
 - [Asynchronous Iterators in JavaScript](https://www.codementor.io/@tiagolopesferreira/asynchronous-iterators-in-javascript-jl1yg8la1)：通俗易懂的教程，条理清晰
 - [ES2018 新特征之：异步迭代器 for-await-of](https://segmentfault.com/a/1190000013387616)：ES 2018 系列教程中的异步迭代器教程
 - [map for async iterators in JavaScript](https://www.youtube.com/watch?v=lGg43tcQ5x4)：Youtube 上的教程，使用异步迭代器完成异步 mapper 操作
## 第 3 期 - 简写的 border-radius 100% 和 50% 是等效的 {docsify-ignore-all}

## 视频讲解
<iframe class="article-video" src="//player.bilibili.com/player.html?aid=82639410&cid=141392003&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

## 文字讲解

### 1、先讲结论

`border-radius` 这个 css 属性大家应该使用得非常娴熟，现实中用到的场景基本都是四个圆角一致的情况。

比如实现一个圆形按钮，其中 `border-radius` 数值有些人写为 `50%`，有些人则写成 `100%`，不过你会发现两者效果是一样的：

> 测试 HTML 代码如下：
```html
<style>
  .circle-btn {
    color: white;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
  }
</style>

<div class="circle-btn" style="
    background: #8BC34A;
    border-radius: 100%;
">50%</div>

<div class="circle-btn" style="
    background: #E91E63;
    border-radius: 100%;
">100%</div>
```

![result](https://img.alicdn.com/tfs/TB191yftrr1gK0jSZFDXXb9yVXa-246-129.png)

其实不论是 `50%` 还是 `100%`，只要将 `border-radius` 设置成 `x%`，且 `x >= 50` 都能获得和 `50%` 一样的效果。

如果不知道其中的原因，可以继续往下看。

### 2、原因分析

第 1 个知识点是 `border-radius` 的写法，最全的写法是这样的，记住这张图就行：
![示意图](https://img.alicdn.com/tfs/TB1W8Zytoz1gK0jSZLeXXb9kVXa-859-676.png)

> 详细教程可参考《[CSS Border-Radius Can Do That?](https://medium.com/9elements/css-border-radius-can-do-that-d46df1d013ae)》

第 2 个知识点是 `border-radius` 的标准，在[`border-radius` 标准中 Overlapping Curves 章节](https://drafts.csswg.org/css-backgrounds-3/#corner-overlap)里，有这么一段话：

![曲线重叠](https://raw.githubusercontent.com/boycgit/web-image/master/20200108002817.png)

简单翻译为：**角曲线不得重叠：当任意两个相邻边框半径的总和超过边框的长度时，UA（标准实现方）必须按比例减少所有边框半径的使用值，直到它们没有重叠**

我们知道两个前提：
 - 每一条边最高可用长度也就 100%；
 - 每一条边最多可以设置两个圆角曲线（在边的两端）

这两端的椭圆半轴长度设置值之和存在两者情况：
 - 设置值加起来不超过 100%，那么大伙儿各自安好，互不干扰；
 - 设置值加起来如果超过 100%，那需要按比例重新划分：比如一个设置 100%，一个设置成 300%，加起来就 400% 了（超过 100% 了） —— 那么实际上一个真正分得长度的 1/4，另一个真正分得长度的 3/4；

结合 **知识点 1** 和 **知识点 2** 就能得到文章最开始的结论了。

### 3、小工具 + 小练习

如果对 `border-radius` 的写法不太熟也没关系，有个[在线工具](https://9elements.github.io/fancy-border-radius/)可以帮你更好的理解。

另外，最近看到使用单个 div + `border-radius` 实现以下 “转动的太极图”，大伙儿可以练习一下：

![太极图](../images/taiji.gif)

具体实现可参考以下任意一篇文章：
 - [How to create a yin-yang symbol with pure CSS](https://blog.logrocket.com/how-to-create-yin-yang-symbol-pure-css/)：使用一个 div 元素纯 CSS 实现 “阴阳” 圆形，附 [源码](https://codepen.io/boycgit/pen/YzPEEqm)
 - [利用CSS3的border-radius绘制太极及爱心图案示例](http://www.word666.com/wangye/90992.html)：使用 border-radius 绘制太极和爱心
 - [CSS画各种图形（五角星、吃豆人、太极图等）](https://www.imooc.com/article/256689)：更多练手的 css 项目

> 也可以参考我所 [“抄写” 的代码](https://github.com/boycgit/fe-program-tips/blob/master/src/3-border-radius/yinyang.html)


### 4、参考文章

 - [MDN border-radius](https://developer.mozilla.org/zh-CN/docs/Web/CSS/border-radius): MDN 文档
 - [Spec border-radius](https://drafts.csswg.org/css-backgrounds-3/#border-radius): CSS3 中 border-radius 的规范
 - [CSS Border-Radius Can Do That?](https://medium.com/9elements/css-border-radius-can-do-that-d46df1d013ae)：强烈推荐这篇文章（附[中文译文](http://www.shejidaren.com/css-border-radius.html)），图文并茂，还带一个可视化工具
 - [Fancy-Border-Radius](https://9elements.github.io/fancy-border-radius/)：这个就是上一条所指的在线 border radius 工具，所见即所得的；边动手边学习，理解会快很多
 - [秋月何时了，CSS3 border-radius知多少？](https://www.zhangxinxu.com/wordpress/2015/11/css3-border-radius-tips/)：张鑫旭教程，行文幽默，讲解清晰详细
 - [了解 border-radius 的原理](https://blog.csdn.net/xiaoermingn/article/details/53497607)：用例子讲解 border-radius 的原理
 - [CSS border-radius:50%和100%的区别](https://blog.csdn.net/chy555chy/article/details/54783186)：本文主要是讨论 50% 和 100% 的设置值一样的原因

 - [border-radius](https://border-radius.com/)：专门生成 border-radius CSS3 代码的网站，也是所见即所得

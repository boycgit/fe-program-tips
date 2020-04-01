## 第 7 期 - 用 6 行代码实现文本复制 {docsify-ignore-all}

## 视频讲解


## 文字讲解

本期主要是讲一个 JS 技巧，用 6 行代码就实现文本复制的功能。

### 代码片段

核心的代码片段就 6 行，利用动态创建 `textarea`，和 `document.execCommand` 命令就实现了：
```js
const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};
```

### 替代方案

因为 `document.execCommand` 命令虽说还能使用，然而官方建议尽可能少用。官方比较推荐的还是 [Navigator.clipboard](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/clipboard) API，当然该对象还在草案状态，IE、Safari 也还不支持，所以兼容性需要考虑。

使用 [Clipboard_API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API) 就很方便实现 **复制**、**粘贴** 功能：

```js
const copyToClipboard = async str => {
    ...
    // 写入粘贴板
    await navigator.clipboard.writeText(str)
    ...
    // 读取粘贴板
    await navigator.clipboard.readText()
};
```


### 注意事项

 - 因为浏览器安全限制，**文本复制** 功能必须由用户主动触发（比如放在点击事件里），而不能一进页面就自动触发
 - 建议这个代码片段只是用于 **能力增强** 部分，就算牺牲掉该功能也没多大关系。
 - 如果非要用于主功能里，建议使用成熟的 [clipboard.js](https://github.com/zenorocha/clipboard.js) 开源库

### 参考文档
 - [Copying text to clipboard with JavaScript](https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f)：30 seconds of code
 - [How to copy to the clipboard using JavaScript](https://flaviocopes.com/clipboard-api/)：使用 Clipboard_API
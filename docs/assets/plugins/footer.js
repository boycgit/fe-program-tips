// 给每篇正文包装一层 div
function install(hook, vm) {
    // const dom = Docsify.dom
    var footer = `<section id="content-qr-footer"><p style="text-align: center">关注微信公众号，回复 “tips” + “期号” 获取往期 tip。（比如可以通过回复 “tips25” 获取 第 25  期 tips）</p> <section style="text-align: center"><img src="./images/blogqrcode2.jpg" /></section></section>`;
    hook.afterEach(function (html) {
        return html + footer
    });

    // 每次路由切换时数据全部加载完成后调用，没有参数。
    hook.doneEach(function () {
        //  让首页不出现二维码
        const $footer = document.querySelector('#content-qr-footer');
        if ($footer) {
            if (location.hash === "#/") {
                $footer.style.display = 'none';
            } else {
                $footer.style.display = 'block';
            }
        };
        // 初始化针对每个 tip 的留言
    });
}

$docsify.plugins = [].concat(install, $docsify.plugins)
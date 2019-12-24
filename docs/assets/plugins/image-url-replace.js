// 给每篇正文包装一层 div
function install(hook, vm) {
    // const dom = Docsify.dom
    // 只在线上环境进行替换
    const shouldReplace = location.host === 'boycgit.github.io';
    const REG_IMAGE_SRC = /src\=\"[^\"]*\/images\//g;

    const repalceImageSrc = function (str) {
        if (shouldReplace) {
            return str.replace(REG_IMAGE_SRC, `src="${DOCSIFY.BASE_URL}/images/`)
        } else {
            return str;
        }
    }

    hook.afterEach((html) => {
        return repalceImageSrc(html);
    });
}

$docsify.plugins = [].concat(install, $docsify.plugins)
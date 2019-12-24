// 给每篇正文包装一层 div
function install(hook, vm) {
    // const dom = Docsify.dom

    hook.afterEach((html) => {
        return `<div id="${DOCSIFY.ID_CONTENT}">` + html + '</div>';
    });
}

$docsify.plugins = [].concat(install, $docsify.plugins)
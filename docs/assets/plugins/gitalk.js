function install(hook, vm) {
    const dom = Docsify.dom

    hook.afterEach((html) => {
        const main = dom.getNode('#main');
        const gitTalkConent = `<div id="gitalk-container" style="width: ${main.clientWidth}px; margin: 0 auto 20px;"></div>`
        return html + gitTalkConent
    });

    hook.doneEach(_ => {
        const el = document.getElementById('gitalk-container')
        while (el.hasChildNodes()) {
            el.removeChild(el.firstChild)
        }
        const contentBody = dom.getNode('#article-wrappe').innerHTML;
        // console.log('xxx', document.title, contentBody);
        // 初始化 gitalk
        const gitalk = new Gitalk({
            clientID: '23a07f304b5bc80b9da2',
            clientSecret: 'ee28eb5e64c8795c8d38765d9ed4587578fcb377',
            repo: 'fe-program-tips',
            owner: 'boycgit',
            admin: ['boycgit'],
            id: location.hash.replace('#/', ''),
            body: location.href + contentBody,
            // title: ,
            // facebook-like distraction free mode
            distractionFreeMode: false
        });
        // eslint-disable-next-line
        gitalk.render('gitalk-container');
    })
}

$docsify.plugins = [].concat(install, $docsify.plugins)
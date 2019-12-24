const baseUrl = 'https://boycgit.github.io/fe-program-tips';
const isDebug = /debug=true/.test(location.href);
window.DOCSIFY = {
    ID_CONTENT: 'article-wrapper',
    BASE_URL: baseUrl,
    IS_DEBUG: isDebug
}
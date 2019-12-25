
function plus(a, b) {
    return a + b;
}

module.exports = plus;

if(require.main === module) {
    console.log('plus: 1 + 2 = ', plus(1, 2));
}


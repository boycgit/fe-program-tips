const delay = (time) => (cb) => setTimeout(() => { console.log(time); cb && cb(); }, time * 1000);

const delays = [delay(3), delay(2), delay(4)];

const promisify = func => (...args) =>
    new Promise((resolve, reject) =>
        func(...args, (err, result) => (err ? reject(err) : resolve(result)))
    );

const delayIteraterable = {
    // 注意：generator 生成器不能使用箭头函数
    // refer: https://stackoverflow.com/questions/27661306/can-i-use-es6s-arrow-function-syntax-with-generators-arrow-notation
    [Symbol.asyncIterator]: async function* () {

        while (delays.length) {
            // it waits for the promise to resolve
            yield await promisify(delays.shift())();
        }
    }
}

const execIt = async function () {
    for await (const cur of delayIteraterable) {
        console.log(cur);
    }
}
execIt();
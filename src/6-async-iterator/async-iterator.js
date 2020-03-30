const delay = (time) => (cb) => setTimeout(() => { console.log(time);  cb && cb();}, time * 1000);

const delays = [delay(3), delay(2), delay(4)];

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

const execIt = async function () {
    for await (const cur of delayIteraterable) {
        console.log(cur);
    }
}
execIt();
let count = 0;
function countIterator() {
    // 返回一个迭代器对象，对象的属性是一个 next 方法
    return {
        next: function () {
            if (count < 2) {
                // 当没有到达末尾时，返回当前值，并把索引加1
                return { value: count++, done: false };
            }

            // 到达末尾，done 属性为 true
            return { value: count, done: true };
        }
    };
}

// 返回一个可迭代对象，注意 [Symbol.iterator] 这个 key 
const customArray = {
    [Symbol.iterator]: countIterator
}

for (const cur of customArray) {
    console.log(cur)
}
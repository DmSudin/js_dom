uniq([1, 2, 2, 3, 1, 4]); // 1, 2, 3, 4
uniq(['a', 'a', 'b', 'c', 'c']); // 'a', 'b', 'c'
uniq(['a', 'a', 'b', 'c', 'c', 'd', 'a', 'e', 'f', 'f']);


function uniq(src) {
    const result = [];
    src.forEach(element => {
        if (!result.find(elem => element === elem)) {
            result.push(element);
        }
    });
    console.log(result);
}
function trimSymbols(src, repeatLimit) {
    const result = [];
    const [...arr] = [...src];
    let repeatStartPos = undefined;
    let repeatEndPos = undefined;
    let repeatFound = false;

    i = 1;
    while (i < arr.length - 1) {
        if (arr[i] === arr[i-1]) {
            repeatFound = true;
            repeatStartPos = i-1;
            for (j = i+1; j <= arr.length-1; j++) {

                if (arr[j] !== arr[repeatStartPos]) {
                    repeatEndPos = j-1;
                    i = j;
                    repeatFound = false;
                    break;
                }
                if ((j === arr.length -1) && (arr[j] === arr[repeatStartPos])) {
                    repeatEndPos = j;
                    i = j;
                    break;
                }
            }
            // console.log('repeat start', repeatStartPos);
            // console.log('symbol', arr[repeatStartPos]);
            // console.log('repeat end', repeatEndPos);

            for (let index = 0; index < repeatLimit; index++) {
                result.push(arr[repeatStartPos]);
            }
        }
        else i++;
    }
    return result.join('');
}

console.log(trimSymbols('xxx', 3));
console.log(trimSymbols('xxx', 2));
console.log(trimSymbols('xxx', 1));
console.log(trimSymbols('xxxaaaaa', 2));
console.log(trimSymbols('xxxaaaaabbb', 2));


console.log(trimSymbols('xxxaaaaab', 2));



function sortStrings(src, type) {

    if (type === 'asc') {
        for (let j = 0; j < src.length; j++) {
            for (let i=0; i<src.length; i++) {
                if (src[i] > src[i+1]) {
                    let tmp = src[i];
                    src[i] = src[i+1];
                    src[i+1] = tmp;
                }
            }
        }
    }
    else {
        console.log(type);
        tmp = null;
        for (let j = 0; j < src.length; j++) {
            for (let i=src.length-1; i>0; i--) {
                if (src[i-1] < src[i]) {
                    let tmp = src[i];
                    src[i] = src[i-1];
                    src[i-1] = tmp;
                }
            }
        }
    }


return src;
}
// console.log(sortStrings(['д', 'я', 'а', 'ё', 'б', 'в'], 'asc'));
// console.log(sortStrings(['б', 'я', 'ё', 'а', 'д', 'в'], 'desc'));

function pick(obj, ...fields) {
    const resultObject = {};
    fields.forEach(element => {
        const value = obj[`${element}`]
        resultObject[`${element}`] = value;
    });
    return resultObject;
}

function omit(obj, ...fields) {
    const resultObject = {};
    const keys = Object.keys(obj);
    const arr = keys.filter((elem) => fields.includes(elem));
    arr.forEach(element => {
        resultObject[`${element}`] = obj[element];
    });
    return resultObject;
}

const fruits = {
    apple: 2,
    orange: 4,
    banana: 3,
};


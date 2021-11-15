function createGetter(field) {
    return function(obj) {
        const params = field.split('.');
        // console.log('params', params);
        // console.log(obj['category.title']);
        // console.log(`obj${}`);
        // query =
    }

}

const product = {
    category: {
        title: {
            name: 'John',
        }
    }
}
console.log(product['category']);

const getter = createGetter('category.title');
// console.log(getter(product)); // {name: 'John'}


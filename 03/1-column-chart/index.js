class ColumnChart {
    constructor(data, label, link, value) {
        [this.data, this.label, this.link, this.value] = [...arguments];
        console.log(this.data);
        console.log(this.label);
        console.log(this.link);
        console.log(this.value);
    }

    render() {
    }
}

chart = new ColumnChart([1, 2, 3], 'somelabel', 'https://ya.ru', 55000);
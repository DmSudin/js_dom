
class ColumnChart {
    constructor(data, label, link, value) {
        [this.data, this.label, this.link, this.value] = [...arguments];
        this.render();
    }


    getDataHtml = function(data) {
        const rowCount = data.length;
        const flexBasis = `${100 / rowCount}%`;
        let HtmlString = '';

        data.forEach(element => {
            HtmlString += `<div class="chart__row" style="height: ${element}px;"> </div>`;
        });
        return HtmlString;
    }

    render() {
        if (this.link) {
            this.linkText = `<a href="${this.link}">View all</a>`;
        }

        const element = document.createElement('div');
        element.innerHTML = `
        <div class="chart">
            <div class="chart__caption">
                <div class="chart__label">${this.label}</div>
                <div class="chart__link">${this.linkText}</div>
            </div>
            <div class="chart__value">${this.value}</div>
            <div class="chart__graph"></div>
        </div>
        `;

        const graph = element.querySelector('div.chart__graph');
        graph.innerHTML = this.getDataHtml(this.data);
        this.element = element.firstElementChild;
    }
}
export default { ColumnChart };

const chart = new ColumnChart([60, 80, 100, 12, 12, 23, 34, 45, 56, 67, 78, 78, 60, 80, 100, 12, 12, 23, 34, 45, 56, 67, 78, 78], '', 'https://ya.ru');
const element = document.getElementById("root");
root.append(chart.element);
var colorPalette = ['#3c44b1','#f83245',  '#f4772e', '#f83245', '#11c5db']

var optionsBar = {
    chart: {
        type: 'bar',
        height: 380,
        width: '100%',
        stacked: true,
    },
    plotOptions: {
        bar: {
            columnWidth: '45%',
        }
    },
    colors: colorPalette,
    series: [{
        name: "Clothing",
        data: [42, 52, 16, 55, 59, 51, 45, 32, 26, 33, 44, 51, 42, 56],
    }, {
        name: "Food Products",
        data: [6, 12, 4, 7, 5, 3, 6, 4, 3, 3, 5, 6, 7, 4],
    }],
    labels: [10,11,12,13,14,15,16,17,18,19,20,21,22,23],
    xaxis: {
        labels: {
            show: false
        },
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false
        },
    },
    yaxis: {
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false
        },
        labels: {
            style: {
                color: '#78909c'
            }
        }
    },
}

var chartBar = new ApexCharts(document.querySelector('#bar'), optionsBar);
chartBar.render();

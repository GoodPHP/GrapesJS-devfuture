Apex.grid = {
    padding: {
        right: 0,
        left: 0
    }
}

Apex.dataLabels = {
    enabled: false
}

var randomizeArray = function (arg) {
    var array = arg.slice();
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// data for the sparklines that appear below header area
var sparklineData = [47, 45, 54, 38, 56, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93, 53, 61, 27, 54, 43, 19, 46];

// the default colorPalette for this dashboard
//var colorPalette = ['#01BFD6', '#5564BE', '#F7A600', '#EDCD24', '#F74F58'];
var colorPalette = ['#3c44b1','#f83245',  '#f4772e', '#f83245', '#11c5db']

var monthlyEarningsOpt = {
    chart: {
        type: 'area',
        height: 260,
        background: '#eff4f7',
        sparkline: {
            enabled: true
        },
    },
    stroke: {
        curve: 'straight'
    },
    fill: {
        type: 'solid',
        opacity: 1,
    },
    series: [{
        data: randomizeArray(sparklineData)
    }],
    xaxis: {
        crosshairs: {
            width: 1
        },
    },
    yaxis: {
        min: 0,
        max: 130
    },
    colors: ['#dce6ec'],
}

var monthlyEarningsChart = new ApexCharts(document.querySelector("#monthly-earnings-chart"), monthlyEarningsOpt);


var optionsArea = {
    chart: {
        height: 340,
        type: 'area',
        zoom: {
            enabled: false
        },
    },
    stroke: {
        curve: 'straight'
    },
    colors: colorPalette,
    series: [
        {
            name: "Blog",
            data: [{
                x: 0,
                y: 0
            }, {
                x: 4,
                y: 5
            }, {
                x: 5,
                y: 3
            }, {
                x: 9,
                y: 8
            }, {
                x: 14,
                y: 4
            }, {
                x: 18,
                y: 5
            }, {
                x: 25,
                y: 0
            }]
        },
        {
            name: "Social Media",
            data: [{
                x: 0,
                y: 0
            }, {
                x: 4,
                y: 6
            }, {
                x: 5,
                y: 4
            }, {
                x: 14,
                y: 8
            }, {
                x: 18,
                y: 5.5
            }, {
                x: 21,
                y: 6
            }, {
                x: 25,
                y: 0
            }]
        },
        {
            name: "External",
            data: [{
                x: 0,
                y: 0
            }, {
                x: 2,
                y: 5
            }, {
                x: 5,
                y: 4
            }, {
                x: 10,
                y: 11
            }, {
                x: 14,
                y: 4
            }, {
                x: 18,
                y: 8
            }, {
                x: 25,
                y: 0
            }]
        }
    ],
    fill: {
        opacity: 1,
    },
    markers: {
        size: 0,
        style: 'hollow',
        hover: {
            opacity: 5,
        }
    },
    tooltip: {
        intersect: true,
        shared: false,
    },
    xaxis: {
        tooltip: {
            enabled: false
        },
        labels: {
            show: false
        },
        axisTicks: {
            show: false
        }
    },
    yaxis: {
        tickAmount: 4,
        max: 12,
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
    legend: {
        show: false
    }
}

var chartArea = new ApexCharts(document.querySelector('#area'), optionsArea);
chartArea.render();

var optionDonut = {
    chart: {
        type: 'donut',
        width: '100%'
    },
    dataLabels: {
        enabled: false,
    },
    plotOptions: {
        pie: {
            donut: {
                size: '55%',
            },
        },
        stroke: {
            colors: undefined
        }
    },
    colors: colorPalette,
    series: [21, 23, 19, 14, 6],
    labels: ['Clothing', 'Food Products', 'Electronics', 'Kitchen Utility', 'Gardening'],
    legend: {
        position: 'bottom',
    }
}

var donut = new ApexCharts(
    document.querySelector("#donut"),
    optionDonut
)
donut.render();


function trigoSeries(cnt, strength) {
    var data = [];
    for (var i = 0; i < cnt; i++) {
        data.push((Math.sin(i / strength) * (i / strength) + i / strength+1) * (strength*2));
    }

    return data;
}



var optionsLine = {
    chart: {
        height: 340,
        type: 'line',
        zoom: {
            enabled: false
        }
    },
    plotOptions: {
        stroke: {
            width: 4,
            curve: 'smooth'
        },
    },
    colors: colorPalette,
    series: [
        {
            name: "Day Time",
            data: trigoSeries(52, 20)
        },
        {
            name: "Night Time",
            data: trigoSeries(52, 27)
        },
    ],
    markers: {
        size: 0
    },

    grid: {

    },
    xaxis: {
        labels: {
            show: false
        },
        axisTicks: {
            show: false
        },
        tooltip: {
            enabled: false
        }
    },
    yaxis: {
        tickAmount: 2,
        labels: {
            show: false
        },
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false
        },
        min: 0,
    },
    legend: {
        position: 'top',
        horizontalAlign: 'left',
    }

}

var chartLine = new ApexCharts(document.querySelector('#line'), optionsLine);

// a small hack to extend height in website sample dashboard
chartLine.render().then((function () {
    var ifr = document.querySelector("#wrapper");
    if (ifr.contentDocument) {
        ifr.style.height = ifr.contentDocument.body.scrollHeight + 20 + 'px';
    }
}));


// on smaller screen, change the legends position for donut
var mobileDonut = function() {
    if($(window).width() < 768) {
        donut.updateOptions({
            plotOptions: {
                pie: {

                }
            },
            legend: {
                position: 'bottom'
            }
        }, false, false)
    }
    else {
        donut.updateOptions({
            plotOptions: {
                pie: {

                }
            },
            legend: {
                position: 'left'
            }
        }, false, false)
    }
}

$(window).resize((function() {
    mobileDonut()
}))

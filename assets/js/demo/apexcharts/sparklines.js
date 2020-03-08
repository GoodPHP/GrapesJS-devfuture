// Generate Randoms

var randomizeArray = function (arg) {
    var array = arg.slice();
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (0 !== currentIndex) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};


// Sparklines examples initialization

var sparklineData = [47, 45, 54, 38, 56, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93, 53, 61, 27, 54, 43, 19, 46];

// Primary

var sparklinesPrimary = {
    chart: {
        type: 'line',
        height: 100,
        sparkline: {
            enabled: true
        },
    },
    colors: ["#3c44b1"],
    stroke: {
        width: 3,
        curve: 'smooth',
    },

    markers: {
        size: 0
    },
    tooltip: {
        fixed: {
            enabled: true
        },
        x: {
            show: false
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return '';
                }
            }
        },
        marker: {
            show: false
        }
    },
    series: [{
        data: randomizeArray(sparklineData)
    }],
    yaxis: {
        min: 0
    },
};

var sparklinePrimary = new ApexCharts(
    document.querySelector(".sparkline-primary"),
    sparklinesPrimary
);
sparklinePrimary.render();

var sparklinePrimary2 = new ApexCharts(
    document.querySelector(".sparkline-primary-2"),
    sparklinesPrimary
);
sparklinePrimary2.render();

// First

var sparklinesFirst = {
    chart: {
        type: 'line',
        height: 100,
        sparkline: {
            enabled: true
        },
    },
    colors: ["#4191ff"],
    stroke: {
        width: 3,
        curve: 'smooth',
    },

    markers: {
        size: 0
    },
    tooltip: {
        fixed: {
            enabled: true
        },
        x: {
            show: false
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return '';
                }
            }
        },
        marker: {
            show: false
        }
    },
    series: [{
        data: randomizeArray(sparklineData)
    }],
    yaxis: {
        min: 0
    },
};

var sparklineFirst = new ApexCharts(
    document.querySelector(".sparkline-first"),
    sparklinesFirst
);
sparklineFirst.render();

// Warning

var sparklinesWarning = {
    chart: {
        type: 'line',
        height: 100,
        sparkline: {
            enabled: true
        },
    },
    stroke: {
        width: 3,
        curve: 'smooth'
    },
    colors: ['#f4772e'],
    markers: {
        size: 0
    },
    tooltip: {
        fixed: {
            enabled: true
        },
        x: {
            show: false
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return '';
                }
            }
        },
        marker: {
            show: false
        }
    },
    series: [{
        data: randomizeArray(sparklineData)
    }],
    yaxis: {
        min: 0
    },
};

var sparklineWarning = new ApexCharts(
    document.querySelector(".sparkline-warning"),
    sparklinesWarning
);
sparklineWarning.render();

// Danger

var sparklinesDanger = {
    chart: {
        type: 'line',
        height: 100,
        sparkline: {
            enabled: true
        },
    },
    colors: ['#f83245'],
    stroke: {
        width: 3,
        curve: 'smooth'
    },

    markers: {
        size: 0
    },
    tooltip: {
        fixed: {
            enabled: true
        },
        x: {
            show: false
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return '';
                }
            }
        },
        marker: {
            show: false
        }
    },
    series: [{
        data: randomizeArray(sparklineData)
    }],
    yaxis: {
        min: 0
    },
};

var sparklineDanger = new ApexCharts(
    document.querySelector(".sparkline-danger"),
    sparklinesDanger
);
sparklineDanger.render();

var sparklineDanger2 = new ApexCharts(
    document.querySelector(".sparkline-danger-2"),
    sparklinesDanger
);
sparklineDanger2.render();

// Success Gradient Sparkline

var sparklinesGradientSuccess = {
    chart: {
        type: 'area',
        height: 150,
        sparkline: {
            enabled: true
        },
    },
    colors: ['#1bc943'],
    stroke: {
        width: 4,
        curve: 'smooth'
    },

    markers: {
        size: 0
    },
    tooltip: {
        fixed: {
            enabled: false
        },
        x: {
            show: false
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return '';
                }
            }
        },
        marker: {
            show: false
        }
    },
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 90, 100]
        }
    },
    series: [{
        data: randomizeArray(sparklineData)
    }],
    yaxis: {
        min: 0
    },
};

var sparklineGradientSuccess = new ApexCharts(
    document.querySelector(".sparkline-gradient-success"),
    sparklinesGradientSuccess
);
sparklineGradientSuccess.render();

var sparklineGradientSuccess2 = new ApexCharts(
    document.querySelector(".sparkline-gradient-success-2"),
    sparklinesGradientSuccess
);
sparklineGradientSuccess2.render();

var sparklineGradientSuccess3 = new ApexCharts(
    document.querySelector(".sparkline-gradient-success-3"),
    sparklinesGradientSuccess
);
sparklineGradientSuccess3.render();

// Danger Gradient Sparkline

var sparklinesGradientDanger = {
    chart: {
        type: 'area',
        height: 150,
        sparkline: {
            enabled: true
        },
    },
    colors: ['#f83245'],
    stroke: {
        width: 4,
        curve: 'smooth'
    },

    markers: {
        size: 0
    },
    tooltip: {
        fixed: {
            enabled: false
        },
        x: {
            show: false
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return '';
                }
            }
        },
        marker: {
            show: false
        }
    },
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 90, 100]
        }
    },
    series: [{
        data: randomizeArray(sparklineData)
    }],
    yaxis: {
        min: 0
    },
};
var sparklinesGradientDanger2 = {
    chart: {
        type: 'line',
        height: 150,
        sparkline: {
            enabled: true
        },
    },
    colors: ['#f83245'],
    stroke: {
        width: 4,
        curve: 'smooth'
    },

    markers: {
        size: 0
    },
    tooltip: {
        fixed: {
            enabled: false
        },
        x: {
            show: false
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return '';
                }
            }
        },
        marker: {
            show: false
        }
    },
    series: [{
        data: randomizeArray(sparklineData)
    }],
    yaxis: {
        min: 0
    },
};

var sparklineGradientDanger = new ApexCharts(
    document.querySelector(".sparkline-gradient-danger"),
    sparklinesGradientDanger
);
sparklineGradientDanger.render();

// Danger Gradient Sparkline 2

var sparklineGradientDanger2 = new ApexCharts(
    document.querySelector(".sparkline-gradient-danger-2"),
    sparklinesGradientDanger2
);
sparklineGradientDanger2.render();

// Danger Gradient Sparkline 3

var sparklineGradientDanger3 = new ApexCharts(
    document.querySelector(".sparkline-gradient-danger-3"),
    sparklinesGradientDanger
);
sparklineGradientDanger3.render();

// Primary Gradient Sparkline

var sparklinesGradientPrimary = {
    chart: {
        type: 'area',
        height: 150,
        sparkline: {
            enabled: true
        },
    },
    colors: ['#3c44b1'],
    stroke: {
        width: 4,
        curve: 'smooth'
    },

    markers: {
        size: 0
    },
    tooltip: {
        fixed: {
            enabled: false
        },
        x: {
            show: false
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return '';
                }
            }
        },
        marker: {
            show: false
        }
    },
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 90, 100]
        }
    },
    series: [{
        data: randomizeArray(sparklineData)
    }],
    yaxis: {
        min: 0
    },
};

var sparklineGradientPrimary = new ApexCharts(
    document.querySelector(".sparkline-gradient-primary"),
    sparklinesGradientPrimary
);
sparklineGradientPrimary.render();

// Primary Gradient Sparkline 2

var sparklineGradientPrimary2 = new ApexCharts(
    document.querySelector(".sparkline-gradient-primary-2"),
    sparklinesGradientPrimary
);
sparklineGradientPrimary2.render();


// Warning Gradient Sparkline

var sparklinesGradientWarning = {
    chart: {
        type: 'area',
        height: 134,
        sparkline: {
            enabled: true
        },
    },
    colors: ['#f4772e'],
    stroke: {
        width: 4,
        curve: 'smooth'
    },

    markers: {
        size: 0
    },
    tooltip: {
        fixed: {
            enabled: false
        },
        x: {
            show: false
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return '';
                }
            }
        },
        marker: {
            show: false
        }
    },
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 90, 100]
        }
    },
    series: [{
        data: randomizeArray(sparklineData)
    }],
    yaxis: {
        min: 0
    },
};

var sparklineGradientWarning = new ApexCharts(
    document.querySelector(".sparkline-gradient-warning"),
    sparklinesGradientWarning
);
sparklineGradientWarning.render();

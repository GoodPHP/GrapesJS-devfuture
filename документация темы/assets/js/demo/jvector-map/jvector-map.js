// jVector map init

jVectorMap = (function () {
    var e = $('[data-toggle="jvector-map"]'), a = {
        gray: {
            100: "#f8f9ff",
            200: "#f4f5fd",
            300: "#eeeff8",
            400: "#e6e7f1",
            500: "#dfe0ea",
            600: "#d1d2db",
            700: "#a6a6b9",
            800: "#7a7b97",
            900: "#3b3e66",
        },
        theme: {
            primary: "#4191ff",
            secondary: "#070919",
            info: "#18e1a5",
            success: "#1bc943",
            danger: "#f83245",
            warning: "#f4772e"
        },
        black: "#070919",
        white: "#ffffff",
        transparent: "transparent"
    };
    e.length && e.each((function () {
        var e, t;
        e = $(this), t = {
            map: e.data("map"),
            zoomOnScroll: !1,
            scaleColors: ["#4191ff", "#f4772e"],
            normalizeFunction: "polynomial",
            hoverOpacity: .7,
            hoverColor: !1,
            backgroundColor: a.transparent,
            regionStyle: {
                initial: {
                    fill: a.gray[200],
                    "fill-opacity": .8,
                    stroke: "none",
                    "stroke-width": 0,
                    "stroke-opacity": 1
                },
                hover: {fill: a.gray[300], "fill-opacity": .8, cursor: "pointer"},
                selected: {fill: "yellow"},
                selectedHover: {}
            },
            markerStyle: {
                initial: {fill: a.theme.warning, "stroke-width": 0},
                hover: {fill: a.theme.info, "stroke-width": 0}
            },
            markers: [{latLng: [41.9, 12.45], name: "Vatican City"}, {
                latLng: [43.73, 7.41],
                name: "Monaco"
            }, {latLng: [35.88, 14.5], name: "Malta"}, {
                latLng: [1.3, 103.8],
                name: "Singapore"
            }, {latLng: [1.46, 173.03], name: "Kiribati"}, {
                latLng: [-21.13, -175.2],
                name: "Tonga"
            }, {latLng: [15.3, -61.38], name: "Dominica"}, {
                latLng: [-20.2, 57.5],
                name: "Mauritius"
            }, {latLng: [26.02, 50.55], name: "Bahrain"}],
            series: {
                regions: [{
                    values: {
                        AU: 760,
                        BR: 550,
                        CA: 120,
                        DE: 1300,
                        FR: 540,
                        GB: 690,
                        GE: 200,
                        IN: 200,
                        RO: 600,
                        RU: 300,
                        US: 2920
                    }, scale: [a.gray[400], a.gray[500]], normalizeFunction: "polynomial"
                }]
            }
        }, e.vectorMap(t), e.find(".jvectormap-zoomin").addClass("btn btn-primary"), e.find(".jvectormap-zoomout").addClass("btn btn-primary")
    }))
})()

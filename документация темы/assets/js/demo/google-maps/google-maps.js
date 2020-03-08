color = "#ffffff";

function initMap() {
    map = document.getElementById("map-example"), lat = map.getAttribute("data-latitude"), lng = map.getAttribute("data-longitude");
    var e = new google.maps.LatLng(lat, lng), a = {
        zoom: 5,
        scrollwheel: !1,
        center: e,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [{
            featureType: "administrative",
            elementType: "labels.text.fill",
            stylers: [{color: "#3b3e66"}]
        }, {featureType: "landscape", elementType: "all", stylers: [{color: "#f4f5fd"}]}, {
            featureType: "poi",
            elementType: "all",
            stylers: [{visibility: "on"}]
        }, {
            featureType: "road",
            elementType: "all",
            stylers: [{saturation: -100}, {lightness: 45}]
        }, {
            featureType: "road.highway",
            elementType: "all",
            stylers: [{visibility: "simplified"}]
        }, {
            featureType: "road.arterial",
            elementType: "labels.icon",
            stylers: [{visibility: "off"}]
        }, {featureType: "transit", elementType: "all", stylers: [{visibility: "on"}]}, {
            featureType: "water",
            elementType: "all",
            stylers: [{color: color}, {visibility: "on"}]
        }]
    };
    map = new google.maps.Map(map, a);
    var t = new google.maps.Marker({
            position: e,
            map: map,
            animation: google.maps.Animation.DROP,
            title: "Hello World!"
        }),
        n = new google.maps.InfoWindow({content: '<div class="text-center p-3"><h5>Maps pointers</h5><p class="font-size-lg text-black-50 mb-0">This is a custom example using the popular Google Maps platform.</p></div>'});
    google.maps.event.addListener(t, "click", (function () {
        n.open(map, t)
    }))
}

($map = $("#map-example")).length && google.maps.event.addDomListener(window, "load", initMap);

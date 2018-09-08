var gmarkers = [];
var markers = [];
var gmarkersTop = [];
var markersTop = [];
var markersUrl = [];
var markersUrlTop = [];
var filterSwitch = [1, 1, 1, 1, 1, 1];

function initMap() {
    var lilis = [];
    var imglilitype = ['', './img/icon_blue.png', './img/icon_lightblue.png', './img/icon_yellow.png', './img/icon_red.png', './img/icon_lime.png'];
    $.getJSON('https://spreadsheets.google.com/feeds/list/1eUgqe2z8gL1d9GrY2LwpAAxW9Wh2xOKOopqDNcISdpE/1/public/values?alt=json', function (dataLog) {
            console.log("gJson");
            var dataAmount = dataLog.feed.entry.length;
            console.log(dataAmount);
            for (var i = 0; i < dataAmount; i++) {
                var aZ = dataLog.feed.entry[i].gsx$z.$t;
                var aName = dataLog.feed.entry[i].gsx$liliname.$t;
                var aLatitude = dataLog.feed.entry[i].gsx$lati.$t;
                var aLongtitude = dataLog.feed.entry[i].gsx$longi.$t;
                var alilitype = dataLog.feed.entry[i].gsx$lilitype.$t;
                lilis[i] = [aName, aLatitude, aLongtitude, alilitype, aZ];
                console.log(lilis[i]);

                var marker = new google.maps.Marker({
                    url: './lili.html?liliID=' + aZ,
                    position: {
                        lat: parseFloat(aLatitude),
                        lng: parseFloat(aLongtitude)
                    },
                    map: map,
                    title: aName,
                    icon: {
                        url: imglilitype[alilitype],
                        //url: './img/avatar/' + aZ + '.png',
                        scaledSize: new google.maps.Size(70, 100)
                    },

                });
                var markerTop = new google.maps.Marker({
                    url: './lili.html?liliID=' + aZ,
                    position: {
                        lat: parseFloat(aLatitude),
                        lng: parseFloat(aLongtitude)
                    },
                    map: map,
                    title: aName,
                    icon: {
                        //url: imglilitype[alilitype],
                        url: './img/avatar_circle/' + aZ + '.png',
                        scaledSize: new google.maps.Size(52, 52),
                        anchor: new google.maps.Point(26, 95),
                    },

                });
                //                marker2.bindTo("position", marker);
                markers.push(alilitype);
                gmarkers.push(marker);
                markersTop.push(alilitype);
                gmarkersTop.push(markerTop);
                markersUrl.push(aZ);
                markersUrlTop.push(aZ);

                marker.addListener('click', function () {
                    location.href = this.url;
                });
                markerTop.addListener('click', function () {
                    location.href = this.url;
                });
            } //end for
        } //end function data
    ); //end get JSON

    var myLatLng = {
        lat: 24.9947383,
        lng: 121.1893604
    };
    //    var lilis = [
    //        ['肉圓', 24.9947383, 121.1893604, '../img/icon_lightblue.png'],
    //        ['肉圓2', 24.965992, 121.220625, '../img/icon_blue.png'],
    //        ['肉圓3', 24.960049, 121.225325, '../img/icon_lime.png'],
    //        ['肉圓4', 24.957740, 121.231640, '../img/icon_red.png'],
    //        ['肉圓5', 24.954472, 121.235953, '../img/icon_yellow.png']
    //    ];

    var map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 24.962903,
            lng: 121.213771
        },
        zoom: 13,
        styles: [{
                "elementType": "geometry",
                "stylers": [{
                    "color": "#f5f5f5"
                        }]
                    },
            {
                "elementType": "labels.icon",
                "stylers": [{
                    "visibility": "off"
                        }]
                    },
            {
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#616161"
                        }]
                    },
            {
                "elementType": "labels.text.stroke",
                "stylers": [{
                    "color": "#f5f5f5"
                        }]
                    },
            {
                "featureType": "administrative.country",
                "elementType": "geometry.fill",
                "stylers": [{
                    "visibility": "simplified"
                        }]
                    },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "geometry.fill",
                "stylers": [{
                        "color": "#ffeb3b"
                            },
                    {
                        "visibility": "simplified"
                            }
                        ]
                    },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#bdbdbd"
                        }]
                    },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#eeeeee"
                        }]
                    },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#757575"
                        }]
                    },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#e5e5e5"
                        }]
                    },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#9e9e9e"
                        }]
                    },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#f7dead"
                        }]
                    },
            {
                "featureType": "road.arterial",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#757575"
                        }]
                    },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#dadada"
                        }]
                    },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#616161"
                        }]
                    },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#9e9e9e"
                        }]
                    },
            {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#e5e5e5"
                        }]
                    },
            {
                "featureType": "transit.station",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#eeeeee"
                        }]
                    },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#b0f1f3"
                        }]
                    },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#9e9e9e"
                        }]
                    }
                ]
    });
}

function switchFilter(ind) {
    filterSwitch[ind] *= -1;
    for (i = 0; i < markers.length; i++) {
        if (filterSwitch[ind] < 0) {
            if (markers[i] == ind) gmarkers[i].setVisible(false);
            if (markersTop[i] == ind) gmarkersTop[i].setVisible(false);
            $("#navBar a:nth-child(" + ind + ")").addClass("switchOff");
        } else {
            if (markers[i] == ind) gmarkers[i].setVisible(true);
            if (markersTop[i] == ind) gmarkersTop[i].setVisible(true);
            $("#navBar a:nth-child(" + ind + ")").removeClass("switchOff");
        }
    }
}

function initMap() {
    var lilis = [];
    var imglilitype = ['', '../img/icon_blue.png', '../img/icon_lightblue.png', '../img/icon_yellow.png', '../img/icon_red.png', '../img/icon_lime.png'];
    $.getJSON('https://spreadsheets.google.com/feeds/list/1eUgqe2z8gL1d9GrY2LwpAAxW9Wh2xOKOopqDNcISdpE/1/public/values?alt=json', function (dataLog) {
            console.log("gJson");
            var dataAmount = dataLog.feed.entry.length;
            console.log(dataAmount);
            for (var i = 0; i < dataAmount; i++) {
                var aName = dataLog.feed.entry[i].gsx$liliname.$t;
                var aLatitude = dataLog.feed.entry[i].gsx$lati.$t;
                var aLongtitude = dataLog.feed.entry[i].gsx$longi.$t;
                var alilitype = dataLog.feed.entry[i].gsx$lilitype.$t;
                lilis[i] = [aName, aLatitude, aLongtitude, alilitype];
                console.log(lilis[i]);

                var marker = new google.maps.Marker({
                    position: {
                        lat: parseFloat(aLatitude),
                        lng: parseFloat(aLongtitude)
                    },
                    map: map,
                    title: aName,
                    icon: {
                        url: imglilitype[alilitype],
                        scaledSize: new google.maps.Size(140, 200)
                    },

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

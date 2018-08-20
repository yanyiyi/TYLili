function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
};

var lilis = [];
var imglilitype = ['', '../img/icon_blue.png', '../img/icon_lightblue.png', '../img/icon_yellow.png', '../img/icon_red.png', '../img/icon_lime.png'];
$.getJSON('https://spreadsheets.google.com/feeds/list/1eUgqe2z8gL1d9GrY2LwpAAxW9Wh2xOKOopqDNcISdpE/1/public/values?alt=json', function (dataLog) {

        //        console.log("gJson");
        var i = GetURLParameter("liliID") - 1;
        //        console.log(i);
        var aName = dataLog.feed.entry[i].gsx$liliname.$t;
        //        var aLatitude = dataLog.feed.entry[i].gsx$lati.$t;
        //        var aLongtitude = dataLog.feed.entry[i].gsx$longi.$t;
        var alilitype = dataLog.feed.entry[i].gsx$lilitype.$t;
        //        alert(aName);
        $("#liName").text(aName);
    } //end function data
); //end get JSON

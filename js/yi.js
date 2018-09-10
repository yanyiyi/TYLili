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
$.getJSON('https://spreadsheets.google.com/feeds/list/1vunxJbdBnE8tkz7FXPGNUuocVWTCUpyEm84kE-R58Q4/1/public/values?alt=json', function (dataLog) {

        //        console.log("gJson");
        var i = GetURLParameter("artist") - 1;
        var j = GetURLParameter("artist");
        //        console.log(i);
        if (j == null) {
            i = Math.floor(Math.random() * (14 - 1));
            j = i + 1;
        }
        var aNameTw = dataLog.feed.entry[i].gsx$nametw.$t;
        var aNameEng = dataLog.feed.entry[i].gsx$nameeng.$t;
        var aCommunity = dataLog.feed.entry[i].gsx$community.$t;
        var aYTLink = dataLog.feed.entry[i].gsx$ytlink.$t;
        var aNationTw = dataLog.feed.entry[i].gsx$nationtw.$t;
        var aNationEng = dataLog.feed.entry[i].gsx$nationeng.$t;


        $("title").append(aNameTw + "・" + aNameEng);
        $('meta[itemprop="name"]').attr("content", "藝遊中壢上河圖 - 藝術家／" + aNameTw + "・" + aNameEng);
        $('meta[name="twitter:title"]').attr("content", "藝遊中壢上河圖 - 藝術家／" + aNameTw + "・" + aNameEng);
        $('meta[property="og:title"]').attr("content", "藝遊中壢上河圖 - 藝術家／" + aNameTw + "・" + aNameEng);

        $("#liName").append(aNameTw + "<br>" + aNameEng);

        $(".tagSet").append(aNationTw + "<br>" + aNationEng)
        $('meta[property="og:url"]').attr("content", "https://lili.tyc.land/y.html?artist=" + j);

        $("#liliMain iframe.youtube-player").attr("src", "https://www.youtube.com/embed/" + aYTLink);
        var aStorySplit = aCommunity.split(" ");
        for (var aSS = 0; aSS < aStorySplit.length; aSS++) {
            $(".aContext").append("<p>" + aStorySplit[aSS] + "</p>");
        }


    } //end function data
); //end get JSON

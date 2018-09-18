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
        var j = GetURLParameter("liliID");
        //        console.log(i);
        if (j == null) {
            i = Math.floor(Math.random() * (50 - 1));
            j = i + 1;
        }
        var aName = dataLog.feed.entry[i].gsx$liliname.$t;
        var aWhere = dataLog.feed.entry[i].gsx$wherecome.$t;
        var aWhen = dataLog.feed.entry[i].gsx$whencome.$t;
        var aYTLink = dataLog.feed.entry[i].gsx$ytlink.$t;
        var alilitype = dataLog.feed.entry[i].gsx$lilitype.$t;
        var aStory = dataLog.feed.entry[i].gsx$story.$t;
        var aIntro = dataLog.feed.entry[i].gsx$intro.$t;
        //        alert(aName);

        $("title").append("－No." + j + " LiLi：" + aName);
        $('meta[itemprop="name"]').attr("content", "LiLi's 我的壢歷史－No." + j + " LiLi：" + aName);
        $('meta[name="twitter:title"]').attr("content", "LiLi's 我的壢歷史－No." + j + " LiLi：" + aName);
        $('meta[property="og:title"]').attr("content", "LiLi's 我的壢歷史－No." + j + " LiLi：" + aName);
        $('meta[property="og:description"]').attr("content", aIntro);
        $('meta[name="twitter:description"]').attr("content", aIntro);
        $('meta[name="description"]').attr("content", aIntro);
        $('meta[itemprop="description"]').attr("content", aIntro);
        $("#liName").text(aName);
        var avatarImg = "./img/avatar/" + j + ".png";
        var avatarImgOG = "https://lili.tyc.land/img/avatar/" + j + ".png";
        $("#liImg").attr("src", avatarImg);
        $('meta[property="og:image"]').attr("content", avatarImgOG);
        $('meta[name="twitter:image:src"]').attr("content", avatarImgOG);
        $('meta[name="twitter:card"]').attr("content", avatarImgOG);
        $('meta[itemprop="image"]').attr("content", avatarImgOG);
        $('meta[property="og:url"]').attr("content", "https://lili.tyc.land/lili.html?liliID=" + j);

        $(".tagSet").append(aWhen + " " + aWhere + "<br/>");
        if (alilitype == 1) $(".tagSet").append("<a href='./index.html?liliType=1'><img src='./img/mark_1.png'/>清代時期</a>");
        if (alilitype == 2) $(".tagSet").append("<a href='./index.html?liliType=2'><img src='./img/mark_2.png'/>日治時期</a>");
        if (alilitype == 3) $(".tagSet").append("<a href='./index.html?liliType=3'><img src='./img/mark_3.png'/>國民政府來台</a>");
        if (alilitype == 4) $(".tagSet").append("<a href='./index.html?liliType=4'><img src='./img/mark_4.png'/>城市蓬勃發展</a>");
        if (alilitype == 5) $(".tagSet").append("<a href='./index.html?liliType=5'><img src='./img/mark_5.png'/>城市多元蛻變</a>");
        $("#liliMain iframe.youtube-player").attr("src", "https://www.youtube.com/embed/" + aYTLink);
        var aStorySplit = aStory.split(" ");
        for (var aSS = 0; aSS < aStorySplit.length; aSS++) {
            $(".aContext").append("<p>" + aStorySplit[aSS] + "</p>");
        }
        var oldPhotoExist = dataLog.feed.entry[i].gsx$photoam.$t;
        var photolilis = [];
        if (oldPhotoExist > 0) $.getJSON('https://spreadsheets.google.com/feeds/list/1pqIU16Nbk5so8FRx8USA5nvacA2gBLVahnVb0dIe9z8/1/public/values?alt=json', function (photoLog) {
            var photoAmount = photoLog.feed.entry.length;
            console.log(photoAmount, j);
            var zPhotoAmount = 0;
            for (var k = 0; k < photoAmount; k++) {
                var pID = photoLog.feed.entry[k].gsx$p.$t;
                //                console.log(zID);
                if (pID === j) {
                    zPhotoAmount++;
                    console.log(zPhotoAmount, oldPhotoExist);
                    var pEvent = photoLog.feed.entry[k].gsx$event.$t;
                    var pPoint = photoLog.feed.entry[k].gsx$point.$t;
                    var pTime = photoLog.feed.entry[k].gsx$time.$t;
                    var pFileid = photoLog.feed.entry[k].gsx$fileid.$t;
                    console.log(pID, pEvent, pPoint, pTime);
                    $("#oldPhoto").append("<a class='oPhotos' data-lightbox='example-set' data-title='" + pEvent + "・" + pPoint + "・" + pTime + "' href='./img/oldphoto/" + pID + "/" + pFileid + ".jpg' ><div class='oImg'><img src='./img/oldphoto/" + pID + "/" + pFileid + ".jpg'/></div><div class='oContent'>" + pEvent + "<br/><span class='pWid'>" + pPoint + "・" + pTime + "</span></div></a>");
                }
            }
        }); //end of photoLog

    } //end function data
); //end get JSON

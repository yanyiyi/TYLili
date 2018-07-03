 $(document).ready(function () {
     $(function () {
         var aLatitude = [];
         var aLongtitude = [];
         var dataAmount = 0;
         console.log("w");
         $.getJSON('https://spreadsheets.google.com/feeds/list/1eUgqe2z8gL1d9GrY2LwpAAxW9Wh2xOKOopqDNcISdpE/1/public/values?alt=json', function (dataLog) {
                 console.log("gJson");
                 dataAmount = dataLog.feed.entry.length;
                 console.log(dataAmount);
                 for (var i = 0; i < dataAmount; i++) {
                     aLatitude[i] = dataLog.feed.entry[i].gsx$lati.$t;
                     aLongtitude[i] = dataLog.feed.entry[i].gsx$longi.$t;
                     $('#ext').append(aLatitude[i] + aLongtitude[i]);
                 } //end for
             } //end function data
         ); //end get JSON
     }); //end function
 });

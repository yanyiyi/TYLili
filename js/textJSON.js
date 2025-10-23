 $(document).ready(function () {
     $(function () {
         var aLatitude = [];
         var aLongtitude = [];
         var dataAmount = 0;
         console.log("w");
         $.getJSON('https://script.google.com/macros/s/AKfycbxscTjzWn9YTZ_Vmrrs-mB_DQZDrORmzlXdQrgL-2YxKkVYq9js4WlzM5zIAg8PYjPjVQ/exec', function (dataLog) {
                 console.log("gJson");
                 dataAmount = dataLog.feed.entry.length;
                 console.log(dataAmount);
                 for (var i = 0; i < dataAmount; i++) {
                     aLatitude[i] = dataLog.feed.entry[i].gsx$lati.$t;
                     aLongtitude[i] = dataLog.feed.entry[i].gsx$longi.$t;
                     $('#ext').append("<br>" + aLatitude[i] + "," + aLongtitude[i]);
                 } //end for
             } //end function data
         ); //end get JSON
     }); //end function
 });

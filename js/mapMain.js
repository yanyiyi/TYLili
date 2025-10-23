// === utils ===
function GetURLParameter(sParam) {
  const sPageURL = window.location.search.substring(1);
  const sURLVariables = sPageURL.split('&');
  for (let i = 0; i < sURLVariables.length; i++) {
    const [k, v] = sURLVariables[i].split('=');
    if (k === sParam) return decodeURIComponent(v || '');
  }
  return null;
}

// 將各種回傳格式「歸一化」成統一欄位
function normalizeRows(dataLog) {
  // 1) 舊版 Google Sheets JSON feed
  if (dataLog && dataLog.feed && Array.isArray(dataLog.feed.entry)) {
    return dataLog.feed.entry.map((e, i) => ({
      z: e['gsx$z']?.$t ?? String(i + 1),
      liliname: e['gsx$liliname']?.$t ?? '',
      lati: e['gsx$lati']?.$t ?? '',
      longi: e['gsx$longi']?.$t ?? '',
      lilitype: e['gsx$lilitype']?.$t ?? '',
      wherecome: e['gsx$wherecome']?.$t ?? '',
      whencome: e['gsx$whencome']?.$t ?? ''
    }));
  }

  // 2) 常見 Apps Script 回傳：陣列或物件載著 data/records/rows/items
  const candidate =
    Array.isArray(dataLog) ? dataLog :
    dataLog?.data || dataLog?.records || dataLog?.rows || dataLog?.items || [];

  if (Array.isArray(candidate)) {
    return candidate.map((e, i) => ({
      z: e.z ?? e.id ?? String(i + 1),
      liliname: e.liliname ?? e.name ?? '',
      lati: String(e.lati ?? e.lat ?? ''),
      longi: String(e.longi ?? e.lng ?? e.lon ?? ''),
      lilitype: String(e.lilitype ?? e.type ?? e.liliType ?? ''),
      wherecome: e.wherecome ?? e.where ?? '',
      whencome: e.whencome ?? e.when ?? ''
    }));
  }

  console.warn('無法辨識的資料格式：', dataLog);
  return [];
}

// === globals (沿用你的變數) ===
var gmarkers = [];
var markers = [];
var gmarkersTop = [];
var markersTop = [];
var markersUrl = [];
var markersUrlTop = [];
var filterSwitch = [1, 1, 1, 1, 1, 1];

// === 主程式 ===
function initMap() {
  const imglilitype = ['', './img/icon_blue.png', './img/icon_lightblue.png', './img/icon_yellow.png', './img/icon_red.png', './img/icon_lime.png'];

  // 1) 先建立地圖（避免資料 callback 超車）
  const map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 24.962903, lng: 121.213771 },
    zoom: 13,
    styles: [
      {"elementType":"geometry","stylers":[{"color":"#f5f5f5"}]},
      {"elementType":"labels.icon","stylers":[{"visibility":"off"}]},
      {"elementType":"labels.text.fill","stylers":[{"color":"#616161"}]},
      {"elementType":"labels.text.stroke","stylers":[{"color":"#f5f5f5"}]},
      {"featureType":"administrative.country","elementType":"geometry.fill","stylers":[{"visibility":"simplified"}]},
      {"featureType":"administrative.land_parcel","elementType":"geometry.fill","stylers":[{"color":"#ffeb3b"},{"visibility":"simplified"}]},
      {"featureType":"administrative.land_parcel","elementType":"labels.text.fill","stylers":[{"color":"#bdbdbd"}]},
      {"featureType":"poi","elementType":"geometry","stylers":[{"color":"#eeeeee"}]},
      {"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},
      {"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#e5e5e5"}]},
      {"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#9e9e9e"}]},
      {"featureType":"road","elementType":"geometry","stylers":[{"color":"#f7dead"}]},
      {"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},
      {"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#dadada"}]},
      {"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#616161"}]},
      {"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#9e9e9e"}]},
      {"featureType":"transit.line","elementType":"geometry","stylers":[{"color":"#e5e5e5"}]},
      {"featureType":"transit.station","elementType":"geometry","stylers":[{"color":"#eeeeee"}]},
      {"featureType":"water","elementType":"geometry","stylers":[{"color":"#b0f1f3"}]},
      {"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#9e9e9e"}]}
    ]
  });

  // 2) 再抓資料
  $.getJSON(
    'https://script.google.com/macros/s/AKfycbxscTjzWn9YTZ_Vmrrs-mB_DQZDrORmzlXdQrgL-2YxKkVYq9js4WlzM5zIAg8PYjPjVQ/exec',
    function (dataLog) {
      const ltypeParam = GetURLParameter("liliType");
      const rows = normalizeRows(dataLog);
      console.log('筆數：', rows.length);

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];

        // 轉型 & 防呆
        const aZ = String(row.z || (i + 1));
        const aName = row.liliname || '';
        const aLatitude = parseFloat(row.lati);
        const aLongtitude = parseFloat(row.longi);
        const alilitypeNum = Math.max(1, Math.min(5, parseInt(row.lilitype, 10) || 1));
        const aWhere = row.wherecome || '';
        const aWhen = row.whencome || '';
        const avatarImg = "./img/avatar/" + (i + 1) + ".png";

        // 無座標就跳過
        if (!isFinite(aLatitude) || !isFinite(aLongtitude)) continue;

        // 右側清單：若有篩選參數，就只顯示該類
        if (ltypeParam === null || String(alilitypeNum) === ltypeParam) {
          if ($(".lilisSet").length > 0) {
            $(".lilisSet:first").clone().appendTo("#liliList");
            $(".lilisSet:last").attr("href", "./lili.html?liliID=" + aZ);
            $(".lilisSet:last .liName").text(aName);
            $(".lilisSet:last .liImg").attr("src", avatarImg);
            $(".lilisSet:last .tagSet").html(aWhen + "  " + aWhere + "<br/>");
            if (alilitypeNum === 1) $(".lilisSet:last .tagSet").append("<img src='./img/mark_1.png'/>清國時期");
            if (alilitypeNum === 2) $(".lilisSet:last .tagSet").append("<img src='./img/mark_2.png'/>日本時期");
            if (alilitypeNum === 3) $(".lilisSet:last .tagSet").append("<img src='./img/mark_3.png'/>國民政府來台");
            if (alilitypeNum === 4) $(".lilisSet:last .tagSet").append("<img src='./img/mark_4.png'/>城市蓬勃發展");
            if (alilitypeNum === 5) $(".lilisSet:last .tagSet").append("<img src='./img/mark_5.png'/>城市多元蛻變");
          }
        }

        // 底層圖標
        const marker = new google.maps.Marker({
          url: './lili.html?liliID=' + aZ,
          position: { lat: aLatitude, lng: aLongtitude },
          map,
          title: aName,
          icon: {
            url: imglilitype[alilitypeNum] || imglilitype[1],
            scaledSize: new google.maps.Size(70, 100)
          }
        });

        // 頂層頭像
        const markerTop = new google.maps.Marker({
          url: './lili.html?liliID=' + aZ,
          position: { lat: aLatitude, lng: aLongtitude },
          map,
          title: aName,
          icon: {
            url: './img/avatar_circle/' + aZ + '.png',
            scaledSize: new google.maps.Size(52, 52),
            anchor: new google.maps.Point(26, 95),
          }
        });

        // 索引與點擊
        markers.push(alilitypeNum);
        gmarkers.push(marker);
        markersTop.push(alilitypeNum);
        gmarkersTop.push(markerTop);
        markersUrl.push(aZ);
        markersUrlTop.push(aZ);

        marker.addListener('click', function () { location.href = this.url; });
        markerTop.addListener('click', function () { location.href = this.url; });
      }

      // 移除模板那一筆
      if (rows.length > 0 && $(".lilisSet").length > 0) {
        $(".lilisSet:first").remove();
      }

      checkLiliType();
    }
  ).fail(function (jqxhr, textStatus, error) {
    console.error('讀取資料失敗：', textStatus, error);
  });
}

// === 下面兩個沿用你原本的函式，不用改 ===
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

function checkLiliType() {
  var litype = GetURLParameter("liliType");
  if (litype != null) {
    console.log(litype);
    for (var z = 1; z <= 5; z++) {
      if (z != litype) {
        switchFilter(z);
      }
    }
  }
}

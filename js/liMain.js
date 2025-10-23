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

// 將主資料各種回傳格式「歸一化」成統一欄位
function normalizeRows(dataLog) {
  // 1) 舊版 Google Sheets JSON feed
  if (dataLog && dataLog.feed && Array.isArray(dataLog.feed.entry)) {
    return dataLog.feed.entry.map((e, i) => ({
      liliname: e['gsx$liliname']?.$t ?? '',
      wherecome: e['gsx$wherecome']?.$t ?? '',
      whencome: e['gsx$whencome']?.$t ?? '',
      ytlink: e['gsx$ytlink']?.$t ?? '',
      lilitype: e['gsx$lilitype']?.$t ?? '',
      story: e['gsx$story']?.$t ?? '',
      intro: e['gsx$intro']?.$t ?? '',
      photoam: e['gsx$photoam']?.$t ?? '0',
      z: e['gsx$z']?.$t ?? String(i + 1)
    }));
  }

  // 2) 常見 Apps Script 回傳：陣列或物件載著 data/records/rows/items
  const candidate =
    Array.isArray(dataLog) ? dataLog :
    dataLog?.data || dataLog?.records || dataLog?.rows || dataLog?.items || [];

  if (Array.isArray(candidate)) {
    return candidate.map((e, i) => ({
      liliname: e.liliname ?? e.name ?? '',
      wherecome: e.wherecome ?? e.where ?? '',
      whencome: e.whencome ?? e.when ?? '',
      ytlink: e.ytlink ?? e.youtube ?? '',
      lilitype: String(e.lilitype ?? e.type ?? e.liliType ?? ''),
      story: e.story ?? '',
      intro: e.intro ?? '',
      photoam: String(e.photoam ?? e.photo_count ?? '0'),
      z: e.z ?? e.id ?? String(i + 1)
    }));
  }

  console.warn('無法辨識的資料格式：', dataLog);
  return [];
}

// 舊照片資料歸一化（若之後改成 Apps Script 也能吃）
function normalizePhotoRows(photoLog) {
  if (photoLog && photoLog.feed && Array.isArray(photoLog.feed.entry)) {
    return photoLog.feed.entry.map((e) => ({
      p: e['gsx$p']?.$t ?? '',
      event: e['gsx$event']?.$t ?? '',
      point: e['gsx$point']?.$t ?? '',
      time: e['gsx$time']?.$t ?? '',
      fileid: e['gsx$fileid']?.$t ?? ''
    }));
  }
  const candidate =
    Array.isArray(photoLog) ? photoLog :
    photoLog?.data || photoLog?.records || photoLog?.rows || photoLog?.items || [];
  if (Array.isArray(candidate)) {
    return candidate.map((e) => ({
      p: String(e.p ?? e.person ?? e.id ?? ''),
      event: e.event ?? e.title ?? '',
      point: e.point ?? e.location ?? '',
      time: e.time ?? e.date ?? '',
      fileid: e.fileid ?? e.fileId ?? e.filename ?? ''
    }));
  }
  console.warn('無法辨識的照片資料格式：', photoLog);
  return [];
}

// === 你原本的變數（保留與路徑一致） ===
var lilis = [];
var imglilitype = ['', '../img/icon_blue.png', '../img/icon_lightblue.png', '../img/icon_yellow.png', '../img/icon_red.png', '../img/icon_lime.png'];

// === 主流程 ===
$.getJSON(
  'https://script.google.com/macros/s/AKfycbxscTjzWn9YTZ_Vmrrs-mB_DQZDrORmzlXdQrgL-2YxKkVYq9js4WlzM5zIAg8PYjPjVQ/exec',
  function (dataLog) {
    const rows = normalizeRows(dataLog);

    // 取得 liliID（1-based）；若無就隨機一筆
    let i = (parseInt(GetURLParameter("liliID"), 10) || 0) - 1;
    let j = parseInt(GetURLParameter("liliID"), 10) || 0;

    if (!(j > 0) || i < 0 || i >= rows.length) {
      i = Math.floor(Math.random() * Math.max(1, rows.length));
      j = i + 1;
    }

    const row = rows[i] || {};
    const aName = row.liliname || '';
    const aWhere = row.wherecome || '';
    const aWhen = row.whencome || '';
    const aYTLink = row.ytlink || '';
    const alilitype = Math.max(1, Math.min(5, parseInt(row.lilitype, 10) || 1)); // 1..5
    const aStory = row.story || '';
    const aIntro = row.intro || '';
    const oldPhotoExist = parseInt(row.photoam, 10) || 0;

    // === SEO / OG / 版面填值 ===
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
    if (alilitype === 1) $(".tagSet").append("<a href='./index.html?liliType=1'><img src='./img/mark_1.png'/>清代時期</a>");
    if (alilitype === 2) $(".tagSet").append("<a href='./index.html?liliType=2'><img src='./img/mark_2.png'/>日治時期</a>");
    if (alilitype === 3) $(".tagSet").append("<a href='./index.html?liliType=3'><img src='./img/mark_3.png'/>國民政府來台</a>");
    if (alilitype === 4) $(".tagSet").append("<a href='./index.html?liliType=4'><img src='./img/mark_4.png'/>城市蓬勃發展</a>");
    if (alilitype === 5) $(".tagSet").append("<a href='./index.html?liliType=5'><img src='./img/mark_5.png'/>城市多元蛻變</a>");

    // Youtube：若 aYTLink 是純 ID，這樣就 OK；若是完整網址可再補 parse 規則。
    if (aYTLink) {
      $("#liliMain iframe.youtube-player").attr("src", "https://www.youtube.com/embed/" + aYTLink);
    }

    // 內文切段：原本用空白切；若來源其實是以換行分段，也一併支援
    const aStorySplit = aStory.indexOf('\n') >= 0 ? aStory.split(/\r?\n/) : aStory.split(' ');
    for (let aSS = 0; aSS < aStorySplit.length; aSS++) {
      const seg = aStorySplit[aSS].trim();
      if (seg) $(".aContext").append("<p>" + seg + "</p>");
    }

    // 舊照片載入（保留你原本的資料夾結構）
    if (oldPhotoExist > 0) {
      $.getJSON(
        'https://spreadsheets.google.com/feeds/list/1pqIU16Nbk5so8FRx8USA5nvacA2gBLVahnVb0dIe9z8/1/public/values?alt=json',
        function (photoLog) {
          const photos = normalizePhotoRows(photoLog);
          let zPhotoAmount = 0;
          const jStr = String(j);

          for (let k = 0; k < photos.length; k++) {
            const pID = String(photos[k].p || '');
            if (pID === jStr) {
              zPhotoAmount++;
              const pEvent = photos[k].event || '';
              const pPoint = photos[k].point || '';
              const pTime  = photos[k].time  || '';
              const pFileid = photos[k].fileid || '';
              $("#oldPhoto").append(
                "<a class='oPhotos' data-lightbox='example-set' data-title='" + pEvent + "・" + pPoint + "・" + pTime +
                "' href='./img/oldphoto/" + pID + "/" + pFileid + ".jpg'>" +
                  "<div class='oImg'><img src='./img/oldphoto/" + pID + "/" + pFileid + ".jpg'/></div>" +
                  "<div class='oContent'>" + pEvent + "<br/><span class='pWid'>" + pPoint + "・" + pTime + "</span></div>" +
                "</a>"
              );
            }
          }
          console.log('已載入舊照數：', zPhotoAmount, '（預期：', oldPhotoExist, '）');
        }
      ).fail(function (jqxhr, textStatus, error) {
        console.error('讀取舊照片資料失敗：', textStatus, error);
      });
    }
  }
).fail(function (jqxhr, textStatus, error) {
  console.error('讀取主資料失敗：', textStatus, error);
});

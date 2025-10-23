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
const typeBadges = {
  1: { icon: './img/mark_1.png', label: '清代時期', link: './index.html?liliType=1' },
  2: { icon: './img/mark_2.png', label: '日治時期', link: './index.html?liliType=2' },
  3: { icon: './img/mark_3.png', label: '國民政府來台', link: './index.html?liliType=3' },
  4: { icon: './img/mark_4.png', label: '城市蓬勃發展', link: './index.html?liliType=4' },
  5: { icon: './img/mark_5.png', label: '城市多元蛻變', link: './index.html?liliType=5' }
};

function normalizeYouTubeId(raw) {
  if (!raw) return '';
  const value = String(raw).trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(value)) return value;
  try {
    const url = new URL(value, 'https://www.youtube.com');
    if (url.hostname.includes('youtu.be')) {
      const id = url.pathname.replace(/^\//, '').slice(0, 11);
      if (/^[A-Za-z0-9_-]{11}$/.test(id)) return id;
    }
    if (url.searchParams.has('v')) {
      const id = url.searchParams.get('v');
      if (/^[A-Za-z0-9_-]{11}$/.test(id)) return id;
    }
    if (url.pathname.startsWith('/embed/')) {
      const id = url.pathname.split('/')[2];
      if (/^[A-Za-z0-9_-]{11}$/.test(id)) return id;
    }
  } catch (err) {
    // ignore parse errors
  }
  return '';
}

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
    const alilitype = Math.max(1, Math.min(5, parseInt(row.lilitype, 10) || 1));
    const aStory = row.story || '';
    const aIntro = row.intro || '';
    const oldPhotoExist = parseInt(row.photoam, 10) || 0;
    const sanitizedId = encodeURIComponent(String(j));
    const sanitizedIntro = aIntro.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    // === SEO / OG / 版面填值 ===
    const pageTitle = "LiLi's 我的壢歷史－No." + j + " LiLi：" + aName;
    document.title = pageTitle;
    $('meta[itemprop="name"]').attr("content", pageTitle);
    $('meta[name="twitter:title"]').attr("content", pageTitle);
    $('meta[property="og:title"]').attr("content", pageTitle);
    if (sanitizedIntro) {
      $('meta[property="og:description"]').attr("content", sanitizedIntro);
      $('meta[name="twitter:description"]').attr("content", sanitizedIntro);
      $('meta[name="description"]').attr("content", sanitizedIntro);
      $('meta[itemprop="description"]').attr("content", sanitizedIntro);
    }

    $("#liName").text(aName);
    const avatarImg = "./img/avatar/" + sanitizedId + ".png";
    const avatarImgOG = "https://lili.tyc.land/img/avatar/" + sanitizedId + ".png";
    $("#liImg").attr({
      src: avatarImg,
      alt: aName ? aName + " 的肖像" : "LiLi 肖像",
      loading: 'lazy',
      decoding: 'async'
    });
    $('meta[property="og:image"]').attr("content", avatarImgOG);
    $('meta[name="twitter:image:src"]').attr("content", avatarImgOG);
    $('meta[name="twitter:card"]').attr("content", avatarImgOG);
    $('meta[itemprop="image"]').attr("content", avatarImgOG);
    $('meta[property="og:url"]').attr("content", "https://lili.tyc.land/lili.html?liliID=" + sanitizedId);

    const $tagSet = $(".tagSet");
    $tagSet.empty();
    const infoText = (aWhen + ' ' + aWhere).trim();
    if (infoText) {
      $('<span>').text(infoText).appendTo($tagSet);
      $tagSet.append(document.createElement('br'));
    }
    const badge = typeBadges[alilitype];
    if (badge) {
      const $link = $('<a>', { href: badge.link });
      $('<img>', {
        src: badge.icon,
        alt: badge.label,
        loading: 'lazy',
        decoding: 'async'
      }).appendTo($link);
      $link.append(document.createTextNode(badge.label));
      $tagSet.append($link);
    }

    const ytId = normalizeYouTubeId(aYTLink);
    if (ytId) {
      $("#liliMain iframe.youtube-player").attr("src", "https://www.youtube.com/embed/" + ytId);
    }

    // 內文切段：原本用空白切；若來源其實是以換行分段，也一併支援
    const $context = $(".aContext");
    $context.empty();
    const contextFragment = document.createDocumentFragment();
    const aStorySplit = aStory.indexOf('\n') >= 0 ? aStory.split(/\r?\n/) : aStory.split(' ');
    for (let aSS = 0; aSS < aStorySplit.length; aSS++) {
      const seg = aStorySplit[aSS].trim();
      if (seg) {
        const p = document.createElement('p');
        p.textContent = seg;
        contextFragment.appendChild(p);
      }
    }
    $context.append(contextFragment);

    // 舊照片載入（保留你原本的資料夾結構）
    if (oldPhotoExist > 0) {
      $.getJSON(
        'https://spreadsheets.google.com/feeds/list/1pqIU16Nbk5so8FRx8USA5nvacA2gBLVahnVb0dIe9z8/1/public/values?alt=json',
        function (photoLog) {
          const photos = normalizePhotoRows(photoLog);
          let zPhotoAmount = 0;
          const jStr = String(j);
          const oldPhotoFragment = document.createDocumentFragment();

          for (let k = 0; k < photos.length; k++) {
            const pID = String(photos[k].p || '');
            if (pID === jStr) {
              zPhotoAmount++;
              const pEvent = photos[k].event || '';
              const pPoint = photos[k].point || '';
              const pTime  = photos[k].time  || '';
              const pFileidRaw = photos[k].fileid || '';
              const safeFolder = encodeURIComponent(pID);
              const safeFile = encodeURIComponent(pFileidRaw);
              const captionParts = [pEvent, pPoint, pTime].filter(Boolean);
              const caption = captionParts.join('・');

              const link = document.createElement('a');
              link.className = 'oPhotos';
              link.dataset.lightbox = 'example-set';
              link.dataset.title = caption;
              link.href = `./img/oldphoto/${safeFolder}/${safeFile}.jpg`;
              if (caption) {
                link.setAttribute('aria-label', caption);
              }

              const imgWrapper = document.createElement('div');
              imgWrapper.className = 'oImg';
              const img = document.createElement('img');
              img.src = `./img/oldphoto/${safeFolder}/${safeFile}.jpg`;
              img.alt = caption || '老照片';
              img.loading = 'lazy';
              img.decoding = 'async';
              imgWrapper.appendChild(img);

              const contentWrapper = document.createElement('div');
              contentWrapper.className = 'oContent';
              contentWrapper.appendChild(document.createTextNode(pEvent));
              contentWrapper.appendChild(document.createElement('br'));
              const span = document.createElement('span');
              span.className = 'pWid';
              span.textContent = [pPoint, pTime].filter(Boolean).join('・');
              contentWrapper.appendChild(span);

              link.appendChild(imgWrapper);
              link.appendChild(contentWrapper);
              oldPhotoFragment.appendChild(link);
            }
          }
          $("#oldPhoto").empty().append(oldPhotoFragment);
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

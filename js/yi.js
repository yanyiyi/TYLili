// === utils ===
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  const value = params.get(name);
  return value ? decodeURIComponent(value) : null;
}

function normalizeRows(dataLog) {
  if (dataLog && dataLog.feed && Array.isArray(dataLog.feed.entry)) {
    return dataLog.feed.entry.map((entry) => ({
      nameTw: entry['gsx$nametw']?.$t ?? '',
      nameEng: entry['gsx$nameeng']?.$t ?? '',
      community: entry['gsx$community']?.$t ?? '',
      ytlink: entry['gsx$ytlink']?.$t ?? '',
      nationTw: entry['gsx$nationtw']?.$t ?? '',
      nationEng: entry['gsx$nationeng']?.$t ?? ''
    }));
  }

  const candidate =
    Array.isArray(dataLog) ? dataLog :
    dataLog?.data || dataLog?.records || dataLog?.rows || dataLog?.items || [];

  if (Array.isArray(candidate)) {
    return candidate.map((entry) => ({
      nameTw: entry.nametw ?? entry.name_tw ?? entry.name ?? '',
      nameEng: entry.nameeng ?? entry.name_eng ?? entry.english ?? '',
      community: entry.community ?? entry.summary ?? '',
      ytlink: entry.ytlink ?? entry.youtube ?? '',
      nationTw: entry.nationtw ?? entry.nation_tw ?? '',
      nationEng: entry.nationeng ?? entry.nation_eng ?? ''
    }));
  }

  console.warn('無法辨識的藝術家資料格式：', dataLog);
  return [];
}

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
    if (!rows.length) {
      console.warn('藝術家資料為空');
      return;
    }

    const paramValue = getQueryParam('artist');
    let index = Number.parseInt(paramValue, 10);
    if (Number.isNaN(index) || index < 1 || index > rows.length) {
      index = Math.floor(Math.random() * rows.length) + 1;
    }
    const arrayIndex = index - 1;

    const row = rows[arrayIndex] || {};
    const nameTw = row.nameTw || '';
    const nameEng = row.nameEng || '';
    const community = row.community || '';
    const ytlink = row.ytlink || '';
    const nationTw = row.nationTw || '';
    const nationEng = row.nationEng || '';
    const sanitizedId = encodeURIComponent(String(index));

    const pageTitle = `藝遊中壢上河圖 - 藝術家／${nameTw}・${nameEng}`;
    document.title = pageTitle;
    $('meta[itemprop="name"]').attr('content', pageTitle);
    $('meta[name="twitter:title"]').attr('content', pageTitle);
    $('meta[property="og:title"]').attr('content', pageTitle);
    $('meta[property="og:url"]').attr('content', 'https://lili.tyc.land/y.html?artist=' + sanitizedId);

    const $liName = $('#liName');
    $liName.empty();
    if (nameTw) {
      $('<span>').text(nameTw).appendTo($liName);
    }
    if (nameEng) {
      if (nameTw) $liName.append(document.createElement('br'));
      $('<span>').text(nameEng).appendTo($liName);
    }

    const $tagSet = $('.tagSet');
    $tagSet.empty();
    if (nationTw) {
      $('<span>').text(nationTw).appendTo($tagSet);
      $tagSet.append(document.createElement('br'));
    }
    if (nationEng) {
      $('<span>').text(nationEng).appendTo($tagSet);
    }

    const ytId = normalizeYouTubeId(ytlink);
    if (ytId) {
      $('#liliMain iframe.youtube-player').attr('src', 'https://www.youtube.com/embed/' + ytId);
    }

    const $context = $('.aContext');
    $context.find('p').remove();
    const fragment = document.createDocumentFragment();
    const communityParts = community.indexOf('\n') >= 0 ? community.split(/\r?\n/) : community.split(/\s+/);
    communityParts.forEach((part) => {
      const text = part.trim();
      if (text) {
        const p = document.createElement('p');
        p.textContent = text;
        fragment.appendChild(p);
      }
    });
    $context.append(fragment);
  }
).fail(function (jqxhr, textStatus, error) {
  console.error('讀取藝術家資料失敗：', textStatus, error);
});

$(function () {
  function normalizeRows(dataLog) {
    if (dataLog && dataLog.feed && Array.isArray(dataLog.feed.entry)) {
      return dataLog.feed.entry.map((entry) => ({
        lat: entry['gsx$lati']?.$t ?? '',
        lng: entry['gsx$longi']?.$t ?? ''
      }));
    }
    const candidate =
      Array.isArray(dataLog) ? dataLog :
      dataLog?.data || dataLog?.records || dataLog?.rows || dataLog?.items || [];
    if (Array.isArray(candidate)) {
      return candidate.map((entry) => ({
        lat: entry.lati ?? entry.lat ?? '',
        lng: entry.longi ?? entry.lng ?? entry.lon ?? ''
      }));
    }
    console.warn('無法辨識的座標資料格式：', dataLog);
    return [];
  }

  $.getJSON(
    'https://script.google.com/macros/s/AKfycbxscTjzWn9YTZ_Vmrrs-mB_DQZDrORmzlXdQrgL-2YxKkVYq9js4WlzM5zIAg8PYjPjVQ/exec',
    function (dataLog) {
      const rows = normalizeRows(dataLog);
      const extEl = document.getElementById('ext');
      if (!extEl) return;
      extEl.textContent = '';
      const fragment = document.createDocumentFragment();
      rows.forEach((row) => {
        const lat = String(row.lat || '').trim();
        const lng = String(row.lng || '').trim();
        if (!lat || !lng) return;
        const line = document.createElement('div');
        line.textContent = lat + ',' + lng;
        fragment.appendChild(line);
      });
      extEl.appendChild(fragment);
    }
  ).fail(function (jqxhr, textStatus, error) {
    console.error('讀取座標資料失敗：', textStatus, error);
  });
});

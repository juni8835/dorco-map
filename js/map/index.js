console.log('[map.js]');
import mapConfig from './config.js';
import mapHelper from './helpers.js';

//https://developers.kakao.com/docs/latest/ko/local/dev-guide#search-by-keyword
// https://apis.map.kakao.com/web/sample/keywordList/
// 키워드 https://developers.kakao.com/docs/latest/ko/local/dev-guide#search-by-keyword

async function mapApp() {
  const mapContainer = document.getElementById('map');
  const mapItems = document.querySelectorAll('[data-address-name]');
  const mapList = await getMapList(mapItems);

  // setup map
  const mapOptions = {
    center: mapList[0].position,
    level: mapConfig.getSetting('level'),
  };
  const map = new kakao.maps.Map(mapContainer, mapOptions);

  // control map
  setControlButtons(map);

  // set marker and customOverlay
  for (const mapItem of mapList) {
    const marker = mapHelper.createMarker(mapItem);
    const customOverlay = mapHelper.createOverlay(mapItem);
    marker.setMap(map);
    customOverlay.setMap(map);

    // handle tabmenu
    mapItem.element.addEventListener('click', (e) => {
      for (const mapItem of mapItems) {
        mapItem.closest('li').classList.remove('active');
        mapItem.title = mapItem.dataset.addressName;
      }
      e.target.closest('li').classList.add('active');
      e.target.title = e.target.dataset.addressName + ' 선택됨';

      map.panTo(mapItem.position);
    });

    // handle marker and customOverlay
    kakao.maps.event.addListener(marker, 'click', () => {
      map.panTo(mapItem.position);
    });
  }
}
mapApp();

async function getMapList(mapItems) {
  const mapList = [];
  for (let i = 0; i < mapItems.length; i++) {
    const addressName = mapItems[i].dataset.addressName;
    const mapInfo = await mapHelper.getAddress(addressName);
    const position = mapHelper.getPosition(mapInfo.y, mapInfo.x);
    const index = mapItems.length - i;
    Object.assign(mapInfo, { position, index, element: mapItems[i] });
    mapList.push(mapInfo);
  }
  return mapList;
}

function zoomIn(map) {
  map.setLevel(map.getLevel() - 1);
}
function zoomOut(map) {
  map.setLevel(map.getLevel() + 1);
}
function setMapType({ map, type, current, sibling }) {
  const maptype = type === 'roadmap' ? 'ROADMAP' : 'HYBRID';
  map.setMapTypeId(kakao.maps.MapTypeId[maptype]);
  current.className = 'selected_btn';
  sibling.className = 'btn';
}

function setControlButtons(map) {
  const zoomInBtn = document.getElementById('btnZoomIn');
  const zoomOutBtn = document.getElementById('btnZoomOut');

  zoomInBtn.addEventListener('click', zoomIn.bind(null, map));
  zoomOutBtn.addEventListener('click', zoomOut.bind(null, map));
  const roadmapControl = document.getElementById('btnRoadmap');
  const skyviewControl = document.getElementById('btnSkyview');
  roadmapControl.addEventListener(
    'click',
    setMapType.bind(null, {
      map: map,
      type: 'roadmap',
      current: roadmapControl,
      sibling: skyviewControl,
    })
  );
  skyviewControl.addEventListener(
    'click',
    setMapType.bind(null, {
      map: map,
      type: 'skyview',
      current: skyviewControl,
      sibling: roadmapControl,
    })
  );
}

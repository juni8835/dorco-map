import mapConfig from './config.js';
import mapUtil from './utils.js';

function getPosition(lat, lng) {
  return new kakao.maps.LatLng(Number(lat), Number(lng));
}

function createMarkerImage(type = 'dark') {
  const { src, size } = mapConfig.getMarkerInfo(type);
  const { width, height } = size;
  const imageSize = new kakao.maps.Size(width, height);
  return new kakao.maps.MarkerImage(src, imageSize);
}

function createOverlay({ position, index, place_name, id }) {
  const link = `https://map.kakao.com/link/map/${id}`;
  const title = place_name.split('도루코')[1];
  const { src: logoImage } = mapConfig.getMarkerInfo('logo');
  const content = `
    <div class="map-overlay">
      <div class="map-overlay__box">
        <div class="map-overlay__image">
          <img src="${logoImage}" alt="${place_name}" />
        </div>
        <span>${title}</span>
      </div>
      <a href="${link}" target="_blank" title="카카오지도 새창열기" class="non-drag">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(255, 255, 255, 1);transform: ;msFilter:;"><path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path></svg>
      </a>
    </div>
  `;
  return new kakao.maps.CustomOverlay({
    position,
    content,
    zIndex: index,
    yAnchor: 1,
  });
}

function createMarker({ position, title, index }) {
  const image = createMarkerImage();
  const marker = new kakao.maps.Marker({
    position,
    zIndex: index + 20,
    title,
    image,
  });
  return marker;
}

async function getAddress(keyword) {
  const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURI(
    keyword
  )}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `KakaoAK ${mapConfig.getKey('restAPI')}`,
    },
  });

  const data = await response.json();
  const result = data.documents[0];
  return result;
}

function getAddressByName(addressName) {
  const promise = new Promise((resolve, reject) => {
    mapUtil.geocoder.addressSearch(addressName, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const { x: lng, y: lat } = result[0];
        resolve(getPosition(lat, lng));
      } else {
        reject(new Error('검색결과 없음.'));
      }
    });
  });

  return promise;
}

export default {
  getPosition,
  createMarkerImage,
  createMarker,
  createOverlay,
  getAddress,
  getAddressByName,
};

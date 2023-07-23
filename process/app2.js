const getEl = (selector) => {
  return document.querySelector(selector);
};
const getEls = (selector) => {
  return document.querySelectorAll(selector);
};

// placeSearchBtn.addEventListener('click', searchPlaceHandler);
// function searchPlaceHandler(e) {
//   const value = placeSearchInp.value.trim();
//   const moveLatLon = new kakao.maps.LatLng(33.45058, 126.574942);
//   map.panTo(moveLatLon);
// }

class MapHelper {
  static panTo(map, { lat, lng }) {
    const moveLatLon = new kakao.maps.LatLng(lat, lng);
    map.panTo(moveLatLon);
  }

  static checkSuccess(response) {
    if (response.ok) {
      Promise.resolve(response);
    } else {
      Promise.reject(response);
    }
  }
}

class MapList {
  mapEls;
  placeItems;

  constructor(mapId, coords) {
    this.mapEls = {
      container: getEl(mapId),
      searchInp: getEl('#place-search-input'),
      searchBtn: getEl('#place-search-btn'),
    };
    this.placeItems = getEls('[data-place-item]');

    this.createMap(coords);
    this.setEvent();
    this.setPlaceItems();
  }

  createMap({ lat, lng }) {
    this.map = new kakao.maps.Map(this.mapEls.container, {
      center: new kakao.maps.LatLng(lat, lng),
      level: 3,
    });
  }

  setPlaceItems() {}

  setEvent() {
    this.mapEls.searchBtn.addEventListener(
      'click',
      this.searchHandler.bind(this)
    );
  }

  getAddress(address) {
    return new Promise((resolve, reject) => {
      MapApp.geocoder.addressSearch(address, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const { x: lng, y: lat } = result[0];
          const coords = { lat: Number(lat), lng: Number(lng) };
          resolve(coords);
        } else {
          reject(new Error('검색결과 없음.'));
        }
      });
    });
  }

  async searchHandler() {
    // 서울 서초구 효령로70길 36-9
    const value = this.mapEls.searchInp.value.trim();
    const coords = await this.getAddress(value);
    MapHelper.panTo(this.map, coords);
  }
}

class MapItem {
  constructor(title, address) {
    this.getAddress(value).then((coords) => {
      this.title = title;
      this.address = address;
      this.coords = coords;
    });
  }
}

class MapApp {
  static geocoder = new kakao.maps.services.Geocoder();

  static init() {
    const mapList = new MapList('#place-map', {
      lat: 37.4852749863796,
      lng: 127.024420301629,
    });
  }
}
MapApp.init();

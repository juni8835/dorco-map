const REST_API_KEY = '9928aa8b85a303f52f16ad36b1597231';
const ADDRESS_URL = 'https://dapi.kakao.com/v2/local/search/address.json';
const MARKER_INFO = {
  size: [37, 45],
  point: [27, 45],
  src: {
    marker: '/images/marker.svg',
    pointer: '/images/pointer.svg',
  },
};

// https://apis.map.kakao.com/web/sample/markerWithCustomOverlay/

function checkSuccess(response) {
  if (response.ok) {
    return Promise.resolve(response.json());
  } else {
    return Promise.reject(new Error('something went wrong!'));
  }
}

class MapHelper {
  static getMarker({ lat, lng, type }) {
    const { size, point, src } = MARKER_INFO;
    const imageSize = new kakao.maps.Size(size[0], size[1]);
    const imageOption = new kakao.maps.Point(point[0], point[1]);
    let imageSrc = src.marker;

    if (type) {
      console.log('hi');
      imageSrc = src[type] ? src[type] : src.marker;
    }

    const markerImage = new kakao.maps.MarkerImage(
      imageSrc,
      imageSize,
      imageOption
    );
    const markerPosition = new kakao.maps.LatLng(lat, lng);

    const marker = new kakao.maps.Marker({
      position: markerPosition,
      image: markerImage,
    });

    return marker;
  }

  static getCoords(address) {
    const url = `${ADDRESS_URL}?query=${address}`;
    const promise = fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: `KakaoAK ${REST_API_KEY}`,
      },
    })
      .then(checkSuccess)
      .then((result) => {
        const info = result.documents[0];
        const coords = { lat: Number(info.y), lng: Number(info.x) };
        return coords;
      })
      .catch((err) => {
        console.error(err);
      });

    return promise;
  }
}

class PlaceItem {
  constructor(placeEl) {
    this.el = placeEl;
    this.title = placeEl.title;
    this.address = placeEl.dataset.placeAddress;
  }
}

class PlaceList {
  mapEl = null;
  placeItems = [];

  constructor(mapId) {
    this.mapEl = document.getElementById(mapId);
    const placeElems = [...document.querySelectorAll('[data-place-address]')];
    for (const placeEl of placeElems) {
      placeEl.addEventListener('click', this.loadMapHandler);
      this.placeItems.push(new PlaceItem(placeEl));
    }

    this.init();
  }

  loadMapHandler(e) {
    console.log(e.target);
  }

  setEvent() {
    const marker = new kakao.maps.Marker({
      position: this.map.getCenter(),
    });
    marker.imageSrc = MARKER_INFO.src.pointer;
    marker.setMap(this.map);

    kakao.maps.event.addListener(this.map, 'click', function (mouseEvent) {
      const latlng = mouseEvent.latLng;
      marker.setPosition(latlng);

      const lat = latlng.getLat();
      const lng = latlng.getLng();
      const message = `위도: ${lat}, 경도: ${lng}`;
      const resultDiv = document.getElementById('map-coords');
      resultDiv.innerHTML = message;
    });
  }

  createOverlay(title) {
    const html = `
    <div class="map-marker">
      <div class="map-logo">
        <svg width="100" height="20" viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_352_9663)">
            <path d="M7.57775 0.270508H0.0676586C0.0676586 0.270508 0 0.338125 0 0.405745V19.2713C0 19.3389 0.0676586 19.3389 0.0676586 19.3389H7.57775C12.8551 19.3389 17.1176 15.0789 17.1176 9.8047C17.1176 4.53046 12.8551 0.270508 7.57775 0.270508ZM7.30712 14.8761H4.7361V4.73332H7.37477C10.1488 4.73332 12.4492 7.03235 12.4492 9.8047C12.3815 12.577 10.1488 14.8761 7.30712 14.8761Z" fill="white"/>
            <path d="M28.9579 0.0671387C23.6129 0.0671387 19.2151 4.46233 19.2151 9.80417C19.2151 15.146 23.6129 19.5412 28.9579 19.5412C34.3029 19.5412 38.7007 15.146 38.7007 9.80417C38.7007 4.46233 34.3029 0.0671387 28.9579 0.0671387ZM28.9579 15.0784C26.1162 15.0784 23.9512 12.7794 23.9512 9.80417C23.9512 6.82897 26.184 4.52996 28.9579 4.52996C31.7995 4.52996 33.9647 6.82897 33.9647 9.80417C33.9647 12.7794 31.732 15.0784 28.9579 15.0784Z" fill="white"/>
            <path d="M90.2564 0.0671387C84.9114 0.0671387 80.5135 4.46233 80.5135 9.80417C80.5135 15.146 84.9114 19.5412 90.2564 19.5412C95.6014 19.5412 99.9993 15.146 99.9993 9.80417C100.067 4.46233 95.6692 0.0671387 90.2564 0.0671387ZM90.2564 15.0784C87.4148 15.0784 85.2499 12.7794 85.2499 9.80417C85.2499 6.82897 87.4826 4.52996 90.2564 4.52996C93.0981 4.52996 95.2632 6.82897 95.2632 9.80417C95.331 12.7794 93.0981 15.0784 90.2564 15.0784Z" fill="white"/>
            <path d="M70.7709 4.53044C70.8385 4.53044 70.9063 4.53044 70.9739 4.53044C72.8683 4.59804 73.9509 5.67995 74.6274 6.55898C74.7627 6.76184 74.8981 6.9647 75.0334 7.16755C75.0334 7.23516 75.101 7.23516 75.1688 7.16755L79.0252 5.07138C79.093 5.07138 79.093 5.00375 79.0252 4.93615C76.86 1.48761 74.0184 0 70.7709 0C65.4935 0 61.0281 4.25995 61.0281 9.73705C61.0281 15.2141 65.4935 19.4741 70.7709 19.4741C74.0184 19.4741 76.86 17.9865 79.0252 14.5379C79.0252 14.4703 79.0252 14.4703 79.0252 14.4027L75.1688 12.3065C75.101 12.3065 75.101 12.3065 75.0334 12.3065C74.8981 12.5094 74.7627 12.7123 74.6274 12.9151C73.9509 13.8618 72.8683 14.8761 70.9739 14.9437C70.9063 14.9437 70.8385 14.9437 70.7709 14.9437C67.9969 14.9437 65.7642 12.577 65.7642 9.66942C65.7642 6.89707 67.9969 4.53044 70.7709 4.53044Z" fill="white"/>
            <path d="M58.3893 8.31657C58.5244 3.71853 54.5327 0.0671387 49.5259 0.0671387C45.3988 0.0671387 41.407 3.24519 41.407 7.6404V19.2031C41.407 19.2708 41.4746 19.2708 41.4746 19.2708H46.0077C46.0753 19.2708 46.0753 19.2031 46.0753 19.2031V8.31657C46.0753 6.28802 47.6993 4.59756 49.729 4.52996C51.8264 4.46233 53.5855 5.94994 53.5855 8.04611C53.5855 9.73657 52.1646 11.6299 49.2554 11.6975C49.1876 11.6975 49.1201 11.7651 49.1876 11.8327L53.7208 19.2708L53.7884 19.3384H59.607C59.6748 19.3384 59.7424 19.2708 59.6748 19.2031L55.7506 13.3203C57.4421 12.0356 58.3215 10.2099 58.3893 8.31657Z" fill="white"/>
          </g>
            <defs>
              <clipPath id="clip0_352_9663">
              <rect width="100" height="19.6126" fill="white"/>
              </clipPath>
            </defs>
        </svg>
      </div>
      <strong>${title}</strong>
    </div>
    `;
    return html;
  }

  init() {
    const firstAddress = encodeURI(this.placeItems[0].address);
    MapHelper.getCoords(firstAddress).then((result) => {
      const marker = MapHelper.getMarker(result);
      const options = {
        center: new kakao.maps.LatLng(result.lat, result.lng),
        level: 3,
      };

      this.map = new kakao.maps.Map(this.mapEl, options);
      marker.setMap(this.map);
      this.setEvent();

      // const content = this.createOverlay(this.placeItems[0].title);

      // const customOverlay = new kakao.maps.CustomOverlay({
      //   map: this.map,
      //   position: markerPosition,
      //   content: content,
      //   yAnchor: 1,
      // });
    });
  }
}

const place = new PlaceList('place-map');

function zoomIn() {
  place.map.setLevel(map.getLevel() - 1);
}
function zoomOut() {
  place.map.setLevel(map.getLevel() + 1);
}

function zoomInOut() {
  place.map.setLevel(place.map.getLevel() - 1);
}

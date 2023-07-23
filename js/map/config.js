const APP_KEYS = {
  restAPI: '9928aa8b85a303f52f16ad36b1597231',
  javascript: '49fdf14f92f42c42c200686e3959a12f',
};

const REQUEST_URL = {
  address: 'https://dapi.kakao.com/v2/local/search/address.json',
};

const SETTING = {
  level: 3,
};

const MARKER_INFO = {
  size: { width: 26, height: 38 },
  src: {
    logo: '/images/marker-logo.svg',
    red: '/images/marker-red.svg',
    dark: '/images/marker-dark.svg',
    light: '/images/marker-light.svg',
  },
};

function getKey(type) {
  return APP_KEYS[type] || null;
}
function getRequestUrl(type) {
  return REQUEST_URL[type] || null;
}
function getSetting(type) {
  return SETTING[type] || null;
}
function getMarkerInfo(type) {
  return {
    ...MARKER_INFO,
    src: MARKER_INFO.src[type] || MARKER_INFO.src['dark'],
  };
}

export default {
  getKey,
  getRequestUrl,
  getSetting,
  getMarkerInfo,
};

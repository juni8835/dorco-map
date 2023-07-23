<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>카카오맵</title>
    <link rel="stylesheet" href="https://unpkg.com/boxicons@latest/css/boxicons.min.css">
    <link rel="stylesheet" href="./style.css" />

    <script
      type="text/javascript"
      src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=49fdf14f92f42c42c200686e3959a12f&libraries=services"
    ></script>

    <script src="./js/map/index.js" type="module" defer></script>
  </head>
  <body>
    <h1>카카오 맵</h1>
    <?php
      $place_list = array(
        '도루코 본사', 
        '도루코 문막', 
        '도루코 서초/기술연구소', 
        '도루코 용인/기술연구소'
      )
    ?>
    <ul class="no-map__addr-catg">
      <?php foreach($place_list as $key => $value) :
      $keyword = explode('도루코', $value)[1];
      $address_name = trim($keyword);
      $title = $key == 0 ? $value.' 선택됨' : $value;
      $isActive = $key == 0 ? 'class="active"': null;
      ?>
        <li <?=$isActive?>>
          <button 
            type="button" 
            title="<?=$title?>" 
            data-address-name="<?=$value?>"
          ><?=$address_name?></button>
        </li>
      <?php endforeach; ?>
    </ul>
    
    <!-- map start -->
    <div class="map-wrap">
      <div id="map" style="width:100%;height:100%;position:relative;overflow:hidden;"></div>
      <div class="custom_typecontrol radius_border">
          <span id="btnRoadmap" class="selected_btn">지도</span>
          <span id="btnSkyview" class="btn">스카이뷰</span>
      </div>
      <div class="custom_zoomcontrol radius_border"> 
          <button type="button" id="btnZoomIn" title="확대"><i class='bx bx-plus'></i></button>  
          <button type="button" id="btnZoomOut" title="축소"><i class='bx bx-minus'></i></button>
      </div>
    </div>
    <!-- map end -->
  </body>
</html>

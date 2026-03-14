<template>
  <div id="map" class="map-container"></div>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/leaflet.markercluster.js';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { useProductStore } from '@/store/productStore';

// 修正 Leaflet 預設圖標路徑問題
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow });
L.Marker.prototype.options.icon = DefaultIcon;

const productStore = useProductStore();
let map = null;
let markerClusterGroup = null;

//防斗
const debounce = (fn, delay) => {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(... args), delay);
  };
};

// 初始化地圖
onMounted(() => {
  map = L.map('map').setView([25.033, 121.565], 13); // 預設台北市中心

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  markerClusterGroup = L.markerClusterGroup();
  map.addLayer(markerClusterGroup);

  // 監聽地圖移動結束
  map.on('moveend', debounce(() => {
    const bounds = map.getBounds();
    productStore.setMapBounds({
      minLat: bounds.getSouth(),
      maxLat: bounds.getNorth(),
      minLng: bounds.getWest(),
      maxLng: bounds.getEast()
    });
    productStore.fetchMapProperties();
  }, 500)); // 500ms 防斗

  // 初始抓取一次
  setTimeout(() => {
    map.fire('moveend');
  }, 500);
});

// 監聽 mapProducts 變化，重新繪製標記
watch(() => productStore.mapProducts, (newProperties) => {
  if (!map || !markerClusterGroup) return;
  markerClusterGroup.clearLayers();

  newProperties.forEach(prop => {
    if (!prop.lat || !prop.lng) return;
    const marker = L.marker([prop.lat, prop.lng]);
    // 彈出視窗顯示商品名稱與價格
    marker.bindPopup(`<b>${prop.name || prop.title}</b><br>價格: ${prop.price}`);
    marker.on('click', () => {
      productStore.setActiveProductId(prop._id);
      // 滾動左側商品（由 MapView 監聽 activeProductId 處理）
    });
    markerClusterGroup.addLayer(marker);
  });
}, { deep: true });
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 500px;
  border-radius: 8px;
  overflow: hidden;
}
</style>
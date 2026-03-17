<!-- components/ProductForm.vue -->
<template>
  <div class="product-form">
    <h1>{{ isEdit ? '編輯商品' : '新增商品' }}</h1>
    <form @submit.prevent="handleSubmit">
      <!-- 图片上传区域 -->
      <div class="form-group">
        <label>商品圖片（可多選，第一張為主圖）</label>
        <div class="image-upload-area">
          <input
            type="file"
            multiple
            accept="image/*"
            @change="handleImageUpload"
            ref="fileInput"
          />
          <div class="image-preview-grid">
            <div
              v-for="(img, index) in imageList"
              :key="index"
              class="image-preview-item"
              :class="{ 'is-main': index === 0 }"
              @click="setMainImage(index)"
            >
              <img :src="img.url" :alt="'預覽圖' + (index + 1)" />
              <span class="main-badge" v-if="index === 0">主圖</span>
              <button
                type="button"
                class="remove-image"
                @click.stop="removeImage(index)"
              >
                &times;
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 地址与经纬度 -->
      <div class="form-group">
        <label for="address">地址</label>
        <input
          id="address"
          v-model="form.address"
          type="text"
          placeholder="請输入地址（例如：台北市信義區...）"
          @input="debouncedGeocodeAddress"
        />
      </div>

      <div class="form-row">
        <div class="form-group half">
          <label for="lat">緯度</label>
          <input
            id="lat"
            v-model.number="form.lat"
            type="number"
            step="any"
            placeholder="例如：25.033976"
            @input="debouncedReverseGeocode"
          />
        </div>
        <div class="form-group half">
          <label for="lng">經度</label>
          <input
            id="lng"
            v-model.number="form.lng"
            type="number"
            step="any"
            placeholder="例如：121.565411"
            @input="debouncedReverseGeocode"
          />
        </div>
      </div>

      <!-- 其他字段 -->
      <div class="form-group">
        <label for="name">商品名稱</label>
        <input id="name" v-model="form.name" type="text" required />
      </div>

      <div class="form-group">
        <label for="price">價格</label>
        <input id="price" v-model.number="form.price" placeholder="例如15000" type="number" min="0" required />
      </div>

      <div class="form-group">
        <label for="category">類別</label>
        <select id="category" v-model="form.category" required>
          <option value="">請選擇</option>
          <option value="apartment">公寓</option>
          <option value="house">透天厝</option>
          <option value="condo">電梯大樓</option>
          <option value="studio">套房</option>
          <option value="office">辦公室</option>
        </select>
      </div>

      <div class="form-group">
        <label for="description">描述</label>
        <textarea id="description" v-model="form.description" rows="4" required></textarea>
      </div>

      <div class="form-actions">
        <button type="button" @click="$emit('cancel')">取消</button>
        <button type="submit" :disabled="uploading || submitting">
          {{ submitting ? '處理中...' : (isEdit ? '儲存' : '新增商品') }}
        </button>
      </div>
    </form>

    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { debounce } from 'lodash-es';
import { api } from'@/store/adminStore';

const props = defineProps({
  initialData: { type: Object, default: () => ({}) },
  isEdit: { type: Boolean, default: false }
});
const emit = defineEmits(['submit', 'cancel']);

// 图片列表
const imageList = ref([]);
const fileInput = ref(null);

// 表单数据
const form = ref({
  name: '',
  price: 0,
  category: '',
  description: '',
  stock: 0,
  address: '',
  lat: null,
  lng: null,
  images: [],
});

const uploading = ref(false);
const submitting = ref(false);
const errorMessage = ref('');

// 填充初始数据（编辑时）
watch(() => props.initialData, (val) => {
  if (val && Object.keys(val).length) {
    form.value = { ...form.value, ...val };
    // 初始化图片列表
    imageList.value = (val.images || []).map(url => ({
      url,
      uploadedUrl: url,
      file: null,
    }));
    form.value.images = val.images || [];
  }
}, { immediate: true, deep: true });

// ---------- 图片上传 ----------
const uploadImages = async (files) => {
  const formData = new FormData();
  files.forEach(file => formData.append('images', file));

   // 使用 api 实例发送请求，会自动添加 token
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  if (response.data.success) {
    return response.data.data;
  } else {
    throw new Error('上传失败');
  }
};

const handleImageUpload = async (event) => {
  const files = Array.from(event.target.files);
  if (files.length === 0) return;

  for (const file of files) {
    const localUrl = URL.createObjectURL(file);
    imageList.value.push({ file, url: localUrl, uploadedUrl: null });
  }

  uploading.value = true;
  try {
    const uploadedUrls = await uploadImages(files);
    uploadedUrls.forEach((url, idx) => {
      if (imageList.value[idx]) {
        imageList.value[idx].uploadedUrl = url;
      }
    });
    form.value.images = imageList.value.map(item => item.uploadedUrl).filter(Boolean);
  } catch (err) {
    errorMessage.value = '图片上传失败，请重试';
  } finally {
    uploading.value = false;
  }
};

const removeImage = (index) => {
  if (!confirm('確定刪除此圖片嗎?')) return;
  const removed = imageList.value.splice(index, 1)[0];
  if (removed.url.startsWith('blob:')) {
    URL.revokeObjectURL(removed.url);
  }
  form.value.images = imageList.value.map(item => item.uploadedUrl).filter(Boolean);
};

const setMainImage = (index) => {
  if (index === 0) return;
  const [item] = imageList.value.splice(index, 1);
  imageList.value.unshift(item);
  form.value.images = imageList.value.map(item => item.uploadedUrl).filter(Boolean);
};

// ---------- 地理编码 ----------
const geocodeAddress = async (address) => {
  if (!address) return;
  try {
    const response = await fetch(`/api/geocode?q=${encodeURIComponent(address)}`);
    const data = await response.json();
    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      form.value.lat = parseFloat(lat);
      form.value.lng = parseFloat(lon);
    } else {
      console.warn('地址未找到经纬度');
    }
  } catch (err) {
    console.error('地理编码失败', err);
  }
};

const reverseGeocode = async (lat, lng) => {
  if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) return;
  try {
    const response = await fetch(`/api/geocode?lat=${lat}&lon=${lng}`);
    const data = await response.json();
    if (data && data.display_name) {
      form.value.address = data.display_name;
    } else {
      console.warn('经纬度未找到地址');
    }
  } catch (err) {
    console.error('逆地理编码失败', err);
  }
};

const debouncedGeocodeAddress = debounce(() => {
  geocodeAddress(form.value.address);
}, 500);

const debouncedReverseGeocode = debounce(() => {
  reverseGeocode(form.value.lat, form.value.lng);
}, 500);

watch(
  () => [form.value.lat, form.value.lng],
  ([newLat, newLng], [oldLat, oldLng]) => {
    if (newLat !== oldLat || newLng !== oldLng) {
      debouncedReverseGeocode();
    }
  }
);

watch(
  () => form.value.address,
  (newAddress, oldAddress) => {
    if (newAddress !== oldAddress) {
      debouncedGeocodeAddress();
    }
  }
);

// 提交表单
const handleSubmit = async () => {
  // 前端验证
  if (!form.value.name || !form.value.price || !form.value.category || !form.value.description) {
    errorMessage.value = '請填寫必填區域';
    return;
  }
  if (form.value.price < 0) {
    errorMessage.value = '價格不可為負數';
    return;
  }
  if (form.value.images.length === 0) {
    errorMessage.value = '請至少上傳一張圖片';
    return;
  }

  submitting.value = true;
  errorMessage.value = '';

  try {
    const submitData = { ...form.value };
    if (submitData.lat == null) delete submitData.lat;
    if (submitData.lng == null) delete submitData.lng;

    await emit('submit', submitData);
  } catch (err) {
    errorMessage.value = err.message || '操作失敗，請稍後再試';
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.product-form {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}
.form-group {
  margin-bottom: 1.5rem;
}
.form-row {
  display: flex;
  gap: 1rem;
}
.form-group.half {
  flex: 1;
}
label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.25rem;
}
input, select, textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.image-upload-area {
  border: 1px dashed #ccc;
  padding: 1rem;
  border-radius: 4px;
}
.image-preview-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.image-preview-item {
  position: relative;
  width: 100px;
  height: 100px;
  border: 2px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
}
.image-preview-item.is-main {
  border-color: #42b983;
}
.image-preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.main-badge {
  position: absolute;
  top: 2px;
  left: 2px;
  background: #42b983;
  color: white;
  font-size: 12px;
  padding: 2px 4px;
  border-radius: 2px;
}
.remove-image {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 20px;
  height: 20px;
  border: none;
  background: rgba(255, 0, 0, 0.7);
  /* color: white; */
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}
button {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}
button[type='button'] {
  background-color: #f0f0f0;
}
button[type='submit'] {
  background-color: #42b983;
  color: white;
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.error-message {
  color: red;
  margin-top: 1rem;
}
</style>
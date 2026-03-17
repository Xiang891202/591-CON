// 在 script setup 中添加
const uploadImages = async (files) => {
  const formData = new FormData();
  files.forEach(file => formData.append('images', file));

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  const result = await response.json();
  if (result.success) {
    return result.data; // 图片 URL 数组
  } else {
    throw new Error('上传失败');
  }
};

// 修改 handleImageUpload
const handleImageUpload = async (event) => {
  const files = Array.from(event.target.files);
  if (files.length === 0) return;

  // 先预览
  for (const file of files) {
    const localUrl = URL.createObjectURL(file);
    imageList.value.push({ file, url: localUrl, uploadedUrl: null });
  }

  loading.value = true; // 可显示上传中
  try {
    // 调用真实上传
    const uploadedUrls = await uploadImages(files);
    // 将上传后的 URL 按顺序赋给对应的 imageList 项
    uploadedUrls.forEach((url, idx) => {
      if (imageList.value[idx]) {
        imageList.value[idx].uploadedUrl = url;
      }
    });
    // 更新 form.images
    form.value.images = imageList.value.map(item => item.uploadedUrl).filter(Boolean);
  } catch (err) {
    errorMessage.value = '图片上传失败，请重试';
    // 可选择移除预览失败的图片
  } finally {
    loading.value = false;
  }
};
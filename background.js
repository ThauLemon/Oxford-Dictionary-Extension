// background.js

// 1. Thay ID và Key MỚI của bạn vào đây
const APP_ID = '54188eb4'; 
const APP_KEY = '4c299bfceedc9256b019ddde5f7f3d05';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'lookupWord') {
    
    // 2. Xử lý Lowercase theo tài liệu
    const word = request.word.trim().toLowerCase();
    
    // 3. Dùng URL chuẩn theo tài liệu (en-us hoặc en-gb đều được)
    const languageCode = 'en-gb'; // Hoặc 'en-gb'
    const endpoint = 'entries';
    const url = `https://od-api.oxforddictionaries.com/api/v2/${endpoint}/${languageCode}/${word}`;

    console.log("Đang gọi API:", url); // Để debug

    fetch(url, {
      method: 'GET',
      headers: {
        // 4. Header chuẩn theo tài liệu
        'app_id': APP_ID,
        'app_key': APP_KEY,
        'Accept': 'application/json'
      }
    })
    .then(response => {
      // Log trạng thái để biết lỗi gì (403, 404, 200...)
      console.log("API Status:", response.status);
      
      if (!response.ok) {
         // Nếu lỗi, đọc nội dung lỗi để biết tại sao
         return response.text().then(text => {
             throw new Error(`Lỗi API (${response.status}): ${text}`);
         });
      }
      return response.json();
    })
    .then(data => {
      sendResponse({ success: true, data: data });
    })
    .catch(error => {
      console.error("Lỗi fetch:", error);
      sendResponse({ success: false, error: error.message });
    });

    return true; // Giữ kết nối để trả về bất đồng bộ
  }
});
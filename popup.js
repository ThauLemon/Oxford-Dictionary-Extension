// popup.js
document.addEventListener('DOMContentLoaded', function() {
  const searchBtn = document.getElementById('searchBtn');
  const wordInput = document.getElementById('wordInput');
  const resultDiv = document.getElementById('result');

  searchBtn.addEventListener('click', handleSearch);
  
  wordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') handleSearch();
  });

  function handleSearch() {
    const word = wordInput.value.trim().toLowerCase();
    if (!word) return;

    resultDiv.innerHTML = '<p style="text-align:center">Đang tải...</p>';

    // Gửi tin nhắn sang Background
    chrome.runtime.sendMessage(
      { action: 'lookupWord', word: word },
      function(response) {
        // Kiểm tra nếu có lỗi kết nối (ví dụ background chưa khởi động)
        if (chrome.runtime.lastError) {
          resultDiv.innerHTML = `<p class="error">Lỗi kết nối: ${chrome.runtime.lastError.message}</p>`;
          return;
        }

        // Xử lý kết quả trả về từ Background
        if (response && response.success) {
          displayResult(response.data);
        } else {
          resultDiv.innerHTML = '<p class="error">Không tìm thấy từ hoặc lỗi API.</p>';
        }
      }
    );
  }

  function displayResult(data) {
    // Hàm hiển thị giữ nguyên như cũ (logic HTML không đổi)
    try {
      const entry = data.results[0].lexicalEntries[0].entries[0];
      const pronunciation = entry.pronunciations ? entry.pronunciations[0].phoneticSpelling : '';
      const sense = entry.senses[0];
      const definition = sense.definitions ? sense.definitions[0] : 'Không có định nghĩa';
      const example = sense.examples ? sense.examples[0].text : '';

      let html = `
        <div class="word-title">${data.id}</div>
        <div class="phonetic">/${pronunciation}/</div>
        <div class="definition"><strong>Định nghĩa:</strong> ${definition}</div>
      `;

      if (example) {
        html += `<div class="definition" style="color:#555"><strong>Ví dụ:</strong> "${example}"</div>`;
      }
      resultDiv.innerHTML = html;
    } catch (e) {
      resultDiv.innerHTML = '<p class="error">Cấu trúc dữ liệu khác mong đợi.</p>';
    }
  }
});
// 監聽網頁上的點擊事件
document.addEventListener('click', function(event) {
    // 發送事件給擴充功能
    chrome.runtime.sendMessage({event: event});
  });
  
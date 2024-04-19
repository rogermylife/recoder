document.addEventListener('DOMContentLoaded', function() {
  const learnBtn = document.getElementById('learnBtn');
  const stopBtn = document.getElementById('stopBtn');
  const runBtn = document.getElementById('runBtn');

  let isLearning = false;
  let recordedElements = [];

  // 定義一個函數來執行內容腳本
  function executeContentScript() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs.length > 0) {
        const tabId = tabs[0].id;
        chrome.scripting.executeScript({
          target: {tabId: tabId},
          function: contentScriptFunction // 調用內容腳本函數
        });
      } else {
        console.log('No active tab found.');
      }
    });
  }

// 內容腳本的函數，用於監聽事件並發送消息
function contentScriptFunction() {
  // 獲取 DOM 元素的 DOM 路徑
  function getDomPath(element) {
    const path = [];
    while (element) {
      let selector = element.nodeName;
      if (element.id) {
        selector += `#${element.id}`;
        path.unshift(selector);
        break;
      } else {
        let sibling = element;
        let nth = 1;
        while (sibling = sibling.previousElementSibling) {
          if (sibling.nodeName == element.nodeName) {
            nth++;
          }
        }
        if (nth != 1) {
          selector += `:nth-of-type(${nth})`;
        }
      }
      path.unshift(selector);
      element = element.parentNode;
    }
    return path.join(' > ');
  }

  document.addEventListener('click', function(event) {
    const target = event.target;
    const domPath = getDomPath(target);
    const elementInfo = {
      tag: target.tagName,
      path: domPath
    };
    console.log(target)
    console.log(domPath)
    console.log(elementInfo)
    chrome.runtime.sendMessage({event: elementInfo});
  });
}

  learnBtn.addEventListener('click', function() {
    if (!isLearning) {
      isLearning = true;
      recordedElements = []; // 清空之前的記錄
      console.log('Learning...');
      executeContentScript(); // 執行內容腳本
    }
  });

  stopBtn.addEventListener('click', function() {
    if (isLearning) {
      isLearning = false;
      console.log('Stopped.');
    }
  });

  runBtn.addEventListener('click', function() {
    if (recordedElements.length > 0) {
      console.log('Running...');
      // 模仿點擊元素
      console.log('?...');
      recordedElements.forEach(function(elementInfo, index) {
        setTimeout(function() {
          const element = document.querySelector(elementInfo.path);
          console.log("XD")
          console.log("PATH" + elementInfo.path)
          console.log(element)
          if (element) {
            element.click();
            console.log('Element clicked:', elementInfo.tag, elementInfo.path);
          }
        }, index * 1000); // 每次延遲一秒執行下一個操作
      });
    } else {
      console.log('No recorded elements to click.');
    }
  });

  // 接收來自內容腳本的元素點擊記錄
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (isLearning) {
      recordedElements.push(message.event);
      console.log('Element recorded:', message.event.tag, message.event.path);
    }
  });
});

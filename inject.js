// inject.js

// 內容腳本的函數，用於監聽事件並發送消息
function contentScriptFunction() {
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

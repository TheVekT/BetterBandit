
  document.addEventListener("DOMContentLoaded", () => {
    const checkbox = document.getElementById("toggleBalanceHiding");
  
    chrome.storage.sync.get("hideBalance", (data) => {
      checkbox.checked = !!data.hideBalance;
    });
  
    checkbox.addEventListener("change", () => {
      const hide = checkbox.checked;
  
      // Сохраняем новое состояние
      chrome.storage.sync.set({ hideBalance: hide });
  
      // Отправляем сообщение на активную вкладку
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "toggleBalanceHiding",
          hide: hide
        });
      });
    });
  });

  document.getElementById("testBet").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => {
                window.postMessage({ type: "CALL_WHEEL_BET" }, "*");
            }
        });
    });
});
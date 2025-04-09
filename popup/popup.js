
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


  document.addEventListener("DOMContentLoaded", () => {
    const checkbox = document.getElementById("toggler");
  
    // Читаем значение betterAutobet из хранилища и устанавливаем состояние чекбокса
    chrome.storage.sync.get("betterAutobet", (data) => {
      checkbox.checked = !!data.betterAutobet;
    });
  
    // При изменении чекбокса сохраняем новое значение
    checkbox.addEventListener("change", () => {
      const enabled = checkbox.checked;
      chrome.storage.sync.set({ betterAutobet: enabled });
    });
  });
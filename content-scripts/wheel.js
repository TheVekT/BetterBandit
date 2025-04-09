(function injectWheelBetScript() {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('inject/wheel-bet.js');
  script.type = 'text/javascript';
  script.onload = () => {
      console.log("[BetterBandit] wheel-bet.js injected successfully.");
      script.remove();
  };
  document.documentElement.appendChild(script);
})();



(function () {
  // Глобальная переменная для хранения последней карточки
  let lastCard = null;

  // Функция для изменения заголовка карточки Autobet Settings
  function updateHeaderInCard(card, enabled) {
    const header = card.querySelector("h4.text-uppercase.lh-1.text-body-2.font-weight-semibold");
    if (header) {
      if (enabled) {
        if (!header.dataset.originalText) {
          header.dataset.originalText = header.innerHTML;
        }
        header.innerHTML = "[BetterBandit] Autobet Settings";
      } else {
        if (header.dataset.originalText) {
          header.innerHTML = header.dataset.originalText;
          delete header.dataset.originalText;
        }
      }
    } else {
      console.warn("Заголовок не найден в карточке");
    }
  }

  // Функция для применения инъекции и заголовка
  function applyModifications(enabled) {
    const card = document.querySelector("div.v-card.v-sheet.theme--dark.elevation-15.rounded-0");

    if (!card) {
      console.warn("Карточка Autobet Settings не найдена.");
      return; // Не делать ничего, если карточки нет
    }

    lastCard = card;
    updateHeaderInCard(card, enabled);

    const injectionConfig = {
      parentSelector: "div.v-card.v-sheet.theme--dark.elevation-15.rounded-0 div.row.row--dense:not(.timer-row)",
      injectionId: "btAb_wheel_injected",
      htmlUrl: chrome.runtime.getURL("content-resources/wheel/btAb_wheel.html"),
      cssUrl: chrome.runtime.getURL("content-resources/wheel/btAb_wheel.css"),
      onInjected: (wrapper) => {
        console.log("[BetterBandit] HTML и CSS успешно внедрены:", wrapper);
      },
      onRevert: () => {
        console.log("[BetterBandit] Инъекция удалена.");
      }
    };

    if (enabled) {
      if (!window.btAbInjectionManager) {
        window.btAbInjectionManager = new InjectionManager(injectionConfig);
      }
      window.btAbInjectionManager.observe();
    } else if (window.btAbInjectionManager) {
      window.btAbInjectionManager.revert();
    }
  }

  // Главная проверка
  function checkAndApplyModifications() {
    chrome.storage.sync.get("betterAutobet", (data) => {
      const enabled = !!data.betterAutobet;
      applyModifications(enabled);
    });
  }

  // При загрузке страницы
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkAndApplyModifications);
  } else {
    checkAndApplyModifications();
  }

  // Слушаем изменения в хранилище
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "sync" && changes.betterAutobet) {
      const enabled = changes.betterAutobet.newValue;
      applyModifications(enabled);
    }
  });

  // Периодическая проверка на появление карточки
  setInterval(checkAndApplyModifications, 500);
})();
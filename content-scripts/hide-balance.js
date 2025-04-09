let originalWalletText = null;
let intervalId = null;
let observerIntervalId = null;
let shouldHideBalance = false;

// Случайный символ
function getRandomChar() {
  const chars = '0123456789!@#$%^&*()_+=-[]{}|;:,.<>?/\\';
  return chars[Math.floor(Math.random() * chars.length)];
}

// Генерация фейкового текста
function getObfuscatedText() {
  return (
    getRandomChar() +
    getRandomChar() +
    getRandomChar() +
    '.' +
    getRandomChar() +
    getRandomChar()
  );
}

function startBalanceObfuscation() {
  const targetWalletSpan = document.querySelector(
    '.wallet-pill .scrap .lh-1.font-weight-bold'
  );

  if (!targetWalletSpan) return;

  if (originalWalletText === null) {
    originalWalletText = targetWalletSpan.textContent;
  }

  if (intervalId) return;

  intervalId = setInterval(() => {
    targetWalletSpan.textContent = getObfuscatedText();
  }, 300);
}

function stopBalanceObfuscation() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  const targetWalletSpan = document.querySelector(
    '.wallet-pill .scrap .lh-1.font-weight-bold'
  );

  if (targetWalletSpan && originalWalletText !== null) {
    targetWalletSpan.textContent = originalWalletText;
  }
}

// 🔁 Следим за появлением элемента и активируем фичу
function watchForBalanceElement() {
  if (observerIntervalId) return;

  observerIntervalId = setInterval(() => {
    const target = document.querySelector('.wallet-pill .scrap .lh-1.font-weight-bold');
    if (target && shouldHideBalance) {
      startBalanceObfuscation();
      clearInterval(observerIntervalId);
      observerIntervalId = null;
    }
  }, 500);
}

// При старте получаем настройку
chrome.storage.sync.get("hideBalance", (data) => {
  shouldHideBalance = !!data.hideBalance;
  if (shouldHideBalance) {
    watchForBalanceElement();
  }
});

// От popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleBalanceHiding") {
    shouldHideBalance = request.hide;

    if (shouldHideBalance) {
      watchForBalanceElement();
    } else {
      stopBalanceObfuscation();
    }
  }
});
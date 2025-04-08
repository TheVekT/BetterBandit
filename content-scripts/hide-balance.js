let originalWalletText = null;
let intervalId = null;

// Случайный символ: цифра или один из символов
function getRandomChar() {
  const chars = '0123456789!@#$%^&*()_+=-[]{}|;:,.<>?/\\';
  return chars[Math.floor(Math.random() * chars.length)];
}

// Форматированный мусорный текст: "000.00", но с символами
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

  intervalId = setInterval(() => {
    targetWalletSpan.textContent = getObfuscatedText();
  }, 300);

  window.__balanceObfuscationInterval = intervalId;
}

function stopBalanceObfuscation() {
  if (intervalId || window.__balanceObfuscationInterval) {
    clearInterval(intervalId || window.__balanceObfuscationInterval);
    intervalId = null;
    window.__balanceObfuscationInterval = null;
  }

  const targetWalletSpan = document.querySelector(
    '.wallet-pill .scrap .lh-1.font-weight-bold'
  );

  if (targetWalletSpan && originalWalletText !== null) {
    targetWalletSpan.textContent = originalWalletText;
  }
}

// При загрузке страницы
chrome.storage.sync.get("hideBalance", (data) => {
  if (data.hideBalance) {
    startBalanceObfuscation();
  }
});

// От popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleBalanceHiding") {
    if (request.hide) {
      startBalanceObfuscation();
    } else {
      stopBalanceObfuscation();
    }
  }
});
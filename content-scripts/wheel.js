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
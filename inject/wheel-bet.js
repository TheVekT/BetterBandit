function findVueComponentWithMethod(methodName = "setBets") {
  const elements = document.querySelectorAll("*");
  for (const el of elements) {
      const vueInstance = el.__vue__;
      if (vueInstance && typeof vueInstance[methodName] === "function") {
          console.log("[BetterBandit] Found Vue component with method:", methodName);
          return vueInstance;
      }
  }
  console.warn("[BetterBandit] Vue component with method", methodName, "not found.");
  return null;
}

window.callWheelBet = function (betData) {
  const interval = setInterval(() => {
      const component = findVueComponentWithMethod("setBets");
      if (!component) {
          return;
      }
      clearInterval(interval);
      try {
          component.setBets(betData, false); // Здесь исправлено на component
      } catch (err) {
          console.error("[BetterBandit] Error calling Bets:", err);
      }
  }, 500);

  // Timeout для прерывания поиска
  setTimeout(() => {
      clearInterval(interval);
      console.warn("[BetterBandit] Timeout reached, Vue component not found.");
  }, 15000);
};

window.addEventListener("message", (event) => {
  if (event.data?.type === "CALL_WHEEL_BET") {
      const betData = event.data?.betData; // Ожидаем betData в сообщении
      if (betData) {
          window.callWheelBet(betData); // Передаем betData в функцию
      }
  }
});
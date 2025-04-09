/**
 * InjectionManager – универсальный класс для инъекций HTML и CSS в нужный родительский элемент.
 *
 * Конфигурация принимает объект с параметрами:
 *  - parentSelector: селектор родительского элемента, куда нужно вставить HTML.
 *  - injectionId: уникальный ID для внедряемого блока (чтобы избежать дублирования).
 *  - htmlUrl: URL к HTML-файлу (если вы храните HTML в отдельном файле).
 *  - cssUrl: URL к CSS-файлу (опционально).
 *  - htmlContent: если HTML уже задан как строка, вместо htmlUrl.
 *  - onInjected: функция, вызываемая после успешной инъекции.
 *  - onRevert: функция, вызываемая после удаления инъекции.
 */
class InjectionManager {
    constructor(config) {
      this.parentSelector = config.parentSelector;
      this.injectionId = config.injectionId;
      this.htmlUrl = config.htmlUrl;
      this.cssUrl = config.cssUrl;
      this.htmlContent = config.htmlContent;
      this.onInjected = config.onInjected;
      this.onRevert = config.onRevert;
      
      this.observer = null;
    }
  
    // Начинаем наблюдение за DOM, чтобы найти нужный родительский элемент
    observe() {
      if (document.getElementById(this.injectionId)) return;
      
      const parent = document.querySelector(this.parentSelector);
      if (parent) {
        this.inject(parent);
      } else {
        this.observer = new MutationObserver((mutations, obs) => {
          const parent = document.querySelector(this.parentSelector);
          if (parent) {
            this.inject(parent);
            obs.disconnect();
          }
        });
        this.observer.observe(document.body, { childList: true, subtree: true });
      }
    }
  
    // Асинхронная загрузка HTML (если используется htmlUrl)
    async loadHtml() {
      if (this.htmlContent) {
        return this.htmlContent;
      } else if (this.htmlUrl) {
        const response = await fetch(this.htmlUrl);
        if (!response.ok) {
          throw new Error("Не удалось загрузить HTML: " + response.status);
        }
        return await response.text();
      }
      throw new Error("Не указаны htmlContent или htmlUrl");
    }
  
    // Выполняет инъекцию в найденный родительский элемент
    async inject(parent) {
      try {
        const html = await this.loadHtml();
        const wrapper = document.createElement("div");
        wrapper.id = this.injectionId;
        wrapper.innerHTML = html;
        // Вставляем обёртку в начало родительского элемента
        parent.insertBefore(wrapper, parent.firstChild);
        console.log(`[InjectionManager] Инъекция "${this.injectionId}" выполнена.`);
        
        // Если указан CSS, подключаем его (если ещё не подключён)
        if (this.cssUrl && !document.getElementById(`${this.injectionId}_css`)) {
          const link = document.createElement("link");
          link.id = `${this.injectionId}_css`;
          link.rel = "stylesheet";
          link.href = this.cssUrl;
          document.head.appendChild(link);
        }
        
        if (typeof this.onInjected === "function") {
          this.onInjected(wrapper);
        }
      } catch (err) {
        console.error(`[InjectionManager] Ошибка инъекции "${this.injectionId}":`, err);
      }
    }
    
    // Удаление инъекции (если требуется)
    revert() {
      const wrapper = document.getElementById(this.injectionId);
      if (wrapper && wrapper.parentNode) {
        wrapper.parentNode.removeChild(wrapper);
        console.log(`[InjectionManager] Инъекция "${this.injectionId}" удалена.`);
      }
      
      const link = document.getElementById(`${this.injectionId}_css`);
      if (link && link.parentNode) {
        link.parentNode.removeChild(link);
      }
      
      if (typeof this.onRevert === "function") {
        this.onRevert();
      }
    }
  }
  
  // Экспорт для CommonJS (если используется сборщик) или сделаем класс глобальным
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = InjectionManager;
  } else {
    window.InjectionManager = InjectionManager;
  }
export function installCardDom() {
  const registry = new Map();

  class FakeShadowRoot {
    constructor() {
      this.innerHTML = "";
    }

    querySelectorAll() {
      return [];
    }

    querySelector() {
      return null;
    }

    getElementById() {
      return null;
    }
  }

  globalThis.HTMLElement = class {
    attachShadow() {
      this.shadowRoot = new FakeShadowRoot();
      return this.shadowRoot;
    }

    dispatchEvent(event) {
      this.lastDispatchedEvent = event;
      return true;
    }
  };

  globalThis.customElements = {
    define(name, constructor) {
      registry.set(name, constructor);
    },
    get(name) {
      return registry.get(name);
    },
  };

  globalThis.CustomEvent = class {
    constructor(type, options = {}) {
      this.type = type;
      Object.assign(this, options);
    }
  };

  globalThis.window = {
    customCards: [],
    confirm: () => true,
  };

  return registry;
}

export function entityState(state, attributes = {}) {
  return { state: String(state), attributes };
}

export function createHass(states = {}, language = "de") {
  return {
    states,
    locale: { language },
    callService: async () => undefined,
    callWS: async () => [],
  };
}

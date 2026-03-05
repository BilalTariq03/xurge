import { AnimationBase } from "../core/base.js";
import { revealUpOnScroll } from "../utils/reveal-text.js";

export class GlobalReveals extends AnimationBase {
  init() {
    this._observers = [];

    document.querySelectorAll('.reveal-up').forEach(el => {
      const { observer } = revealUpOnScroll(el);
      if (observer) this._observers.push(observer);
    });
  }

  cleanup() {
    (this._observers || []).forEach(o => o.disconnect());
    this._observers = [];
    super.cleanup();
  }
}
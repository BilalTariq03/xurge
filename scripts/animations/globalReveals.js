import { AnimationBase } from "../core/base.js";
import { revealUpOnScroll } from "../utils/reveal-text.js";

export class GlobalReveals extends AnimationBase {
  init() {
    document.querySelectorAll('.reveal-up').forEach(el => {
      const anim = revealUpOnScroll(el);
      this.registerTrigger(anim.scrollTrigger);
    });
  }
}

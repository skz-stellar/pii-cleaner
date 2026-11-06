/* Shade panel chrome while leaving translucent text fields visually unchanged. */
(() => {
  'use strict';
  const panels = Array.from(document.querySelectorAll('.panel'));
  const selector = 'textarea, input[type="text"]';
  let frame = 0;

  function update() {
    frame = 0;
    for (const panel of panels) {
      const bounds = panel.getBoundingClientRect();
      const masks = ['linear-gradient(#000 0 0) 0 0 / 100% 100% no-repeat'];
      for (const field of panel.querySelectorAll(selector)) {
        const box = field.getBoundingClientRect();
        if (!box.width || !box.height) continue;
        const x = box.left - bounds.left - panel.clientLeft + panel.scrollLeft;
        const y = box.top - bounds.top - panel.clientTop + panel.scrollTop;
        masks.push(`linear-gradient(#000 0 0) ${x}px ${y}px / ${box.width}px ${box.height}px no-repeat`);
      }
      panel.style.setProperty('--surface-mask', masks.join(', '));
      panel.setAttribute('data-surface-shaded', '');
    }
  }

  function schedule() {
    if (!frame) frame = window.requestAnimationFrame(update);
  }

  const observer = new ResizeObserver(schedule);
  for (const panel of panels) {
    observer.observe(panel);
    panel.querySelectorAll(selector).forEach((field) => observer.observe(field));
  }
  window.addEventListener('resize', schedule, { passive: true });
  update();
})();

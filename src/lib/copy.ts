// Copy buttons live inside build-time HTML, so one delegated listener serves all of them.
export function installCopyButtons(root: Document = document) {
  root.addEventListener('click', (e) => {
    const btn = (e.target as Element).closest?.('[data-act="copy"]');
    const code = btn?.closest('.code')?.querySelector('code');
    const label = btn?.querySelector('span');
    if (!btn || !code || !label) return;
    const done = () => {
      label.textContent = 'Skopiowano';
      setTimeout(() => (label.textContent = 'Kopiuj'), 1500);
    };
    // Without clipboard access (insecure context) select the code so the user can copy it by hand.
    const fallback = () => {
      const r = document.createRange();
      r.selectNodeContents(code);
      getSelection()?.removeAllRanges();
      getSelection()?.addRange(r);
      label.textContent = 'Zaznaczono';
    };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(code.textContent ?? '').then(done, fallback);
    else fallback();
  });
}

(() => {
  const params = new URLSearchParams(location.search);
  const path = params.has('id') ? '/identity/' : params.has('name') ? '/dpns/' : '';
  let moved = document.querySelector('dashhq-moved');
  if (!moved && path) {
    const main = document.querySelector('main');
    main.replaceChildren(document.importNode(document.getElementById('forward').content, true));
    moved = main.querySelector('dashhq-moved');
  }
  if (moved) {
    if (path) moved.setAttribute('path', path);
    return;
  }

  const pick = (v) => (v === 'mainnet' || v === 'testnet' ? v : '');
  const net = pick(params.get('network')) || pick(params.get('net'));
  if (net) {
    for (const input of document.querySelectorAll('input[name="network"]')) input.value = net;
    for (const a of document.querySelectorAll('a[data-radar]')) {
      const u = new URL(a.href);
      u.searchParams.set('network', net);
      a.href = u.href;
    }
    for (const el of document.querySelectorAll('[data-net]')) el.textContent = net === 'mainnet' ? 'Mainnet' : 'Testnet';
    document.querySelector('dashhq-bar')?.setAttribute('network', net);
  }

  const name = document.getElementById('name-q');
  document.getElementById('name-form').addEventListener('submit', () => {
    name.value = name.value.trim().replace(/^@/, '').replace(/\.dash$/i, '');
  });
  const id = document.getElementById('id-q');
  document.getElementById('id-form').addEventListener('submit', () => { id.value = id.value.replace(/\s+/g, ''); });
})();

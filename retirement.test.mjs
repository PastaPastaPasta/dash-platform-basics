// Shared with vote and fees. The shell's <dashhq-moved> forwards at once and owns the network, the query and the arrival
// notice (checked in design/tools/render-demo.mjs); a retired site keeps its pages and its route map. Basics' root is a
// lookup page that only forwards a record link (?id=, ?name=).
import { existsSync, readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import assert from 'node:assert/strict';
import test from 'node:test';

const read = (f) => readFileSync(new URL(f, import.meta.url), 'utf8');
const html = read('./index.html');
const site = /<dashhq-bar product="([^"]+)"/.exec(html)[1];
const fallback = site === 'fees' ? './public/404.html' : './404.html';
const pages = ['./index.html', fallback, ...(site === 'basics' ? ['./get-identities/index.html', './all-dpns/index.html'] : [])];
const script = existsSync(new URL('./retirement.js', import.meta.url)) ? read('./retirement.js') : '';
const home = { vote: 'https://gov.dashhq.org', fees: 'https://explorer.dashhq.org', basics: 'https://explorer.dashhq.org' }[site];
const movedTag = (page) => /<dashhq-moved[^>]*>/.exec(page)?.[0];
const isLookup = (page) => site === 'basics' && /<template id="forward">/.test(page);

// A stand-in for the few DOM calls the route map makes. Each element keeps its attributes; the basics lookup page holds
// its <dashhq-moved> in a <template> that the map puts in place only for a record link.
function fakeDom(page) {
  const attrsOf = (tag) => Object.fromEntries([...tag.matchAll(/ ([a-z-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
  const element = (attrs = {}) => ({ attrs, value: '', textContent: '', href: attrs.href,
    setAttribute(k, v) { this.attrs[k] = v; }, addEventListener(type, fn) { this.listeners = { ...this.listeners, [type]: fn }; } });
  const lookup = isLookup(page);
  let moved = lookup ? null : element(attrsOf(movedTag(page)));
  const template = lookup && element();
  if (template) template.content = { moved: element(attrsOf(movedTag(/<template id="forward">([\s\S]*?)<\/template>/.exec(page)[1]))) };
  const byId = Object.fromEntries(['name-q', 'id-q', 'name-form', 'id-form'].map((k) => [k, element()]));
  const hidden = [...page.matchAll(/<input type="hidden" name="network" value="([^"]+)">/g)].map((m) => ({ ...element(), value: m[1] }));
  const links = [...page.matchAll(/<a [^>]*data-radar href="([^"]+)"/g)].map((m) => element({ href: m[1].replaceAll('&amp;', '&') }));
  const main = { ...element(), replaceChildren(frag) { moved = frag.moved; }, querySelector: () => moved };
  const bar = element();
  const document = {
    querySelector: (sel) => ({ 'dashhq-moved': moved, main, 'dashhq-bar': bar }[sel]),
    querySelectorAll: (sel) => ({ 'input[name="network"]': hidden, 'a[data-radar]': links, '[data-net]': [] }[sel] || []),
    getElementById: (k) => (k === 'forward' ? template : byId[k]),
    importNode: (content) => content,
  };
  return { document, byId, hidden, links, bar, moved: () => moved };
}

// Run the route map against an old address and return what it leaves on <dashhq-moved> (null when nothing forwards).
function visit(route, page = html) {
  const dom = fakeDom(page);
  runInNewContext(script, { URL, URLSearchParams, location: new URL(route, `https://${site}.dashhq.org`), document: dom.document });
  const m = dom.moved();
  return m && { path: m.attrs.path, label: m.attrs.label };
}

if (site === 'vote') {
  for (const route of ['/?network=testnet#/c/alice', '/c/alice?network=testnet', '/names/Alice', '/#/c/alice.dash']) {
    test(`${route} opens the contest at the address Governance publishes`, () => {
      assert.deepEqual(visit(route), { path: '/names/a11ce', label: 'Open alice.dash in Governance' });
    });
  }
  test('anything that is not a contest label opens the contest list', () => {
    for (const route of ['/#/c/a%2Fb', '/#/c/%E0%A4%A', '/#/c/ab', '/missing/page', '/#/about']) {
      assert.deepEqual(visit(route), { path: '/names', label: 'Open name contests' }, route);
    }
  });
}
if (site === 'basics') {
  test('the lookup page stays put and forwards nothing', () => {
    for (const route of ['/', '/?network=testnet#names', '/missing/page']) assert.equal(visit(route), null, route);
  });
  test('the old list pages open their lists', () => {
    assert.equal(visit('/get-identities/?network=testnet', read('./get-identities/index.html')).path, '/identities');
    assert.equal(visit('/all-dpns/?network=testnet', read('./all-dpns/index.html')).path, '/names');
  });
  test('identity and name parameters open their record, on every page', () => {
    for (const page of pages) {
      assert.equal(visit('/?id=public-id&network=testnet', read(page)).path, '/identity/', page);
      assert.equal(visit('/?name=alice.dash', read(page)).path, '/dpns/', page);
    }
  });
  test('the lookup forms reach Radar without JavaScript, on Testnet, and the CSP allows them', () => {
    const forms = [...html.matchAll(/<form [^>]*action="([^"]+)" method="get"[^>]*>([\s\S]*?)<\/form>/g)];
    assert.deepEqual(forms.map((f) => [f[1], /<input class="dh-input[^"]*" id="[^"]+" name="([^"]+)"/.exec(f[2])[1]]),
      [['https://explorer.dashhq.org/names', 'q'], ['https://explorer.dashhq.org/identity/', 'id']]);
    for (const [, , body] of forms) {
      assert.match(body, /<input type="hidden" name="network" value="testnet">/);
      assert.match(body, /<input type="hidden" name="moved-from" value="basics">/);
    }
    assert.match(html, /form-action 'self' https:\/\/explorer\.dashhq\.org;/);
  });
  test('the lookup page links both lists and Radar on Testnet', () => {
    const links = [...html.matchAll(/<a [^>]*data-radar href="([^"]+)"/g)].map((m) => new URL(m[1].replaceAll('&amp;', '&')));
    assert.deepEqual(links.map((u) => u.pathname), ['/names', '/identities', '/']);
    for (const u of links) {
      assert.equal(u.origin, home);
      assert.equal(u.searchParams.get('network'), 'testnet');
      assert.equal(u.searchParams.get('moved-from'), 'basics');
    }
  });
  test('a network in the address carries into the forms and links', () => {
    const dom = fakeDom(html);
    runInNewContext(script, { URL, URLSearchParams, location: new URL('https://basics.dashhq.org/?network=mainnet'), document: dom.document });
    assert.deepEqual(dom.hidden.map((i) => i.value), ['mainnet', 'mainnet']);
    assert.ok(dom.links.every((a) => new URL(a.href).searchParams.get('network') === 'mainnet'));
    assert.equal(dom.bar.attrs.network, 'mainnet');
  });
  test('a username drops its .dash and an identity ID its spaces before the form goes', () => {
    const dom = fakeDom(html);
    runInNewContext(script, { URL, URLSearchParams, location: new URL('https://basics.dashhq.org/'), document: dom.document });
    dom.byId['name-q'].value = '  Alice.DASH ';
    dom.byId['name-form'].listeners.submit();
    assert.equal(dom.byId['name-q'].value, 'Alice');
    dom.byId['id-q'].value = ' GgZe kwh3 \n';
    dom.byId['id-form'].listeners.submit();
    assert.equal(dom.byId['id-q'].value, 'GgZekwh3');
  });
}
if (site === 'fees') test('every old address opens the fee estimator in Explorer', () => {
  for (const route of ['/?contract=example#costs', '/old/calculator?network=testnet#costs']) assert.equal(visit(route).path, '/tools/fees/');
});

test('the shell owns the forward: the site writes no timer and no redirect of its own', () => {
  assert.match(html, /<dashhq-moved /);
  assert.doesNotMatch(script, /setTimeout|setInterval|location\.(replace|assign|href\s*=)/);
});
test('unknown routes serve the same page', () => assert.equal(read(fallback), html));
for (const page of pages) {
  test(`${page} works without JavaScript and has no network menu`, () => {
    const p = read(page);
    assert.doesNotMatch(/<dashhq-bar[^>]*>/.exec(p)[0], /networks=/);
    assert.match(p, /<h1 class="dh-page-header__title">/);
    assert.match(p, /script-src 'self'/);
    assert.doesNotMatch(p, /unsafe-|src="\.\//);
    if (isLookup(p)) return;
    const link = /<dashhq-moved[\s\S]*?<a class="dh-btn dh-btn--primary" href="([^"]+)"/.exec(p);
    assert.ok(link, 'a primary link inside <dashhq-moved>');
    const u = new URL(link[1].replaceAll('&amp;', '&'));
    assert.equal(u.origin, home);
    assert.equal(u.searchParams.get('moved-from'), site);
    if (site === 'basics') {
      assert.equal(u.searchParams.get('network'), 'testnet');
      assert.equal(u.pathname, { 'get-identities': '/identities', 'all-dpns': '/names' }[/get-identities|all-dpns/.exec(page)[0]]);
      assert.equal(movedTag(p).match(/ path="([^"]+)"/)[1], u.pathname);
    } else assert.ok(u.searchParams.get('network'));
    assert.match(p, /<noscript>/);
  });
}

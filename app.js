/* Harbour birthday invite: three tabs (Details, Wishlist, Dress code).
   The wishlist filters by gift type and price band; guests tap to claim a
   gift (no names). Claims live in Firebase (shared) or localStorage (demo mode). */
(function () {
  "use strict";

  const P = window.PARTY || {};
  const $ = (id) => document.getElementById(id);
  const FIREBASE_VERSION = "10.12.2";
  const CATS = P.categories || {};
  const BANDS = P.priceBands || {};
  const ITEMS = P.wishlist || [];

  // ---------------- helpers ----------------
  const ordinal = (n) => { const s = ["th", "st", "nd", "rd"], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };

  let toastTimer;
  function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 3200);
  }

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  // ---------------- tabs ----------------
  const TAB_IDS = ["details", "wishlist", "dresscode"];

  let pinLoaded = false;
  function loadPinterest() {
    const dc = P.dressCode || {};
    if (pinLoaded || !dc.pinterest) return;
    pinLoaded = true;
    const box = $("pin-board");
    // Size the widget to the space it has (phones are narrow).
    const width = Math.max(240, Math.floor(box.clientWidth || 320));
    const a = document.createElement("a");
    a.href = dc.pinterest;
    a.setAttribute("data-pin-do", "embedBoard");
    a.setAttribute("data-pin-board-width", String(width));
    a.setAttribute("data-pin-scale-height", width < 420 ? "420" : "520");
    a.setAttribute("data-pin-scale-width", width < 420 ? "70" : "90");
    box.appendChild(a);
    const done = () => { const l = $("pin-loading"); if (l) l.remove(); };
    if (window.PinUtils && window.PinUtils.build) { window.PinUtils.build(); done(); return; }
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://assets.pinterest.com/js/pinit.js";
    s.onload = () => setTimeout(done, 400);
    s.onerror = () => {
      const l = $("pin-loading");
      if (l) l.textContent = "The board couldn't load here. Tap \"Open in Pinterest\" to see it.";
    };
    document.body.appendChild(s);
  }

  function showTab(name, { focus = false, push = true } = {}) {
    if (!TAB_IDS.includes(name)) name = "details";
    if (name === "dresscode") setTimeout(loadPinterest, 0);
    TAB_IDS.forEach((id) => {
      const on = id === name;
      const tab = $("tab-" + id);
      tab.setAttribute("aria-selected", String(on));
      tab.tabIndex = on ? 0 : -1;
      $("panel-" + id).hidden = !on;
    });
    if (focus) $("tab-" + name).focus();
    if (push) {
      try { history.replaceState(null, "", name === "details" ? location.pathname + location.search : "#" + name); } catch { /* file:// can refuse */ }
    }
    // Keep the tab bar in view when switching from further down the page.
    const bar = document.querySelector(".tabbar");
    if (bar.getBoundingClientRect().top < 0 || window.scrollY > bar.offsetTop) {
      window.scrollTo({ top: bar.offsetTop, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
  }

  function wireTabs() {
    document.querySelectorAll(".tab").forEach((tab, i, all) => {
      tab.addEventListener("click", () => showTab(tab.dataset.tab));
      tab.addEventListener("keydown", (e) => {
        let j = null;
        if (e.key === "ArrowRight") j = (i + 1) % all.length;
        if (e.key === "ArrowLeft") j = (i - 1 + all.length) % all.length;
        if (e.key === "Home") j = 0;
        if (e.key === "End") j = all.length - 1;
        if (j != null) { e.preventDefault(); showTab(all[j].dataset.tab, { focus: true }); }
      });
    });
    document.querySelectorAll("[data-goto]").forEach((b) => b.addEventListener("click", () => showTab(b.dataset.goto)));
    window.addEventListener("hashchange", () => showTab(location.hash.slice(1), { push: false }));
    const start = location.hash.slice(1);
    showTab(TAB_IDS.includes(start) ? start : "details", { push: false });
  }

  // ---------------- details + dress code ----------------
  const host = P.host || "My";

  function renderDetails() {
    document.title = `${host}'s ${P.golden ? "golden " : P.age ? ordinal(P.age) + " " : ""}birthday`;
    if (P.golden) {
      $("golden-word").hidden = false;
      document.body.classList.add("is-golden");
      $("eyebrow").textContent = `Golden birthday · ${P.age ? ordinal(P.age) + " on the " + ordinal(P.age) : "Sydney Harbour"}`;
    }
    $("host-name").textContent = host + "'s";
    $("tagline").textContent = P.tagline || "";

    if (P.age != null) {
      $("ring-num").textContent = P.age;
      $("ring").setAttribute("aria-label", `Turning ${P.age}`);
    } else {
      $("ring").hidden = true;
    }

    const dc = typeof P.dressCode === "string" ? { headline: P.dressCode } : (P.dressCode || {});
    $("f-when").textContent = P.when || "";
    $("f-where").textContent = P.where || "";
    $("f-dress").textContent = dc.headline || "Whatever makes you happy";
    if (P.bring) $("f-bring").textContent = P.bring; else $("bring-row").hidden = true;
    if (P.onBoard) $("f-onboard").textContent = P.onBoard; else $("onboard-row").hidden = true;
    $("f-extra").textContent = P.extraInfo || "";
    $("wish-note").textContent = P.wishlistNote || "";
    const sizes = P.sizes || [];
    if (sizes.length) {
      $("sizes-box").hidden = false;
      const dl = $("size-list");
      dl.replaceChildren();
      sizes.forEach((sz) => {
        const d = el("div", "size");
        d.appendChild(el("dt", null, sz.label));
        d.appendChild(el("dd", null, sz.value));
        dl.appendChild(d);
      });
    }
    $("footer-text").textContent = `see you on deck! love, ${host} xx`;

    const fb = $("fb-link");
    if (P.facebookEvent) fb.href = P.facebookEvent; else fb.hidden = true;
    const q = P.mapsQuery;
    if (q) $("map-link").href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);
    else $("map-link").hidden = true;

    // Pinterest board (loaded the first time the Dress code tab opens)
    if (dc.pinterest) {
      $("inspo").hidden = false;
      $("pin-link").href = dc.pinterest;
    }

    // dress code tab
    $("dc-headline").textContent = dc.headline || "Come as you are";
    $("dc-intro").textContent = dc.intro || "";
    const tips = $("dc-tips");
    tips.replaceChildren();
    (dc.tips || []).forEach((t) => {
      const row = el("div", "dress-tip");
      row.appendChild(el("dt", null, t.title));
      row.appendChild(el("dd", null, t.text));
      tips.appendChild(row);
    });
  }

  // ---------------- storage ----------------
  // Both stores expose: uid, onClaims(cb), claim(id), unclaim(id)

  function demoStore() {
    const read = (k, f) => { try { return JSON.parse(localStorage.getItem(k)) ?? f; } catch { return f; } };
    const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage blocked */ } };
    let uid = read("bday:uid", null);
    if (!uid) { uid = "demo-" + Math.random().toString(36).slice(2); write("bday:uid", uid); }
    const subs = [];
    const emit = () => subs.forEach((cb) => cb(read("bday:claims", {})));
    return {
      uid,
      onClaims(cb) { subs.push(cb); cb(read("bday:claims", {})); },
      async claim(id) {
        const all = read("bday:claims", {});
        if (all[id]) throw new Error("taken");
        all[id] = { uid }; write("bday:claims", all); emit();
      },
      async unclaim(id) { const all = read("bday:claims", {}); if (all[id]?.uid === uid) delete all[id]; write("bday:claims", all); emit(); }
    };
  }

  async function firebaseStore(cfg) {
    const base = `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}`;
    const [appMod, authMod, fs] = await Promise.all([
      import(`${base}/firebase-app.js`),
      import(`${base}/firebase-auth.js`),
      import(`${base}/firebase-firestore.js`)
    ]);
    const app = appMod.initializeApp(cfg);
    const auth = authMod.getAuth(app);
    const cred = await authMod.signInAnonymously(auth);
    const db = fs.getFirestore(app);
    const uid = cred.user.uid;
    return {
      uid,
      onClaims(cb) {
        fs.onSnapshot(fs.collection(db, "claims"), (snap) => {
          const m = {}; snap.forEach((d) => { m[d.id] = d.data(); }); cb(m);
        }, (e) => { console.error(e); toast("Couldn't load the wishlist. Check your connection and refresh."); });
      },
      async claim(id) {
        // Rules only allow creating a claim that doesn't exist yet, so a race loses cleanly.
        try { await fs.setDoc(fs.doc(db, "claims", id), { uid, at: fs.serverTimestamp() }); }
        catch (e) { throw new Error(e.code === "permission-denied" ? "taken" : "failed"); }
      },
      async unclaim(id) { await fs.deleteDoc(fs.doc(db, "claims", id)); }
    };
  }

  // ---------------- wishlist ----------------
  let store;
  let claims = {};
  const busy = new Set();
  const filter = { cat: "all", price: "all", hideClaimed: false };

  const matchesCat = (item, cat) => cat === "all" || item.category === cat;
  const matchesPrice = (item, band) => band === "all" || item.price === band || item.price === "any";

  function renderChips() {
    const make = (boxId, entries, key, test) => {
      const box = $(boxId);
      box.replaceChildren();
      entries.forEach(([value, label]) => {
        // count what this chip would show, given the other filter
        const n = ITEMS.filter((i) => test(i, value) && (key === "cat" ? matchesPrice(i, filter.price) : matchesCat(i, filter.cat))).length;
        const b = el("button", "chip");
        b.type = "button";
        b.setAttribute("aria-pressed", String(filter[key] === value));
        b.appendChild(document.createTextNode(label));
        b.appendChild(el("span", "n", String(n)));
        b.addEventListener("click", () => { filter[key] = value; renderWishlist(); });
        box.appendChild(b);
      });
    };
    const usedCats = Object.entries(CATS).filter(([k]) => ITEMS.some((i) => i.category === k));
    make("cat-chips", [["all", "All"], ...usedCats], "cat", matchesCat);
    make("price-chips", [["all", "Any price"], ...Object.entries(BANDS)], "price", matchesPrice);
  }

  function itemMain(item) {
    const main = el("div", "wish-main");
    main.appendChild(el("span", "wish-title", item.title));
    const meta = el("div", "wish-meta");
    if (item.cost) meta.appendChild(el("span", "tag price-tag", item.cost));
    if (item.category && CATS[item.category]) meta.appendChild(el("span", "tag", CATS[item.category]));
    if (item.link) {
      const a = el("a", null, "View item");
      a.href = item.link; a.target = "_blank"; a.rel = "noopener";
      meta.appendChild(a);
    }
    if (meta.childNodes.length) main.appendChild(meta);
    if (item.note) main.appendChild(el("span", "wish-note", item.note));
    return main;
  }

  async function toggleClaim(item, mine) {
    if (!store || busy.has(item.id)) return;
    busy.add(item.id);
    try {
      if (mine) {
        await store.unclaim(item.id);
        toast("Unclaimed. Someone else can pick it now.");
      } else {
        await store.claim(item.id);
        toast("It's yours. Only this phone can unclaim it.");
      }
    } catch (e) {
      console.error(e);
      toast(e.message === "taken" ? "Someone just claimed that one. Pick another?" : "That didn't save. Check your connection and try again.");
    } finally {
      busy.delete(item.id);
    }
  }

  function renderWishlist() {
    renderChips();
    const list = $("wish-list");
    list.replaceChildren();

    // Claimable items first (in config order), open ideas last.
    const ordered = [...ITEMS.filter((i) => !i.open), ...ITEMS.filter((i) => i.open)];
    const shown = ordered.filter((i) =>
      matchesCat(i, filter.cat) && matchesPrice(i, filter.price) && !(filter.hideClaimed && !i.open && claims[i.id])
    );

    shown.forEach((item) => {
      const c = !item.open && claims[item.id];
      const mine = c && store && c.uid === store.uid;
      const li = el("li", "wish" + (item.open ? " open-idea" : "") + (c ? " claimed" : "") + (mine ? " mine" : ""));
      li.appendChild(itemMain(item));

      const side = el("div", "wish-side");
      if (item.open) {
        side.appendChild(el("span", "pill", "Open idea, no need to claim"));
      } else if (mine) {
        side.appendChild(el("span", "pill", "You're getting this"));
        const un = el("button", "link-btn", "Unclaim");
        un.type = "button";
        un.addEventListener("click", () => toggleClaim(item, true));
        side.appendChild(un);
      } else if (c) {
        side.appendChild(el("span", "pill", "Someone's got this"));
      } else {
        const b = el("button", "btn btn-primary btn-small", "I'll get this");
        b.type = "button";
        b.setAttribute("aria-label", `I'll get ${item.title}`);
        b.addEventListener("click", () => toggleClaim(item, false));
        side.appendChild(b);
      }
      li.appendChild(side);
      list.appendChild(li);
    });

    const claimable = ITEMS.filter((i) => !i.open);
    const left = claimable.filter((i) => !claims[i.id]).length;
    const filtered = filter.cat !== "all" || filter.price !== "all" || filter.hideClaimed;
    $("wish-count").textContent = (filtered ? `Showing ${shown.length} of ${ITEMS.length}` : `${ITEMS.length} ideas`) + ` · ${left} still up for grabs`;
    $("wish-empty").hidden = shown.length > 0;
  }

  function wireWishlist() {
    $("hide-claimed").addEventListener("change", (e) => { filter.hideClaimed = e.target.checked; renderWishlist(); });
    $("clear-filters").addEventListener("click", () => {
      filter.cat = "all"; filter.price = "all"; filter.hideClaimed = false;
      $("hide-claimed").checked = false;
      renderWishlist();
    });
  }

  // ---------------- boot ----------------
  async function boot() {
    renderDetails();
    wireTabs();
    wireWishlist();
    renderWishlist();

    const banner = $("banner");
    const notes = [];
    if (P.sample) notes.push("Some details are placeholders until they're edited in config.js.");

    if (window.FIREBASE_CONFIG) {
      try {
        store = await firebaseStore(window.FIREBASE_CONFIG);
      } catch (e) {
        console.error("Firebase failed to start", e);
        notes.push("Couldn't connect to the wishlist. Claims will only save on this device.");
        store = demoStore();
      }
    } else {
      notes.push("Demo mode: claims only save in this browser until Firebase is set up.");
      store = demoStore();
    }
    if (notes.length) { banner.textContent = notes.join(" "); banner.hidden = false; }

    store.onClaims((m) => { claims = m; renderWishlist(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();

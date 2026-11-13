/* Diet Crate behaviour: menu, cart, WhatsApp links, enquiry form, analytics. */
(function () {
  "use strict";

  var CFG = window.DIET_CRATE || {};
  var NUMBER = String(CFG.whatsapp || "").replace(/\D/g, "");

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function money(n) { return "₹" + Number(n).toLocaleString("en-IN"); }
  function waHref(text) { return "https://wa.me/" + NUMBER + "?text=" + encodeURIComponent(text); }

  if (!NUMBER && window.console) console.warn("Diet Crate: add your WhatsApp number in js/config.js so buttons reach your phone.");

  /* ---------- Analytics (only when gaId is set) ---------- */
  var GA = String(CFG.gaId || "").trim();
  if (/^G-[A-Z0-9]+$/i.test(GA)) {
    var gs = document.createElement("script");
    gs.async = true;
    gs.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA);
    document.head.appendChild(gs);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA);
  }
  function track(name, params) { if (window.gtag) window.gtag("event", name, params || {}); }

  /* ---------- WhatsApp links and footer contact details ---------- */
  $$("[data-wa]").forEach(function (a) { a.href = waHref(a.getAttribute("data-wa")); });
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-wa], #sentLink");
    if (a) track("whatsapp_click", { link_text: (a.textContent || "").trim().slice(0, 40) });
  });
  if (CFG.phoneDisplay) {
    var digits = String(CFG.phoneDisplay).replace(/[^\d+]/g, "");
    var p1 = $('[data-bind="phone"]'), p2 = $('[data-bind="phone-tel"]');
    if (p1) p1.textContent = "WhatsApp " + CFG.phoneDisplay;
    if (p2) { p2.textContent = CFG.phoneDisplay; p2.href = "tel:" + digits; }
  }
  if (CFG.email) {
    var em = $('[data-bind="email"]');
    if (em) { em.textContent = CFG.email; em.href = "mailto:" + CFG.email; }
  }

  /* ---------- Mobile menu and active link ---------- */
  var menuBtn = $("#menuBtn"), navLinks = $("#navLinks");
  menuBtn.addEventListener("click", function () {
    var open = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  navLinks.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { navLinks.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }
  });
  var spy = ["home", "crates", "pricing", "it-parks", "contact"].map(function (id) { return document.getElementById(id); });
  function markActive() {
    var y = window.scrollY + 140, cur = "home";
    spy.forEach(function (s) { if (s && s.offsetTop <= y) cur = s.id; });
    $$("#navLinks a").forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + cur); });
  }
  window.addEventListener("scroll", markActive, { passive: true });
  markActive();

  /* ---------- Prefill the enquiry form from buttons ---------- */
  $$("[data-prefill]").forEach(function (a) {
    a.addEventListener("click", function () {
      var v = a.getAttribute("data-prefill"), sel = $("#f-type");
      for (var i = 0; i < sel.options.length; i++) if (sel.options[i].text === v) sel.selectedIndex = i;
    });
  });

  /* ---------- Cart ---------- */
  var KEY = "dietcrate_cart_v1", cart = {}, catalog = {};
  $$("[data-add]").forEach(function (b) {
    catalog[b.getAttribute("data-add")] = { id: b.getAttribute("data-add"), name: b.getAttribute("data-name"), price: Number(b.getAttribute("data-price")) };
  });

  function load() {
    var raw = null;
    try { raw = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { raw = {}; }
    cart = {};
    if (raw && typeof raw === "object") {
      Object.keys(raw).forEach(function (id) {
        var q = parseInt(raw[id], 10);
        if (catalog[id] && q > 0) cart[id] = Math.min(q, 99);
      });
    }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) { /* storage unavailable */ } }
  function count() { return Object.keys(cart).reduce(function (n, id) { return n + cart[id]; }, 0); }
  function total() { return Object.keys(cart).reduce(function (n, id) { return n + cart[id] * catalog[id].price; }, 0); }

  var drawer = $("#drawer"), scrim = $("#scrim"), cartBtn = $("#cartBtn"), lastFocus = null;

  function render() {
    var n = count(), badge = $("#cartCount");
    badge.textContent = String(n);
    badge.hidden = n === 0;
    cartBtn.setAttribute("aria-label", "Open cart, " + n + (n === 1 ? " item" : " items"));
    $("#cartEmpty").hidden = n > 0;
    $("#cartFull").hidden = n === 0;
    var list = $("#cartList");
    list.innerHTML = "";
    Object.keys(cart).forEach(function (id) {
      var it = catalog[id], q = cart[id], li = document.createElement("li");
      li.className = "cart-row";
      li.innerHTML =
        '<div><b></b><div class="each"></div></div>' +
        '<div class="line"></div>' +
        '<div class="qty">' +
        '<button type="button" data-act="dec" aria-label="Decrease quantity"><svg class="ic" aria-hidden="true"><use href="#i-minus"/></svg></button>' +
        '<span class="n" aria-live="polite"></span>' +
        '<button type="button" data-act="inc" aria-label="Increase quantity"><svg class="ic" aria-hidden="true"><use href="#i-plus"/></svg></button></div>' +
        '<button type="button" class="link-btn remove" data-act="rm">Remove</button>';
      li.setAttribute("data-id", id);
      $("b", li).textContent = it.name;
      $(".each", li).textContent = money(it.price) + " per crate";
      $(".line", li).textContent = money(it.price * q);
      $(".n", li).textContent = String(q);
      $('[data-act="dec"]', li).setAttribute("aria-label", "Decrease " + it.name + " quantity");
      $('[data-act="inc"]', li).setAttribute("aria-label", "Increase " + it.name + " quantity");
      $('[data-act="rm"]', li).setAttribute("aria-label", "Remove " + it.name);
      list.appendChild(li);
    });
    $("#cartTotal").textContent = money(total());
  }

  function openDrawer() {
    lastFocus = document.activeElement;
    toast.hidden = true;
    scrim.hidden = false;
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("lock");
    $("#cartStatus").hidden = true;
    setTimeout(function () { $("#drawerClose").focus(); }, 30);
    track("view_cart");
  }
  function closeDrawer() {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    scrim.hidden = true;
    document.body.classList.remove("lock");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  cartBtn.addEventListener("click", openDrawer);
  $("#drawerClose").addEventListener("click", closeDrawer);
  scrim.addEventListener("click", closeDrawer);
  $("#browseCrates").addEventListener("click", closeDrawer);
  document.addEventListener("keydown", function (e) {
    if (!drawer.classList.contains("open")) return;
    if (e.key === "Escape") { closeDrawer(); return; }
    if (e.key === "Tab") {
      var f = $$("button, a[href], input, textarea, select", drawer).filter(function (x) { return !x.disabled && x.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  var toast = $("#toast"), toastTimer = null;
  function showToast(text) {
    toast.innerHTML = "<span></span><button type=\"button\">View cart</button>";
    $("span", toast).textContent = text;
    $("button", toast).addEventListener("click", function () { toast.hidden = true; openDrawer(); });
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.hidden = true; }, 3500);
  }

  $$("[data-add]").forEach(function (b) {
    b.addEventListener("click", function () {
      var id = b.getAttribute("data-add");
      cart[id] = Math.min((cart[id] || 0) + 1, 99);
      save(); render();
      showToast(catalog[id].name + " added to cart");
      track("add_to_cart", { item_id: id, value: catalog[id].price, currency: "INR" });
    });
  });

  $("#cartList").addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-act]");
    if (!btn) return;
    var id = btn.closest("li").getAttribute("data-id"), act = btn.getAttribute("data-act");
    if (act === "inc") cart[id] = Math.min(cart[id] + 1, 99);
    else if (act === "dec") { cart[id] -= 1; if (cart[id] <= 0) delete cart[id]; }
    else if (act === "rm") delete cart[id];
    save(); render();
    if (!count()) { var b = $("#browseCrates"); if (b) b.focus(); }
  });

  $("#clearCart").addEventListener("click", function () { cart = {}; save(); render(); });

  $("#checkout").addEventListener("click", function () {
    var name = $("#c-name").value.trim(), loc = $("#c-loc").value.trim(), note = $("#c-note").value.trim();
    var en = $("#e-cname"), el = $("#e-cloc"), ok = true;
    en.hidden = !!name; el.hidden = !!loc;
    if (!name) { en.textContent = "Enter your name so we know who the order is for."; ok = false; }
    if (!loc) { el.textContent = "Enter your office or IT Park so we can plan delivery."; ok = false; }
    if (!ok) { (name ? $("#c-loc") : $("#c-name")).focus(); return; }
    if (!count()) return;

    var lines = ["Hi Diet Crate, I would like to order:"];
    Object.keys(cart).forEach(function (id) {
      var it = catalog[id];
      lines.push("- " + cart[id] + " x " + it.name + " (" + money(it.price) + " each) = " + money(it.price * cart[id]));
    });
    lines.push("Estimated total: " + money(total()));
    lines.push("Name: " + name);
    lines.push("Office / IT Park: " + loc);
    if (note) lines.push("Notes: " + note);

    track("whatsapp_order", { value: total(), currency: "INR" });
    window.open(waHref(lines.join("\n")), "_blank", "noopener");
    var st = $("#cartStatus");
    st.textContent = "WhatsApp is opening with your order. Send the message there to place it. Your cart stays here until you clear it.";
    st.hidden = false;
  });

  /* Clear a field's error message as soon as the visitor edits it */
  [["#c-name", "#e-cname"], ["#c-loc", "#e-cloc"], ["#f-name", "#e-name"]].forEach(function (pair) {
    $(pair[0]).addEventListener("input", function () { $(pair[1]).hidden = true; });
  });

  load(); render();

  /* ---------- Enquiry form: builds a WhatsApp message, nothing is sent from the page ---------- */
  var lastMsg = "";
  $("#enquiry").addEventListener("submit", function (e) {
    e.preventDefault();
    var name = $("#f-name").value.trim(), err = $("#e-name");
    if (!name) { err.textContent = "Enter your name so we know who to reply to."; err.hidden = false; $("#f-name").focus(); return; }
    err.hidden = true;
    var lines = ["Hi Diet Crate,", "I am interested in: " + $("#f-type").value, "Name: " + name];
    var company = $("#f-company").value.trim(), msg = $("#f-msg").value.trim();
    if (company) lines.push("Company / IT Park: " + company);
    lines.push("Preferred crate: " + $("#f-crate").value);
    if (msg) lines.push("Message: " + msg);
    lastMsg = lines.join("\n");
    $("#sentText").textContent = lastMsg;
    $("#sentLink").href = waHref(lastMsg);
    $("#sent").hidden = false;
    $("#sent").scrollIntoView({ block: "nearest", behavior: "smooth" });
    track("enquiry_prepared", { interest: $("#f-type").value });
  });
  $("#copyMsg").addEventListener("click", function () {
    var b = $("#copyMsg");
    function done(t) { b.textContent = t; setTimeout(function () { b.textContent = "Copy message"; }, 2000); }
    function fallback() {
      var r = document.createRange(); r.selectNodeContents($("#sentText"));
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      done("Selected. Press Ctrl+C");
    }
    try { navigator.clipboard.writeText(lastMsg).then(function () { done("Copied"); }, fallback); } catch (x) { fallback(); }
  });
})();

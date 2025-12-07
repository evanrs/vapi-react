import o from "js-cookie";
function l() {
  const t = window.location.hostname;
  if (t === "localhost" || t === "127.0.0.1" || /^\d+\.\d+\.\d+\.\d+$/.test(t))
    return t;
  const e = t.split(".");
  return e.length <= 2 ? t : "." + e.slice(-2).join(".");
}
const u = (t, e, r, n = "session") => {
  const i = e.webCallUrl || e.transport?.callUrl;
  if (!i) {
    console.warn(
      "No webCallUrl found in call object, cannot store for reconnection"
    );
    return;
  }
  const a = {
    webCallUrl: i,
    id: e.id,
    artifactPlan: e.artifactPlan,
    assistant: e.assistant,
    callOptions: r,
    timestamp: Date.now()
  };
  if (n === "session")
    sessionStorage.setItem(t, JSON.stringify(a));
  else if (n === "cookies")
    try {
      const s = l();
      o.set(t, JSON.stringify(a), {
        domain: s,
        path: "/",
        secure: !0,
        sameSite: "lax",
        expires: 1 / 24
        // 1 hour (expires takes days, so 1/24 = 1 hour)
      });
    } catch (s) {
      console.error("Failed to store call data in cookie:", s);
    }
}, f = (t, e = "session") => {
  try {
    if (e === "session") {
      const r = sessionStorage.getItem(t);
      return r ? JSON.parse(r) : null;
    } else if (e === "cookies") {
      const r = o.get(t);
      return r ? JSON.parse(r) : null;
    }
    return null;
  } catch (r) {
    return console.error("Error reading stored call data:", r), null;
  }
}, d = (t, e = "session") => {
  if (e === "session")
    sessionStorage.removeItem(t);
  else if (e === "cookies") {
    const r = l();
    o.remove(t, {
      domain: r,
      path: "/"
    });
  }
}, m = (t, e) => {
  if (t === e) return !0;
  if (!t || !e) return !1;
  try {
    return JSON.stringify(t) === JSON.stringify(e);
  } catch {
    return t === e;
  }
};
export {
  m as areCallOptionsEqual,
  d as clearStoredCall,
  f as getStoredCallData,
  u as storeCallData
};
//# sourceMappingURL=vapiCallStorage.js.map

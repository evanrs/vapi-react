import { jsxs as ne, jsx as v, Fragment as it } from "react/jsx-runtime";
import * as g from "react";
import { useState as le, useRef as Ve, useEffect as Te, useCallback as me, createContext as zi } from "react";
import Ni from "@vapi-ai/web";
function yt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t];
    for (var r in n)
      e[r] = n[r];
  }
  return e;
}
var Di = {
  read: function(e) {
    return e[0] === '"' && (e = e.slice(1, -1)), e.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
  },
  write: function(e) {
    return encodeURIComponent(e).replace(
      /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
      decodeURIComponent
    );
  }
};
function Jt(e, t) {
  function n(i, l, a) {
    if (!(typeof document > "u")) {
      a = yt({}, t, a), typeof a.expires == "number" && (a.expires = new Date(Date.now() + a.expires * 864e5)), a.expires && (a.expires = a.expires.toUTCString()), i = encodeURIComponent(i).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
      var o = "";
      for (var c in a)
        a[c] && (o += "; " + c, a[c] !== !0 && (o += "=" + a[c].split(";")[0]));
      return document.cookie = i + "=" + e.write(l, i) + o;
    }
  }
  function r(i) {
    if (!(typeof document > "u" || arguments.length && !i)) {
      for (var l = document.cookie ? document.cookie.split("; ") : [], a = {}, o = 0; o < l.length; o++) {
        var c = l[o].split("="), s = c.slice(1).join("=");
        try {
          var u = decodeURIComponent(c[0]);
          if (a[u] = e.read(s, u), i === u)
            break;
        } catch {
        }
      }
      return i ? a[i] : a;
    }
  }
  return Object.create(
    {
      set: n,
      get: r,
      remove: function(i, l) {
        n(
          i,
          "",
          yt({}, l, {
            expires: -1
          })
        );
      },
      withAttributes: function(i) {
        return Jt(this.converter, yt({}, this.attributes, i));
      },
      withConverter: function(i) {
        return Jt(yt({}, this.converter, i), this.attributes);
      }
    },
    {
      attributes: { value: Object.freeze(t) },
      converter: { value: Object.freeze(e) }
    }
  );
}
var un = Jt(Di, { path: "/" });
function Sr() {
  const e = window.location.hostname;
  if (e === "localhost" || e === "127.0.0.1" || /^\d+\.\d+\.\d+\.\d+$/.test(e))
    return e;
  const t = e.split(".");
  return t.length <= 2 ? e : "." + t.slice(-2).join(".");
}
const Vi = (e, t, n, r = "session") => {
  const i = t.webCallUrl || t.transport?.callUrl;
  if (!i) {
    console.warn(
      "No webCallUrl found in call object, cannot store for reconnection"
    );
    return;
  }
  const l = {
    webCallUrl: i,
    id: t.id,
    artifactPlan: t.artifactPlan,
    assistant: t.assistant,
    callOptions: n,
    timestamp: Date.now()
  };
  if (r === "session")
    sessionStorage.setItem(e, JSON.stringify(l));
  else if (r === "cookies")
    try {
      const a = Sr();
      un.set(e, JSON.stringify(l), {
        domain: a,
        path: "/",
        secure: !0,
        sameSite: "lax",
        expires: 1 / 24
        // 1 hour (expires takes days, so 1/24 = 1 hour)
      });
    } catch (a) {
      console.error("Failed to store call data in cookie:", a);
    }
}, Bi = (e, t = "session") => {
  try {
    if (t === "session") {
      const n = sessionStorage.getItem(e);
      return n ? JSON.parse(n) : null;
    } else if (t === "cookies") {
      const n = un.get(e);
      return n ? JSON.parse(n) : null;
    }
    return null;
  } catch (n) {
    return console.error("Error reading stored call data:", n), null;
  }
}, xt = (e, t = "session") => {
  if (t === "session")
    sessionStorage.removeItem(e);
  else if (t === "cookies") {
    const n = Sr();
    un.remove(e, {
      domain: n,
      path: "/"
    });
  }
}, Oi = (e, t) => {
  if (e === t) return !0;
  if (!e || !t) return !1;
  try {
    return JSON.stringify(e) === JSON.stringify(t);
  } catch {
    return e === t;
  }
}, Ri = ({
  publicKey: e,
  callOptions: t,
  apiUrl: n,
  enabled: r = !0,
  voiceAutoReconnect: i = !1,
  voiceReconnectStorage: l = "session",
  reconnectStorageKey: a = "vapi_widget_web_call",
  onCallStart: o,
  onCallEnd: c,
  onMessage: s,
  onError: u,
  onTranscript: h
}) => {
  const [p] = le(
    () => e ? new Ni(e, n) : null
  ), [f, w] = le(!1), [k, A] = le(!1), [b, T] = le(!1), [M, R] = le(0), [_, y] = le("disconnected"), z = Ve({
    onCallStart: o,
    onCallEnd: c,
    onMessage: s,
    onError: u,
    onTranscript: h
  });
  Te(() => {
    z.current = {
      onCallStart: o,
      onCallEnd: c,
      onMessage: s,
      onError: u,
      onTranscript: h
    };
  }), Te(() => {
    if (!p)
      return;
    const S = () => {
      w(!0), y("connected"), z.current.onCallStart?.();
    }, E = () => {
      w(!1), y("disconnected"), R(0), A(!1), T(!1), xt(
        a,
        l
      ), z.current.onCallEnd?.();
    }, D = () => {
      A(!0);
    }, X = () => {
      A(!1);
    }, U = (N) => {
      R(N);
    }, W = (N) => {
      N.type === "transcript" && N.transcriptType === "final" && (N.role === "user" || N.role === "assistant") && z.current.onTranscript?.({
        role: N.role,
        text: N.transcript,
        timestamp: /* @__PURE__ */ new Date()
      }), z.current.onMessage?.(N);
    }, m = (N) => {
      console.error("Vapi error:", N), y("disconnected"), w(!1), A(!1), z.current.onError?.(N);
    };
    return p.on("call-start", S), p.on("call-end", E), p.on("speech-start", D), p.on("speech-end", X), p.on("volume-level", U), p.on("message", W), p.on("error", m), () => {
      p.removeListener("call-start", S), p.removeListener("call-end", E), p.removeListener("speech-start", D), p.removeListener("speech-end", X), p.removeListener("volume-level", U), p.removeListener("message", W), p.removeListener("error", m);
    };
  }, [p, a, l]), Te(() => () => {
    p && p.stop();
  }, [p]);
  const L = me(async () => {
    if (!p || !r) {
      console.error("Cannot start call: no vapi instance or not enabled");
      return;
    }
    try {
      console.log("Starting call with configuration:", t), console.log("Starting call with options:", {
        voiceAutoReconnect: i
      }), y("connecting");
      const S = await p.start(
        // assistant
        t,
        // assistant overrides,
        void 0,
        // squad
        void 0,
        // workflow
        void 0,
        // workflow overrides
        void 0,
        // options
        {
          roomDeleteOnUserLeaveEnabled: !i
        }
      );
      S && i && Vi(
        a,
        S,
        t,
        l
      );
    } catch (S) {
      console.error("Error starting call:", S), y("disconnected"), z.current.onError?.(S);
    }
  }, [
    p,
    t,
    r,
    i,
    l,
    a
  ]), B = me(
    async ({ force: S = !1 } = {}) => {
      if (!p) {
        console.log("Cannot end call: no vapi instance");
        return;
      }
      console.log("Ending call with force:", S), S ? p.end() : p.stop();
    },
    [p]
  ), j = me(
    async ({ force: S = !1 } = {}) => {
      f ? await B({ force: S }) : await L();
    },
    [f, L, B]
  ), F = me(() => {
    if (!p || !f) {
      console.log("Cannot toggle mute: no vapi instance or call not active");
      return;
    }
    const S = !b;
    p.setMuted(S), T(S);
  }, [p, f, b]), P = me(async () => {
    if (!p || !r) {
      console.error("Cannot reconnect: no vapi instance or not enabled");
      return;
    }
    const S = Bi(
      a,
      l
    );
    if (!S) {
      console.warn("No stored call data found for reconnection");
      return;
    }
    if (!Oi(S.callOptions, t)) {
      console.warn(
        "CallOptions have changed since last call, clearing stored data and skipping reconnection"
      ), xt(
        a,
        l
      );
      return;
    }
    y("connecting");
    try {
      await p.reconnect({
        webCallUrl: S.webCallUrl,
        id: S.id,
        artifactPlan: S.artifactPlan,
        assistant: S.assistant
      }), console.log("Successfully reconnected to call");
    } catch (E) {
      y("disconnected"), console.error("Reconnection failed:", E), xt(
        a,
        l
      ), z.current.onError?.(E);
    }
  }, [p, r, a, l, t]), q = me(() => {
    xt(a, l);
  }, [a, l]);
  return Te(() => {
    !p || !r || !i || P();
  }, [p, r, i, P, a]), {
    // State
    isCallActive: f,
    isSpeaking: k,
    volumeLevel: M,
    connectionStatus: _,
    isMuted: b,
    // Handlers
    startCall: L,
    endCall: B,
    toggleCall: j,
    toggleMute: F,
    reconnect: P,
    clearStoredCall: q
  };
};
async function _i(e, t) {
  const n = e.getReader();
  let r;
  for (; !(r = await n.read()).done; )
    t(r.value);
}
function Hi(e) {
  let t, n, r, i = !1;
  return function(a) {
    t === void 0 ? (t = a, n = 0, r = -1) : t = Zi(t, a);
    const o = t.length;
    let c = 0;
    for (; n < o; ) {
      i && (t[n] === 10 && (c = ++n), i = !1);
      let s = -1;
      for (; n < o && s === -1; ++n)
        switch (t[n]) {
          case 58:
            r === -1 && (r = n - c);
            break;
          case 13:
            i = !0;
          case 10:
            s = n;
            break;
        }
      if (s === -1)
        break;
      e(t.subarray(c, s), r), c = n, r = -1;
    }
    c === o ? t = void 0 : c !== 0 && (t = t.subarray(c), n -= c);
  };
}
function ji(e, t, n) {
  let r = Vn();
  const i = new TextDecoder();
  return function(a, o) {
    if (a.length === 0)
      n?.(r), r = Vn();
    else if (o > 0) {
      const c = i.decode(a.subarray(0, o)), s = o + (a[o + 1] === 32 ? 2 : 1), u = i.decode(a.subarray(s));
      switch (c) {
        case "data":
          r.data = r.data ? r.data + `
` + u : u;
          break;
        case "event":
          r.event = u;
          break;
        case "id":
          e(r.id = u);
          break;
        case "retry":
          const h = parseInt(u, 10);
          isNaN(h) || t(r.retry = h);
          break;
      }
    }
  };
}
function Zi(e, t) {
  const n = new Uint8Array(e.length + t.length);
  return n.set(e), n.set(t, e.length), n;
}
function Vn() {
  return {
    data: "",
    event: "",
    id: "",
    retry: void 0
  };
}
var Ui = function(e, t) {
  var n = {};
  for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var i = 0, r = Object.getOwnPropertySymbols(e); i < r.length; i++)
      t.indexOf(r[i]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[i]) && (n[r[i]] = e[r[i]]);
  return n;
};
const Qt = "text/event-stream", $i = 1e3, Bn = "last-event-id";
function qi(e, t) {
  var { signal: n, headers: r, onopen: i, onmessage: l, onclose: a, onerror: o, openWhenHidden: c, fetch: s } = t, u = Ui(t, ["signal", "headers", "onopen", "onmessage", "onclose", "onerror", "openWhenHidden", "fetch"]);
  return new Promise((h, p) => {
    const f = Object.assign({}, r);
    f.accept || (f.accept = Qt);
    let w;
    function k() {
      w.abort(), document.hidden || _();
    }
    c || document.addEventListener("visibilitychange", k);
    let A = $i, b = 0;
    function T() {
      document.removeEventListener("visibilitychange", k), window.clearTimeout(b), w.abort();
    }
    n?.addEventListener("abort", () => {
      T(), h();
    });
    const M = s ?? window.fetch, R = i ?? Wi;
    async function _() {
      var y;
      w = new AbortController();
      try {
        const z = await M(e, Object.assign(Object.assign({}, u), { headers: f, signal: w.signal }));
        await R(z), await _i(z.body, Hi(ji((L) => {
          L ? f[Bn] = L : delete f[Bn];
        }, (L) => {
          A = L;
        }, l))), a?.(), T(), h();
      } catch (z) {
        if (!w.signal.aborted)
          try {
            const L = (y = o?.(z)) !== null && y !== void 0 ? y : A;
            window.clearTimeout(b), b = window.setTimeout(_, L);
          } catch (L) {
            T(), p(L);
          }
      }
    }
    _();
  });
}
function Wi(e) {
  const t = e.headers.get("content-type");
  if (!t?.startsWith(Qt))
    throw new Error(`Expected content-type to be ${Qt}, Actual: ${t}`);
}
class Xi extends Error {
}
class On extends Error {
}
class Yi {
  apiUrl;
  publicKey;
  abortController = null;
  constructor(t) {
    this.publicKey = t.publicKey, this.apiUrl = t.apiUrl || "https://api.vapi.ai";
  }
  async streamChat(t, n, r, i) {
    this.abort(), this.abortController = new AbortController();
    try {
      await qi(`${this.apiUrl}/chat/web`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.publicKey}`,
          "Content-Type": "application/json",
          "X-Client-ID": "vapi-widget"
        },
        body: JSON.stringify({
          ...t,
          stream: !0
        }),
        signal: this.abortController.signal,
        // Event handlers
        async onopen(l) {
          if (!(l.ok && l.headers.get("content-type")?.includes("text/event-stream")))
            throw l.status >= 400 && l.status < 500 && l.status !== 429 ? new On(`HTTP error! status: ${l.status}`) : new Xi(`HTTP error! status: ${l.status}`);
        },
        onmessage(l) {
          if (l.data !== "[DONE]")
            try {
              const a = JSON.parse(l.data);
              (a.delta !== void 0 || a.output !== void 0 || a.path !== void 0) && n(a);
            } catch {
              console.warn(`Failed to parse SSE data: ${l.data}`);
            }
        },
        onclose() {
          i?.();
        },
        onerror(l) {
          if (l instanceof On)
            throw r?.(l), l;
          if (l instanceof Error && l.name === "AbortError")
            throw i?.(), l;
          console.warn("Retriable error occurred, retrying...", l);
        }
      });
    } catch (l) {
      l instanceof Error && l.name !== "AbortError" && r?.(l);
    }
    return () => this.abort();
  }
  abort() {
    this.abortController && (this.abortController.abort(), this.abortController = null);
  }
}
function Ji(e) {
  return e.delta && e.path === "chat.output[0].content" ? e.delta : e.output !== void 0 ? e.output : null;
}
const Qi = (e, t, n, r, i) => {
  if (!t || !e.trim())
    throw new Error("Chat is disabled or message is empty");
  if (!n || !r)
    throw new Error(
      "Missing required configuration: publicKey and assistantId"
    );
  if (!i)
    throw new Error("Chat client not initialized");
}, Gi = (e) => ({
  role: "user",
  content: e.trim(),
  timestamp: /* @__PURE__ */ new Date()
}), Ki = (e) => ({
  role: "assistant",
  content: e,
  timestamp: /* @__PURE__ */ new Date()
}), Rn = (e, t) => {
  e.current = "", t.current = null;
}, el = (e, t) => {
  t((n) => {
    const r = [...n];
    return e.current = r.length, r.push({
      role: "assistant",
      content: "",
      // Start with empty content
      timestamp: /* @__PURE__ */ new Date()
    }), r;
  });
}, tl = (e, t, n, r) => {
  console.error("Stream error:", e), t(!1), n.current = null, r?.(e);
}, nl = (e, t, n, r, i, l) => {
  e.sessionId && e.sessionId !== t && n(e.sessionId);
  const a = Ji(e);
  if (a && (r.current += a, i.current !== null)) {
    const o = i.current;
    l((c) => {
      const s = [...c];
      return o < s.length && (s[o] = {
        ...s[o],
        content: r.current
      }), s;
    });
  }
}, rl = (e, t, n, r) => {
  if (e(!1), t.current = null, n.current) {
    const i = Ki(
      n.current
    );
    r?.(i);
  }
}, il = ({
  enabled: e = !0,
  publicKey: t,
  assistantId: n,
  assistantOverrides: r,
  apiUrl: i,
  sessionId: l,
  firstChatMessage: a,
  onMessage: o,
  onError: c
}) => {
  const [s, u] = le(() => e && a ? [
    {
      role: "assistant",
      content: a,
      timestamp: /* @__PURE__ */ new Date()
    }
  ] : []), [h, p] = le(!1), [f, w] = le(!1), [k, A] = le(
    l
  ), b = Ve(null), T = Ve(null), M = Ve(""), R = Ve(null), _ = Ve(!1);
  Te(() => (t && e && (b.current = new Yi({ publicKey: t, apiUrl: i })), () => {
    T.current?.();
  }), [t, i, e]), Te(() => {
    l && A(l);
  }, [l]);
  const y = me(
    (B) => {
      u((j) => [...j, B]), o?.(B);
    },
    [o]
  ), z = me(
    async (B, j = !1) => {
      try {
        if (j) {
          if (_.current)
            return;
          _.current = !0;
        }
        if (Qi(
          B,
          e,
          t,
          n,
          b.current
        ), w(!0), !j && B.trim()) {
          const D = Gi(B);
          y(D);
        }
        if (!j)
          Rn(
            M,
            R
          ), el(R, u), p(!0);
        else {
          const D = B.trim() || "Ending chat...";
          u((X) => [
            ...X,
            {
              role: "assistant",
              content: D,
              timestamp: /* @__PURE__ */ new Date()
            }
          ]), p(!0);
        }
        const F = (D) => tl(
          D,
          p,
          R,
          c
        ), P = (D) => nl(
          D,
          k,
          A,
          M,
          R,
          u
        ), q = j ? () => {
          p(!1), R.current = null;
        } : () => rl(
          p,
          R,
          M,
          o
        );
        let S;
        j ? S = B.trim() : a && a.trim() !== "" && s.length === 1 && s[0].role === "assistant" ? S = [
          {
            role: "assistant",
            content: a
          },
          {
            role: "user",
            content: B.trim()
          }
        ] : S = B.trim();
        const E = await b.current.streamChat(
          {
            input: S,
            assistantId: n,
            assistantOverrides: r,
            sessionId: k,
            stream: !0,
            sessionEnd: j
          },
          P,
          F,
          q
        );
        T.current = E;
      } catch (F) {
        throw console.error("Error sending message:", F), p(!1), R.current = null, c?.(F), F;
      } finally {
        w(!1), j && (_.current = !1);
      }
    },
    [
      e,
      t,
      n,
      r,
      k,
      y,
      c,
      o,
      a,
      s
    ]
  ), L = me(() => {
    u(e && a ? [
      {
        role: "assistant",
        content: a,
        timestamp: /* @__PURE__ */ new Date()
      }
    ] : []), T.current?.(), p(!1), w(!1), Rn(
      M,
      R
    ), A(void 0);
  }, [e, a]);
  return {
    // State
    messages: s,
    isTyping: h,
    isLoading: f,
    sessionId: k,
    isEnabled: e,
    // Handlers
    sendMessage: z,
    clearMessages: L
  };
}, ll = ({
  mode: e,
  publicKey: t,
  assistantId: n,
  assistant: r,
  assistantOverrides: i,
  apiUrl: l,
  firstChatMessage: a,
  voiceAutoReconnect: o = !1,
  voiceReconnectStorage: c = "session",
  reconnectStorageKey: s,
  onCallStart: u,
  onCallEnd: h,
  onMessage: p,
  onError: f
}) => {
  const [w, k] = le(null), [A, b] = le(!1), [T, M] = le([]), R = () => {
    if (r)
      return r;
    if (n)
      return i ? {
        assistantId: n,
        assistantOverrides: i
      } : n;
  }, _ = e === "voice" || e === "hybrid", y = Ri({
    publicKey: t,
    callOptions: R(),
    apiUrl: l,
    enabled: _,
    voiceAutoReconnect: o,
    voiceReconnectStorage: c,
    reconnectStorageKey: s,
    onCallStart: () => {
      e === "hybrid" && (L.clearMessages(), M([])), k("voice"), b(!1), u?.();
    },
    onCallEnd: () => {
      k(null), h?.();
    },
    onMessage: p,
    onError: f,
    onTranscript: (D) => {
      const X = {
        role: D.role,
        content: D.text,
        timestamp: D.timestamp
      };
      M((U) => [...U, X]);
    }
  }), z = e === "chat" || e === "hybrid", L = il({
    enabled: z,
    publicKey: z ? t : void 0,
    assistantId: z ? n : void 0,
    assistantOverrides: z ? i : void 0,
    apiUrl: l,
    onMessage: p,
    // Keep the callback for external notifications
    onError: f,
    firstChatMessage: a
  }), B = e === "voice" ? T : e === "chat" ? L.messages : [...T, ...L.messages].sort(
    (D, X) => D.timestamp.getTime() - X.timestamp.getTime()
  ), j = me((D) => {
    b(D.length > 0);
  }, []), F = me(
    async (D, X = !1) => {
      e === "hybrid" && (y.isCallActive && await y.endCall({ force: !0 }), w !== "chat" && (M([]), L.clearMessages()), k("chat")), await L.sendMessage(D, X);
    },
    [e, L, y, w]
  ), P = me(
    async ({ force: D } = {}) => {
      e === "hybrid" && !y.isCallActive && (L.clearMessages(), M([]), k("voice"), b(!1)), await y.toggleCall({ force: D });
    },
    [e, y, L]
  ), q = me(() => {
    M([]), L.clearMessages(), k(null), b(!1);
  }, [L]), S = _ && !y.isCallActive && !L.isLoading, E = z && !L.isLoading;
  return {
    // Current mode and state
    mode: e,
    activeMode: w,
    conversation: B,
    // Voice state and handlers
    voice: {
      ...y,
      isAvailable: S,
      toggleCall: P
    },
    // Chat state and handlers
    chat: {
      ...L,
      isAvailable: E,
      sendMessage: F,
      handleInput: j
    },
    // Combined handlers
    clearConversation: q,
    isUserTyping: A
  };
}, Ar = {
  tiny: {
    button: { width: "3rem", height: "3rem" },
    // w-12 h-12
    expanded: { width: "18rem", height: "20rem" },
    // w-72 h-80
    icon: { width: "1.25rem", height: "1.25rem" }
    // w-5 h-5
  },
  compact: {
    button: {
      paddingLeft: "1rem",
      paddingRight: "1rem",
      paddingTop: "0.75rem",
      paddingBottom: "0.75rem",
      height: "3rem"
    },
    // px-4 py-3 h-12
    expanded: { width: "24rem", height: "32rem" },
    // w-96 h-[32rem]
    icon: { width: "1.25rem", height: "1.25rem" }
    // w-5 h-5
  },
  full: {
    button: {
      paddingLeft: "1.5rem",
      paddingRight: "1.5rem",
      paddingTop: "1rem",
      paddingBottom: "1rem",
      height: "3.5rem"
    },
    // px-6 py-4 h-14
    expanded: { width: "28rem", height: "40rem" },
    // w-[28rem] h-[40rem]
    icon: { width: "1.5rem", height: "1.5rem" }
    // w-6 h-6
  }
}, al = {
  none: { borderRadius: "0" },
  small: { borderRadius: "0.5rem" },
  // rounded-lg
  medium: { borderRadius: "1rem" },
  // rounded-2xl
  large: { borderRadius: "1.5rem" }
  // rounded-3xl
}, ol = {
  none: { borderRadius: "0" },
  small: { borderRadius: "0.5rem" },
  // rounded-lg
  medium: { borderRadius: "1rem" },
  // rounded-2xl
  large: { borderRadius: "1.5rem" }
  // rounded-3xl
}, sl = {
  none: "rounded-none",
  small: "rounded-md",
  // 6px - subtle rounding
  medium: "rounded-lg",
  // 8px - moderate rounding
  large: "rounded-xl"
  // 12px - more rounded but not excessive
}, ul = {
  "bottom-right": { bottom: "1.5rem", right: "1.5rem" },
  "bottom-left": { bottom: "1.5rem", left: "1.5rem" },
  "top-right": { top: "1.5rem", right: "1.5rem" },
  "top-left": { top: "1.5rem", left: "1.5rem" },
  "bottom-center": {
    bottom: "1.5rem",
    left: "50%",
    transform: "translateX(-50%)"
  }
}, Vt = {
  none: { borderRadius: "0" },
  small: { borderRadius: "0.5rem" },
  medium: { borderRadius: "1rem" },
  large: { borderRadius: "1.5rem" }
}, cl = ({
  consentTitle: e = "Terms and conditions",
  consentContent: t,
  onAccept: n,
  onCancel: r,
  colors: i,
  styles: l,
  radius: a
}) => {
  const o = l.theme === "dark", c = o ? "#1F2937" : "#E5E7EB", s = o ? "#FFFFFF" : "#111827", u = o ? "#D1D5DB" : "#4B5563", h = {
    ...Vt[a],
    backgroundColor: i.baseColor,
    // Use configured base color
    border: `1px solid ${c}`,
    boxShadow: o ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)" : "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    padding: "1rem",
    maxWidth: "360px",
    minWidth: "300px"
  }, p = {
    color: s,
    fontSize: "1rem",
    fontWeight: "600",
    marginBottom: "0.75rem",
    margin: "0 0 0.75rem 0"
  }, f = {
    color: u,
    fontSize: "0.75rem",
    lineHeight: "1.5",
    marginBottom: "1rem",
    maxHeight: "120px",
    overflowY: "auto",
    // Custom scrollbar styling for dark mode
    scrollbarWidth: "thin",
    scrollbarColor: o ? "#4B5563 transparent" : "#CBD5E1 transparent"
  }, w = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "0.5rem"
  }, k = {
    ...Vt[a],
    backgroundColor: "transparent",
    border: o ? "none" : "1px solid #D1D5DB",
    // No border in dark mode
    color: o ? "#9CA3AF" : "#4B5563",
    padding: "0.5rem 1rem",
    fontSize: "0.75rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out"
  }, A = {
    ...Vt[a],
    // Invert colors based on theme - white bg in dark mode, use configured colors in light mode
    backgroundColor: o ? i.ctaButtonTextColor || "#FFFFFF" : i.ctaButtonColor || "#000000",
    color: o ? i.ctaButtonColor || "#000000" : i.ctaButtonTextColor || "#FFFFFF",
    border: "none",
    padding: "0.5rem 1rem",
    fontSize: "0.75rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out"
  };
  return /* @__PURE__ */ ne("div", { style: h, children: [
    /* @__PURE__ */ v("style", { children: `
        /* Custom scrollbar styles for webkit browsers */
        .consent-terms-content::-webkit-scrollbar {
          width: 6px;
        }
        .consent-terms-content::-webkit-scrollbar-track {
          background: transparent;
        }
        .consent-terms-content::-webkit-scrollbar-thumb {
          background: ${o ? "#4B5563" : "#CBD5E1"};
          border-radius: 3px;
        }
        .consent-terms-content::-webkit-scrollbar-thumb:hover {
          background: ${o ? "#6B7280" : "#94A3B8"};
        }
        .consent-cancel-button:hover {
          background-color: ${o ? "#1F2937" : "#F9FAFB"} !important;
          ${o ? "" : "border-color: #9CA3AF !important;"}
        }
        .consent-accept-button:hover {
          opacity: 0.9;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }
      ` }),
    /* @__PURE__ */ v("h3", { style: p, children: e }),
    /* @__PURE__ */ v(
      "div",
      {
        className: "consent-terms-content",
        style: f,
        dangerouslySetInnerHTML: { __html: t }
      }
    ),
    /* @__PURE__ */ ne("div", { style: w, children: [
      /* @__PURE__ */ v(
        "button",
        {
          className: "consent-cancel-button",
          onClick: r,
          style: k,
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ v(
        "button",
        {
          className: "consent-accept-button",
          onClick: n,
          style: A,
          children: "Accept"
        }
      )
    ] })
  ] });
}, vt = ({
  size: e = 40,
  connectionStatus: t,
  isCallActive: n,
  isSpeaking: r,
  isTyping: i,
  isError: l,
  volumeLevel: a = 0,
  baseColor: o = "#9CA3AF",
  animationType: c,
  animationSpeed: s,
  colors: u,
  barCount: h = 17,
  barWidthRatio: p = 0.08,
  barHeightRatio: f = 0.19,
  className: w = ""
}) => {
  const [k, A] = le(0), b = n, T = b ? 5 : h, R = l ? {
    animationType: "pulse",
    colors: "#EF4444",
    // Red for errors
    animationSpeed: 300
  } : t === "connecting" ? {
    animationType: "spin",
    colors: "#FCD34D",
    // Yellow
    animationSpeed: 1e3
  } : n && r ? {
    animationType: "scale",
    colors: "#F87171",
    // Light red
    animationSpeed: 600
    // Match the SVG animation duration
  } : n ? {
    animationType: "none",
    colors: "#62F6B5",
    // Green
    animationSpeed: 1e3
  } : i ? {
    animationType: "sequential",
    colors: "#60A5FA",
    // Blue
    animationSpeed: 1e3
  } : {
    animationType: "none",
    colors: o,
    animationSpeed: 3e3
  }, _ = c ?? R.animationType, y = s ?? R.animationSpeed, z = u ?? R.colors;
  Te(() => {
    if (_ !== "none") {
      const U = Date.now();
      let W;
      const m = () => {
        A((Date.now() - U) / y), W = requestAnimationFrame(m);
      };
      return W = requestAnimationFrame(m), () => cancelAnimationFrame(W);
    }
  }, [_, y]);
  const L = b ? 24 : 253, j = (() => {
    const U = L / 2, W = L / 2, m = L * 0.38;
    return Array.from({ length: T }, (N, Y) => {
      const d = Y / T * 2 * Math.PI - Math.PI / 2, J = U + m * Math.cos(d), ae = W + m * Math.sin(d), Q = d * 180 / Math.PI + 90;
      return { x: J, y: ae, rotate: Q };
    });
  })(), F = () => {
    const W = [0.5, 0.75, 1, 0.75, 0.5];
    return Array.from({ length: 5 }, (m, N) => {
      const J = W[N];
      return {
        x: 1 + N * 4.8,
        y: 6,
        width: 2.8,
        baseHeight: 16 * J,
        maxHeight: 22,
        delay: N === 2 ? 0 : Math.abs(N - 2) * 0.2,
        // Center bar starts first
        rotate: 0
      };
    });
  }, P = (U) => Array.isArray(z) ? z[U % z.length] : z, q = (U, W) => {
    const m = k % 1;
    switch (_) {
      case "rotate-fade": {
        const N = T, Y = m * N % N, J = Math.min(
          Math.abs(U - Y),
          Math.abs(U - Y + N),
          Math.abs(U - Y - N)
        ) / (N / 2);
        return { opacity: Math.max(0.14, 1 - J * 0.86), transform: "" };
      }
      case "scale": {
        if (b && "delay" in W) {
          const N = W, Y = Math.max(0, Math.min(1, a)), d = [
            { sensitivity: 0.8, frequency: 1.2, baseActivity: 0.3 },
            // Bar 0 - Low freq, less sensitive
            { sensitivity: 1, frequency: 1.8, baseActivity: 0.4 },
            // Bar 1 - Mid-low freq
            { sensitivity: 1.2, frequency: 2.5, baseActivity: 0.5 },
            // Bar 2 - Center, most responsive
            { sensitivity: 1, frequency: 2, baseActivity: 0.4 },
            // Bar 3 - Mid-high freq
            { sensitivity: 0.9, frequency: 1.5, baseActivity: 0.35 }
            // Bar 4 - High freq
          ], J = d[U] || d[2], Q = k % 1 * J.frequency % 1, ce = Math.sin(Q * 2 * Math.PI) * 0.3 + Math.sin(Q * 6 * Math.PI) * 0.2 + Math.sin(Q * 12 * Math.PI) * 0.1, ie = Y * J.sensitivity, ke = Math.max(
            0,
            Math.min(
              1,
              J.baseActivity + ie * 0.6 + ce * Y * 0.4
            )
          ), xe = 0.7 + ke * 1.1, ve = N.baseHeight * xe, Oe = 12 - ve / 2;
          return {
            opacity: 0.4 + ke * 0.6,
            height: ve,
            y: Oe,
            transform: ""
          };
        }
        if (!b) {
          const N = Math.max(0, Math.min(1, a)), Y = k % 1, d = U / T * 2 * Math.PI, J = Math.sin(Y * 4 * Math.PI + d) * 0.3 + Math.sin(Y * 8 * Math.PI + d * 2) * 0.2 + Math.sin(Y * 16 * Math.PI + d * 3) * 0.1, ae = 0.7 + 0.3 * Math.sin(d + Math.PI / 4), Q = Math.max(
            0,
            Math.min(
              1,
              0.3 + N * ae * 0.5 + J * N * 0.2
            )
          );
          return {
            opacity: 0.4 + Q * 0.6,
            transform: Q > 0.5 ? `scale(${1 + (Q - 0.5) * 0.4})` : ""
          };
        }
        return { opacity: 1, transform: "" };
      }
      case "spin": {
        const N = m * 2 * Math.PI % (2 * Math.PI), Y = U / T * 2 * Math.PI;
        return { opacity: 0.3 + 0.7 * (1 - Math.abs(
          (N - Y + Math.PI) % (2 * Math.PI) - Math.PI
        ) / Math.PI), transform: "" };
      }
      case "pulse":
        return {
          opacity: 0.5 + 0.5 * Math.sin(m * 2 * Math.PI),
          transform: ""
        };
      case "sequential": {
        const N = Math.floor(m * T) % T;
        return {
          opacity: U === N || U === (N + 1) % T ? 1 : 0.3,
          transform: ""
        };
      }
      case "wave": {
        const N = m * 2 * Math.PI, Y = U / T * 2 * Math.PI;
        return {
          opacity: 0.5 + 0.5 * Math.sin(N + Y),
          transform: ""
        };
      }
      default:
        return { opacity: 1, transform: "" };
    }
  }, S = b ? 2.8 : L * p, E = b ? 12 : L * f, D = S / 2, X = b ? F() : j;
  return /* @__PURE__ */ v(
    "div",
    {
      className: `relative ${w}`,
      style: { width: e, height: e },
      children: /* @__PURE__ */ ne(
        "svg",
        {
          width: e,
          height: e,
          viewBox: `0 0 ${L} ${b ? 24 : L + 1}`,
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
          children: [
            !b && /* @__PURE__ */ v(
              "circle",
              {
                cx: L / 2,
                cy: L / 2,
                r: L * 0.38,
                fill: "none",
                stroke: o,
                strokeWidth: "1",
                opacity: "0.05"
              }
            ),
            X.map((U, W) => {
              const m = _ !== "none", N = m ? q(W, U) : { opacity: 1 }, Y = m ? P(W) : z === o ? o : P(W);
              if (b && "width" in U) {
                const d = U, J = N.y !== void 0 ? N.y : 12 - d.baseHeight / 2;
                return /* @__PURE__ */ v(
                  "rect",
                  {
                    x: d.x,
                    y: J,
                    width: d.width,
                    height: N.height !== void 0 ? N.height : d.baseHeight,
                    fill: Y,
                    opacity: N.opacity,
                    rx: d.width / 2
                  },
                  W
                );
              } else {
                const d = U;
                let J = E;
                if (_ === "rotate-fade") {
                  const ce = T, ie = k % 1 * ce, xe = Math.min(
                    Math.abs(W - ie),
                    Math.abs(W - ie + ce),
                    Math.abs(W - ie - ce)
                  ) / (ce / 2), ve = 0.4 + 0.6 * (1 - xe), Oe = Math.sin(xe * Math.PI) * 0.2;
                  J = E * (ve + Oe);
                } else {
                  const ie = 0.7 + 0.3 * (1 - Math.min(W, T - W) / (T / 2));
                  J = E * ie;
                }
                const ae = d.x - S / 2, Q = d.y - J / 2;
                return /* @__PURE__ */ v(
                  "rect",
                  {
                    x: ae,
                    y: Q,
                    width: S,
                    height: J,
                    rx: D,
                    fill: Y,
                    opacity: N.opacity,
                    transform: d.rotate !== 0 ? `rotate(${d.rotate} ${d.x} ${d.y})` : void 0,
                    style: {
                      transition: _ === "sequential" ? "opacity 0.1s ease-in-out" : void 0
                    }
                  },
                  W
                );
              }
            })
          ]
        }
      )
    }
  );
}, hl = ({
  isCallActive: e,
  connectionStatus: t,
  isSpeaking: n,
  isTyping: r,
  volumeLevel: i,
  onClick: l,
  onToggleCall: a,
  mainLabel: o,
  ctaTitle: c,
  ctaSubtitle: s,
  colors: u,
  styles: h,
  mode: p
}) => {
  const f = p === "voice" && h.size === "tiny", w = () => {
    f && a ? a() : l();
  }, k = c || o, A = {
    ...f && e ? { width: "5rem", height: "5rem" } : Ar[h.size].button,
    ...ol[h.radius],
    backgroundColor: e && f ? "#ef4444" : u.ctaButtonColor,
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    // shadow-lg
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    // transition-all duration-300
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    // Adjust height when subtitle is present
    ...s && (h.size === "compact" || h.size === "full") && !f ? { height: h.size === "compact" ? "4rem" : "4.5rem" } : {}
  };
  return /* @__PURE__ */ v(
    "div",
    {
      className: `hover:scale-105 hover:-translate-y-1 hover:shadow-xl ${f && e ? "animate-glow" : ""}`,
      style: A,
      onClick: w,
      children: /* @__PURE__ */ ne(
        "div",
        {
          className: "flex items-center space-x-2",
          style: {
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
            // space-x-2
          },
          children: [
            /* @__PURE__ */ v(
              vt,
              {
                size: f && e ? 48 : h.size === "tiny" ? 24 : 28,
                connectionStatus: t,
                isCallActive: e,
                isSpeaking: n,
                isTyping: r,
                baseColor: u.accentColor,
                colors: u.accentColor,
                volumeLevel: i
              }
            ),
            (h.size === "compact" || h.size === "full") && !f && /* @__PURE__ */ ne(
              "div",
              {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "center"
                },
                children: [
                  /* @__PURE__ */ v(
                    "span",
                    {
                      style: {
                        color: u.ctaButtonTextColor,
                        fontSize: "0.875rem",
                        // text-sm
                        fontWeight: "500",
                        // font-medium
                        lineHeight: "1.2"
                      },
                      children: k
                    }
                  ),
                  s && /* @__PURE__ */ v(
                    "span",
                    {
                      style: {
                        color: u.ctaButtonTextColor,
                        fontSize: "0.75rem",
                        // text-xs
                        fontWeight: "400",
                        // font-normal
                        opacity: 0.8,
                        lineHeight: "1.2",
                        marginTop: "0.125rem"
                      },
                      children: s
                    }
                  )
                ]
              }
            )
          ]
        }
      )
    }
  );
}, fl = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M228,48V96a12,12,0,0,1-12,12H168a12,12,0,0,1,0-24h19l-7.8-7.8a75.55,75.55,0,0,0-53.32-22.26h-.43A75.49,75.49,0,0,0,72.39,75.57,12,12,0,1,1,55.61,58.41a99.38,99.38,0,0,1,69.87-28.47H126A99.42,99.42,0,0,1,196.2,59.23L204,67V48a12,12,0,0,1,24,0ZM183.61,180.43a75.49,75.49,0,0,1-53.09,21.63h-.43A75.55,75.55,0,0,1,76.77,179.8L69,172H88a12,12,0,0,0,0-24H40a12,12,0,0,0-12,12v48a12,12,0,0,0,24,0V189l7.8,7.8A99.42,99.42,0,0,0,130,226.06h.56a99.38,99.38,0,0,0,69.87-28.47,12,12,0,0,0-16.78-17.16Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M216,128a88,88,0,1,1-88-88A88,88,0,0,1,216,128Z", opacity: "0.2" }), /* @__PURE__ */ g.createElement("path", { d: "M224,48V96a8,8,0,0,1-8,8H168a8,8,0,0,1,0-16h28.69L182.06,73.37a79.56,79.56,0,0,0-56.13-23.43h-.45A79.52,79.52,0,0,0,69.59,72.71,8,8,0,0,1,58.41,61.27a96,96,0,0,1,135,.79L208,76.69V48a8,8,0,0,1,16,0ZM186.41,183.29a80,80,0,0,1-112.47-.66L59.31,168H88a8,8,0,0,0,0-16H40a8,8,0,0,0-8,8v48a8,8,0,0,0,16,0V179.31l14.63,14.63A95.43,95.43,0,0,0,130,222.06h.53a95.36,95.36,0,0,0,67.07-27.33,8,8,0,0,0-11.18-11.44Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M224,48V96a8,8,0,0,1-8,8H168a8,8,0,0,1-5.66-13.66L180.65,72a79.48,79.48,0,0,0-54.72-22.09h-.45A79.52,79.52,0,0,0,69.59,72.71,8,8,0,0,1,58.41,61.27,96,96,0,0,1,192,60.7l18.36-18.36A8,8,0,0,1,224,48ZM186.41,183.29A80,80,0,0,1,75.35,184l18.31-18.31A8,8,0,0,0,88,152H40a8,8,0,0,0-8,8v48a8,8,0,0,0,13.66,5.66L64,195.3a95.42,95.42,0,0,0,66,26.76h.53a95.36,95.36,0,0,0,67.07-27.33,8,8,0,0,0-11.18-11.44Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M222,48V96a6,6,0,0,1-6,6H168a6,6,0,0,1,0-12h33.52L183.47,72a81.51,81.51,0,0,0-57.53-24h-.46A81.5,81.5,0,0,0,68.19,71.28a6,6,0,1,1-8.38-8.58,93.38,93.38,0,0,1,65.67-26.76H126a93.45,93.45,0,0,1,66,27.53l18,18V48a6,6,0,0,1,12,0ZM187.81,184.72a81.5,81.5,0,0,1-57.29,23.34h-.46a81.51,81.51,0,0,1-57.53-24L54.48,166H88a6,6,0,0,0,0-12H40a6,6,0,0,0-6,6v48a6,6,0,0,0,12,0V174.48l18,18.05a93.45,93.45,0,0,0,66,27.53h.52a93.38,93.38,0,0,0,65.67-26.76,6,6,0,1,0-8.38-8.58Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M224,48V96a8,8,0,0,1-8,8H168a8,8,0,0,1,0-16h28.69L182.06,73.37a79.56,79.56,0,0,0-56.13-23.43h-.45A79.52,79.52,0,0,0,69.59,72.71,8,8,0,0,1,58.41,61.27a96,96,0,0,1,135,.79L208,76.69V48a8,8,0,0,1,16,0ZM186.41,183.29a80,80,0,0,1-112.47-.66L59.31,168H88a8,8,0,0,0,0-16H40a8,8,0,0,0-8,8v48a8,8,0,0,0,16,0V179.31l14.63,14.63A95.43,95.43,0,0,0,130,222.06h.53a95.36,95.36,0,0,0,67.07-27.33,8,8,0,0,0-11.18-11.44Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M220,48V96a4,4,0,0,1-4,4H168a4,4,0,0,1,0-8h38.34L184.89,70.54A84,84,0,0,0,66.8,69.85a4,4,0,1,1-5.6-5.72,92,92,0,0,1,129.34.76L212,86.34V48a4,4,0,0,1,8,0ZM189.2,186.15a83.44,83.44,0,0,1-58.68,23.91h-.47a83.52,83.52,0,0,1-58.94-24.6L49.66,164H88a4,4,0,0,0,0-8H40a4,4,0,0,0-4,4v48a4,4,0,0,0,8,0V169.66l21.46,21.45A91.43,91.43,0,0,0,130,218.06h.51a91.45,91.45,0,0,0,64.28-26.19,4,4,0,1,0-5.6-5.72Z" }))
  ]
]), pl = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M128,20A108,108,0,0,0,31.85,177.23L21,209.66A20,20,0,0,0,46.34,235l32.43-10.81A108,108,0,1,0,128,20Zm0,192a84,84,0,0,1-42.06-11.27,12,12,0,0,0-6-1.62,12.1,12.1,0,0,0-3.8.62l-29.79,9.93,9.93-29.79a12,12,0,0,0-1-9.81A84,84,0,1,1,128,212Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement(
      "path",
      {
        d: "M224,128A96,96,0,0,1,79.93,211.11h0L42.54,223.58a8,8,0,0,1-10.12-10.12l12.47-37.39h0A96,96,0,1,1,224,128Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ g.createElement("path", { d: "M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M232,128A104,104,0,0,1,79.12,219.82L45.07,231.17a16,16,0,0,1-20.24-20.24l11.35-34.05A104,104,0,1,1,232,128Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M128,26A102,102,0,0,0,38.35,176.69L26.73,211.56a14,14,0,0,0,17.71,17.71l34.87-11.62A102,102,0,1,0,128,26Zm0,192a90,90,0,0,1-45.06-12.08,6.09,6.09,0,0,0-3-.81,6.2,6.2,0,0,0-1.9.31L40.65,217.88a2,2,0,0,1-2.53-2.53L50.58,178a6,6,0,0,0-.5-4.91A90,90,0,1,1,128,218Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M128,28A100,100,0,0,0,40.53,176.5l-11.9,35.69a12,12,0,0,0,15.18,15.18l35.69-11.9A100,100,0,1,0,128,28Zm0,192a92,92,0,0,1-46.07-12.35,4.05,4.05,0,0,0-2-.54,3.93,3.93,0,0,0-1.27.21L41.28,219.78a4,4,0,0,1-5.06-5.06l12.46-37.38a4,4,0,0,0-.33-3.27A92,92,0,1,1,128,220Z" }))
  ]
]), dl = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M128,180a52.06,52.06,0,0,0,52-52V64A52,52,0,0,0,76,64v64A52.06,52.06,0,0,0,128,180ZM100,64a28,28,0,0,1,56,0v64a28,28,0,0,1-56,0Zm40,155.22V240a12,12,0,0,1-24,0V219.22A92.14,92.14,0,0,1,36,128a12,12,0,0,1,24,0,68,68,0,0,0,136,0,12,12,0,0,1,24,0A92.14,92.14,0,0,1,140,219.22Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement(
      "path",
      {
        d: "M168,64v64a40,40,0,0,1-40,40h0a40,40,0,0,1-40-40V64a40,40,0,0,1,40-40h0A40,40,0,0,1,168,64Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ g.createElement("path", { d: "M128,176a48.05,48.05,0,0,0,48-48V64a48,48,0,0,0-96,0v64A48.05,48.05,0,0,0,128,176ZM96,64a32,32,0,0,1,64,0v64a32,32,0,0,1-64,0Zm40,143.6V240a8,8,0,0,1-16,0V207.6A80.11,80.11,0,0,1,48,128a8,8,0,0,1,16,0,64,64,0,0,0,128,0,8,8,0,0,1,16,0A80.11,80.11,0,0,1,136,207.6Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M80,128V64a48,48,0,0,1,96,0v64a48,48,0,0,1-96,0Zm128,0a8,8,0,0,0-16,0,64,64,0,0,1-128,0,8,8,0,0,0-16,0,80.11,80.11,0,0,0,72,79.6V240a8,8,0,0,0,16,0V207.6A80.11,80.11,0,0,0,208,128Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M128,174a46.06,46.06,0,0,0,46-46V64a46,46,0,0,0-92,0v64A46.06,46.06,0,0,0,128,174ZM94,64a34,34,0,0,1,68,0v64a34,34,0,0,1-68,0Zm40,141.75V240a6,6,0,0,1-12,0V205.75A78.09,78.09,0,0,1,50,128a6,6,0,0,1,12,0,66,66,0,0,0,132,0,6,6,0,0,1,12,0A78.09,78.09,0,0,1,134,205.75Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M128,176a48.05,48.05,0,0,0,48-48V64a48,48,0,0,0-96,0v64A48.05,48.05,0,0,0,128,176ZM96,64a32,32,0,0,1,64,0v64a32,32,0,0,1-64,0Zm40,143.6V240a8,8,0,0,1-16,0V207.6A80.11,80.11,0,0,1,48,128a8,8,0,0,1,16,0,64,64,0,0,0,128,0,8,8,0,0,1,16,0A80.11,80.11,0,0,1,136,207.6Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M128,172a44.05,44.05,0,0,0,44-44V64a44,44,0,0,0-88,0v64A44.05,44.05,0,0,0,128,172ZM92,64a36,36,0,0,1,72,0v64a36,36,0,0,1-72,0Zm40,139.89V240a4,4,0,0,1-8,0V203.89A76.09,76.09,0,0,1,52,128a4,4,0,0,1,8,0,68,68,0,0,0,136,0,4,4,0,0,1,8,0A76.09,76.09,0,0,1,132,203.89Z" }))
  ]
]), ml = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M56.88,39.93A12,12,0,1,0,39.12,56.07L76,96.64V128a52,52,0,0,0,72.11,48l11.26,12.39A67.34,67.34,0,0,1,128,196a68.07,68.07,0,0,1-68-68,12,12,0,0,0-24,0,92.14,92.14,0,0,0,80,91.22V240a12,12,0,0,0,24,0V219.23a90.39,90.39,0,0,0,35.92-12.68l23.2,25.52a12,12,0,0,0,17.76-16.14ZM128,156a28,28,0,0,1-28-28v-5l29.9,32.89C129.27,156,128.64,156,128,156Zm63-2.42A67.63,67.63,0,0,0,196,128a12,12,0,0,1,24,0,91.48,91.48,0,0,1-6.74,34.61,12,12,0,0,1-22.23-9ZM85.7,33.75A52,52,0,0,1,180,64v56.54a12,12,0,0,1-24,0V64a28,28,0,0,0-50.79-16.28,12,12,0,0,1-19.51-14Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement(
      "path",
      {
        d: "M168,64v64a40,40,0,0,1-40,40h0a40,40,0,0,1-40-40V64a40,40,0,0,1,40-40h0A40,40,0,0,1,168,64Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ g.createElement("path", { d: "M213.92,218.62l-160-176A8,8,0,0,0,42.08,53.38L80,95.09V128a48,48,0,0,0,69.11,43.12l11.1,12.2A63.41,63.41,0,0,1,128,192a64.07,64.07,0,0,1-64-64,8,8,0,0,0-16,0,80.11,80.11,0,0,0,72,79.6V240a8,8,0,0,0,16,0V207.59a78.83,78.83,0,0,0,35.16-12.22l30.92,34a8,8,0,1,0,11.84-10.76ZM128,160a32,32,0,0,1-32-32V112.69l41.66,45.82A32,32,0,0,1,128,160Zm57.52-3.91A63.32,63.32,0,0,0,192,128a8,8,0,0,1,16,0,79.16,79.16,0,0,1-8.11,35.12,8,8,0,0,1-7.19,4.49,7.88,7.88,0,0,1-3.51-.82A8,8,0,0,1,185.52,156.09ZM84,44.87A48,48,0,0,1,176,64v64a49.19,49.19,0,0,1-.26,5,8,8,0,0,1-8,7.17,8.13,8.13,0,0,1-.84,0,8,8,0,0,1-7.12-8.79c.11-1.1.17-2.24.17-3.36V64A32,32,0,0,0,98.64,51.25,8,8,0,1,1,84,44.87Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M213.38,229.92a8,8,0,0,1-11.3-.54l-30.92-34A78.83,78.83,0,0,1,136,207.59V240a8,8,0,0,1-16,0V207.6A80.11,80.11,0,0,1,48,128a8,8,0,0,1,16,0,64.07,64.07,0,0,0,64,64,63.41,63.41,0,0,0,32.21-8.68l-11.1-12.2A48,48,0,0,1,80,128V95.09L42.08,53.38A8,8,0,0,1,53.92,42.62l160,176A8,8,0,0,1,213.38,229.92Zm-24.19-63.13a7.88,7.88,0,0,0,3.51.82,8,8,0,0,0,7.19-4.49A79.16,79.16,0,0,0,208,128a8,8,0,0,0-16,0,63.32,63.32,0,0,1-6.48,28.09A8,8,0,0,0,189.19,166.79Zm-27.33-29.22A8,8,0,0,0,175.74,133a49.49,49.49,0,0,0,.26-5V64A48,48,0,0,0,84,44.87a8,8,0,0,0,1.41,8.57Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M212.44,220,52.44,44A6,6,0,0,0,43.56,52L82,94.32V128a46,46,0,0,0,67.56,40.64l13.75,15.12A65.26,65.26,0,0,1,128,194a66.08,66.08,0,0,1-66-66,6,6,0,0,0-12,0,78.09,78.09,0,0,0,72,77.75V240a6,6,0,0,0,12,0V205.77a76.93,76.93,0,0,0,37.48-13L203.56,228a6,6,0,0,0,8.88-8.08ZM128,162a34,34,0,0,1-34-34V107.52l47.12,51.84A33.82,33.82,0,0,1,128,162Zm59.32-5A65.38,65.38,0,0,0,194,128a6,6,0,0,1,12,0,77.33,77.33,0,0,1-7.9,34.25A6,6,0,1,1,187.32,157ZM85.8,45.67A46,46,0,0,1,174,64v64a45.17,45.17,0,0,1-.25,4.81,6,6,0,0,1-6,5.38q-.31,0-.63,0a6,6,0,0,1-5.34-6.59A35.41,35.41,0,0,0,162,128V64A34,34,0,0,0,96.8,50.45a6,6,0,0,1-11-4.78Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M213.92,218.62l-160-176A8,8,0,0,0,42.08,53.38L80,95.09V128a48,48,0,0,0,69.11,43.12l11.1,12.2A63.41,63.41,0,0,1,128,192a64.07,64.07,0,0,1-64-64,8,8,0,0,0-16,0,80.11,80.11,0,0,0,72,79.6V240a8,8,0,0,0,16,0V207.59a78.83,78.83,0,0,0,35.16-12.22l30.92,34a8,8,0,1,0,11.84-10.76ZM128,160a32,32,0,0,1-32-32V112.69l41.66,45.82A32,32,0,0,1,128,160Zm57.52-3.91A63.32,63.32,0,0,0,192,128a8,8,0,0,1,16,0,79.16,79.16,0,0,1-8.11,35.12,8,8,0,0,1-7.19,4.49,7.88,7.88,0,0,1-3.51-.82A8,8,0,0,1,185.52,156.09ZM84,44.87A48,48,0,0,1,176,64v64a49.19,49.19,0,0,1-.26,5,8,8,0,0,1-8,7.17,8.13,8.13,0,0,1-.84,0,8,8,0,0,1-7.12-8.79c.11-1.1.17-2.24.17-3.36V64A32,32,0,0,0,98.64,51.25,8,8,0,1,1,84,44.87Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M211,221.31,51,45.31A4,4,0,0,0,45,50.69L84,93.55V128a44,44,0,0,0,66,38.12l16.38,18A67.21,67.21,0,0,1,128,196a68.07,68.07,0,0,1-68-68,4,4,0,0,0-8,0,76.09,76.09,0,0,0,72,75.89V240a4,4,0,0,0,8,0V203.89a75.1,75.1,0,0,0,39.79-13.77L205,226.69a4,4,0,1,0,5.92-5.38ZM128,164a36,36,0,0,1-36-36V102.35L144.43,160A35.83,35.83,0,0,1,128,164Zm61.12-6.15A67.44,67.44,0,0,0,196,128a4,4,0,0,1,8,0,75.28,75.28,0,0,1-7.7,33.37,4,4,0,0,1-7.18-3.52ZM87.63,46.46A44,44,0,0,1,172,64v64a44.2,44.2,0,0,1-.24,4.61,4,4,0,0,1-4,3.58l-.42,0a4,4,0,0,1-3.57-4.39A36.67,36.67,0,0,0,164,128V64A36,36,0,0,0,95,49.66a4,4,0,0,1-7.34-3.2Z" }))
  ]
]), gl = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M230.14,25.86a20,20,0,0,0-19.57-5.11l-.22.07L18.44,79a20,20,0,0,0-3.06,37.25L99,157l40.71,83.65a19.81,19.81,0,0,0,18,11.38c.57,0,1.15,0,1.73-.07A19.82,19.82,0,0,0,177,237.56L235.18,45.65a1.42,1.42,0,0,0,.07-.22A20,20,0,0,0,230.14,25.86ZM156.91,221.07l-34.37-70.64,46-45.95a12,12,0,0,0-17-17l-46,46L34.93,99.09,210,46Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement(
      "path",
      {
        d: "M223.69,42.18l-58.22,192a8,8,0,0,1-14.92,1.25L108,148,20.58,105.45a8,8,0,0,1,1.25-14.92l192-58.22A8,8,0,0,1,223.69,42.18Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ g.createElement("path", { d: "M227.32,28.68a16,16,0,0,0-15.66-4.08l-.15,0L19.57,82.84a16,16,0,0,0-2.49,29.8L102,154l41.3,84.87A15.86,15.86,0,0,0,157.74,248q.69,0,1.38-.06a15.88,15.88,0,0,0,14-11.51l58.2-191.94c0-.05,0-.1,0-.15A16,16,0,0,0,227.32,28.68ZM157.83,231.85l-.05.14,0-.07-40.06-82.3,48-48a8,8,0,0,0-11.31-11.31l-48,48L24.08,98.25l-.07,0,.14,0L216,40Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M231.4,44.34s0,.1,0,.15l-58.2,191.94a15.88,15.88,0,0,1-14,11.51q-.69.06-1.38.06a15.86,15.86,0,0,1-14.42-9.15L107,164.15a4,4,0,0,1,.77-4.58l57.92-57.92a8,8,0,0,0-11.31-11.31L96.43,148.26a4,4,0,0,1-4.58.77L17.08,112.64a16,16,0,0,1,2.49-29.8l191.94-58.2.15,0A16,16,0,0,1,231.4,44.34Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M225.88,30.12a13.83,13.83,0,0,0-13.7-3.58l-.11,0L20.14,84.77A14,14,0,0,0,18,110.85l85.56,41.64L145.12,238a13.87,13.87,0,0,0,12.61,8c.4,0,.81,0,1.21-.05a13.9,13.9,0,0,0,12.29-10.09l58.2-191.93,0-.11A13.83,13.83,0,0,0,225.88,30.12Zm-8,10.4L159.73,232.43l0,.11a2,2,0,0,1-3.76.26l-40.68-83.58,49-49a6,6,0,1,0-8.49-8.49l-49,49L23.15,100a2,2,0,0,1,.31-3.74l.11,0L215.48,38.08a1.94,1.94,0,0,1,1.92.52A2,2,0,0,1,217.92,40.52Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M227.32,28.68a16,16,0,0,0-15.66-4.08l-.15,0L19.57,82.84a16,16,0,0,0-2.49,29.8L102,154l41.3,84.87A15.86,15.86,0,0,0,157.74,248q.69,0,1.38-.06a15.88,15.88,0,0,0,14-11.51l58.2-191.94c0-.05,0-.1,0-.15A16,16,0,0,0,227.32,28.68ZM157.83,231.85l-.05.14,0-.07-40.06-82.3,48-48a8,8,0,0,0-11.31-11.31l-48,48L24.08,98.25l-.07,0,.14,0L216,40Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M224.47,31.52a11.87,11.87,0,0,0-11.82-3L20.74,86.67a12,12,0,0,0-1.91,22.38L105,151l41.92,86.15A11.88,11.88,0,0,0,157.74,244c.34,0,.69,0,1,0a11.89,11.89,0,0,0,10.52-8.63l58.21-192,0-.08A11.85,11.85,0,0,0,224.47,31.52Zm-4.62,9.54-58.23,192a4,4,0,0,1-7.48.59l-41.3-84.86,50-50a4,4,0,1,0-5.66-5.66l-50,50-84.9-41.31a3.88,3.88,0,0,1-2.27-4,3.93,3.93,0,0,1,3-3.54L214.9,36.16A3.93,3.93,0,0,1,216,36a4,4,0,0,1,2.79,1.19A3.93,3.93,0,0,1,219.85,41.06Z" }))
  ]
]), yl = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M200,36H56A20,20,0,0,0,36,56V200a20,20,0,0,0,20,20H200a20,20,0,0,0,20-20V56A20,20,0,0,0,200,36Zm-4,160H60V60H196Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement(
      "path",
      {
        d: "M208,56V200a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V56a8,8,0,0,1,8-8H200A8,8,0,0,1,208,56Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ g.createElement("path", { d: "M200,40H56A16,16,0,0,0,40,56V200a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,160H56V56H200V200Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M216,56V200a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40H200A16,16,0,0,1,216,56Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M200,42H56A14,14,0,0,0,42,56V200a14,14,0,0,0,14,14H200a14,14,0,0,0,14-14V56A14,14,0,0,0,200,42Zm2,158a2,2,0,0,1-2,2H56a2,2,0,0,1-2-2V56a2,2,0,0,1,2-2H200a2,2,0,0,1,2,2Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M200,40H56A16,16,0,0,0,40,56V200a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,160H56V56H200V200Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M200,44H56A12,12,0,0,0,44,56V200a12,12,0,0,0,12,12H200a12,12,0,0,0,12-12V56A12,12,0,0,0,200,44Zm4,156a4,4,0,0,1-4,4H56a4,4,0,0,1-4-4V56a4,4,0,0,1,4-4H200a4,4,0,0,1,4,4Z" }))
  ]
]), xl = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M60,96v64a12,12,0,0,1-24,0V96a12,12,0,0,1,24,0ZM88,20A12,12,0,0,0,76,32V224a12,12,0,0,0,24,0V32A12,12,0,0,0,88,20Zm40,32a12,12,0,0,0-12,12V192a12,12,0,0,0,24,0V64A12,12,0,0,0,128,52Zm40,32a12,12,0,0,0-12,12v64a12,12,0,0,0,24,0V96A12,12,0,0,0,168,84Zm40-16a12,12,0,0,0-12,12v96a12,12,0,0,0,24,0V80A12,12,0,0,0,208,68Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M208,96v64H48V96Z", opacity: "0.2" }), /* @__PURE__ */ g.createElement("path", { d: "M56,96v64a8,8,0,0,1-16,0V96a8,8,0,0,1,16,0ZM88,24a8,8,0,0,0-8,8V224a8,8,0,0,0,16,0V32A8,8,0,0,0,88,24Zm40,32a8,8,0,0,0-8,8V192a8,8,0,0,0,16,0V64A8,8,0,0,0,128,56Zm40,32a8,8,0,0,0-8,8v64a8,8,0,0,0,16,0V96A8,8,0,0,0,168,88Zm40-16a8,8,0,0,0-8,8v96a8,8,0,0,0,16,0V80A8,8,0,0,0,208,72Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM72,152a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32,32a8,8,0,0,1-16,0V72a8,8,0,0,1,16,0Zm32-16a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Zm32-16a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32,8a8,8,0,0,1-16,0V96a8,8,0,0,1,16,0Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M54,96v64a6,6,0,0,1-12,0V96a6,6,0,0,1,12,0ZM88,26a6,6,0,0,0-6,6V224a6,6,0,0,0,12,0V32A6,6,0,0,0,88,26Zm40,32a6,6,0,0,0-6,6V192a6,6,0,0,0,12,0V64A6,6,0,0,0,128,58Zm40,32a6,6,0,0,0-6,6v64a6,6,0,0,0,12,0V96A6,6,0,0,0,168,90Zm40-16a6,6,0,0,0-6,6v96a6,6,0,0,0,12,0V80A6,6,0,0,0,208,74Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M56,96v64a8,8,0,0,1-16,0V96a8,8,0,0,1,16,0ZM88,24a8,8,0,0,0-8,8V224a8,8,0,0,0,16,0V32A8,8,0,0,0,88,24Zm40,32a8,8,0,0,0-8,8V192a8,8,0,0,0,16,0V64A8,8,0,0,0,128,56Zm40,32a8,8,0,0,0-8,8v64a8,8,0,0,0,16,0V96A8,8,0,0,0,168,88Zm40-16a8,8,0,0,0-8,8v96a8,8,0,0,0,16,0V80A8,8,0,0,0,208,72Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M52,96v64a4,4,0,0,1-8,0V96a4,4,0,0,1,8,0ZM88,28a4,4,0,0,0-4,4V224a4,4,0,0,0,8,0V32A4,4,0,0,0,88,28Zm40,32a4,4,0,0,0-4,4V192a4,4,0,0,0,8,0V64A4,4,0,0,0,128,60Zm40,32a4,4,0,0,0-4,4v64a4,4,0,0,0,8,0V96A4,4,0,0,0,168,92Zm40-16a4,4,0,0,0-4,4v96a4,4,0,0,0,8,0V80A4,4,0,0,0,208,76Z" }))
  ]
]), bl = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement(
      "path",
      {
        d: "M216,56V200a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40H200A16,16,0,0,1,216,56Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ g.createElement("path", { d: "M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM181.66,170.34a8,8,0,0,1-11.32,11.32L128,139.31,85.66,181.66a8,8,0,0,1-11.32-11.32L116.69,128,74.34,85.66A8,8,0,0,1,85.66,74.34L128,116.69l42.34-42.35a8,8,0,0,1,11.32,11.32L139.31,128Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M204.24,195.76a6,6,0,1,1-8.48,8.48L128,136.49,60.24,204.24a6,6,0,0,1-8.48-8.48L119.51,128,51.76,60.24a6,6,0,0,1,8.48-8.48L128,119.51l67.76-67.75a6,6,0,0,1,8.48,8.48L136.49,128Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ g.createElement(g.Fragment, null, /* @__PURE__ */ g.createElement("path", { d: "M202.83,197.17a4,4,0,0,1-5.66,5.66L128,133.66,58.83,202.83a4,4,0,0,1-5.66-5.66L122.34,128,53.17,58.83a4,4,0,0,1,5.66-5.66L128,122.34l69.17-69.17a4,4,0,1,1,5.66,5.66L133.66,128Z" }))
  ]
]), wl = zi({
  color: "currentColor",
  size: "1em",
  weight: "regular",
  mirrored: !1
}), ze = g.forwardRef(
  (e, t) => {
    const {
      alt: n,
      color: r,
      size: i,
      weight: l,
      mirrored: a,
      children: o,
      weights: c,
      ...s
    } = e, {
      color: u = "currentColor",
      size: h,
      weight: p = "regular",
      mirrored: f = !1,
      ...w
    } = g.useContext(wl);
    return /* @__PURE__ */ g.createElement(
      "svg",
      {
        ref: t,
        xmlns: "http://www.w3.org/2000/svg",
        width: i ?? h,
        height: i ?? h,
        fill: r ?? u,
        viewBox: "0 0 256 256",
        transform: a || f ? "scale(-1, 1)" : void 0,
        ...w,
        ...s
      },
      !!n && /* @__PURE__ */ g.createElement("title", null, n),
      o,
      c.get(l ?? p)
    );
  }
);
ze.displayName = "IconBase";
const Ir = g.forwardRef((e, t) => /* @__PURE__ */ g.createElement(ze, { ref: t, ...e, weights: fl }));
Ir.displayName = "ArrowsClockwiseIcon";
const Mr = g.forwardRef((e, t) => /* @__PURE__ */ g.createElement(ze, { ref: t, ...e, weights: pl }));
Mr.displayName = "ChatCircleIcon";
const At = g.forwardRef((e, t) => /* @__PURE__ */ g.createElement(ze, { ref: t, ...e, weights: dl }));
At.displayName = "MicrophoneIcon";
const cn = g.forwardRef((e, t) => /* @__PURE__ */ g.createElement(ze, { ref: t, ...e, weights: ml }));
cn.displayName = "MicrophoneSlashIcon";
const hn = g.forwardRef((e, t) => /* @__PURE__ */ g.createElement(ze, { ref: t, ...e, weights: gl }));
hn.displayName = "PaperPlaneTiltIcon";
const fn = g.forwardRef((e, t) => /* @__PURE__ */ g.createElement(ze, { ref: t, ...e, weights: yl }));
fn.displayName = "StopIcon";
const pn = g.forwardRef((e, t) => /* @__PURE__ */ g.createElement(ze, { ref: t, ...e, weights: xl }));
pn.displayName = "WaveformIcon";
const Tr = g.forwardRef((e, t) => /* @__PURE__ */ g.createElement(ze, { ref: t, ...e, weights: bl }));
Tr.displayName = "XIcon";
const kl = ({
  mode: e,
  connectionStatus: t,
  isCallActive: n,
  isSpeaking: r,
  isTyping: i,
  hasActiveConversation: l,
  mainLabel: a,
  onClose: o,
  onReset: c,
  onChatComplete: s,
  showEndChatButton: u,
  colors: h,
  styles: p
}) => {
  const f = () => t === "connecting" ? "Connecting..." : n ? r ? "Assistant Speaking..." : "Listening..." : i ? "Assistant is typing..." : l ? e === "chat" ? "Chat active" : e === "hybrid" ? "Ready to assist" : "Connected" : e === "voice" ? "Click the microphone to start" : e === "chat" ? "Type a message below" : "Choose voice or text";
  return /* @__PURE__ */ ne(
    "div",
    {
      className: `relative z-10 p-4 flex items-center justify-between border-b ${p.theme === "dark" ? "text-white border-gray-800 shadow-lg" : "text-gray-900 border-gray-200 shadow-sm"}`,
      style: { backgroundColor: h.baseColor },
      children: [
        /* @__PURE__ */ ne("div", { className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ v(
            vt,
            {
              size: 40,
              connectionStatus: t,
              isCallActive: n,
              isSpeaking: r,
              isTyping: i,
              baseColor: h.accentColor,
              colors: h.accentColor
            }
          ),
          /* @__PURE__ */ ne("div", { children: [
            /* @__PURE__ */ v("div", { className: "font-medium", children: a }),
            /* @__PURE__ */ v(
              "div",
              {
                className: `text-sm ${p.theme === "dark" ? "text-gray-300" : "text-gray-600"}`,
                children: f()
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ ne("div", { className: "flex items-center space-x-2", children: [
          u !== !1 && e === "chat" && /* @__PURE__ */ v(
            "button",
            {
              onClick: s,
              className: "text-red-600 text-sm font-medium px-2 py-1 border border-transparent hover:border-red-600 rounded-md transition-colors",
              title: "End Chat",
              children: "End Chat"
            }
          ),
          /* @__PURE__ */ v(
            "button",
            {
              onClick: c,
              className: "w-8 h-8 rounded-full flex items-center justify-center transition-all}",
              title: "Reset conversation",
              children: /* @__PURE__ */ v(Ir, { size: 16, weight: "bold" })
            }
          ),
          /* @__PURE__ */ v(
            "button",
            {
              onClick: o,
              className: "w-8 h-8 rounded-full flex items-center justify-center transition-all",
              children: /* @__PURE__ */ v(Tr, { size: 16, weight: "bold" })
            }
          )
        ] })
      ]
    }
  );
};
function Cl(e, t) {
  const n = {};
  return (e[e.length - 1] === "" ? [...e, ""] : e).join(
    (n.padRight ? " " : "") + "," + (n.padLeft === !1 ? "" : " ")
  ).trim();
}
const vl = /^[$_\p{ID_Start}][$_\u{200C}\u{200D}\p{ID_Continue}]*$/u, El = /^[$_\p{ID_Start}][-$_\u{200C}\u{200D}\p{ID_Continue}]*$/u, Sl = {};
function _n(e, t) {
  return (Sl.jsx ? El : vl).test(e);
}
const Al = /[ \t\n\f\r]/g;
function Il(e) {
  return typeof e == "object" ? e.type === "text" ? Hn(e.value) : !1 : Hn(e);
}
function Hn(e) {
  return e.replace(Al, "") === "";
}
class ut {
  /**
   * @param {SchemaType['property']} property
   *   Property.
   * @param {SchemaType['normal']} normal
   *   Normal.
   * @param {Space | undefined} [space]
   *   Space.
   * @returns
   *   Schema.
   */
  constructor(t, n, r) {
    this.normal = n, this.property = t, r && (this.space = r);
  }
}
ut.prototype.normal = {};
ut.prototype.property = {};
ut.prototype.space = void 0;
function Lr(e, t) {
  const n = {}, r = {};
  for (const i of e)
    Object.assign(n, i.property), Object.assign(r, i.normal);
  return new ut(n, r, t);
}
function Gt(e) {
  return e.toLowerCase();
}
class ye {
  /**
   * @param {string} property
   *   Property.
   * @param {string} attribute
   *   Attribute.
   * @returns
   *   Info.
   */
  constructor(t, n) {
    this.attribute = n, this.property = t;
  }
}
ye.prototype.attribute = "";
ye.prototype.booleanish = !1;
ye.prototype.boolean = !1;
ye.prototype.commaOrSpaceSeparated = !1;
ye.prototype.commaSeparated = !1;
ye.prototype.defined = !1;
ye.prototype.mustUseProperty = !1;
ye.prototype.number = !1;
ye.prototype.overloadedBoolean = !1;
ye.prototype.property = "";
ye.prototype.spaceSeparated = !1;
ye.prototype.space = void 0;
let Ml = 0;
const Z = He(), re = He(), Kt = He(), C = He(), ee = He(), We = He(), be = He();
function He() {
  return 2 ** ++Ml;
}
const en = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  boolean: Z,
  booleanish: re,
  commaOrSpaceSeparated: be,
  commaSeparated: We,
  number: C,
  overloadedBoolean: Kt,
  spaceSeparated: ee
}, Symbol.toStringTag, { value: "Module" })), Bt = (
  /** @type {ReadonlyArray<keyof typeof types>} */
  Object.keys(en)
);
class dn extends ye {
  /**
   * @constructor
   * @param {string} property
   *   Property.
   * @param {string} attribute
   *   Attribute.
   * @param {number | null | undefined} [mask]
   *   Mask.
   * @param {Space | undefined} [space]
   *   Space.
   * @returns
   *   Info.
   */
  constructor(t, n, r, i) {
    let l = -1;
    if (super(t, n), jn(this, "space", i), typeof r == "number")
      for (; ++l < Bt.length; ) {
        const a = Bt[l];
        jn(this, Bt[l], (r & en[a]) === en[a]);
      }
  }
}
dn.prototype.defined = !0;
function jn(e, t, n) {
  n && (e[t] = n);
}
function Ye(e) {
  const t = {}, n = {};
  for (const [r, i] of Object.entries(e.properties)) {
    const l = new dn(
      r,
      e.transform(e.attributes || {}, r),
      i,
      e.space
    );
    e.mustUseProperty && e.mustUseProperty.includes(r) && (l.mustUseProperty = !0), t[r] = l, n[Gt(r)] = r, n[Gt(l.attribute)] = r;
  }
  return new ut(t, n, e.space);
}
const Fr = Ye({
  properties: {
    ariaActiveDescendant: null,
    ariaAtomic: re,
    ariaAutoComplete: null,
    ariaBusy: re,
    ariaChecked: re,
    ariaColCount: C,
    ariaColIndex: C,
    ariaColSpan: C,
    ariaControls: ee,
    ariaCurrent: null,
    ariaDescribedBy: ee,
    ariaDetails: null,
    ariaDisabled: re,
    ariaDropEffect: ee,
    ariaErrorMessage: null,
    ariaExpanded: re,
    ariaFlowTo: ee,
    ariaGrabbed: re,
    ariaHasPopup: null,
    ariaHidden: re,
    ariaInvalid: null,
    ariaKeyShortcuts: null,
    ariaLabel: null,
    ariaLabelledBy: ee,
    ariaLevel: C,
    ariaLive: null,
    ariaModal: re,
    ariaMultiLine: re,
    ariaMultiSelectable: re,
    ariaOrientation: null,
    ariaOwns: ee,
    ariaPlaceholder: null,
    ariaPosInSet: C,
    ariaPressed: re,
    ariaReadOnly: re,
    ariaRelevant: null,
    ariaRequired: re,
    ariaRoleDescription: ee,
    ariaRowCount: C,
    ariaRowIndex: C,
    ariaRowSpan: C,
    ariaSelected: re,
    ariaSetSize: C,
    ariaSort: null,
    ariaValueMax: C,
    ariaValueMin: C,
    ariaValueNow: C,
    ariaValueText: null,
    role: null
  },
  transform(e, t) {
    return t === "role" ? t : "aria-" + t.slice(4).toLowerCase();
  }
});
function Pr(e, t) {
  return t in e ? e[t] : t;
}
function zr(e, t) {
  return Pr(e, t.toLowerCase());
}
const Tl = Ye({
  attributes: {
    acceptcharset: "accept-charset",
    classname: "class",
    htmlfor: "for",
    httpequiv: "http-equiv"
  },
  mustUseProperty: ["checked", "multiple", "muted", "selected"],
  properties: {
    // Standard Properties.
    abbr: null,
    accept: We,
    acceptCharset: ee,
    accessKey: ee,
    action: null,
    allow: null,
    allowFullScreen: Z,
    allowPaymentRequest: Z,
    allowUserMedia: Z,
    alt: null,
    as: null,
    async: Z,
    autoCapitalize: null,
    autoComplete: ee,
    autoFocus: Z,
    autoPlay: Z,
    blocking: ee,
    capture: null,
    charSet: null,
    checked: Z,
    cite: null,
    className: ee,
    cols: C,
    colSpan: null,
    content: null,
    contentEditable: re,
    controls: Z,
    controlsList: ee,
    coords: C | We,
    crossOrigin: null,
    data: null,
    dateTime: null,
    decoding: null,
    default: Z,
    defer: Z,
    dir: null,
    dirName: null,
    disabled: Z,
    download: Kt,
    draggable: re,
    encType: null,
    enterKeyHint: null,
    fetchPriority: null,
    form: null,
    formAction: null,
    formEncType: null,
    formMethod: null,
    formNoValidate: Z,
    formTarget: null,
    headers: ee,
    height: C,
    hidden: Kt,
    high: C,
    href: null,
    hrefLang: null,
    htmlFor: ee,
    httpEquiv: ee,
    id: null,
    imageSizes: null,
    imageSrcSet: null,
    inert: Z,
    inputMode: null,
    integrity: null,
    is: null,
    isMap: Z,
    itemId: null,
    itemProp: ee,
    itemRef: ee,
    itemScope: Z,
    itemType: ee,
    kind: null,
    label: null,
    lang: null,
    language: null,
    list: null,
    loading: null,
    loop: Z,
    low: C,
    manifest: null,
    max: null,
    maxLength: C,
    media: null,
    method: null,
    min: null,
    minLength: C,
    multiple: Z,
    muted: Z,
    name: null,
    nonce: null,
    noModule: Z,
    noValidate: Z,
    onAbort: null,
    onAfterPrint: null,
    onAuxClick: null,
    onBeforeMatch: null,
    onBeforePrint: null,
    onBeforeToggle: null,
    onBeforeUnload: null,
    onBlur: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onContextLost: null,
    onContextMenu: null,
    onContextRestored: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFormData: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLanguageChange: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadEnd: null,
    onLoadStart: null,
    onMessage: null,
    onMessageError: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRejectionHandled: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onScrollEnd: null,
    onSecurityPolicyViolation: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onSlotChange: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnhandledRejection: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onWheel: null,
    open: Z,
    optimum: C,
    pattern: null,
    ping: ee,
    placeholder: null,
    playsInline: Z,
    popover: null,
    popoverTarget: null,
    popoverTargetAction: null,
    poster: null,
    preload: null,
    readOnly: Z,
    referrerPolicy: null,
    rel: ee,
    required: Z,
    reversed: Z,
    rows: C,
    rowSpan: C,
    sandbox: ee,
    scope: null,
    scoped: Z,
    seamless: Z,
    selected: Z,
    shadowRootClonable: Z,
    shadowRootDelegatesFocus: Z,
    shadowRootMode: null,
    shape: null,
    size: C,
    sizes: null,
    slot: null,
    span: C,
    spellCheck: re,
    src: null,
    srcDoc: null,
    srcLang: null,
    srcSet: null,
    start: C,
    step: null,
    style: null,
    tabIndex: C,
    target: null,
    title: null,
    translate: null,
    type: null,
    typeMustMatch: Z,
    useMap: null,
    value: re,
    width: C,
    wrap: null,
    writingSuggestions: null,
    // Legacy.
    // See: https://html.spec.whatwg.org/#other-elements,-attributes-and-apis
    align: null,
    // Several. Use CSS `text-align` instead,
    aLink: null,
    // `<body>`. Use CSS `a:active {color}` instead
    archive: ee,
    // `<object>`. List of URIs to archives
    axis: null,
    // `<td>` and `<th>`. Use `scope` on `<th>`
    background: null,
    // `<body>`. Use CSS `background-image` instead
    bgColor: null,
    // `<body>` and table elements. Use CSS `background-color` instead
    border: C,
    // `<table>`. Use CSS `border-width` instead,
    borderColor: null,
    // `<table>`. Use CSS `border-color` instead,
    bottomMargin: C,
    // `<body>`
    cellPadding: null,
    // `<table>`
    cellSpacing: null,
    // `<table>`
    char: null,
    // Several table elements. When `align=char`, sets the character to align on
    charOff: null,
    // Several table elements. When `char`, offsets the alignment
    classId: null,
    // `<object>`
    clear: null,
    // `<br>`. Use CSS `clear` instead
    code: null,
    // `<object>`
    codeBase: null,
    // `<object>`
    codeType: null,
    // `<object>`
    color: null,
    // `<font>` and `<hr>`. Use CSS instead
    compact: Z,
    // Lists. Use CSS to reduce space between items instead
    declare: Z,
    // `<object>`
    event: null,
    // `<script>`
    face: null,
    // `<font>`. Use CSS instead
    frame: null,
    // `<table>`
    frameBorder: null,
    // `<iframe>`. Use CSS `border` instead
    hSpace: C,
    // `<img>` and `<object>`
    leftMargin: C,
    // `<body>`
    link: null,
    // `<body>`. Use CSS `a:link {color: *}` instead
    longDesc: null,
    // `<frame>`, `<iframe>`, and `<img>`. Use an `<a>`
    lowSrc: null,
    // `<img>`. Use a `<picture>`
    marginHeight: C,
    // `<body>`
    marginWidth: C,
    // `<body>`
    noResize: Z,
    // `<frame>`
    noHref: Z,
    // `<area>`. Use no href instead of an explicit `nohref`
    noShade: Z,
    // `<hr>`. Use background-color and height instead of borders
    noWrap: Z,
    // `<td>` and `<th>`
    object: null,
    // `<applet>`
    profile: null,
    // `<head>`
    prompt: null,
    // `<isindex>`
    rev: null,
    // `<link>`
    rightMargin: C,
    // `<body>`
    rules: null,
    // `<table>`
    scheme: null,
    // `<meta>`
    scrolling: re,
    // `<frame>`. Use overflow in the child context
    standby: null,
    // `<object>`
    summary: null,
    // `<table>`
    text: null,
    // `<body>`. Use CSS `color` instead
    topMargin: C,
    // `<body>`
    valueType: null,
    // `<param>`
    version: null,
    // `<html>`. Use a doctype.
    vAlign: null,
    // Several. Use CSS `vertical-align` instead
    vLink: null,
    // `<body>`. Use CSS `a:visited {color}` instead
    vSpace: C,
    // `<img>` and `<object>`
    // Non-standard Properties.
    allowTransparency: null,
    autoCorrect: null,
    autoSave: null,
    disablePictureInPicture: Z,
    disableRemotePlayback: Z,
    prefix: null,
    property: null,
    results: C,
    security: null,
    unselectable: null
  },
  space: "html",
  transform: zr
}), Ll = Ye({
  attributes: {
    accentHeight: "accent-height",
    alignmentBaseline: "alignment-baseline",
    arabicForm: "arabic-form",
    baselineShift: "baseline-shift",
    capHeight: "cap-height",
    className: "class",
    clipPath: "clip-path",
    clipRule: "clip-rule",
    colorInterpolation: "color-interpolation",
    colorInterpolationFilters: "color-interpolation-filters",
    colorProfile: "color-profile",
    colorRendering: "color-rendering",
    crossOrigin: "crossorigin",
    dataType: "datatype",
    dominantBaseline: "dominant-baseline",
    enableBackground: "enable-background",
    fillOpacity: "fill-opacity",
    fillRule: "fill-rule",
    floodColor: "flood-color",
    floodOpacity: "flood-opacity",
    fontFamily: "font-family",
    fontSize: "font-size",
    fontSizeAdjust: "font-size-adjust",
    fontStretch: "font-stretch",
    fontStyle: "font-style",
    fontVariant: "font-variant",
    fontWeight: "font-weight",
    glyphName: "glyph-name",
    glyphOrientationHorizontal: "glyph-orientation-horizontal",
    glyphOrientationVertical: "glyph-orientation-vertical",
    hrefLang: "hreflang",
    horizAdvX: "horiz-adv-x",
    horizOriginX: "horiz-origin-x",
    horizOriginY: "horiz-origin-y",
    imageRendering: "image-rendering",
    letterSpacing: "letter-spacing",
    lightingColor: "lighting-color",
    markerEnd: "marker-end",
    markerMid: "marker-mid",
    markerStart: "marker-start",
    navDown: "nav-down",
    navDownLeft: "nav-down-left",
    navDownRight: "nav-down-right",
    navLeft: "nav-left",
    navNext: "nav-next",
    navPrev: "nav-prev",
    navRight: "nav-right",
    navUp: "nav-up",
    navUpLeft: "nav-up-left",
    navUpRight: "nav-up-right",
    onAbort: "onabort",
    onActivate: "onactivate",
    onAfterPrint: "onafterprint",
    onBeforePrint: "onbeforeprint",
    onBegin: "onbegin",
    onCancel: "oncancel",
    onCanPlay: "oncanplay",
    onCanPlayThrough: "oncanplaythrough",
    onChange: "onchange",
    onClick: "onclick",
    onClose: "onclose",
    onCopy: "oncopy",
    onCueChange: "oncuechange",
    onCut: "oncut",
    onDblClick: "ondblclick",
    onDrag: "ondrag",
    onDragEnd: "ondragend",
    onDragEnter: "ondragenter",
    onDragExit: "ondragexit",
    onDragLeave: "ondragleave",
    onDragOver: "ondragover",
    onDragStart: "ondragstart",
    onDrop: "ondrop",
    onDurationChange: "ondurationchange",
    onEmptied: "onemptied",
    onEnd: "onend",
    onEnded: "onended",
    onError: "onerror",
    onFocus: "onfocus",
    onFocusIn: "onfocusin",
    onFocusOut: "onfocusout",
    onHashChange: "onhashchange",
    onInput: "oninput",
    onInvalid: "oninvalid",
    onKeyDown: "onkeydown",
    onKeyPress: "onkeypress",
    onKeyUp: "onkeyup",
    onLoad: "onload",
    onLoadedData: "onloadeddata",
    onLoadedMetadata: "onloadedmetadata",
    onLoadStart: "onloadstart",
    onMessage: "onmessage",
    onMouseDown: "onmousedown",
    onMouseEnter: "onmouseenter",
    onMouseLeave: "onmouseleave",
    onMouseMove: "onmousemove",
    onMouseOut: "onmouseout",
    onMouseOver: "onmouseover",
    onMouseUp: "onmouseup",
    onMouseWheel: "onmousewheel",
    onOffline: "onoffline",
    onOnline: "ononline",
    onPageHide: "onpagehide",
    onPageShow: "onpageshow",
    onPaste: "onpaste",
    onPause: "onpause",
    onPlay: "onplay",
    onPlaying: "onplaying",
    onPopState: "onpopstate",
    onProgress: "onprogress",
    onRateChange: "onratechange",
    onRepeat: "onrepeat",
    onReset: "onreset",
    onResize: "onresize",
    onScroll: "onscroll",
    onSeeked: "onseeked",
    onSeeking: "onseeking",
    onSelect: "onselect",
    onShow: "onshow",
    onStalled: "onstalled",
    onStorage: "onstorage",
    onSubmit: "onsubmit",
    onSuspend: "onsuspend",
    onTimeUpdate: "ontimeupdate",
    onToggle: "ontoggle",
    onUnload: "onunload",
    onVolumeChange: "onvolumechange",
    onWaiting: "onwaiting",
    onZoom: "onzoom",
    overlinePosition: "overline-position",
    overlineThickness: "overline-thickness",
    paintOrder: "paint-order",
    panose1: "panose-1",
    pointerEvents: "pointer-events",
    referrerPolicy: "referrerpolicy",
    renderingIntent: "rendering-intent",
    shapeRendering: "shape-rendering",
    stopColor: "stop-color",
    stopOpacity: "stop-opacity",
    strikethroughPosition: "strikethrough-position",
    strikethroughThickness: "strikethrough-thickness",
    strokeDashArray: "stroke-dasharray",
    strokeDashOffset: "stroke-dashoffset",
    strokeLineCap: "stroke-linecap",
    strokeLineJoin: "stroke-linejoin",
    strokeMiterLimit: "stroke-miterlimit",
    strokeOpacity: "stroke-opacity",
    strokeWidth: "stroke-width",
    tabIndex: "tabindex",
    textAnchor: "text-anchor",
    textDecoration: "text-decoration",
    textRendering: "text-rendering",
    transformOrigin: "transform-origin",
    typeOf: "typeof",
    underlinePosition: "underline-position",
    underlineThickness: "underline-thickness",
    unicodeBidi: "unicode-bidi",
    unicodeRange: "unicode-range",
    unitsPerEm: "units-per-em",
    vAlphabetic: "v-alphabetic",
    vHanging: "v-hanging",
    vIdeographic: "v-ideographic",
    vMathematical: "v-mathematical",
    vectorEffect: "vector-effect",
    vertAdvY: "vert-adv-y",
    vertOriginX: "vert-origin-x",
    vertOriginY: "vert-origin-y",
    wordSpacing: "word-spacing",
    writingMode: "writing-mode",
    xHeight: "x-height",
    // These were camelcased in Tiny. Now lowercased in SVG 2
    playbackOrder: "playbackorder",
    timelineBegin: "timelinebegin"
  },
  properties: {
    about: be,
    accentHeight: C,
    accumulate: null,
    additive: null,
    alignmentBaseline: null,
    alphabetic: C,
    amplitude: C,
    arabicForm: null,
    ascent: C,
    attributeName: null,
    attributeType: null,
    azimuth: C,
    bandwidth: null,
    baselineShift: null,
    baseFrequency: null,
    baseProfile: null,
    bbox: null,
    begin: null,
    bias: C,
    by: null,
    calcMode: null,
    capHeight: C,
    className: ee,
    clip: null,
    clipPath: null,
    clipPathUnits: null,
    clipRule: null,
    color: null,
    colorInterpolation: null,
    colorInterpolationFilters: null,
    colorProfile: null,
    colorRendering: null,
    content: null,
    contentScriptType: null,
    contentStyleType: null,
    crossOrigin: null,
    cursor: null,
    cx: null,
    cy: null,
    d: null,
    dataType: null,
    defaultAction: null,
    descent: C,
    diffuseConstant: C,
    direction: null,
    display: null,
    dur: null,
    divisor: C,
    dominantBaseline: null,
    download: Z,
    dx: null,
    dy: null,
    edgeMode: null,
    editable: null,
    elevation: C,
    enableBackground: null,
    end: null,
    event: null,
    exponent: C,
    externalResourcesRequired: null,
    fill: null,
    fillOpacity: C,
    fillRule: null,
    filter: null,
    filterRes: null,
    filterUnits: null,
    floodColor: null,
    floodOpacity: null,
    focusable: null,
    focusHighlight: null,
    fontFamily: null,
    fontSize: null,
    fontSizeAdjust: null,
    fontStretch: null,
    fontStyle: null,
    fontVariant: null,
    fontWeight: null,
    format: null,
    fr: null,
    from: null,
    fx: null,
    fy: null,
    g1: We,
    g2: We,
    glyphName: We,
    glyphOrientationHorizontal: null,
    glyphOrientationVertical: null,
    glyphRef: null,
    gradientTransform: null,
    gradientUnits: null,
    handler: null,
    hanging: C,
    hatchContentUnits: null,
    hatchUnits: null,
    height: null,
    href: null,
    hrefLang: null,
    horizAdvX: C,
    horizOriginX: C,
    horizOriginY: C,
    id: null,
    ideographic: C,
    imageRendering: null,
    initialVisibility: null,
    in: null,
    in2: null,
    intercept: C,
    k: C,
    k1: C,
    k2: C,
    k3: C,
    k4: C,
    kernelMatrix: be,
    kernelUnitLength: null,
    keyPoints: null,
    // SEMI_COLON_SEPARATED
    keySplines: null,
    // SEMI_COLON_SEPARATED
    keyTimes: null,
    // SEMI_COLON_SEPARATED
    kerning: null,
    lang: null,
    lengthAdjust: null,
    letterSpacing: null,
    lightingColor: null,
    limitingConeAngle: C,
    local: null,
    markerEnd: null,
    markerMid: null,
    markerStart: null,
    markerHeight: null,
    markerUnits: null,
    markerWidth: null,
    mask: null,
    maskContentUnits: null,
    maskUnits: null,
    mathematical: null,
    max: null,
    media: null,
    mediaCharacterEncoding: null,
    mediaContentEncodings: null,
    mediaSize: C,
    mediaTime: null,
    method: null,
    min: null,
    mode: null,
    name: null,
    navDown: null,
    navDownLeft: null,
    navDownRight: null,
    navLeft: null,
    navNext: null,
    navPrev: null,
    navRight: null,
    navUp: null,
    navUpLeft: null,
    navUpRight: null,
    numOctaves: null,
    observer: null,
    offset: null,
    onAbort: null,
    onActivate: null,
    onAfterPrint: null,
    onBeforePrint: null,
    onBegin: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnd: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFocusIn: null,
    onFocusOut: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadStart: null,
    onMessage: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onMouseWheel: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRepeat: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onShow: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onZoom: null,
    opacity: null,
    operator: null,
    order: null,
    orient: null,
    orientation: null,
    origin: null,
    overflow: null,
    overlay: null,
    overlinePosition: C,
    overlineThickness: C,
    paintOrder: null,
    panose1: null,
    path: null,
    pathLength: C,
    patternContentUnits: null,
    patternTransform: null,
    patternUnits: null,
    phase: null,
    ping: ee,
    pitch: null,
    playbackOrder: null,
    pointerEvents: null,
    points: null,
    pointsAtX: C,
    pointsAtY: C,
    pointsAtZ: C,
    preserveAlpha: null,
    preserveAspectRatio: null,
    primitiveUnits: null,
    propagate: null,
    property: be,
    r: null,
    radius: null,
    referrerPolicy: null,
    refX: null,
    refY: null,
    rel: be,
    rev: be,
    renderingIntent: null,
    repeatCount: null,
    repeatDur: null,
    requiredExtensions: be,
    requiredFeatures: be,
    requiredFonts: be,
    requiredFormats: be,
    resource: null,
    restart: null,
    result: null,
    rotate: null,
    rx: null,
    ry: null,
    scale: null,
    seed: null,
    shapeRendering: null,
    side: null,
    slope: null,
    snapshotTime: null,
    specularConstant: C,
    specularExponent: C,
    spreadMethod: null,
    spacing: null,
    startOffset: null,
    stdDeviation: null,
    stemh: null,
    stemv: null,
    stitchTiles: null,
    stopColor: null,
    stopOpacity: null,
    strikethroughPosition: C,
    strikethroughThickness: C,
    string: null,
    stroke: null,
    strokeDashArray: be,
    strokeDashOffset: null,
    strokeLineCap: null,
    strokeLineJoin: null,
    strokeMiterLimit: C,
    strokeOpacity: C,
    strokeWidth: null,
    style: null,
    surfaceScale: C,
    syncBehavior: null,
    syncBehaviorDefault: null,
    syncMaster: null,
    syncTolerance: null,
    syncToleranceDefault: null,
    systemLanguage: be,
    tabIndex: C,
    tableValues: null,
    target: null,
    targetX: C,
    targetY: C,
    textAnchor: null,
    textDecoration: null,
    textRendering: null,
    textLength: null,
    timelineBegin: null,
    title: null,
    transformBehavior: null,
    type: null,
    typeOf: be,
    to: null,
    transform: null,
    transformOrigin: null,
    u1: null,
    u2: null,
    underlinePosition: C,
    underlineThickness: C,
    unicode: null,
    unicodeBidi: null,
    unicodeRange: null,
    unitsPerEm: C,
    values: null,
    vAlphabetic: C,
    vMathematical: C,
    vectorEffect: null,
    vHanging: C,
    vIdeographic: C,
    version: null,
    vertAdvY: C,
    vertOriginX: C,
    vertOriginY: C,
    viewBox: null,
    viewTarget: null,
    visibility: null,
    width: null,
    widths: null,
    wordSpacing: null,
    writingMode: null,
    x: null,
    x1: null,
    x2: null,
    xChannelSelector: null,
    xHeight: C,
    y: null,
    y1: null,
    y2: null,
    yChannelSelector: null,
    z: null,
    zoomAndPan: null
  },
  space: "svg",
  transform: Pr
}), Nr = Ye({
  properties: {
    xLinkActuate: null,
    xLinkArcRole: null,
    xLinkHref: null,
    xLinkRole: null,
    xLinkShow: null,
    xLinkTitle: null,
    xLinkType: null
  },
  space: "xlink",
  transform(e, t) {
    return "xlink:" + t.slice(5).toLowerCase();
  }
}), Dr = Ye({
  attributes: { xmlnsxlink: "xmlns:xlink" },
  properties: { xmlnsXLink: null, xmlns: null },
  space: "xmlns",
  transform: zr
}), Vr = Ye({
  properties: { xmlBase: null, xmlLang: null, xmlSpace: null },
  space: "xml",
  transform(e, t) {
    return "xml:" + t.slice(3).toLowerCase();
  }
}), Fl = {
  classId: "classID",
  dataType: "datatype",
  itemId: "itemID",
  strokeDashArray: "strokeDasharray",
  strokeDashOffset: "strokeDashoffset",
  strokeLineCap: "strokeLinecap",
  strokeLineJoin: "strokeLinejoin",
  strokeMiterLimit: "strokeMiterlimit",
  typeOf: "typeof",
  xLinkActuate: "xlinkActuate",
  xLinkArcRole: "xlinkArcrole",
  xLinkHref: "xlinkHref",
  xLinkRole: "xlinkRole",
  xLinkShow: "xlinkShow",
  xLinkTitle: "xlinkTitle",
  xLinkType: "xlinkType",
  xmlnsXLink: "xmlnsXlink"
}, Pl = /[A-Z]/g, Zn = /-[a-z]/g, zl = /^data[-\w.:]+$/i;
function Nl(e, t) {
  const n = Gt(t);
  let r = t, i = ye;
  if (n in e.normal)
    return e.property[e.normal[n]];
  if (n.length > 4 && n.slice(0, 4) === "data" && zl.test(t)) {
    if (t.charAt(4) === "-") {
      const l = t.slice(5).replace(Zn, Vl);
      r = "data" + l.charAt(0).toUpperCase() + l.slice(1);
    } else {
      const l = t.slice(4);
      if (!Zn.test(l)) {
        let a = l.replace(Pl, Dl);
        a.charAt(0) !== "-" && (a = "-" + a), t = "data" + a;
      }
    }
    i = dn;
  }
  return new i(r, t);
}
function Dl(e) {
  return "-" + e.toLowerCase();
}
function Vl(e) {
  return e.charAt(1).toUpperCase();
}
const Bl = Lr([Fr, Tl, Nr, Dr, Vr], "html"), mn = Lr([Fr, Ll, Nr, Dr, Vr], "svg");
function Ol(e) {
  return e.join(" ").trim();
}
function Br(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var $e = {}, Ot, Un;
function Rl() {
  if (Un) return Ot;
  Un = 1;
  var e = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, t = /\n/g, n = /^\s*/, r = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/, i = /^:\s*/, l = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/, a = /^[;\s]*/, o = /^\s+|\s+$/g, c = `
`, s = "/", u = "*", h = "", p = "comment", f = "declaration";
  function w(A, b) {
    if (typeof A != "string")
      throw new TypeError("First argument must be a string");
    if (!A) return [];
    b = b || {};
    var T = 1, M = 1;
    function R(S) {
      var E = S.match(t);
      E && (T += E.length);
      var D = S.lastIndexOf(c);
      M = ~D ? S.length - D : M + S.length;
    }
    function _() {
      var S = { line: T, column: M };
      return function(E) {
        return E.position = new y(S), B(), E;
      };
    }
    function y(S) {
      this.start = S, this.end = { line: T, column: M }, this.source = b.source;
    }
    y.prototype.content = A;
    function z(S) {
      var E = new Error(
        b.source + ":" + T + ":" + M + ": " + S
      );
      if (E.reason = S, E.filename = b.source, E.line = T, E.column = M, E.source = A, !b.silent) throw E;
    }
    function L(S) {
      var E = S.exec(A);
      if (E) {
        var D = E[0];
        return R(D), A = A.slice(D.length), E;
      }
    }
    function B() {
      L(n);
    }
    function j(S) {
      var E;
      for (S = S || []; E = F(); )
        E !== !1 && S.push(E);
      return S;
    }
    function F() {
      var S = _();
      if (!(s != A.charAt(0) || u != A.charAt(1))) {
        for (var E = 2; h != A.charAt(E) && (u != A.charAt(E) || s != A.charAt(E + 1)); )
          ++E;
        if (E += 2, h === A.charAt(E - 1))
          return z("End of comment missing");
        var D = A.slice(2, E - 2);
        return M += 2, R(D), A = A.slice(E), M += 2, S({
          type: p,
          comment: D
        });
      }
    }
    function P() {
      var S = _(), E = L(r);
      if (E) {
        if (F(), !L(i)) return z("property missing ':'");
        var D = L(l), X = S({
          type: f,
          property: k(E[0].replace(e, h)),
          value: D ? k(D[0].replace(e, h)) : h
        });
        return L(a), X;
      }
    }
    function q() {
      var S = [];
      j(S);
      for (var E; E = P(); )
        E !== !1 && (S.push(E), j(S));
      return S;
    }
    return B(), q();
  }
  function k(A) {
    return A ? A.replace(o, h) : h;
  }
  return Ot = w, Ot;
}
var $n;
function _l() {
  if ($n) return $e;
  $n = 1;
  var e = $e && $e.__importDefault || function(r) {
    return r && r.__esModule ? r : { default: r };
  };
  Object.defineProperty($e, "__esModule", { value: !0 }), $e.default = n;
  const t = e(Rl());
  function n(r, i) {
    let l = null;
    if (!r || typeof r != "string")
      return l;
    const a = (0, t.default)(r), o = typeof i == "function";
    return a.forEach((c) => {
      if (c.type !== "declaration")
        return;
      const { property: s, value: u } = c;
      o ? i(s, u, c) : u && (l = l || {}, l[s] = u);
    }), l;
  }
  return $e;
}
var et = {}, qn;
function Hl() {
  if (qn) return et;
  qn = 1, Object.defineProperty(et, "__esModule", { value: !0 }), et.camelCase = void 0;
  var e = /^--[a-zA-Z0-9_-]+$/, t = /-([a-z])/g, n = /^[^-]+$/, r = /^-(webkit|moz|ms|o|khtml)-/, i = /^-(ms)-/, l = function(s) {
    return !s || n.test(s) || e.test(s);
  }, a = function(s, u) {
    return u.toUpperCase();
  }, o = function(s, u) {
    return "".concat(u, "-");
  }, c = function(s, u) {
    return u === void 0 && (u = {}), l(s) ? s : (s = s.toLowerCase(), u.reactCompat ? s = s.replace(i, o) : s = s.replace(r, o), s.replace(t, a));
  };
  return et.camelCase = c, et;
}
var tt, Wn;
function jl() {
  if (Wn) return tt;
  Wn = 1;
  var e = tt && tt.__importDefault || function(i) {
    return i && i.__esModule ? i : { default: i };
  }, t = e(_l()), n = Hl();
  function r(i, l) {
    var a = {};
    return !i || typeof i != "string" || (0, t.default)(i, function(o, c) {
      o && c && (a[(0, n.camelCase)(o, l)] = c);
    }), a;
  }
  return r.default = r, tt = r, tt;
}
var Zl = jl();
const Ul = /* @__PURE__ */ Br(Zl), Or = Rr("end"), gn = Rr("start");
function Rr(e) {
  return t;
  function t(n) {
    const r = n && n.position && n.position[e] || {};
    if (typeof r.line == "number" && r.line > 0 && typeof r.column == "number" && r.column > 0)
      return {
        line: r.line,
        column: r.column,
        offset: typeof r.offset == "number" && r.offset > -1 ? r.offset : void 0
      };
  }
}
function $l(e) {
  const t = gn(e), n = Or(e);
  if (t && n)
    return { start: t, end: n };
}
function lt(e) {
  return !e || typeof e != "object" ? "" : "position" in e || "type" in e ? Xn(e.position) : "start" in e || "end" in e ? Xn(e) : "line" in e || "column" in e ? tn(e) : "";
}
function tn(e) {
  return Yn(e && e.line) + ":" + Yn(e && e.column);
}
function Xn(e) {
  return tn(e && e.start) + "-" + tn(e && e.end);
}
function Yn(e) {
  return e && typeof e == "number" ? e : 1;
}
class ue extends Error {
  /**
   * Create a message for `reason`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {Options | null | undefined} [options]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | Options | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns
   *   Instance of `VFileMessage`.
   */
  // eslint-disable-next-line complexity
  constructor(t, n, r) {
    super(), typeof n == "string" && (r = n, n = void 0);
    let i = "", l = {}, a = !1;
    if (n && ("line" in n && "column" in n ? l = { place: n } : "start" in n && "end" in n ? l = { place: n } : "type" in n ? l = {
      ancestors: [n],
      place: n.position
    } : l = { ...n }), typeof t == "string" ? i = t : !l.cause && t && (a = !0, i = t.message, l.cause = t), !l.ruleId && !l.source && typeof r == "string") {
      const c = r.indexOf(":");
      c === -1 ? l.ruleId = r : (l.source = r.slice(0, c), l.ruleId = r.slice(c + 1));
    }
    if (!l.place && l.ancestors && l.ancestors) {
      const c = l.ancestors[l.ancestors.length - 1];
      c && (l.place = c.position);
    }
    const o = l.place && "start" in l.place ? l.place.start : l.place;
    this.ancestors = l.ancestors || void 0, this.cause = l.cause || void 0, this.column = o ? o.column : void 0, this.fatal = void 0, this.file = "", this.message = i, this.line = o ? o.line : void 0, this.name = lt(l.place) || "1:1", this.place = l.place || void 0, this.reason = this.message, this.ruleId = l.ruleId || void 0, this.source = l.source || void 0, this.stack = a && l.cause && typeof l.cause.stack == "string" ? l.cause.stack : "", this.actual = void 0, this.expected = void 0, this.note = void 0, this.url = void 0;
  }
}
ue.prototype.file = "";
ue.prototype.name = "";
ue.prototype.reason = "";
ue.prototype.message = "";
ue.prototype.stack = "";
ue.prototype.column = void 0;
ue.prototype.line = void 0;
ue.prototype.ancestors = void 0;
ue.prototype.cause = void 0;
ue.prototype.fatal = void 0;
ue.prototype.place = void 0;
ue.prototype.ruleId = void 0;
ue.prototype.source = void 0;
const yn = {}.hasOwnProperty, ql = /* @__PURE__ */ new Map(), Wl = /[A-Z]/g, Xl = /* @__PURE__ */ new Set(["table", "tbody", "thead", "tfoot", "tr"]), Yl = /* @__PURE__ */ new Set(["td", "th"]), _r = "https://github.com/syntax-tree/hast-util-to-jsx-runtime";
function Jl(e, t) {
  if (!t || t.Fragment === void 0)
    throw new TypeError("Expected `Fragment` in options");
  const n = t.filePath || void 0;
  let r;
  if (t.development) {
    if (typeof t.jsxDEV != "function")
      throw new TypeError(
        "Expected `jsxDEV` in options when `development: true`"
      );
    r = ia(n, t.jsxDEV);
  } else {
    if (typeof t.jsx != "function")
      throw new TypeError("Expected `jsx` in production options");
    if (typeof t.jsxs != "function")
      throw new TypeError("Expected `jsxs` in production options");
    r = ra(n, t.jsx, t.jsxs);
  }
  const i = {
    Fragment: t.Fragment,
    ancestors: [],
    components: t.components || {},
    create: r,
    elementAttributeNameCase: t.elementAttributeNameCase || "react",
    evaluater: t.createEvaluater ? t.createEvaluater() : void 0,
    filePath: n,
    ignoreInvalidStyle: t.ignoreInvalidStyle || !1,
    passKeys: t.passKeys !== !1,
    passNode: t.passNode || !1,
    schema: t.space === "svg" ? mn : Bl,
    stylePropertyNameCase: t.stylePropertyNameCase || "dom",
    tableCellAlignToStyle: t.tableCellAlignToStyle !== !1
  }, l = Hr(i, e, void 0);
  return l && typeof l != "string" ? l : i.create(
    e,
    i.Fragment,
    { children: l || void 0 },
    void 0
  );
}
function Hr(e, t, n) {
  if (t.type === "element")
    return Ql(e, t, n);
  if (t.type === "mdxFlowExpression" || t.type === "mdxTextExpression")
    return Gl(e, t);
  if (t.type === "mdxJsxFlowElement" || t.type === "mdxJsxTextElement")
    return ea(e, t, n);
  if (t.type === "mdxjsEsm")
    return Kl(e, t);
  if (t.type === "root")
    return ta(e, t, n);
  if (t.type === "text")
    return na(e, t);
}
function Ql(e, t, n) {
  const r = e.schema;
  let i = r;
  t.tagName.toLowerCase() === "svg" && r.space === "html" && (i = mn, e.schema = i), e.ancestors.push(t);
  const l = Zr(e, t.tagName, !1), a = la(e, t);
  let o = bn(e, t);
  return Xl.has(t.tagName) && (o = o.filter(function(c) {
    return typeof c == "string" ? !Il(c) : !0;
  })), jr(e, a, l, t), xn(a, o), e.ancestors.pop(), e.schema = r, e.create(t, l, a, n);
}
function Gl(e, t) {
  if (t.data && t.data.estree && e.evaluater) {
    const r = t.data.estree.body[0];
    return r.type, /** @type {Child | undefined} */
    e.evaluater.evaluateExpression(r.expression);
  }
  st(e, t.position);
}
function Kl(e, t) {
  if (t.data && t.data.estree && e.evaluater)
    return (
      /** @type {Child | undefined} */
      e.evaluater.evaluateProgram(t.data.estree)
    );
  st(e, t.position);
}
function ea(e, t, n) {
  const r = e.schema;
  let i = r;
  t.name === "svg" && r.space === "html" && (i = mn, e.schema = i), e.ancestors.push(t);
  const l = t.name === null ? e.Fragment : Zr(e, t.name, !0), a = aa(e, t), o = bn(e, t);
  return jr(e, a, l, t), xn(a, o), e.ancestors.pop(), e.schema = r, e.create(t, l, a, n);
}
function ta(e, t, n) {
  const r = {};
  return xn(r, bn(e, t)), e.create(t, e.Fragment, r, n);
}
function na(e, t) {
  return t.value;
}
function jr(e, t, n, r) {
  typeof n != "string" && n !== e.Fragment && e.passNode && (t.node = r);
}
function xn(e, t) {
  if (t.length > 0) {
    const n = t.length > 1 ? t : t[0];
    n && (e.children = n);
  }
}
function ra(e, t, n) {
  return r;
  function r(i, l, a, o) {
    const s = Array.isArray(a.children) ? n : t;
    return o ? s(l, a, o) : s(l, a);
  }
}
function ia(e, t) {
  return n;
  function n(r, i, l, a) {
    const o = Array.isArray(l.children), c = gn(r);
    return t(
      i,
      l,
      a,
      o,
      {
        columnNumber: c ? c.column - 1 : void 0,
        fileName: e,
        lineNumber: c ? c.line : void 0
      },
      void 0
    );
  }
}
function la(e, t) {
  const n = {};
  let r, i;
  for (i in t.properties)
    if (i !== "children" && yn.call(t.properties, i)) {
      const l = oa(e, i, t.properties[i]);
      if (l) {
        const [a, o] = l;
        e.tableCellAlignToStyle && a === "align" && typeof o == "string" && Yl.has(t.tagName) ? r = o : n[a] = o;
      }
    }
  if (r) {
    const l = (
      /** @type {Style} */
      n.style || (n.style = {})
    );
    l[e.stylePropertyNameCase === "css" ? "text-align" : "textAlign"] = r;
  }
  return n;
}
function aa(e, t) {
  const n = {};
  for (const r of t.attributes)
    if (r.type === "mdxJsxExpressionAttribute")
      if (r.data && r.data.estree && e.evaluater) {
        const l = r.data.estree.body[0];
        l.type;
        const a = l.expression;
        a.type;
        const o = a.properties[0];
        o.type, Object.assign(
          n,
          e.evaluater.evaluateExpression(o.argument)
        );
      } else
        st(e, t.position);
    else {
      const i = r.name;
      let l;
      if (r.value && typeof r.value == "object")
        if (r.value.data && r.value.data.estree && e.evaluater) {
          const o = r.value.data.estree.body[0];
          o.type, l = e.evaluater.evaluateExpression(o.expression);
        } else
          st(e, t.position);
      else
        l = r.value === null ? !0 : r.value;
      n[i] = /** @type {Props[keyof Props]} */
      l;
    }
  return n;
}
function bn(e, t) {
  const n = [];
  let r = -1;
  const i = e.passKeys ? /* @__PURE__ */ new Map() : ql;
  for (; ++r < t.children.length; ) {
    const l = t.children[r];
    let a;
    if (e.passKeys) {
      const c = l.type === "element" ? l.tagName : l.type === "mdxJsxFlowElement" || l.type === "mdxJsxTextElement" ? l.name : void 0;
      if (c) {
        const s = i.get(c) || 0;
        a = c + "-" + s, i.set(c, s + 1);
      }
    }
    const o = Hr(e, l, a);
    o !== void 0 && n.push(o);
  }
  return n;
}
function oa(e, t, n) {
  const r = Nl(e.schema, t);
  if (!(n == null || typeof n == "number" && Number.isNaN(n))) {
    if (Array.isArray(n) && (n = r.commaSeparated ? Cl(n) : Ol(n)), r.property === "style") {
      let i = typeof n == "object" ? n : sa(e, String(n));
      return e.stylePropertyNameCase === "css" && (i = ua(i)), ["style", i];
    }
    return [
      e.elementAttributeNameCase === "react" && r.space ? Fl[r.property] || r.property : r.attribute,
      n
    ];
  }
}
function sa(e, t) {
  try {
    return Ul(t, { reactCompat: !0 });
  } catch (n) {
    if (e.ignoreInvalidStyle)
      return {};
    const r = (
      /** @type {Error} */
      n
    ), i = new ue("Cannot parse `style` attribute", {
      ancestors: e.ancestors,
      cause: r,
      ruleId: "style",
      source: "hast-util-to-jsx-runtime"
    });
    throw i.file = e.filePath || void 0, i.url = _r + "#cannot-parse-style-attribute", i;
  }
}
function Zr(e, t, n) {
  let r;
  if (!n)
    r = { type: "Literal", value: t };
  else if (t.includes(".")) {
    const i = t.split(".");
    let l = -1, a;
    for (; ++l < i.length; ) {
      const o = _n(i[l]) ? { type: "Identifier", name: i[l] } : { type: "Literal", value: i[l] };
      a = a ? {
        type: "MemberExpression",
        object: a,
        property: o,
        computed: !!(l && o.type === "Literal"),
        optional: !1
      } : o;
    }
    r = a;
  } else
    r = _n(t) && !/^[a-z]/.test(t) ? { type: "Identifier", name: t } : { type: "Literal", value: t };
  if (r.type === "Literal") {
    const i = (
      /** @type {string | number} */
      r.value
    );
    return yn.call(e.components, i) ? e.components[i] : i;
  }
  if (e.evaluater)
    return e.evaluater.evaluateExpression(r);
  st(e);
}
function st(e, t) {
  const n = new ue(
    "Cannot handle MDX estrees without `createEvaluater`",
    {
      ancestors: e.ancestors,
      place: t,
      ruleId: "mdx-estree",
      source: "hast-util-to-jsx-runtime"
    }
  );
  throw n.file = e.filePath || void 0, n.url = _r + "#cannot-handle-mdx-estrees-without-createevaluater", n;
}
function ua(e) {
  const t = {};
  let n;
  for (n in e)
    yn.call(e, n) && (t[ca(n)] = e[n]);
  return t;
}
function ca(e) {
  let t = e.replace(Wl, ha);
  return t.slice(0, 3) === "ms-" && (t = "-" + t), t;
}
function ha(e) {
  return "-" + e.toLowerCase();
}
const Rt = {
  action: ["form"],
  cite: ["blockquote", "del", "ins", "q"],
  data: ["object"],
  formAction: ["button", "input"],
  href: ["a", "area", "base", "link"],
  icon: ["menuitem"],
  itemId: null,
  manifest: ["html"],
  ping: ["a", "area"],
  poster: ["video"],
  src: [
    "audio",
    "embed",
    "iframe",
    "img",
    "input",
    "script",
    "source",
    "track",
    "video"
  ]
}, fa = {};
function pa(e, t) {
  const n = fa, r = typeof n.includeImageAlt == "boolean" ? n.includeImageAlt : !0, i = typeof n.includeHtml == "boolean" ? n.includeHtml : !0;
  return Ur(e, r, i);
}
function Ur(e, t, n) {
  if (da(e)) {
    if ("value" in e)
      return e.type === "html" && !n ? "" : e.value;
    if (t && "alt" in e && e.alt)
      return e.alt;
    if ("children" in e)
      return Jn(e.children, t, n);
  }
  return Array.isArray(e) ? Jn(e, t, n) : "";
}
function Jn(e, t, n) {
  const r = [];
  let i = -1;
  for (; ++i < e.length; )
    r[i] = Ur(e[i], t, n);
  return r.join("");
}
function da(e) {
  return !!(e && typeof e == "object");
}
const Qn = document.createElement("i");
function wn(e) {
  const t = "&" + e + ";";
  Qn.innerHTML = t;
  const n = Qn.textContent;
  return (
    // @ts-expect-error: TypeScript is wrong that `textContent` on elements can
    // yield `null`.
    n.charCodeAt(n.length - 1) === 59 && e !== "semi" || n === t ? !1 : n
  );
}
function Le(e, t, n, r) {
  const i = e.length;
  let l = 0, a;
  if (t < 0 ? t = -t > i ? 0 : i + t : t = t > i ? i : t, n = n > 0 ? n : 0, r.length < 1e4)
    a = Array.from(r), a.unshift(t, n), e.splice(...a);
  else
    for (n && e.splice(t, n); l < r.length; )
      a = r.slice(l, l + 1e4), a.unshift(t, 0), e.splice(...a), l += 1e4, t += 1e4;
}
function Ce(e, t) {
  return e.length > 0 ? (Le(e, e.length, 0, t), e) : t;
}
const Gn = {}.hasOwnProperty;
function ma(e) {
  const t = {};
  let n = -1;
  for (; ++n < e.length; )
    ga(t, e[n]);
  return t;
}
function ga(e, t) {
  let n;
  for (n in t) {
    const i = (Gn.call(e, n) ? e[n] : void 0) || (e[n] = {}), l = t[n];
    let a;
    if (l)
      for (a in l) {
        Gn.call(i, a) || (i[a] = []);
        const o = l[a];
        ya(
          // @ts-expect-error Looks like a list.
          i[a],
          Array.isArray(o) ? o : o ? [o] : []
        );
      }
  }
}
function ya(e, t) {
  let n = -1;
  const r = [];
  for (; ++n < t.length; )
    (t[n].add === "after" ? e : r).push(t[n]);
  Le(e, 0, 0, r);
}
function $r(e, t) {
  const n = Number.parseInt(e, t);
  return (
    // C0 except for HT, LF, FF, CR, space.
    n < 9 || n === 11 || n > 13 && n < 32 || // Control character (DEL) of C0, and C1 controls.
    n > 126 && n < 160 || // Lone high surrogates and low surrogates.
    n > 55295 && n < 57344 || // Noncharacters.
    n > 64975 && n < 65008 || /* eslint-disable no-bitwise */
    (n & 65535) === 65535 || (n & 65535) === 65534 || /* eslint-enable no-bitwise */
    // Out of range
    n > 1114111 ? "�" : String.fromCodePoint(n)
  );
}
function Xe(e) {
  return e.replace(/[\t\n\r ]+/g, " ").replace(/^ | $/g, "").toLowerCase().toUpperCase();
}
const Me = Be(/[A-Za-z]/), we = Be(/[\dA-Za-z]/), xa = Be(/[#-'*+\--9=?A-Z^-~]/);
function nn(e) {
  return (
    // Special whitespace codes (which have negative values), C0 and Control
    // character DEL
    e !== null && (e < 32 || e === 127)
  );
}
const rn = Be(/\d/), ba = Be(/[\dA-Fa-f]/), wa = Be(/[!-/:-@[-`{-~]/);
function H(e) {
  return e !== null && e < -2;
}
function ge(e) {
  return e !== null && (e < 0 || e === 32);
}
function G(e) {
  return e === -2 || e === -1 || e === 32;
}
const ka = Be(new RegExp("\\p{P}|\\p{S}", "u")), Ca = Be(/\s/);
function Be(e) {
  return t;
  function t(n) {
    return n !== null && n > -1 && e.test(String.fromCharCode(n));
  }
}
function Je(e) {
  const t = [];
  let n = -1, r = 0, i = 0;
  for (; ++n < e.length; ) {
    const l = e.charCodeAt(n);
    let a = "";
    if (l === 37 && we(e.charCodeAt(n + 1)) && we(e.charCodeAt(n + 2)))
      i = 2;
    else if (l < 128)
      /[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(l)) || (a = String.fromCharCode(l));
    else if (l > 55295 && l < 57344) {
      const o = e.charCodeAt(n + 1);
      l < 56320 && o > 56319 && o < 57344 ? (a = String.fromCharCode(l, o), i = 1) : a = "�";
    } else
      a = String.fromCharCode(l);
    a && (t.push(e.slice(r, n), encodeURIComponent(a)), r = n + i + 1, a = ""), i && (n += i, i = 0);
  }
  return t.join("") + e.slice(r);
}
function te(e, t, n, r) {
  const i = r ? r - 1 : Number.POSITIVE_INFINITY;
  let l = 0;
  return a;
  function a(c) {
    return G(c) ? (e.enter(n), o(c)) : t(c);
  }
  function o(c) {
    return G(c) && l++ < i ? (e.consume(c), o) : (e.exit(n), t(c));
  }
}
const va = {
  tokenize: Ea
};
function Ea(e) {
  const t = e.attempt(this.parser.constructs.contentInitial, r, i);
  let n;
  return t;
  function r(o) {
    if (o === null) {
      e.consume(o);
      return;
    }
    return e.enter("lineEnding"), e.consume(o), e.exit("lineEnding"), te(e, t, "linePrefix");
  }
  function i(o) {
    return e.enter("paragraph"), l(o);
  }
  function l(o) {
    const c = e.enter("chunkText", {
      contentType: "text",
      previous: n
    });
    return n && (n.next = c), n = c, a(o);
  }
  function a(o) {
    if (o === null) {
      e.exit("chunkText"), e.exit("paragraph"), e.consume(o);
      return;
    }
    return H(o) ? (e.consume(o), e.exit("chunkText"), l) : (e.consume(o), a);
  }
}
const Sa = {
  tokenize: Aa
}, Kn = {
  tokenize: Ia
};
function Aa(e) {
  const t = this, n = [];
  let r = 0, i, l, a;
  return o;
  function o(M) {
    if (r < n.length) {
      const R = n[r];
      return t.containerState = R[1], e.attempt(R[0].continuation, c, s)(M);
    }
    return s(M);
  }
  function c(M) {
    if (r++, t.containerState._closeFlow) {
      t.containerState._closeFlow = void 0, i && T();
      const R = t.events.length;
      let _ = R, y;
      for (; _--; )
        if (t.events[_][0] === "exit" && t.events[_][1].type === "chunkFlow") {
          y = t.events[_][1].end;
          break;
        }
      b(r);
      let z = R;
      for (; z < t.events.length; )
        t.events[z][1].end = {
          ...y
        }, z++;
      return Le(t.events, _ + 1, 0, t.events.slice(R)), t.events.length = z, s(M);
    }
    return o(M);
  }
  function s(M) {
    if (r === n.length) {
      if (!i)
        return p(M);
      if (i.currentConstruct && i.currentConstruct.concrete)
        return w(M);
      t.interrupt = !!(i.currentConstruct && !i._gfmTableDynamicInterruptHack);
    }
    return t.containerState = {}, e.check(Kn, u, h)(M);
  }
  function u(M) {
    return i && T(), b(r), p(M);
  }
  function h(M) {
    return t.parser.lazy[t.now().line] = r !== n.length, a = t.now().offset, w(M);
  }
  function p(M) {
    return t.containerState = {}, e.attempt(Kn, f, w)(M);
  }
  function f(M) {
    return r++, n.push([t.currentConstruct, t.containerState]), p(M);
  }
  function w(M) {
    if (M === null) {
      i && T(), b(0), e.consume(M);
      return;
    }
    return i = i || t.parser.flow(t.now()), e.enter("chunkFlow", {
      _tokenizer: i,
      contentType: "flow",
      previous: l
    }), k(M);
  }
  function k(M) {
    if (M === null) {
      A(e.exit("chunkFlow"), !0), b(0), e.consume(M);
      return;
    }
    return H(M) ? (e.consume(M), A(e.exit("chunkFlow")), r = 0, t.interrupt = void 0, o) : (e.consume(M), k);
  }
  function A(M, R) {
    const _ = t.sliceStream(M);
    if (R && _.push(null), M.previous = l, l && (l.next = M), l = M, i.defineSkip(M.start), i.write(_), t.parser.lazy[M.start.line]) {
      let y = i.events.length;
      for (; y--; )
        if (
          // The token starts before the line ending…
          i.events[y][1].start.offset < a && // …and either is not ended yet…
          (!i.events[y][1].end || // …or ends after it.
          i.events[y][1].end.offset > a)
        )
          return;
      const z = t.events.length;
      let L = z, B, j;
      for (; L--; )
        if (t.events[L][0] === "exit" && t.events[L][1].type === "chunkFlow") {
          if (B) {
            j = t.events[L][1].end;
            break;
          }
          B = !0;
        }
      for (b(r), y = z; y < t.events.length; )
        t.events[y][1].end = {
          ...j
        }, y++;
      Le(t.events, L + 1, 0, t.events.slice(z)), t.events.length = y;
    }
  }
  function b(M) {
    let R = n.length;
    for (; R-- > M; ) {
      const _ = n[R];
      t.containerState = _[1], _[0].exit.call(t, e);
    }
    n.length = M;
  }
  function T() {
    i.write([null]), l = void 0, i = void 0, t.containerState._closeFlow = void 0;
  }
}
function Ia(e, t, n) {
  return te(e, e.attempt(this.parser.constructs.document, t, n), "linePrefix", this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4);
}
function er(e) {
  if (e === null || ge(e) || Ca(e))
    return 1;
  if (ka(e))
    return 2;
}
function kn(e, t, n) {
  const r = [];
  let i = -1;
  for (; ++i < e.length; ) {
    const l = e[i].resolveAll;
    l && !r.includes(l) && (t = l(t, n), r.push(l));
  }
  return t;
}
const ln = {
  name: "attention",
  resolveAll: Ma,
  tokenize: Ta
};
function Ma(e, t) {
  let n = -1, r, i, l, a, o, c, s, u;
  for (; ++n < e.length; )
    if (e[n][0] === "enter" && e[n][1].type === "attentionSequence" && e[n][1]._close) {
      for (r = n; r--; )
        if (e[r][0] === "exit" && e[r][1].type === "attentionSequence" && e[r][1]._open && // If the markers are the same:
        t.sliceSerialize(e[r][1]).charCodeAt(0) === t.sliceSerialize(e[n][1]).charCodeAt(0)) {
          if ((e[r][1]._close || e[n][1]._open) && (e[n][1].end.offset - e[n][1].start.offset) % 3 && !((e[r][1].end.offset - e[r][1].start.offset + e[n][1].end.offset - e[n][1].start.offset) % 3))
            continue;
          c = e[r][1].end.offset - e[r][1].start.offset > 1 && e[n][1].end.offset - e[n][1].start.offset > 1 ? 2 : 1;
          const h = {
            ...e[r][1].end
          }, p = {
            ...e[n][1].start
          };
          tr(h, -c), tr(p, c), a = {
            type: c > 1 ? "strongSequence" : "emphasisSequence",
            start: h,
            end: {
              ...e[r][1].end
            }
          }, o = {
            type: c > 1 ? "strongSequence" : "emphasisSequence",
            start: {
              ...e[n][1].start
            },
            end: p
          }, l = {
            type: c > 1 ? "strongText" : "emphasisText",
            start: {
              ...e[r][1].end
            },
            end: {
              ...e[n][1].start
            }
          }, i = {
            type: c > 1 ? "strong" : "emphasis",
            start: {
              ...a.start
            },
            end: {
              ...o.end
            }
          }, e[r][1].end = {
            ...a.start
          }, e[n][1].start = {
            ...o.end
          }, s = [], e[r][1].end.offset - e[r][1].start.offset && (s = Ce(s, [["enter", e[r][1], t], ["exit", e[r][1], t]])), s = Ce(s, [["enter", i, t], ["enter", a, t], ["exit", a, t], ["enter", l, t]]), s = Ce(s, kn(t.parser.constructs.insideSpan.null, e.slice(r + 1, n), t)), s = Ce(s, [["exit", l, t], ["enter", o, t], ["exit", o, t], ["exit", i, t]]), e[n][1].end.offset - e[n][1].start.offset ? (u = 2, s = Ce(s, [["enter", e[n][1], t], ["exit", e[n][1], t]])) : u = 0, Le(e, r - 1, n - r + 3, s), n = r + s.length - u - 2;
          break;
        }
    }
  for (n = -1; ++n < e.length; )
    e[n][1].type === "attentionSequence" && (e[n][1].type = "data");
  return e;
}
function Ta(e, t) {
  const n = this.parser.constructs.attentionMarkers.null, r = this.previous, i = er(r);
  let l;
  return a;
  function a(c) {
    return l = c, e.enter("attentionSequence"), o(c);
  }
  function o(c) {
    if (c === l)
      return e.consume(c), o;
    const s = e.exit("attentionSequence"), u = er(c), h = !u || u === 2 && i || n.includes(c), p = !i || i === 2 && u || n.includes(r);
    return s._open = !!(l === 42 ? h : h && (i || !p)), s._close = !!(l === 42 ? p : p && (u || !h)), t(c);
  }
}
function tr(e, t) {
  e.column += t, e.offset += t, e._bufferIndex += t;
}
const La = {
  name: "autolink",
  tokenize: Fa
};
function Fa(e, t, n) {
  let r = 0;
  return i;
  function i(f) {
    return e.enter("autolink"), e.enter("autolinkMarker"), e.consume(f), e.exit("autolinkMarker"), e.enter("autolinkProtocol"), l;
  }
  function l(f) {
    return Me(f) ? (e.consume(f), a) : f === 64 ? n(f) : s(f);
  }
  function a(f) {
    return f === 43 || f === 45 || f === 46 || we(f) ? (r = 1, o(f)) : s(f);
  }
  function o(f) {
    return f === 58 ? (e.consume(f), r = 0, c) : (f === 43 || f === 45 || f === 46 || we(f)) && r++ < 32 ? (e.consume(f), o) : (r = 0, s(f));
  }
  function c(f) {
    return f === 62 ? (e.exit("autolinkProtocol"), e.enter("autolinkMarker"), e.consume(f), e.exit("autolinkMarker"), e.exit("autolink"), t) : f === null || f === 32 || f === 60 || nn(f) ? n(f) : (e.consume(f), c);
  }
  function s(f) {
    return f === 64 ? (e.consume(f), u) : xa(f) ? (e.consume(f), s) : n(f);
  }
  function u(f) {
    return we(f) ? h(f) : n(f);
  }
  function h(f) {
    return f === 46 ? (e.consume(f), r = 0, u) : f === 62 ? (e.exit("autolinkProtocol").type = "autolinkEmail", e.enter("autolinkMarker"), e.consume(f), e.exit("autolinkMarker"), e.exit("autolink"), t) : p(f);
  }
  function p(f) {
    if ((f === 45 || we(f)) && r++ < 63) {
      const w = f === 45 ? p : h;
      return e.consume(f), w;
    }
    return n(f);
  }
}
const It = {
  partial: !0,
  tokenize: Pa
};
function Pa(e, t, n) {
  return r;
  function r(l) {
    return G(l) ? te(e, i, "linePrefix")(l) : i(l);
  }
  function i(l) {
    return l === null || H(l) ? t(l) : n(l);
  }
}
const qr = {
  continuation: {
    tokenize: Na
  },
  exit: Da,
  name: "blockQuote",
  tokenize: za
};
function za(e, t, n) {
  const r = this;
  return i;
  function i(a) {
    if (a === 62) {
      const o = r.containerState;
      return o.open || (e.enter("blockQuote", {
        _container: !0
      }), o.open = !0), e.enter("blockQuotePrefix"), e.enter("blockQuoteMarker"), e.consume(a), e.exit("blockQuoteMarker"), l;
    }
    return n(a);
  }
  function l(a) {
    return G(a) ? (e.enter("blockQuotePrefixWhitespace"), e.consume(a), e.exit("blockQuotePrefixWhitespace"), e.exit("blockQuotePrefix"), t) : (e.exit("blockQuotePrefix"), t(a));
  }
}
function Na(e, t, n) {
  const r = this;
  return i;
  function i(a) {
    return G(a) ? te(e, l, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(a) : l(a);
  }
  function l(a) {
    return e.attempt(qr, t, n)(a);
  }
}
function Da(e) {
  e.exit("blockQuote");
}
const Wr = {
  name: "characterEscape",
  tokenize: Va
};
function Va(e, t, n) {
  return r;
  function r(l) {
    return e.enter("characterEscape"), e.enter("escapeMarker"), e.consume(l), e.exit("escapeMarker"), i;
  }
  function i(l) {
    return wa(l) ? (e.enter("characterEscapeValue"), e.consume(l), e.exit("characterEscapeValue"), e.exit("characterEscape"), t) : n(l);
  }
}
const Xr = {
  name: "characterReference",
  tokenize: Ba
};
function Ba(e, t, n) {
  const r = this;
  let i = 0, l, a;
  return o;
  function o(h) {
    return e.enter("characterReference"), e.enter("characterReferenceMarker"), e.consume(h), e.exit("characterReferenceMarker"), c;
  }
  function c(h) {
    return h === 35 ? (e.enter("characterReferenceMarkerNumeric"), e.consume(h), e.exit("characterReferenceMarkerNumeric"), s) : (e.enter("characterReferenceValue"), l = 31, a = we, u(h));
  }
  function s(h) {
    return h === 88 || h === 120 ? (e.enter("characterReferenceMarkerHexadecimal"), e.consume(h), e.exit("characterReferenceMarkerHexadecimal"), e.enter("characterReferenceValue"), l = 6, a = ba, u) : (e.enter("characterReferenceValue"), l = 7, a = rn, u(h));
  }
  function u(h) {
    if (h === 59 && i) {
      const p = e.exit("characterReferenceValue");
      return a === we && !wn(r.sliceSerialize(p)) ? n(h) : (e.enter("characterReferenceMarker"), e.consume(h), e.exit("characterReferenceMarker"), e.exit("characterReference"), t);
    }
    return a(h) && i++ < l ? (e.consume(h), u) : n(h);
  }
}
const nr = {
  partial: !0,
  tokenize: Ra
}, rr = {
  concrete: !0,
  name: "codeFenced",
  tokenize: Oa
};
function Oa(e, t, n) {
  const r = this, i = {
    partial: !0,
    tokenize: _
  };
  let l = 0, a = 0, o;
  return c;
  function c(y) {
    return s(y);
  }
  function s(y) {
    const z = r.events[r.events.length - 1];
    return l = z && z[1].type === "linePrefix" ? z[2].sliceSerialize(z[1], !0).length : 0, o = y, e.enter("codeFenced"), e.enter("codeFencedFence"), e.enter("codeFencedFenceSequence"), u(y);
  }
  function u(y) {
    return y === o ? (a++, e.consume(y), u) : a < 3 ? n(y) : (e.exit("codeFencedFenceSequence"), G(y) ? te(e, h, "whitespace")(y) : h(y));
  }
  function h(y) {
    return y === null || H(y) ? (e.exit("codeFencedFence"), r.interrupt ? t(y) : e.check(nr, k, R)(y)) : (e.enter("codeFencedFenceInfo"), e.enter("chunkString", {
      contentType: "string"
    }), p(y));
  }
  function p(y) {
    return y === null || H(y) ? (e.exit("chunkString"), e.exit("codeFencedFenceInfo"), h(y)) : G(y) ? (e.exit("chunkString"), e.exit("codeFencedFenceInfo"), te(e, f, "whitespace")(y)) : y === 96 && y === o ? n(y) : (e.consume(y), p);
  }
  function f(y) {
    return y === null || H(y) ? h(y) : (e.enter("codeFencedFenceMeta"), e.enter("chunkString", {
      contentType: "string"
    }), w(y));
  }
  function w(y) {
    return y === null || H(y) ? (e.exit("chunkString"), e.exit("codeFencedFenceMeta"), h(y)) : y === 96 && y === o ? n(y) : (e.consume(y), w);
  }
  function k(y) {
    return e.attempt(i, R, A)(y);
  }
  function A(y) {
    return e.enter("lineEnding"), e.consume(y), e.exit("lineEnding"), b;
  }
  function b(y) {
    return l > 0 && G(y) ? te(e, T, "linePrefix", l + 1)(y) : T(y);
  }
  function T(y) {
    return y === null || H(y) ? e.check(nr, k, R)(y) : (e.enter("codeFlowValue"), M(y));
  }
  function M(y) {
    return y === null || H(y) ? (e.exit("codeFlowValue"), T(y)) : (e.consume(y), M);
  }
  function R(y) {
    return e.exit("codeFenced"), t(y);
  }
  function _(y, z, L) {
    let B = 0;
    return j;
    function j(E) {
      return y.enter("lineEnding"), y.consume(E), y.exit("lineEnding"), F;
    }
    function F(E) {
      return y.enter("codeFencedFence"), G(E) ? te(y, P, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(E) : P(E);
    }
    function P(E) {
      return E === o ? (y.enter("codeFencedFenceSequence"), q(E)) : L(E);
    }
    function q(E) {
      return E === o ? (B++, y.consume(E), q) : B >= a ? (y.exit("codeFencedFenceSequence"), G(E) ? te(y, S, "whitespace")(E) : S(E)) : L(E);
    }
    function S(E) {
      return E === null || H(E) ? (y.exit("codeFencedFence"), z(E)) : L(E);
    }
  }
}
function Ra(e, t, n) {
  const r = this;
  return i;
  function i(a) {
    return a === null ? n(a) : (e.enter("lineEnding"), e.consume(a), e.exit("lineEnding"), l);
  }
  function l(a) {
    return r.parser.lazy[r.now().line] ? n(a) : t(a);
  }
}
const _t = {
  name: "codeIndented",
  tokenize: Ha
}, _a = {
  partial: !0,
  tokenize: ja
};
function Ha(e, t, n) {
  const r = this;
  return i;
  function i(s) {
    return e.enter("codeIndented"), te(e, l, "linePrefix", 5)(s);
  }
  function l(s) {
    const u = r.events[r.events.length - 1];
    return u && u[1].type === "linePrefix" && u[2].sliceSerialize(u[1], !0).length >= 4 ? a(s) : n(s);
  }
  function a(s) {
    return s === null ? c(s) : H(s) ? e.attempt(_a, a, c)(s) : (e.enter("codeFlowValue"), o(s));
  }
  function o(s) {
    return s === null || H(s) ? (e.exit("codeFlowValue"), a(s)) : (e.consume(s), o);
  }
  function c(s) {
    return e.exit("codeIndented"), t(s);
  }
}
function ja(e, t, n) {
  const r = this;
  return i;
  function i(a) {
    return r.parser.lazy[r.now().line] ? n(a) : H(a) ? (e.enter("lineEnding"), e.consume(a), e.exit("lineEnding"), i) : te(e, l, "linePrefix", 5)(a);
  }
  function l(a) {
    const o = r.events[r.events.length - 1];
    return o && o[1].type === "linePrefix" && o[2].sliceSerialize(o[1], !0).length >= 4 ? t(a) : H(a) ? i(a) : n(a);
  }
}
const Za = {
  name: "codeText",
  previous: $a,
  resolve: Ua,
  tokenize: qa
};
function Ua(e) {
  let t = e.length - 4, n = 3, r, i;
  if ((e[n][1].type === "lineEnding" || e[n][1].type === "space") && (e[t][1].type === "lineEnding" || e[t][1].type === "space")) {
    for (r = n; ++r < t; )
      if (e[r][1].type === "codeTextData") {
        e[n][1].type = "codeTextPadding", e[t][1].type = "codeTextPadding", n += 2, t -= 2;
        break;
      }
  }
  for (r = n - 1, t++; ++r <= t; )
    i === void 0 ? r !== t && e[r][1].type !== "lineEnding" && (i = r) : (r === t || e[r][1].type === "lineEnding") && (e[i][1].type = "codeTextData", r !== i + 2 && (e[i][1].end = e[r - 1][1].end, e.splice(i + 2, r - i - 2), t -= r - i - 2, r = i + 2), i = void 0);
  return e;
}
function $a(e) {
  return e !== 96 || this.events[this.events.length - 1][1].type === "characterEscape";
}
function qa(e, t, n) {
  let r = 0, i, l;
  return a;
  function a(h) {
    return e.enter("codeText"), e.enter("codeTextSequence"), o(h);
  }
  function o(h) {
    return h === 96 ? (e.consume(h), r++, o) : (e.exit("codeTextSequence"), c(h));
  }
  function c(h) {
    return h === null ? n(h) : h === 32 ? (e.enter("space"), e.consume(h), e.exit("space"), c) : h === 96 ? (l = e.enter("codeTextSequence"), i = 0, u(h)) : H(h) ? (e.enter("lineEnding"), e.consume(h), e.exit("lineEnding"), c) : (e.enter("codeTextData"), s(h));
  }
  function s(h) {
    return h === null || h === 32 || h === 96 || H(h) ? (e.exit("codeTextData"), c(h)) : (e.consume(h), s);
  }
  function u(h) {
    return h === 96 ? (e.consume(h), i++, u) : i === r ? (e.exit("codeTextSequence"), e.exit("codeText"), t(h)) : (l.type = "codeTextData", s(h));
  }
}
class Wa {
  /**
   * @param {ReadonlyArray<T> | null | undefined} [initial]
   *   Initial items (optional).
   * @returns
   *   Splice buffer.
   */
  constructor(t) {
    this.left = t ? [...t] : [], this.right = [];
  }
  /**
   * Array access;
   * does not move the cursor.
   *
   * @param {number} index
   *   Index.
   * @return {T}
   *   Item.
   */
  get(t) {
    if (t < 0 || t >= this.left.length + this.right.length)
      throw new RangeError("Cannot access index `" + t + "` in a splice buffer of size `" + (this.left.length + this.right.length) + "`");
    return t < this.left.length ? this.left[t] : this.right[this.right.length - t + this.left.length - 1];
  }
  /**
   * The length of the splice buffer, one greater than the largest index in the
   * array.
   */
  get length() {
    return this.left.length + this.right.length;
  }
  /**
   * Remove and return `list[0]`;
   * moves the cursor to `0`.
   *
   * @returns {T | undefined}
   *   Item, optional.
   */
  shift() {
    return this.setCursor(0), this.right.pop();
  }
  /**
   * Slice the buffer to get an array;
   * does not move the cursor.
   *
   * @param {number} start
   *   Start.
   * @param {number | null | undefined} [end]
   *   End (optional).
   * @returns {Array<T>}
   *   Array of items.
   */
  slice(t, n) {
    const r = n ?? Number.POSITIVE_INFINITY;
    return r < this.left.length ? this.left.slice(t, r) : t > this.left.length ? this.right.slice(this.right.length - r + this.left.length, this.right.length - t + this.left.length).reverse() : this.left.slice(t).concat(this.right.slice(this.right.length - r + this.left.length).reverse());
  }
  /**
   * Mimics the behavior of Array.prototype.splice() except for the change of
   * interface necessary to avoid segfaults when patching in very large arrays.
   *
   * This operation moves cursor is moved to `start` and results in the cursor
   * placed after any inserted items.
   *
   * @param {number} start
   *   Start;
   *   zero-based index at which to start changing the array;
   *   negative numbers count backwards from the end of the array and values
   *   that are out-of bounds are clamped to the appropriate end of the array.
   * @param {number | null | undefined} [deleteCount=0]
   *   Delete count (default: `0`);
   *   maximum number of elements to delete, starting from start.
   * @param {Array<T> | null | undefined} [items=[]]
   *   Items to include in place of the deleted items (default: `[]`).
   * @return {Array<T>}
   *   Any removed items.
   */
  splice(t, n, r) {
    const i = n || 0;
    this.setCursor(Math.trunc(t));
    const l = this.right.splice(this.right.length - i, Number.POSITIVE_INFINITY);
    return r && nt(this.left, r), l.reverse();
  }
  /**
   * Remove and return the highest-numbered item in the array, so
   * `list[list.length - 1]`;
   * Moves the cursor to `length`.
   *
   * @returns {T | undefined}
   *   Item, optional.
   */
  pop() {
    return this.setCursor(Number.POSITIVE_INFINITY), this.left.pop();
  }
  /**
   * Inserts a single item to the high-numbered side of the array;
   * moves the cursor to `length`.
   *
   * @param {T} item
   *   Item.
   * @returns {undefined}
   *   Nothing.
   */
  push(t) {
    this.setCursor(Number.POSITIVE_INFINITY), this.left.push(t);
  }
  /**
   * Inserts many items to the high-numbered side of the array.
   * Moves the cursor to `length`.
   *
   * @param {Array<T>} items
   *   Items.
   * @returns {undefined}
   *   Nothing.
   */
  pushMany(t) {
    this.setCursor(Number.POSITIVE_INFINITY), nt(this.left, t);
  }
  /**
   * Inserts a single item to the low-numbered side of the array;
   * Moves the cursor to `0`.
   *
   * @param {T} item
   *   Item.
   * @returns {undefined}
   *   Nothing.
   */
  unshift(t) {
    this.setCursor(0), this.right.push(t);
  }
  /**
   * Inserts many items to the low-numbered side of the array;
   * moves the cursor to `0`.
   *
   * @param {Array<T>} items
   *   Items.
   * @returns {undefined}
   *   Nothing.
   */
  unshiftMany(t) {
    this.setCursor(0), nt(this.right, t.reverse());
  }
  /**
   * Move the cursor to a specific position in the array. Requires
   * time proportional to the distance moved.
   *
   * If `n < 0`, the cursor will end up at the beginning.
   * If `n > length`, the cursor will end up at the end.
   *
   * @param {number} n
   *   Position.
   * @return {undefined}
   *   Nothing.
   */
  setCursor(t) {
    if (!(t === this.left.length || t > this.left.length && this.right.length === 0 || t < 0 && this.left.length === 0))
      if (t < this.left.length) {
        const n = this.left.splice(t, Number.POSITIVE_INFINITY);
        nt(this.right, n.reverse());
      } else {
        const n = this.right.splice(this.left.length + this.right.length - t, Number.POSITIVE_INFINITY);
        nt(this.left, n.reverse());
      }
  }
}
function nt(e, t) {
  let n = 0;
  if (t.length < 1e4)
    e.push(...t);
  else
    for (; n < t.length; )
      e.push(...t.slice(n, n + 1e4)), n += 1e4;
}
function Yr(e) {
  const t = {};
  let n = -1, r, i, l, a, o, c, s;
  const u = new Wa(e);
  for (; ++n < u.length; ) {
    for (; n in t; )
      n = t[n];
    if (r = u.get(n), n && r[1].type === "chunkFlow" && u.get(n - 1)[1].type === "listItemPrefix" && (c = r[1]._tokenizer.events, l = 0, l < c.length && c[l][1].type === "lineEndingBlank" && (l += 2), l < c.length && c[l][1].type === "content"))
      for (; ++l < c.length && c[l][1].type !== "content"; )
        c[l][1].type === "chunkText" && (c[l][1]._isInFirstContentOfListItem = !0, l++);
    if (r[0] === "enter")
      r[1].contentType && (Object.assign(t, Xa(u, n)), n = t[n], s = !0);
    else if (r[1]._container) {
      for (l = n, i = void 0; l--; )
        if (a = u.get(l), a[1].type === "lineEnding" || a[1].type === "lineEndingBlank")
          a[0] === "enter" && (i && (u.get(i)[1].type = "lineEndingBlank"), a[1].type = "lineEnding", i = l);
        else if (!(a[1].type === "linePrefix" || a[1].type === "listItemIndent")) break;
      i && (r[1].end = {
        ...u.get(i)[1].start
      }, o = u.slice(i, n), o.unshift(r), u.splice(i, n - i + 1, o));
    }
  }
  return Le(e, 0, Number.POSITIVE_INFINITY, u.slice(0)), !s;
}
function Xa(e, t) {
  const n = e.get(t)[1], r = e.get(t)[2];
  let i = t - 1;
  const l = [];
  let a = n._tokenizer;
  a || (a = r.parser[n.contentType](n.start), n._contentTypeTextTrailing && (a._contentTypeTextTrailing = !0));
  const o = a.events, c = [], s = {};
  let u, h, p = -1, f = n, w = 0, k = 0;
  const A = [k];
  for (; f; ) {
    for (; e.get(++i)[1] !== f; )
      ;
    l.push(i), f._tokenizer || (u = r.sliceStream(f), f.next || u.push(null), h && a.defineSkip(f.start), f._isInFirstContentOfListItem && (a._gfmTasklistFirstContentOfListItem = !0), a.write(u), f._isInFirstContentOfListItem && (a._gfmTasklistFirstContentOfListItem = void 0)), h = f, f = f.next;
  }
  for (f = n; ++p < o.length; )
    // Find a void token that includes a break.
    o[p][0] === "exit" && o[p - 1][0] === "enter" && o[p][1].type === o[p - 1][1].type && o[p][1].start.line !== o[p][1].end.line && (k = p + 1, A.push(k), f._tokenizer = void 0, f.previous = void 0, f = f.next);
  for (a.events = [], f ? (f._tokenizer = void 0, f.previous = void 0) : A.pop(), p = A.length; p--; ) {
    const b = o.slice(A[p], A[p + 1]), T = l.pop();
    c.push([T, T + b.length - 1]), e.splice(T, 2, b);
  }
  for (c.reverse(), p = -1; ++p < c.length; )
    s[w + c[p][0]] = w + c[p][1], w += c[p][1] - c[p][0] - 1;
  return s;
}
const Ya = {
  resolve: Qa,
  tokenize: Ga
}, Ja = {
  partial: !0,
  tokenize: Ka
};
function Qa(e) {
  return Yr(e), e;
}
function Ga(e, t) {
  let n;
  return r;
  function r(o) {
    return e.enter("content"), n = e.enter("chunkContent", {
      contentType: "content"
    }), i(o);
  }
  function i(o) {
    return o === null ? l(o) : H(o) ? e.check(Ja, a, l)(o) : (e.consume(o), i);
  }
  function l(o) {
    return e.exit("chunkContent"), e.exit("content"), t(o);
  }
  function a(o) {
    return e.consume(o), e.exit("chunkContent"), n.next = e.enter("chunkContent", {
      contentType: "content",
      previous: n
    }), n = n.next, i;
  }
}
function Ka(e, t, n) {
  const r = this;
  return i;
  function i(a) {
    return e.exit("chunkContent"), e.enter("lineEnding"), e.consume(a), e.exit("lineEnding"), te(e, l, "linePrefix");
  }
  function l(a) {
    if (a === null || H(a))
      return n(a);
    const o = r.events[r.events.length - 1];
    return !r.parser.constructs.disable.null.includes("codeIndented") && o && o[1].type === "linePrefix" && o[2].sliceSerialize(o[1], !0).length >= 4 ? t(a) : e.interrupt(r.parser.constructs.flow, n, t)(a);
  }
}
function Jr(e, t, n, r, i, l, a, o, c) {
  const s = c || Number.POSITIVE_INFINITY;
  let u = 0;
  return h;
  function h(b) {
    return b === 60 ? (e.enter(r), e.enter(i), e.enter(l), e.consume(b), e.exit(l), p) : b === null || b === 32 || b === 41 || nn(b) ? n(b) : (e.enter(r), e.enter(a), e.enter(o), e.enter("chunkString", {
      contentType: "string"
    }), k(b));
  }
  function p(b) {
    return b === 62 ? (e.enter(l), e.consume(b), e.exit(l), e.exit(i), e.exit(r), t) : (e.enter(o), e.enter("chunkString", {
      contentType: "string"
    }), f(b));
  }
  function f(b) {
    return b === 62 ? (e.exit("chunkString"), e.exit(o), p(b)) : b === null || b === 60 || H(b) ? n(b) : (e.consume(b), b === 92 ? w : f);
  }
  function w(b) {
    return b === 60 || b === 62 || b === 92 ? (e.consume(b), f) : f(b);
  }
  function k(b) {
    return !u && (b === null || b === 41 || ge(b)) ? (e.exit("chunkString"), e.exit(o), e.exit(a), e.exit(r), t(b)) : u < s && b === 40 ? (e.consume(b), u++, k) : b === 41 ? (e.consume(b), u--, k) : b === null || b === 32 || b === 40 || nn(b) ? n(b) : (e.consume(b), b === 92 ? A : k);
  }
  function A(b) {
    return b === 40 || b === 41 || b === 92 ? (e.consume(b), k) : k(b);
  }
}
function Qr(e, t, n, r, i, l) {
  const a = this;
  let o = 0, c;
  return s;
  function s(f) {
    return e.enter(r), e.enter(i), e.consume(f), e.exit(i), e.enter(l), u;
  }
  function u(f) {
    return o > 999 || f === null || f === 91 || f === 93 && !c || // To do: remove in the future once we’ve switched from
    // `micromark-extension-footnote` to `micromark-extension-gfm-footnote`,
    // which doesn’t need this.
    // Hidden footnotes hook.
    /* c8 ignore next 3 */
    f === 94 && !o && "_hiddenFootnoteSupport" in a.parser.constructs ? n(f) : f === 93 ? (e.exit(l), e.enter(i), e.consume(f), e.exit(i), e.exit(r), t) : H(f) ? (e.enter("lineEnding"), e.consume(f), e.exit("lineEnding"), u) : (e.enter("chunkString", {
      contentType: "string"
    }), h(f));
  }
  function h(f) {
    return f === null || f === 91 || f === 93 || H(f) || o++ > 999 ? (e.exit("chunkString"), u(f)) : (e.consume(f), c || (c = !G(f)), f === 92 ? p : h);
  }
  function p(f) {
    return f === 91 || f === 92 || f === 93 ? (e.consume(f), o++, h) : h(f);
  }
}
function Gr(e, t, n, r, i, l) {
  let a;
  return o;
  function o(p) {
    return p === 34 || p === 39 || p === 40 ? (e.enter(r), e.enter(i), e.consume(p), e.exit(i), a = p === 40 ? 41 : p, c) : n(p);
  }
  function c(p) {
    return p === a ? (e.enter(i), e.consume(p), e.exit(i), e.exit(r), t) : (e.enter(l), s(p));
  }
  function s(p) {
    return p === a ? (e.exit(l), c(a)) : p === null ? n(p) : H(p) ? (e.enter("lineEnding"), e.consume(p), e.exit("lineEnding"), te(e, s, "linePrefix")) : (e.enter("chunkString", {
      contentType: "string"
    }), u(p));
  }
  function u(p) {
    return p === a || p === null || H(p) ? (e.exit("chunkString"), s(p)) : (e.consume(p), p === 92 ? h : u);
  }
  function h(p) {
    return p === a || p === 92 ? (e.consume(p), u) : u(p);
  }
}
function at(e, t) {
  let n;
  return r;
  function r(i) {
    return H(i) ? (e.enter("lineEnding"), e.consume(i), e.exit("lineEnding"), n = !0, r) : G(i) ? te(e, r, n ? "linePrefix" : "lineSuffix")(i) : t(i);
  }
}
const eo = {
  name: "definition",
  tokenize: no
}, to = {
  partial: !0,
  tokenize: ro
};
function no(e, t, n) {
  const r = this;
  let i;
  return l;
  function l(f) {
    return e.enter("definition"), a(f);
  }
  function a(f) {
    return Qr.call(
      r,
      e,
      o,
      // Note: we don’t need to reset the way `markdown-rs` does.
      n,
      "definitionLabel",
      "definitionLabelMarker",
      "definitionLabelString"
    )(f);
  }
  function o(f) {
    return i = Xe(r.sliceSerialize(r.events[r.events.length - 1][1]).slice(1, -1)), f === 58 ? (e.enter("definitionMarker"), e.consume(f), e.exit("definitionMarker"), c) : n(f);
  }
  function c(f) {
    return ge(f) ? at(e, s)(f) : s(f);
  }
  function s(f) {
    return Jr(
      e,
      u,
      // Note: we don’t need to reset the way `markdown-rs` does.
      n,
      "definitionDestination",
      "definitionDestinationLiteral",
      "definitionDestinationLiteralMarker",
      "definitionDestinationRaw",
      "definitionDestinationString"
    )(f);
  }
  function u(f) {
    return e.attempt(to, h, h)(f);
  }
  function h(f) {
    return G(f) ? te(e, p, "whitespace")(f) : p(f);
  }
  function p(f) {
    return f === null || H(f) ? (e.exit("definition"), r.parser.defined.push(i), t(f)) : n(f);
  }
}
function ro(e, t, n) {
  return r;
  function r(o) {
    return ge(o) ? at(e, i)(o) : n(o);
  }
  function i(o) {
    return Gr(e, l, n, "definitionTitle", "definitionTitleMarker", "definitionTitleString")(o);
  }
  function l(o) {
    return G(o) ? te(e, a, "whitespace")(o) : a(o);
  }
  function a(o) {
    return o === null || H(o) ? t(o) : n(o);
  }
}
const io = {
  name: "hardBreakEscape",
  tokenize: lo
};
function lo(e, t, n) {
  return r;
  function r(l) {
    return e.enter("hardBreakEscape"), e.consume(l), i;
  }
  function i(l) {
    return H(l) ? (e.exit("hardBreakEscape"), t(l)) : n(l);
  }
}
const ao = {
  name: "headingAtx",
  resolve: oo,
  tokenize: so
};
function oo(e, t) {
  let n = e.length - 2, r = 3, i, l;
  return e[r][1].type === "whitespace" && (r += 2), n - 2 > r && e[n][1].type === "whitespace" && (n -= 2), e[n][1].type === "atxHeadingSequence" && (r === n - 1 || n - 4 > r && e[n - 2][1].type === "whitespace") && (n -= r + 1 === n ? 2 : 4), n > r && (i = {
    type: "atxHeadingText",
    start: e[r][1].start,
    end: e[n][1].end
  }, l = {
    type: "chunkText",
    start: e[r][1].start,
    end: e[n][1].end,
    contentType: "text"
  }, Le(e, r, n - r + 1, [["enter", i, t], ["enter", l, t], ["exit", l, t], ["exit", i, t]])), e;
}
function so(e, t, n) {
  let r = 0;
  return i;
  function i(u) {
    return e.enter("atxHeading"), l(u);
  }
  function l(u) {
    return e.enter("atxHeadingSequence"), a(u);
  }
  function a(u) {
    return u === 35 && r++ < 6 ? (e.consume(u), a) : u === null || ge(u) ? (e.exit("atxHeadingSequence"), o(u)) : n(u);
  }
  function o(u) {
    return u === 35 ? (e.enter("atxHeadingSequence"), c(u)) : u === null || H(u) ? (e.exit("atxHeading"), t(u)) : G(u) ? te(e, o, "whitespace")(u) : (e.enter("atxHeadingText"), s(u));
  }
  function c(u) {
    return u === 35 ? (e.consume(u), c) : (e.exit("atxHeadingSequence"), o(u));
  }
  function s(u) {
    return u === null || u === 35 || ge(u) ? (e.exit("atxHeadingText"), o(u)) : (e.consume(u), s);
  }
}
const uo = [
  "address",
  "article",
  "aside",
  "base",
  "basefont",
  "blockquote",
  "body",
  "caption",
  "center",
  "col",
  "colgroup",
  "dd",
  "details",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "frame",
  "frameset",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hr",
  "html",
  "iframe",
  "legend",
  "li",
  "link",
  "main",
  "menu",
  "menuitem",
  "nav",
  "noframes",
  "ol",
  "optgroup",
  "option",
  "p",
  "param",
  "search",
  "section",
  "summary",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "title",
  "tr",
  "track",
  "ul"
], ir = ["pre", "script", "style", "textarea"], co = {
  concrete: !0,
  name: "htmlFlow",
  resolveTo: po,
  tokenize: mo
}, ho = {
  partial: !0,
  tokenize: yo
}, fo = {
  partial: !0,
  tokenize: go
};
function po(e) {
  let t = e.length;
  for (; t-- && !(e[t][0] === "enter" && e[t][1].type === "htmlFlow"); )
    ;
  return t > 1 && e[t - 2][1].type === "linePrefix" && (e[t][1].start = e[t - 2][1].start, e[t + 1][1].start = e[t - 2][1].start, e.splice(t - 2, 2)), e;
}
function mo(e, t, n) {
  const r = this;
  let i, l, a, o, c;
  return s;
  function s(d) {
    return u(d);
  }
  function u(d) {
    return e.enter("htmlFlow"), e.enter("htmlFlowData"), e.consume(d), h;
  }
  function h(d) {
    return d === 33 ? (e.consume(d), p) : d === 47 ? (e.consume(d), l = !0, k) : d === 63 ? (e.consume(d), i = 3, r.interrupt ? t : m) : Me(d) ? (e.consume(d), a = String.fromCharCode(d), A) : n(d);
  }
  function p(d) {
    return d === 45 ? (e.consume(d), i = 2, f) : d === 91 ? (e.consume(d), i = 5, o = 0, w) : Me(d) ? (e.consume(d), i = 4, r.interrupt ? t : m) : n(d);
  }
  function f(d) {
    return d === 45 ? (e.consume(d), r.interrupt ? t : m) : n(d);
  }
  function w(d) {
    const J = "CDATA[";
    return d === J.charCodeAt(o++) ? (e.consume(d), o === J.length ? r.interrupt ? t : P : w) : n(d);
  }
  function k(d) {
    return Me(d) ? (e.consume(d), a = String.fromCharCode(d), A) : n(d);
  }
  function A(d) {
    if (d === null || d === 47 || d === 62 || ge(d)) {
      const J = d === 47, ae = a.toLowerCase();
      return !J && !l && ir.includes(ae) ? (i = 1, r.interrupt ? t(d) : P(d)) : uo.includes(a.toLowerCase()) ? (i = 6, J ? (e.consume(d), b) : r.interrupt ? t(d) : P(d)) : (i = 7, r.interrupt && !r.parser.lazy[r.now().line] ? n(d) : l ? T(d) : M(d));
    }
    return d === 45 || we(d) ? (e.consume(d), a += String.fromCharCode(d), A) : n(d);
  }
  function b(d) {
    return d === 62 ? (e.consume(d), r.interrupt ? t : P) : n(d);
  }
  function T(d) {
    return G(d) ? (e.consume(d), T) : j(d);
  }
  function M(d) {
    return d === 47 ? (e.consume(d), j) : d === 58 || d === 95 || Me(d) ? (e.consume(d), R) : G(d) ? (e.consume(d), M) : j(d);
  }
  function R(d) {
    return d === 45 || d === 46 || d === 58 || d === 95 || we(d) ? (e.consume(d), R) : _(d);
  }
  function _(d) {
    return d === 61 ? (e.consume(d), y) : G(d) ? (e.consume(d), _) : M(d);
  }
  function y(d) {
    return d === null || d === 60 || d === 61 || d === 62 || d === 96 ? n(d) : d === 34 || d === 39 ? (e.consume(d), c = d, z) : G(d) ? (e.consume(d), y) : L(d);
  }
  function z(d) {
    return d === c ? (e.consume(d), c = null, B) : d === null || H(d) ? n(d) : (e.consume(d), z);
  }
  function L(d) {
    return d === null || d === 34 || d === 39 || d === 47 || d === 60 || d === 61 || d === 62 || d === 96 || ge(d) ? _(d) : (e.consume(d), L);
  }
  function B(d) {
    return d === 47 || d === 62 || G(d) ? M(d) : n(d);
  }
  function j(d) {
    return d === 62 ? (e.consume(d), F) : n(d);
  }
  function F(d) {
    return d === null || H(d) ? P(d) : G(d) ? (e.consume(d), F) : n(d);
  }
  function P(d) {
    return d === 45 && i === 2 ? (e.consume(d), D) : d === 60 && i === 1 ? (e.consume(d), X) : d === 62 && i === 4 ? (e.consume(d), N) : d === 63 && i === 3 ? (e.consume(d), m) : d === 93 && i === 5 ? (e.consume(d), W) : H(d) && (i === 6 || i === 7) ? (e.exit("htmlFlowData"), e.check(ho, Y, q)(d)) : d === null || H(d) ? (e.exit("htmlFlowData"), q(d)) : (e.consume(d), P);
  }
  function q(d) {
    return e.check(fo, S, Y)(d);
  }
  function S(d) {
    return e.enter("lineEnding"), e.consume(d), e.exit("lineEnding"), E;
  }
  function E(d) {
    return d === null || H(d) ? q(d) : (e.enter("htmlFlowData"), P(d));
  }
  function D(d) {
    return d === 45 ? (e.consume(d), m) : P(d);
  }
  function X(d) {
    return d === 47 ? (e.consume(d), a = "", U) : P(d);
  }
  function U(d) {
    if (d === 62) {
      const J = a.toLowerCase();
      return ir.includes(J) ? (e.consume(d), N) : P(d);
    }
    return Me(d) && a.length < 8 ? (e.consume(d), a += String.fromCharCode(d), U) : P(d);
  }
  function W(d) {
    return d === 93 ? (e.consume(d), m) : P(d);
  }
  function m(d) {
    return d === 62 ? (e.consume(d), N) : d === 45 && i === 2 ? (e.consume(d), m) : P(d);
  }
  function N(d) {
    return d === null || H(d) ? (e.exit("htmlFlowData"), Y(d)) : (e.consume(d), N);
  }
  function Y(d) {
    return e.exit("htmlFlow"), t(d);
  }
}
function go(e, t, n) {
  const r = this;
  return i;
  function i(a) {
    return H(a) ? (e.enter("lineEnding"), e.consume(a), e.exit("lineEnding"), l) : n(a);
  }
  function l(a) {
    return r.parser.lazy[r.now().line] ? n(a) : t(a);
  }
}
function yo(e, t, n) {
  return r;
  function r(i) {
    return e.enter("lineEnding"), e.consume(i), e.exit("lineEnding"), e.attempt(It, t, n);
  }
}
const xo = {
  name: "htmlText",
  tokenize: bo
};
function bo(e, t, n) {
  const r = this;
  let i, l, a;
  return o;
  function o(m) {
    return e.enter("htmlText"), e.enter("htmlTextData"), e.consume(m), c;
  }
  function c(m) {
    return m === 33 ? (e.consume(m), s) : m === 47 ? (e.consume(m), _) : m === 63 ? (e.consume(m), M) : Me(m) ? (e.consume(m), L) : n(m);
  }
  function s(m) {
    return m === 45 ? (e.consume(m), u) : m === 91 ? (e.consume(m), l = 0, w) : Me(m) ? (e.consume(m), T) : n(m);
  }
  function u(m) {
    return m === 45 ? (e.consume(m), f) : n(m);
  }
  function h(m) {
    return m === null ? n(m) : m === 45 ? (e.consume(m), p) : H(m) ? (a = h, X(m)) : (e.consume(m), h);
  }
  function p(m) {
    return m === 45 ? (e.consume(m), f) : h(m);
  }
  function f(m) {
    return m === 62 ? D(m) : m === 45 ? p(m) : h(m);
  }
  function w(m) {
    const N = "CDATA[";
    return m === N.charCodeAt(l++) ? (e.consume(m), l === N.length ? k : w) : n(m);
  }
  function k(m) {
    return m === null ? n(m) : m === 93 ? (e.consume(m), A) : H(m) ? (a = k, X(m)) : (e.consume(m), k);
  }
  function A(m) {
    return m === 93 ? (e.consume(m), b) : k(m);
  }
  function b(m) {
    return m === 62 ? D(m) : m === 93 ? (e.consume(m), b) : k(m);
  }
  function T(m) {
    return m === null || m === 62 ? D(m) : H(m) ? (a = T, X(m)) : (e.consume(m), T);
  }
  function M(m) {
    return m === null ? n(m) : m === 63 ? (e.consume(m), R) : H(m) ? (a = M, X(m)) : (e.consume(m), M);
  }
  function R(m) {
    return m === 62 ? D(m) : M(m);
  }
  function _(m) {
    return Me(m) ? (e.consume(m), y) : n(m);
  }
  function y(m) {
    return m === 45 || we(m) ? (e.consume(m), y) : z(m);
  }
  function z(m) {
    return H(m) ? (a = z, X(m)) : G(m) ? (e.consume(m), z) : D(m);
  }
  function L(m) {
    return m === 45 || we(m) ? (e.consume(m), L) : m === 47 || m === 62 || ge(m) ? B(m) : n(m);
  }
  function B(m) {
    return m === 47 ? (e.consume(m), D) : m === 58 || m === 95 || Me(m) ? (e.consume(m), j) : H(m) ? (a = B, X(m)) : G(m) ? (e.consume(m), B) : D(m);
  }
  function j(m) {
    return m === 45 || m === 46 || m === 58 || m === 95 || we(m) ? (e.consume(m), j) : F(m);
  }
  function F(m) {
    return m === 61 ? (e.consume(m), P) : H(m) ? (a = F, X(m)) : G(m) ? (e.consume(m), F) : B(m);
  }
  function P(m) {
    return m === null || m === 60 || m === 61 || m === 62 || m === 96 ? n(m) : m === 34 || m === 39 ? (e.consume(m), i = m, q) : H(m) ? (a = P, X(m)) : G(m) ? (e.consume(m), P) : (e.consume(m), S);
  }
  function q(m) {
    return m === i ? (e.consume(m), i = void 0, E) : m === null ? n(m) : H(m) ? (a = q, X(m)) : (e.consume(m), q);
  }
  function S(m) {
    return m === null || m === 34 || m === 39 || m === 60 || m === 61 || m === 96 ? n(m) : m === 47 || m === 62 || ge(m) ? B(m) : (e.consume(m), S);
  }
  function E(m) {
    return m === 47 || m === 62 || ge(m) ? B(m) : n(m);
  }
  function D(m) {
    return m === 62 ? (e.consume(m), e.exit("htmlTextData"), e.exit("htmlText"), t) : n(m);
  }
  function X(m) {
    return e.exit("htmlTextData"), e.enter("lineEnding"), e.consume(m), e.exit("lineEnding"), U;
  }
  function U(m) {
    return G(m) ? te(e, W, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(m) : W(m);
  }
  function W(m) {
    return e.enter("htmlTextData"), a(m);
  }
}
const Cn = {
  name: "labelEnd",
  resolveAll: vo,
  resolveTo: Eo,
  tokenize: So
}, wo = {
  tokenize: Ao
}, ko = {
  tokenize: Io
}, Co = {
  tokenize: Mo
};
function vo(e) {
  let t = -1;
  const n = [];
  for (; ++t < e.length; ) {
    const r = e[t][1];
    if (n.push(e[t]), r.type === "labelImage" || r.type === "labelLink" || r.type === "labelEnd") {
      const i = r.type === "labelImage" ? 4 : 2;
      r.type = "data", t += i;
    }
  }
  return e.length !== n.length && Le(e, 0, e.length, n), e;
}
function Eo(e, t) {
  let n = e.length, r = 0, i, l, a, o;
  for (; n--; )
    if (i = e[n][1], l) {
      if (i.type === "link" || i.type === "labelLink" && i._inactive)
        break;
      e[n][0] === "enter" && i.type === "labelLink" && (i._inactive = !0);
    } else if (a) {
      if (e[n][0] === "enter" && (i.type === "labelImage" || i.type === "labelLink") && !i._balanced && (l = n, i.type !== "labelLink")) {
        r = 2;
        break;
      }
    } else i.type === "labelEnd" && (a = n);
  const c = {
    type: e[l][1].type === "labelLink" ? "link" : "image",
    start: {
      ...e[l][1].start
    },
    end: {
      ...e[e.length - 1][1].end
    }
  }, s = {
    type: "label",
    start: {
      ...e[l][1].start
    },
    end: {
      ...e[a][1].end
    }
  }, u = {
    type: "labelText",
    start: {
      ...e[l + r + 2][1].end
    },
    end: {
      ...e[a - 2][1].start
    }
  };
  return o = [["enter", c, t], ["enter", s, t]], o = Ce(o, e.slice(l + 1, l + r + 3)), o = Ce(o, [["enter", u, t]]), o = Ce(o, kn(t.parser.constructs.insideSpan.null, e.slice(l + r + 4, a - 3), t)), o = Ce(o, [["exit", u, t], e[a - 2], e[a - 1], ["exit", s, t]]), o = Ce(o, e.slice(a + 1)), o = Ce(o, [["exit", c, t]]), Le(e, l, e.length, o), e;
}
function So(e, t, n) {
  const r = this;
  let i = r.events.length, l, a;
  for (; i--; )
    if ((r.events[i][1].type === "labelImage" || r.events[i][1].type === "labelLink") && !r.events[i][1]._balanced) {
      l = r.events[i][1];
      break;
    }
  return o;
  function o(p) {
    return l ? l._inactive ? h(p) : (a = r.parser.defined.includes(Xe(r.sliceSerialize({
      start: l.end,
      end: r.now()
    }))), e.enter("labelEnd"), e.enter("labelMarker"), e.consume(p), e.exit("labelMarker"), e.exit("labelEnd"), c) : n(p);
  }
  function c(p) {
    return p === 40 ? e.attempt(wo, u, a ? u : h)(p) : p === 91 ? e.attempt(ko, u, a ? s : h)(p) : a ? u(p) : h(p);
  }
  function s(p) {
    return e.attempt(Co, u, h)(p);
  }
  function u(p) {
    return t(p);
  }
  function h(p) {
    return l._balanced = !0, n(p);
  }
}
function Ao(e, t, n) {
  return r;
  function r(h) {
    return e.enter("resource"), e.enter("resourceMarker"), e.consume(h), e.exit("resourceMarker"), i;
  }
  function i(h) {
    return ge(h) ? at(e, l)(h) : l(h);
  }
  function l(h) {
    return h === 41 ? u(h) : Jr(e, a, o, "resourceDestination", "resourceDestinationLiteral", "resourceDestinationLiteralMarker", "resourceDestinationRaw", "resourceDestinationString", 32)(h);
  }
  function a(h) {
    return ge(h) ? at(e, c)(h) : u(h);
  }
  function o(h) {
    return n(h);
  }
  function c(h) {
    return h === 34 || h === 39 || h === 40 ? Gr(e, s, n, "resourceTitle", "resourceTitleMarker", "resourceTitleString")(h) : u(h);
  }
  function s(h) {
    return ge(h) ? at(e, u)(h) : u(h);
  }
  function u(h) {
    return h === 41 ? (e.enter("resourceMarker"), e.consume(h), e.exit("resourceMarker"), e.exit("resource"), t) : n(h);
  }
}
function Io(e, t, n) {
  const r = this;
  return i;
  function i(o) {
    return Qr.call(r, e, l, a, "reference", "referenceMarker", "referenceString")(o);
  }
  function l(o) {
    return r.parser.defined.includes(Xe(r.sliceSerialize(r.events[r.events.length - 1][1]).slice(1, -1))) ? t(o) : n(o);
  }
  function a(o) {
    return n(o);
  }
}
function Mo(e, t, n) {
  return r;
  function r(l) {
    return e.enter("reference"), e.enter("referenceMarker"), e.consume(l), e.exit("referenceMarker"), i;
  }
  function i(l) {
    return l === 93 ? (e.enter("referenceMarker"), e.consume(l), e.exit("referenceMarker"), e.exit("reference"), t) : n(l);
  }
}
const To = {
  name: "labelStartImage",
  resolveAll: Cn.resolveAll,
  tokenize: Lo
};
function Lo(e, t, n) {
  const r = this;
  return i;
  function i(o) {
    return e.enter("labelImage"), e.enter("labelImageMarker"), e.consume(o), e.exit("labelImageMarker"), l;
  }
  function l(o) {
    return o === 91 ? (e.enter("labelMarker"), e.consume(o), e.exit("labelMarker"), e.exit("labelImage"), a) : n(o);
  }
  function a(o) {
    return o === 94 && "_hiddenFootnoteSupport" in r.parser.constructs ? n(o) : t(o);
  }
}
const Fo = {
  name: "labelStartLink",
  resolveAll: Cn.resolveAll,
  tokenize: Po
};
function Po(e, t, n) {
  const r = this;
  return i;
  function i(a) {
    return e.enter("labelLink"), e.enter("labelMarker"), e.consume(a), e.exit("labelMarker"), e.exit("labelLink"), l;
  }
  function l(a) {
    return a === 94 && "_hiddenFootnoteSupport" in r.parser.constructs ? n(a) : t(a);
  }
}
const Ht = {
  name: "lineEnding",
  tokenize: zo
};
function zo(e, t) {
  return n;
  function n(r) {
    return e.enter("lineEnding"), e.consume(r), e.exit("lineEnding"), te(e, t, "linePrefix");
  }
}
const Ct = {
  name: "thematicBreak",
  tokenize: No
};
function No(e, t, n) {
  let r = 0, i;
  return l;
  function l(s) {
    return e.enter("thematicBreak"), a(s);
  }
  function a(s) {
    return i = s, o(s);
  }
  function o(s) {
    return s === i ? (e.enter("thematicBreakSequence"), c(s)) : r >= 3 && (s === null || H(s)) ? (e.exit("thematicBreak"), t(s)) : n(s);
  }
  function c(s) {
    return s === i ? (e.consume(s), r++, c) : (e.exit("thematicBreakSequence"), G(s) ? te(e, o, "whitespace")(s) : o(s));
  }
}
const de = {
  continuation: {
    tokenize: Oo
  },
  exit: _o,
  name: "list",
  tokenize: Bo
}, Do = {
  partial: !0,
  tokenize: Ho
}, Vo = {
  partial: !0,
  tokenize: Ro
};
function Bo(e, t, n) {
  const r = this, i = r.events[r.events.length - 1];
  let l = i && i[1].type === "linePrefix" ? i[2].sliceSerialize(i[1], !0).length : 0, a = 0;
  return o;
  function o(f) {
    const w = r.containerState.type || (f === 42 || f === 43 || f === 45 ? "listUnordered" : "listOrdered");
    if (w === "listUnordered" ? !r.containerState.marker || f === r.containerState.marker : rn(f)) {
      if (r.containerState.type || (r.containerState.type = w, e.enter(w, {
        _container: !0
      })), w === "listUnordered")
        return e.enter("listItemPrefix"), f === 42 || f === 45 ? e.check(Ct, n, s)(f) : s(f);
      if (!r.interrupt || f === 49)
        return e.enter("listItemPrefix"), e.enter("listItemValue"), c(f);
    }
    return n(f);
  }
  function c(f) {
    return rn(f) && ++a < 10 ? (e.consume(f), c) : (!r.interrupt || a < 2) && (r.containerState.marker ? f === r.containerState.marker : f === 41 || f === 46) ? (e.exit("listItemValue"), s(f)) : n(f);
  }
  function s(f) {
    return e.enter("listItemMarker"), e.consume(f), e.exit("listItemMarker"), r.containerState.marker = r.containerState.marker || f, e.check(
      It,
      // Can’t be empty when interrupting.
      r.interrupt ? n : u,
      e.attempt(Do, p, h)
    );
  }
  function u(f) {
    return r.containerState.initialBlankLine = !0, l++, p(f);
  }
  function h(f) {
    return G(f) ? (e.enter("listItemPrefixWhitespace"), e.consume(f), e.exit("listItemPrefixWhitespace"), p) : n(f);
  }
  function p(f) {
    return r.containerState.size = l + r.sliceSerialize(e.exit("listItemPrefix"), !0).length, t(f);
  }
}
function Oo(e, t, n) {
  const r = this;
  return r.containerState._closeFlow = void 0, e.check(It, i, l);
  function i(o) {
    return r.containerState.furtherBlankLines = r.containerState.furtherBlankLines || r.containerState.initialBlankLine, te(e, t, "listItemIndent", r.containerState.size + 1)(o);
  }
  function l(o) {
    return r.containerState.furtherBlankLines || !G(o) ? (r.containerState.furtherBlankLines = void 0, r.containerState.initialBlankLine = void 0, a(o)) : (r.containerState.furtherBlankLines = void 0, r.containerState.initialBlankLine = void 0, e.attempt(Vo, t, a)(o));
  }
  function a(o) {
    return r.containerState._closeFlow = !0, r.interrupt = void 0, te(e, e.attempt(de, t, n), "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(o);
  }
}
function Ro(e, t, n) {
  const r = this;
  return te(e, i, "listItemIndent", r.containerState.size + 1);
  function i(l) {
    const a = r.events[r.events.length - 1];
    return a && a[1].type === "listItemIndent" && a[2].sliceSerialize(a[1], !0).length === r.containerState.size ? t(l) : n(l);
  }
}
function _o(e) {
  e.exit(this.containerState.type);
}
function Ho(e, t, n) {
  const r = this;
  return te(e, i, "listItemPrefixWhitespace", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 5);
  function i(l) {
    const a = r.events[r.events.length - 1];
    return !G(l) && a && a[1].type === "listItemPrefixWhitespace" ? t(l) : n(l);
  }
}
const lr = {
  name: "setextUnderline",
  resolveTo: jo,
  tokenize: Zo
};
function jo(e, t) {
  let n = e.length, r, i, l;
  for (; n--; )
    if (e[n][0] === "enter") {
      if (e[n][1].type === "content") {
        r = n;
        break;
      }
      e[n][1].type === "paragraph" && (i = n);
    } else
      e[n][1].type === "content" && e.splice(n, 1), !l && e[n][1].type === "definition" && (l = n);
  const a = {
    type: "setextHeading",
    start: {
      ...e[r][1].start
    },
    end: {
      ...e[e.length - 1][1].end
    }
  };
  return e[i][1].type = "setextHeadingText", l ? (e.splice(i, 0, ["enter", a, t]), e.splice(l + 1, 0, ["exit", e[r][1], t]), e[r][1].end = {
    ...e[l][1].end
  }) : e[r][1] = a, e.push(["exit", a, t]), e;
}
function Zo(e, t, n) {
  const r = this;
  let i;
  return l;
  function l(s) {
    let u = r.events.length, h;
    for (; u--; )
      if (r.events[u][1].type !== "lineEnding" && r.events[u][1].type !== "linePrefix" && r.events[u][1].type !== "content") {
        h = r.events[u][1].type === "paragraph";
        break;
      }
    return !r.parser.lazy[r.now().line] && (r.interrupt || h) ? (e.enter("setextHeadingLine"), i = s, a(s)) : n(s);
  }
  function a(s) {
    return e.enter("setextHeadingLineSequence"), o(s);
  }
  function o(s) {
    return s === i ? (e.consume(s), o) : (e.exit("setextHeadingLineSequence"), G(s) ? te(e, c, "lineSuffix")(s) : c(s));
  }
  function c(s) {
    return s === null || H(s) ? (e.exit("setextHeadingLine"), t(s)) : n(s);
  }
}
const Uo = {
  tokenize: $o
};
function $o(e) {
  const t = this, n = e.attempt(
    // Try to parse a blank line.
    It,
    r,
    // Try to parse initial flow (essentially, only code).
    e.attempt(this.parser.constructs.flowInitial, i, te(e, e.attempt(this.parser.constructs.flow, i, e.attempt(Ya, i)), "linePrefix"))
  );
  return n;
  function r(l) {
    if (l === null) {
      e.consume(l);
      return;
    }
    return e.enter("lineEndingBlank"), e.consume(l), e.exit("lineEndingBlank"), t.currentConstruct = void 0, n;
  }
  function i(l) {
    if (l === null) {
      e.consume(l);
      return;
    }
    return e.enter("lineEnding"), e.consume(l), e.exit("lineEnding"), t.currentConstruct = void 0, n;
  }
}
const qo = {
  resolveAll: ei()
}, Wo = Kr("string"), Xo = Kr("text");
function Kr(e) {
  return {
    resolveAll: ei(e === "text" ? Yo : void 0),
    tokenize: t
  };
  function t(n) {
    const r = this, i = this.parser.constructs[e], l = n.attempt(i, a, o);
    return a;
    function a(u) {
      return s(u) ? l(u) : o(u);
    }
    function o(u) {
      if (u === null) {
        n.consume(u);
        return;
      }
      return n.enter("data"), n.consume(u), c;
    }
    function c(u) {
      return s(u) ? (n.exit("data"), l(u)) : (n.consume(u), c);
    }
    function s(u) {
      if (u === null)
        return !0;
      const h = i[u];
      let p = -1;
      if (h)
        for (; ++p < h.length; ) {
          const f = h[p];
          if (!f.previous || f.previous.call(r, r.previous))
            return !0;
        }
      return !1;
    }
  }
}
function ei(e) {
  return t;
  function t(n, r) {
    let i = -1, l;
    for (; ++i <= n.length; )
      l === void 0 ? n[i] && n[i][1].type === "data" && (l = i, i++) : (!n[i] || n[i][1].type !== "data") && (i !== l + 2 && (n[l][1].end = n[i - 1][1].end, n.splice(l + 2, i - l - 2), i = l + 2), l = void 0);
    return e ? e(n, r) : n;
  }
}
function Yo(e, t) {
  let n = 0;
  for (; ++n <= e.length; )
    if ((n === e.length || e[n][1].type === "lineEnding") && e[n - 1][1].type === "data") {
      const r = e[n - 1][1], i = t.sliceStream(r);
      let l = i.length, a = -1, o = 0, c;
      for (; l--; ) {
        const s = i[l];
        if (typeof s == "string") {
          for (a = s.length; s.charCodeAt(a - 1) === 32; )
            o++, a--;
          if (a) break;
          a = -1;
        } else if (s === -2)
          c = !0, o++;
        else if (s !== -1) {
          l++;
          break;
        }
      }
      if (t._contentTypeTextTrailing && n === e.length && (o = 0), o) {
        const s = {
          type: n === e.length || c || o < 2 ? "lineSuffix" : "hardBreakTrailing",
          start: {
            _bufferIndex: l ? a : r.start._bufferIndex + a,
            _index: r.start._index + l,
            line: r.end.line,
            column: r.end.column - o,
            offset: r.end.offset - o
          },
          end: {
            ...r.end
          }
        };
        r.end = {
          ...s.start
        }, r.start.offset === r.end.offset ? Object.assign(r, s) : (e.splice(n, 0, ["enter", s, t], ["exit", s, t]), n += 2);
      }
      n++;
    }
  return e;
}
const Jo = {
  42: de,
  43: de,
  45: de,
  48: de,
  49: de,
  50: de,
  51: de,
  52: de,
  53: de,
  54: de,
  55: de,
  56: de,
  57: de,
  62: qr
}, Qo = {
  91: eo
}, Go = {
  [-2]: _t,
  [-1]: _t,
  32: _t
}, Ko = {
  35: ao,
  42: Ct,
  45: [lr, Ct],
  60: co,
  61: lr,
  95: Ct,
  96: rr,
  126: rr
}, es = {
  38: Xr,
  92: Wr
}, ts = {
  [-5]: Ht,
  [-4]: Ht,
  [-3]: Ht,
  33: To,
  38: Xr,
  42: ln,
  60: [La, xo],
  91: Fo,
  92: [io, Wr],
  93: Cn,
  95: ln,
  96: Za
}, ns = {
  null: [ln, qo]
}, rs = {
  null: [42, 95]
}, is = {
  null: []
}, ls = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  attentionMarkers: rs,
  contentInitial: Qo,
  disable: is,
  document: Jo,
  flow: Ko,
  flowInitial: Go,
  insideSpan: ns,
  string: es,
  text: ts
}, Symbol.toStringTag, { value: "Module" }));
function as(e, t, n) {
  let r = {
    _bufferIndex: -1,
    _index: 0,
    line: n && n.line || 1,
    column: n && n.column || 1,
    offset: n && n.offset || 0
  };
  const i = {}, l = [];
  let a = [], o = [];
  const c = {
    attempt: z(_),
    check: z(y),
    consume: T,
    enter: M,
    exit: R,
    interrupt: z(y, {
      interrupt: !0
    })
  }, s = {
    code: null,
    containerState: {},
    defineSkip: k,
    events: [],
    now: w,
    parser: e,
    previous: null,
    sliceSerialize: p,
    sliceStream: f,
    write: h
  };
  let u = t.tokenize.call(s, c);
  return t.resolveAll && l.push(t), s;
  function h(F) {
    return a = Ce(a, F), A(), a[a.length - 1] !== null ? [] : (L(t, 0), s.events = kn(l, s.events, s), s.events);
  }
  function p(F, P) {
    return ss(f(F), P);
  }
  function f(F) {
    return os(a, F);
  }
  function w() {
    const {
      _bufferIndex: F,
      _index: P,
      line: q,
      column: S,
      offset: E
    } = r;
    return {
      _bufferIndex: F,
      _index: P,
      line: q,
      column: S,
      offset: E
    };
  }
  function k(F) {
    i[F.line] = F.column, j();
  }
  function A() {
    let F;
    for (; r._index < a.length; ) {
      const P = a[r._index];
      if (typeof P == "string")
        for (F = r._index, r._bufferIndex < 0 && (r._bufferIndex = 0); r._index === F && r._bufferIndex < P.length; )
          b(P.charCodeAt(r._bufferIndex));
      else
        b(P);
    }
  }
  function b(F) {
    u = u(F);
  }
  function T(F) {
    H(F) ? (r.line++, r.column = 1, r.offset += F === -3 ? 2 : 1, j()) : F !== -1 && (r.column++, r.offset++), r._bufferIndex < 0 ? r._index++ : (r._bufferIndex++, r._bufferIndex === // Points w/ non-negative `_bufferIndex` reference
    // strings.
    /** @type {string} */
    a[r._index].length && (r._bufferIndex = -1, r._index++)), s.previous = F;
  }
  function M(F, P) {
    const q = P || {};
    return q.type = F, q.start = w(), s.events.push(["enter", q, s]), o.push(q), q;
  }
  function R(F) {
    const P = o.pop();
    return P.end = w(), s.events.push(["exit", P, s]), P;
  }
  function _(F, P) {
    L(F, P.from);
  }
  function y(F, P) {
    P.restore();
  }
  function z(F, P) {
    return q;
    function q(S, E, D) {
      let X, U, W, m;
      return Array.isArray(S) ? (
        /* c8 ignore next 1 */
        Y(S)
      ) : "tokenize" in S ? (
        // Looks like a construct.
        Y([
          /** @type {Construct} */
          S
        ])
      ) : N(S);
      function N(Q) {
        return ce;
        function ce(ie) {
          const ke = ie !== null && Q[ie], xe = ie !== null && Q.null, ve = [
            // To do: add more extension tests.
            /* c8 ignore next 2 */
            ...Array.isArray(ke) ? ke : ke ? [ke] : [],
            ...Array.isArray(xe) ? xe : xe ? [xe] : []
          ];
          return Y(ve)(ie);
        }
      }
      function Y(Q) {
        return X = Q, U = 0, Q.length === 0 ? D : d(Q[U]);
      }
      function d(Q) {
        return ce;
        function ce(ie) {
          return m = B(), W = Q, Q.partial || (s.currentConstruct = Q), Q.name && s.parser.constructs.disable.null.includes(Q.name) ? ae() : Q.tokenize.call(
            // If we do have fields, create an object w/ `context` as its
            // prototype.
            // This allows a “live binding”, which is needed for `interrupt`.
            P ? Object.assign(Object.create(s), P) : s,
            c,
            J,
            ae
          )(ie);
        }
      }
      function J(Q) {
        return F(W, m), E;
      }
      function ae(Q) {
        return m.restore(), ++U < X.length ? d(X[U]) : D;
      }
    }
  }
  function L(F, P) {
    F.resolveAll && !l.includes(F) && l.push(F), F.resolve && Le(s.events, P, s.events.length - P, F.resolve(s.events.slice(P), s)), F.resolveTo && (s.events = F.resolveTo(s.events, s));
  }
  function B() {
    const F = w(), P = s.previous, q = s.currentConstruct, S = s.events.length, E = Array.from(o);
    return {
      from: S,
      restore: D
    };
    function D() {
      r = F, s.previous = P, s.currentConstruct = q, s.events.length = S, o = E, j();
    }
  }
  function j() {
    r.line in i && r.column < 2 && (r.column = i[r.line], r.offset += i[r.line] - 1);
  }
}
function os(e, t) {
  const n = t.start._index, r = t.start._bufferIndex, i = t.end._index, l = t.end._bufferIndex;
  let a;
  if (n === i)
    a = [e[n].slice(r, l)];
  else {
    if (a = e.slice(n, i), r > -1) {
      const o = a[0];
      typeof o == "string" ? a[0] = o.slice(r) : a.shift();
    }
    l > 0 && a.push(e[i].slice(0, l));
  }
  return a;
}
function ss(e, t) {
  let n = -1;
  const r = [];
  let i;
  for (; ++n < e.length; ) {
    const l = e[n];
    let a;
    if (typeof l == "string")
      a = l;
    else switch (l) {
      case -5: {
        a = "\r";
        break;
      }
      case -4: {
        a = `
`;
        break;
      }
      case -3: {
        a = `\r
`;
        break;
      }
      case -2: {
        a = t ? " " : "	";
        break;
      }
      case -1: {
        if (!t && i) continue;
        a = " ";
        break;
      }
      default:
        a = String.fromCharCode(l);
    }
    i = l === -2, r.push(a);
  }
  return r.join("");
}
function us(e) {
  const r = {
    constructs: (
      /** @type {FullNormalizedExtension} */
      ma([ls, ...(e || {}).extensions || []])
    ),
    content: i(va),
    defined: [],
    document: i(Sa),
    flow: i(Uo),
    lazy: {},
    string: i(Wo),
    text: i(Xo)
  };
  return r;
  function i(l) {
    return a;
    function a(o) {
      return as(r, l, o);
    }
  }
}
function cs(e) {
  for (; !Yr(e); )
    ;
  return e;
}
const ar = /[\0\t\n\r]/g;
function hs() {
  let e = 1, t = "", n = !0, r;
  return i;
  function i(l, a, o) {
    const c = [];
    let s, u, h, p, f;
    for (l = t + (typeof l == "string" ? l.toString() : new TextDecoder(a || void 0).decode(l)), h = 0, t = "", n && (l.charCodeAt(0) === 65279 && h++, n = void 0); h < l.length; ) {
      if (ar.lastIndex = h, s = ar.exec(l), p = s && s.index !== void 0 ? s.index : l.length, f = l.charCodeAt(p), !s) {
        t = l.slice(h);
        break;
      }
      if (f === 10 && h === p && r)
        c.push(-3), r = void 0;
      else
        switch (r && (c.push(-5), r = void 0), h < p && (c.push(l.slice(h, p)), e += p - h), f) {
          case 0: {
            c.push(65533), e++;
            break;
          }
          case 9: {
            for (u = Math.ceil(e / 4) * 4, c.push(-2); e++ < u; ) c.push(-1);
            break;
          }
          case 10: {
            c.push(-4), e = 1;
            break;
          }
          default:
            r = !0, e = 1;
        }
      h = p + 1;
    }
    return o && (r && c.push(-5), t && c.push(t), c.push(null)), c;
  }
}
const fs = /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;
function ps(e) {
  return e.replace(fs, ds);
}
function ds(e, t, n) {
  if (t)
    return t;
  if (n.charCodeAt(0) === 35) {
    const i = n.charCodeAt(1), l = i === 120 || i === 88;
    return $r(n.slice(l ? 2 : 1), l ? 16 : 10);
  }
  return wn(n) || e;
}
const ti = {}.hasOwnProperty;
function ms(e, t, n) {
  return typeof t != "string" && (n = t, t = void 0), gs(n)(cs(us(n).document().write(hs()(e, t, !0))));
}
function gs(e) {
  const t = {
    transforms: [],
    canContainEols: ["emphasis", "fragment", "heading", "paragraph", "strong"],
    enter: {
      autolink: l(je),
      autolinkProtocol: B,
      autolinkEmail: B,
      atxHeading: l(ft),
      blockQuote: l(xe),
      characterEscape: B,
      characterReference: B,
      codeFenced: l(ve),
      codeFencedFenceInfo: a,
      codeFencedFenceMeta: a,
      codeIndented: l(ve, a),
      codeText: l(Oe, a),
      codeTextData: B,
      data: B,
      codeFlowValue: B,
      definition: l(ht),
      definitionDestinationString: a,
      definitionLabelString: a,
      definitionTitleString: a,
      emphasis: l(Lt),
      hardBreakEscape: l(pt),
      hardBreakTrailing: l(pt),
      htmlFlow: l(dt, a),
      htmlFlowData: B,
      htmlText: l(dt, a),
      htmlTextData: B,
      image: l(Qe),
      label: a,
      link: l(je),
      listItem: l(Ft),
      listItemValue: p,
      listOrdered: l(mt, h),
      listUnordered: l(mt),
      paragraph: l(Ge),
      reference: d,
      referenceString: a,
      resourceDestinationString: a,
      resourceTitleString: a,
      setextHeading: l(ft),
      strong: l(Ze),
      thematicBreak: l(Ue)
    },
    exit: {
      atxHeading: c(),
      atxHeadingSequence: _,
      autolink: c(),
      autolinkEmail: ke,
      autolinkProtocol: ie,
      blockQuote: c(),
      characterEscapeValue: j,
      characterReferenceMarkerHexadecimal: ae,
      characterReferenceMarkerNumeric: ae,
      characterReferenceValue: Q,
      characterReference: ce,
      codeFenced: c(A),
      codeFencedFence: k,
      codeFencedFenceInfo: f,
      codeFencedFenceMeta: w,
      codeFlowValue: j,
      codeIndented: c(b),
      codeText: c(E),
      codeTextData: j,
      data: j,
      definition: c(),
      definitionDestinationString: R,
      definitionLabelString: T,
      definitionTitleString: M,
      emphasis: c(),
      hardBreakEscape: c(P),
      hardBreakTrailing: c(P),
      htmlFlow: c(q),
      htmlFlowData: j,
      htmlText: c(S),
      htmlTextData: j,
      image: c(X),
      label: W,
      labelText: U,
      lineEnding: F,
      link: c(D),
      listItem: c(),
      listOrdered: c(),
      listUnordered: c(),
      paragraph: c(),
      referenceString: J,
      resourceDestinationString: m,
      resourceTitleString: N,
      resource: Y,
      setextHeading: c(L),
      setextHeadingLineSequence: z,
      setextHeadingText: y,
      strong: c(),
      thematicBreak: c()
    }
  };
  ni(t, (e || {}).mdastExtensions || []);
  const n = {};
  return r;
  function r(x) {
    let I = {
      type: "root",
      children: []
    };
    const O = {
      stack: [I],
      tokenStack: [],
      config: t,
      enter: o,
      exit: s,
      buffer: a,
      resume: u,
      data: n
    }, $ = [];
    let K = -1;
    for (; ++K < x.length; )
      if (x[K][1].type === "listOrdered" || x[K][1].type === "listUnordered")
        if (x[K][0] === "enter")
          $.push(K);
        else {
          const he = $.pop();
          K = i(x, he, K);
        }
    for (K = -1; ++K < x.length; ) {
      const he = t[x[K][0]];
      ti.call(he, x[K][1].type) && he[x[K][1].type].call(Object.assign({
        sliceSerialize: x[K][2].sliceSerialize
      }, O), x[K][1]);
    }
    if (O.tokenStack.length > 0) {
      const he = O.tokenStack[O.tokenStack.length - 1];
      (he[1] || or).call(O, void 0, he[0]);
    }
    for (I.position = {
      start: De(x.length > 0 ? x[0][1].start : {
        line: 1,
        column: 1,
        offset: 0
      }),
      end: De(x.length > 0 ? x[x.length - 2][1].end : {
        line: 1,
        column: 1,
        offset: 0
      })
    }, K = -1; ++K < t.transforms.length; )
      I = t.transforms[K](I) || I;
    return I;
  }
  function i(x, I, O) {
    let $ = I - 1, K = -1, he = !1, Fe, Ee, _e, Pe;
    for (; ++$ <= O; ) {
      const fe = x[$];
      switch (fe[1].type) {
        case "listUnordered":
        case "listOrdered":
        case "blockQuote": {
          fe[0] === "enter" ? K++ : K--, Pe = void 0;
          break;
        }
        case "lineEndingBlank": {
          fe[0] === "enter" && (Fe && !Pe && !K && !_e && (_e = $), Pe = void 0);
          break;
        }
        case "linePrefix":
        case "listItemValue":
        case "listItemMarker":
        case "listItemPrefix":
        case "listItemPrefixWhitespace":
          break;
        default:
          Pe = void 0;
      }
      if (!K && fe[0] === "enter" && fe[1].type === "listItemPrefix" || K === -1 && fe[0] === "exit" && (fe[1].type === "listUnordered" || fe[1].type === "listOrdered")) {
        if (Fe) {
          let Ne = $;
          for (Ee = void 0; Ne--; ) {
            const Se = x[Ne];
            if (Se[1].type === "lineEnding" || Se[1].type === "lineEndingBlank") {
              if (Se[0] === "exit") continue;
              Ee && (x[Ee][1].type = "lineEndingBlank", he = !0), Se[1].type = "lineEnding", Ee = Ne;
            } else if (!(Se[1].type === "linePrefix" || Se[1].type === "blockQuotePrefix" || Se[1].type === "blockQuotePrefixWhitespace" || Se[1].type === "blockQuoteMarker" || Se[1].type === "listItemIndent")) break;
          }
          _e && (!Ee || _e < Ee) && (Fe._spread = !0), Fe.end = Object.assign({}, Ee ? x[Ee][1].start : fe[1].end), x.splice(Ee || $, 0, ["exit", Fe, fe[2]]), $++, O++;
        }
        if (fe[1].type === "listItemPrefix") {
          const Ne = {
            type: "listItem",
            _spread: !1,
            start: Object.assign({}, fe[1].start),
            // @ts-expect-error: we’ll add `end` in a second.
            end: void 0
          };
          Fe = Ne, x.splice($, 0, ["enter", Ne, fe[2]]), $++, O++, _e = void 0, Pe = !0;
        }
      }
    }
    return x[I][1]._spread = he, O;
  }
  function l(x, I) {
    return O;
    function O($) {
      o.call(this, x($), $), I && I.call(this, $);
    }
  }
  function a() {
    this.stack.push({
      type: "fragment",
      children: []
    });
  }
  function o(x, I, O) {
    this.stack[this.stack.length - 1].children.push(x), this.stack.push(x), this.tokenStack.push([I, O || void 0]), x.position = {
      start: De(I.start),
      // @ts-expect-error: `end` will be patched later.
      end: void 0
    };
  }
  function c(x) {
    return I;
    function I(O) {
      x && x.call(this, O), s.call(this, O);
    }
  }
  function s(x, I) {
    const O = this.stack.pop(), $ = this.tokenStack.pop();
    if ($)
      $[0].type !== x.type && (I ? I.call(this, x, $[0]) : ($[1] || or).call(this, x, $[0]));
    else throw new Error("Cannot close `" + x.type + "` (" + lt({
      start: x.start,
      end: x.end
    }) + "): it’s not open");
    O.position.end = De(x.end);
  }
  function u() {
    return pa(this.stack.pop());
  }
  function h() {
    this.data.expectingFirstListItemValue = !0;
  }
  function p(x) {
    if (this.data.expectingFirstListItemValue) {
      const I = this.stack[this.stack.length - 2];
      I.start = Number.parseInt(this.sliceSerialize(x), 10), this.data.expectingFirstListItemValue = void 0;
    }
  }
  function f() {
    const x = this.resume(), I = this.stack[this.stack.length - 1];
    I.lang = x;
  }
  function w() {
    const x = this.resume(), I = this.stack[this.stack.length - 1];
    I.meta = x;
  }
  function k() {
    this.data.flowCodeInside || (this.buffer(), this.data.flowCodeInside = !0);
  }
  function A() {
    const x = this.resume(), I = this.stack[this.stack.length - 1];
    I.value = x.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, ""), this.data.flowCodeInside = void 0;
  }
  function b() {
    const x = this.resume(), I = this.stack[this.stack.length - 1];
    I.value = x.replace(/(\r?\n|\r)$/g, "");
  }
  function T(x) {
    const I = this.resume(), O = this.stack[this.stack.length - 1];
    O.label = I, O.identifier = Xe(this.sliceSerialize(x)).toLowerCase();
  }
  function M() {
    const x = this.resume(), I = this.stack[this.stack.length - 1];
    I.title = x;
  }
  function R() {
    const x = this.resume(), I = this.stack[this.stack.length - 1];
    I.url = x;
  }
  function _(x) {
    const I = this.stack[this.stack.length - 1];
    if (!I.depth) {
      const O = this.sliceSerialize(x).length;
      I.depth = O;
    }
  }
  function y() {
    this.data.setextHeadingSlurpLineEnding = !0;
  }
  function z(x) {
    const I = this.stack[this.stack.length - 1];
    I.depth = this.sliceSerialize(x).codePointAt(0) === 61 ? 1 : 2;
  }
  function L() {
    this.data.setextHeadingSlurpLineEnding = void 0;
  }
  function B(x) {
    const O = this.stack[this.stack.length - 1].children;
    let $ = O[O.length - 1];
    (!$ || $.type !== "text") && ($ = Re(), $.position = {
      start: De(x.start),
      // @ts-expect-error: we’ll add `end` later.
      end: void 0
    }, O.push($)), this.stack.push($);
  }
  function j(x) {
    const I = this.stack.pop();
    I.value += this.sliceSerialize(x), I.position.end = De(x.end);
  }
  function F(x) {
    const I = this.stack[this.stack.length - 1];
    if (this.data.atHardBreak) {
      const O = I.children[I.children.length - 1];
      O.position.end = De(x.end), this.data.atHardBreak = void 0;
      return;
    }
    !this.data.setextHeadingSlurpLineEnding && t.canContainEols.includes(I.type) && (B.call(this, x), j.call(this, x));
  }
  function P() {
    this.data.atHardBreak = !0;
  }
  function q() {
    const x = this.resume(), I = this.stack[this.stack.length - 1];
    I.value = x;
  }
  function S() {
    const x = this.resume(), I = this.stack[this.stack.length - 1];
    I.value = x;
  }
  function E() {
    const x = this.resume(), I = this.stack[this.stack.length - 1];
    I.value = x;
  }
  function D() {
    const x = this.stack[this.stack.length - 1];
    if (this.data.inReference) {
      const I = this.data.referenceType || "shortcut";
      x.type += "Reference", x.referenceType = I, delete x.url, delete x.title;
    } else
      delete x.identifier, delete x.label;
    this.data.referenceType = void 0;
  }
  function X() {
    const x = this.stack[this.stack.length - 1];
    if (this.data.inReference) {
      const I = this.data.referenceType || "shortcut";
      x.type += "Reference", x.referenceType = I, delete x.url, delete x.title;
    } else
      delete x.identifier, delete x.label;
    this.data.referenceType = void 0;
  }
  function U(x) {
    const I = this.sliceSerialize(x), O = this.stack[this.stack.length - 2];
    O.label = ps(I), O.identifier = Xe(I).toLowerCase();
  }
  function W() {
    const x = this.stack[this.stack.length - 1], I = this.resume(), O = this.stack[this.stack.length - 1];
    if (this.data.inReference = !0, O.type === "link") {
      const $ = x.children;
      O.children = $;
    } else
      O.alt = I;
  }
  function m() {
    const x = this.resume(), I = this.stack[this.stack.length - 1];
    I.url = x;
  }
  function N() {
    const x = this.resume(), I = this.stack[this.stack.length - 1];
    I.title = x;
  }
  function Y() {
    this.data.inReference = void 0;
  }
  function d() {
    this.data.referenceType = "collapsed";
  }
  function J(x) {
    const I = this.resume(), O = this.stack[this.stack.length - 1];
    O.label = I, O.identifier = Xe(this.sliceSerialize(x)).toLowerCase(), this.data.referenceType = "full";
  }
  function ae(x) {
    this.data.characterReferenceType = x.type;
  }
  function Q(x) {
    const I = this.sliceSerialize(x), O = this.data.characterReferenceType;
    let $;
    O ? ($ = $r(I, O === "characterReferenceMarkerNumeric" ? 10 : 16), this.data.characterReferenceType = void 0) : $ = wn(I);
    const K = this.stack[this.stack.length - 1];
    K.value += $;
  }
  function ce(x) {
    const I = this.stack.pop();
    I.position.end = De(x.end);
  }
  function ie(x) {
    j.call(this, x);
    const I = this.stack[this.stack.length - 1];
    I.url = this.sliceSerialize(x);
  }
  function ke(x) {
    j.call(this, x);
    const I = this.stack[this.stack.length - 1];
    I.url = "mailto:" + this.sliceSerialize(x);
  }
  function xe() {
    return {
      type: "blockquote",
      children: []
    };
  }
  function ve() {
    return {
      type: "code",
      lang: null,
      meta: null,
      value: ""
    };
  }
  function Oe() {
    return {
      type: "inlineCode",
      value: ""
    };
  }
  function ht() {
    return {
      type: "definition",
      identifier: "",
      label: null,
      title: null,
      url: ""
    };
  }
  function Lt() {
    return {
      type: "emphasis",
      children: []
    };
  }
  function ft() {
    return {
      type: "heading",
      // @ts-expect-error `depth` will be set later.
      depth: 0,
      children: []
    };
  }
  function pt() {
    return {
      type: "break"
    };
  }
  function dt() {
    return {
      type: "html",
      value: ""
    };
  }
  function Qe() {
    return {
      type: "image",
      title: null,
      url: "",
      alt: null
    };
  }
  function je() {
    return {
      type: "link",
      title: null,
      url: "",
      children: []
    };
  }
  function mt(x) {
    return {
      type: "list",
      ordered: x.type === "listOrdered",
      start: null,
      spread: x._spread,
      children: []
    };
  }
  function Ft(x) {
    return {
      type: "listItem",
      spread: x._spread,
      checked: null,
      children: []
    };
  }
  function Ge() {
    return {
      type: "paragraph",
      children: []
    };
  }
  function Ze() {
    return {
      type: "strong",
      children: []
    };
  }
  function Re() {
    return {
      type: "text",
      value: ""
    };
  }
  function Ue() {
    return {
      type: "thematicBreak"
    };
  }
}
function De(e) {
  return {
    line: e.line,
    column: e.column,
    offset: e.offset
  };
}
function ni(e, t) {
  let n = -1;
  for (; ++n < t.length; ) {
    const r = t[n];
    Array.isArray(r) ? ni(e, r) : ys(e, r);
  }
}
function ys(e, t) {
  let n;
  for (n in t)
    if (ti.call(t, n))
      switch (n) {
        case "canContainEols": {
          const r = t[n];
          r && e[n].push(...r);
          break;
        }
        case "transforms": {
          const r = t[n];
          r && e[n].push(...r);
          break;
        }
        case "enter":
        case "exit": {
          const r = t[n];
          r && Object.assign(e[n], r);
          break;
        }
      }
}
function or(e, t) {
  throw e ? new Error("Cannot close `" + e.type + "` (" + lt({
    start: e.start,
    end: e.end
  }) + "): a different token (`" + t.type + "`, " + lt({
    start: t.start,
    end: t.end
  }) + ") is open") : new Error("Cannot close document, a token (`" + t.type + "`, " + lt({
    start: t.start,
    end: t.end
  }) + ") is still open");
}
function xs(e) {
  const t = this;
  t.parser = n;
  function n(r) {
    return ms(r, {
      ...t.data("settings"),
      ...e,
      // Note: these options are not in the readme.
      // The goal is for them to be set by plugins on `data` instead of being
      // passed by users.
      extensions: t.data("micromarkExtensions") || [],
      mdastExtensions: t.data("fromMarkdownExtensions") || []
    });
  }
}
function bs(e, t) {
  const n = {
    type: "element",
    tagName: "blockquote",
    properties: {},
    children: e.wrap(e.all(t), !0)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function ws(e, t) {
  const n = { type: "element", tagName: "br", properties: {}, children: [] };
  return e.patch(t, n), [e.applyData(t, n), { type: "text", value: `
` }];
}
function ks(e, t) {
  const n = t.value ? t.value + `
` : "", r = {}, i = t.lang ? t.lang.split(/\s+/) : [];
  i.length > 0 && (r.className = ["language-" + i[0]]);
  let l = {
    type: "element",
    tagName: "code",
    properties: r,
    children: [{ type: "text", value: n }]
  };
  return t.meta && (l.data = { meta: t.meta }), e.patch(t, l), l = e.applyData(t, l), l = { type: "element", tagName: "pre", properties: {}, children: [l] }, e.patch(t, l), l;
}
function Cs(e, t) {
  const n = {
    type: "element",
    tagName: "del",
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function vs(e, t) {
  const n = {
    type: "element",
    tagName: "em",
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function Es(e, t) {
  const n = typeof e.options.clobberPrefix == "string" ? e.options.clobberPrefix : "user-content-", r = String(t.identifier).toUpperCase(), i = Je(r.toLowerCase()), l = e.footnoteOrder.indexOf(r);
  let a, o = e.footnoteCounts.get(r);
  o === void 0 ? (o = 0, e.footnoteOrder.push(r), a = e.footnoteOrder.length) : a = l + 1, o += 1, e.footnoteCounts.set(r, o);
  const c = {
    type: "element",
    tagName: "a",
    properties: {
      href: "#" + n + "fn-" + i,
      id: n + "fnref-" + i + (o > 1 ? "-" + o : ""),
      dataFootnoteRef: !0,
      ariaDescribedBy: ["footnote-label"]
    },
    children: [{ type: "text", value: String(a) }]
  };
  e.patch(t, c);
  const s = {
    type: "element",
    tagName: "sup",
    properties: {},
    children: [c]
  };
  return e.patch(t, s), e.applyData(t, s);
}
function Ss(e, t) {
  const n = {
    type: "element",
    tagName: "h" + t.depth,
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function As(e, t) {
  if (e.options.allowDangerousHtml) {
    const n = { type: "raw", value: t.value };
    return e.patch(t, n), e.applyData(t, n);
  }
}
function ri(e, t) {
  const n = t.referenceType;
  let r = "]";
  if (n === "collapsed" ? r += "[]" : n === "full" && (r += "[" + (t.label || t.identifier) + "]"), t.type === "imageReference")
    return [{ type: "text", value: "![" + t.alt + r }];
  const i = e.all(t), l = i[0];
  l && l.type === "text" ? l.value = "[" + l.value : i.unshift({ type: "text", value: "[" });
  const a = i[i.length - 1];
  return a && a.type === "text" ? a.value += r : i.push({ type: "text", value: r }), i;
}
function Is(e, t) {
  const n = String(t.identifier).toUpperCase(), r = e.definitionById.get(n);
  if (!r)
    return ri(e, t);
  const i = { src: Je(r.url || ""), alt: t.alt };
  r.title !== null && r.title !== void 0 && (i.title = r.title);
  const l = { type: "element", tagName: "img", properties: i, children: [] };
  return e.patch(t, l), e.applyData(t, l);
}
function Ms(e, t) {
  const n = { src: Je(t.url) };
  t.alt !== null && t.alt !== void 0 && (n.alt = t.alt), t.title !== null && t.title !== void 0 && (n.title = t.title);
  const r = { type: "element", tagName: "img", properties: n, children: [] };
  return e.patch(t, r), e.applyData(t, r);
}
function Ts(e, t) {
  const n = { type: "text", value: t.value.replace(/\r?\n|\r/g, " ") };
  e.patch(t, n);
  const r = {
    type: "element",
    tagName: "code",
    properties: {},
    children: [n]
  };
  return e.patch(t, r), e.applyData(t, r);
}
function Ls(e, t) {
  const n = String(t.identifier).toUpperCase(), r = e.definitionById.get(n);
  if (!r)
    return ri(e, t);
  const i = { href: Je(r.url || "") };
  r.title !== null && r.title !== void 0 && (i.title = r.title);
  const l = {
    type: "element",
    tagName: "a",
    properties: i,
    children: e.all(t)
  };
  return e.patch(t, l), e.applyData(t, l);
}
function Fs(e, t) {
  const n = { href: Je(t.url) };
  t.title !== null && t.title !== void 0 && (n.title = t.title);
  const r = {
    type: "element",
    tagName: "a",
    properties: n,
    children: e.all(t)
  };
  return e.patch(t, r), e.applyData(t, r);
}
function Ps(e, t, n) {
  const r = e.all(t), i = n ? zs(n) : ii(t), l = {}, a = [];
  if (typeof t.checked == "boolean") {
    const u = r[0];
    let h;
    u && u.type === "element" && u.tagName === "p" ? h = u : (h = { type: "element", tagName: "p", properties: {}, children: [] }, r.unshift(h)), h.children.length > 0 && h.children.unshift({ type: "text", value: " " }), h.children.unshift({
      type: "element",
      tagName: "input",
      properties: { type: "checkbox", checked: t.checked, disabled: !0 },
      children: []
    }), l.className = ["task-list-item"];
  }
  let o = -1;
  for (; ++o < r.length; ) {
    const u = r[o];
    (i || o !== 0 || u.type !== "element" || u.tagName !== "p") && a.push({ type: "text", value: `
` }), u.type === "element" && u.tagName === "p" && !i ? a.push(...u.children) : a.push(u);
  }
  const c = r[r.length - 1];
  c && (i || c.type !== "element" || c.tagName !== "p") && a.push({ type: "text", value: `
` });
  const s = { type: "element", tagName: "li", properties: l, children: a };
  return e.patch(t, s), e.applyData(t, s);
}
function zs(e) {
  let t = !1;
  if (e.type === "list") {
    t = e.spread || !1;
    const n = e.children;
    let r = -1;
    for (; !t && ++r < n.length; )
      t = ii(n[r]);
  }
  return t;
}
function ii(e) {
  const t = e.spread;
  return t ?? e.children.length > 1;
}
function Ns(e, t) {
  const n = {}, r = e.all(t);
  let i = -1;
  for (typeof t.start == "number" && t.start !== 1 && (n.start = t.start); ++i < r.length; ) {
    const a = r[i];
    if (a.type === "element" && a.tagName === "li" && a.properties && Array.isArray(a.properties.className) && a.properties.className.includes("task-list-item")) {
      n.className = ["contains-task-list"];
      break;
    }
  }
  const l = {
    type: "element",
    tagName: t.ordered ? "ol" : "ul",
    properties: n,
    children: e.wrap(r, !0)
  };
  return e.patch(t, l), e.applyData(t, l);
}
function Ds(e, t) {
  const n = {
    type: "element",
    tagName: "p",
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function Vs(e, t) {
  const n = { type: "root", children: e.wrap(e.all(t)) };
  return e.patch(t, n), e.applyData(t, n);
}
function Bs(e, t) {
  const n = {
    type: "element",
    tagName: "strong",
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function Os(e, t) {
  const n = e.all(t), r = n.shift(), i = [];
  if (r) {
    const a = {
      type: "element",
      tagName: "thead",
      properties: {},
      children: e.wrap([r], !0)
    };
    e.patch(t.children[0], a), i.push(a);
  }
  if (n.length > 0) {
    const a = {
      type: "element",
      tagName: "tbody",
      properties: {},
      children: e.wrap(n, !0)
    }, o = gn(t.children[1]), c = Or(t.children[t.children.length - 1]);
    o && c && (a.position = { start: o, end: c }), i.push(a);
  }
  const l = {
    type: "element",
    tagName: "table",
    properties: {},
    children: e.wrap(i, !0)
  };
  return e.patch(t, l), e.applyData(t, l);
}
function Rs(e, t, n) {
  const r = n ? n.children : void 0, l = (r ? r.indexOf(t) : 1) === 0 ? "th" : "td", a = n && n.type === "table" ? n.align : void 0, o = a ? a.length : t.children.length;
  let c = -1;
  const s = [];
  for (; ++c < o; ) {
    const h = t.children[c], p = {}, f = a ? a[c] : void 0;
    f && (p.align = f);
    let w = { type: "element", tagName: l, properties: p, children: [] };
    h && (w.children = e.all(h), e.patch(h, w), w = e.applyData(h, w)), s.push(w);
  }
  const u = {
    type: "element",
    tagName: "tr",
    properties: {},
    children: e.wrap(s, !0)
  };
  return e.patch(t, u), e.applyData(t, u);
}
function _s(e, t) {
  const n = {
    type: "element",
    tagName: "td",
    // Assume body cell.
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
const sr = 9, ur = 32;
function Hs(e) {
  const t = String(e), n = /\r?\n|\r/g;
  let r = n.exec(t), i = 0;
  const l = [];
  for (; r; )
    l.push(
      cr(t.slice(i, r.index), i > 0, !0),
      r[0]
    ), i = r.index + r[0].length, r = n.exec(t);
  return l.push(cr(t.slice(i), i > 0, !1)), l.join("");
}
function cr(e, t, n) {
  let r = 0, i = e.length;
  if (t) {
    let l = e.codePointAt(r);
    for (; l === sr || l === ur; )
      r++, l = e.codePointAt(r);
  }
  if (n) {
    let l = e.codePointAt(i - 1);
    for (; l === sr || l === ur; )
      i--, l = e.codePointAt(i - 1);
  }
  return i > r ? e.slice(r, i) : "";
}
function js(e, t) {
  const n = { type: "text", value: Hs(String(t.value)) };
  return e.patch(t, n), e.applyData(t, n);
}
function Zs(e, t) {
  const n = {
    type: "element",
    tagName: "hr",
    properties: {},
    children: []
  };
  return e.patch(t, n), e.applyData(t, n);
}
const Us = {
  blockquote: bs,
  break: ws,
  code: ks,
  delete: Cs,
  emphasis: vs,
  footnoteReference: Es,
  heading: Ss,
  html: As,
  imageReference: Is,
  image: Ms,
  inlineCode: Ts,
  linkReference: Ls,
  link: Fs,
  listItem: Ps,
  list: Ns,
  paragraph: Ds,
  // @ts-expect-error: root is different, but hard to type.
  root: Vs,
  strong: Bs,
  table: Os,
  tableCell: _s,
  tableRow: Rs,
  text: js,
  thematicBreak: Zs,
  toml: bt,
  yaml: bt,
  definition: bt,
  footnoteDefinition: bt
};
function bt() {
}
const li = -1, Mt = 0, ot = 1, Et = 2, vn = 3, En = 4, Sn = 5, An = 6, ai = 7, oi = 8, hr = typeof self == "object" ? self : globalThis, $s = (e, t) => {
  const n = (i, l) => (e.set(l, i), i), r = (i) => {
    if (e.has(i))
      return e.get(i);
    const [l, a] = t[i];
    switch (l) {
      case Mt:
      case li:
        return n(a, i);
      case ot: {
        const o = n([], i);
        for (const c of a)
          o.push(r(c));
        return o;
      }
      case Et: {
        const o = n({}, i);
        for (const [c, s] of a)
          o[r(c)] = r(s);
        return o;
      }
      case vn:
        return n(new Date(a), i);
      case En: {
        const { source: o, flags: c } = a;
        return n(new RegExp(o, c), i);
      }
      case Sn: {
        const o = n(/* @__PURE__ */ new Map(), i);
        for (const [c, s] of a)
          o.set(r(c), r(s));
        return o;
      }
      case An: {
        const o = n(/* @__PURE__ */ new Set(), i);
        for (const c of a)
          o.add(r(c));
        return o;
      }
      case ai: {
        const { name: o, message: c } = a;
        return n(new hr[o](c), i);
      }
      case oi:
        return n(BigInt(a), i);
      case "BigInt":
        return n(Object(BigInt(a)), i);
      case "ArrayBuffer":
        return n(new Uint8Array(a).buffer, a);
      case "DataView": {
        const { buffer: o } = new Uint8Array(a);
        return n(new DataView(o), a);
      }
    }
    return n(new hr[l](a), i);
  };
  return r;
}, fr = (e) => $s(/* @__PURE__ */ new Map(), e)(0), qe = "", { toString: qs } = {}, { keys: Ws } = Object, rt = (e) => {
  const t = typeof e;
  if (t !== "object" || !e)
    return [Mt, t];
  const n = qs.call(e).slice(8, -1);
  switch (n) {
    case "Array":
      return [ot, qe];
    case "Object":
      return [Et, qe];
    case "Date":
      return [vn, qe];
    case "RegExp":
      return [En, qe];
    case "Map":
      return [Sn, qe];
    case "Set":
      return [An, qe];
    case "DataView":
      return [ot, n];
  }
  return n.includes("Array") ? [ot, n] : n.includes("Error") ? [ai, n] : [Et, n];
}, wt = ([e, t]) => e === Mt && (t === "function" || t === "symbol"), Xs = (e, t, n, r) => {
  const i = (a, o) => {
    const c = r.push(a) - 1;
    return n.set(o, c), c;
  }, l = (a) => {
    if (n.has(a))
      return n.get(a);
    let [o, c] = rt(a);
    switch (o) {
      case Mt: {
        let u = a;
        switch (c) {
          case "bigint":
            o = oi, u = a.toString();
            break;
          case "function":
          case "symbol":
            if (e)
              throw new TypeError("unable to serialize " + c);
            u = null;
            break;
          case "undefined":
            return i([li], a);
        }
        return i([o, u], a);
      }
      case ot: {
        if (c) {
          let p = a;
          return c === "DataView" ? p = new Uint8Array(a.buffer) : c === "ArrayBuffer" && (p = new Uint8Array(a)), i([c, [...p]], a);
        }
        const u = [], h = i([o, u], a);
        for (const p of a)
          u.push(l(p));
        return h;
      }
      case Et: {
        if (c)
          switch (c) {
            case "BigInt":
              return i([c, a.toString()], a);
            case "Boolean":
            case "Number":
            case "String":
              return i([c, a.valueOf()], a);
          }
        if (t && "toJSON" in a)
          return l(a.toJSON());
        const u = [], h = i([o, u], a);
        for (const p of Ws(a))
          (e || !wt(rt(a[p]))) && u.push([l(p), l(a[p])]);
        return h;
      }
      case vn:
        return i([o, a.toISOString()], a);
      case En: {
        const { source: u, flags: h } = a;
        return i([o, { source: u, flags: h }], a);
      }
      case Sn: {
        const u = [], h = i([o, u], a);
        for (const [p, f] of a)
          (e || !(wt(rt(p)) || wt(rt(f)))) && u.push([l(p), l(f)]);
        return h;
      }
      case An: {
        const u = [], h = i([o, u], a);
        for (const p of a)
          (e || !wt(rt(p))) && u.push(l(p));
        return h;
      }
    }
    const { message: s } = a;
    return i([o, { name: c, message: s }], a);
  };
  return l;
}, pr = (e, { json: t, lossy: n } = {}) => {
  const r = [];
  return Xs(!(t || n), !!t, /* @__PURE__ */ new Map(), r)(e), r;
}, St = typeof structuredClone == "function" ? (
  /* c8 ignore start */
  (e, t) => t && ("json" in t || "lossy" in t) ? fr(pr(e, t)) : structuredClone(e)
) : (e, t) => fr(pr(e, t));
function Ys(e, t) {
  const n = [{ type: "text", value: "↩" }];
  return t > 1 && n.push({
    type: "element",
    tagName: "sup",
    properties: {},
    children: [{ type: "text", value: String(t) }]
  }), n;
}
function Js(e, t) {
  return "Back to reference " + (e + 1) + (t > 1 ? "-" + t : "");
}
function Qs(e) {
  const t = typeof e.options.clobberPrefix == "string" ? e.options.clobberPrefix : "user-content-", n = e.options.footnoteBackContent || Ys, r = e.options.footnoteBackLabel || Js, i = e.options.footnoteLabel || "Footnotes", l = e.options.footnoteLabelTagName || "h2", a = e.options.footnoteLabelProperties || {
    className: ["sr-only"]
  }, o = [];
  let c = -1;
  for (; ++c < e.footnoteOrder.length; ) {
    const s = e.footnoteById.get(
      e.footnoteOrder[c]
    );
    if (!s)
      continue;
    const u = e.all(s), h = String(s.identifier).toUpperCase(), p = Je(h.toLowerCase());
    let f = 0;
    const w = [], k = e.footnoteCounts.get(h);
    for (; k !== void 0 && ++f <= k; ) {
      w.length > 0 && w.push({ type: "text", value: " " });
      let T = typeof n == "string" ? n : n(c, f);
      typeof T == "string" && (T = { type: "text", value: T }), w.push({
        type: "element",
        tagName: "a",
        properties: {
          href: "#" + t + "fnref-" + p + (f > 1 ? "-" + f : ""),
          dataFootnoteBackref: "",
          ariaLabel: typeof r == "string" ? r : r(c, f),
          className: ["data-footnote-backref"]
        },
        children: Array.isArray(T) ? T : [T]
      });
    }
    const A = u[u.length - 1];
    if (A && A.type === "element" && A.tagName === "p") {
      const T = A.children[A.children.length - 1];
      T && T.type === "text" ? T.value += " " : A.children.push({ type: "text", value: " " }), A.children.push(...w);
    } else
      u.push(...w);
    const b = {
      type: "element",
      tagName: "li",
      properties: { id: t + "fn-" + p },
      children: e.wrap(u, !0)
    };
    e.patch(s, b), o.push(b);
  }
  if (o.length !== 0)
    return {
      type: "element",
      tagName: "section",
      properties: { dataFootnotes: !0, className: ["footnotes"] },
      children: [
        {
          type: "element",
          tagName: l,
          properties: {
            ...St(a),
            id: "footnote-label"
          },
          children: [{ type: "text", value: i }]
        },
        { type: "text", value: `
` },
        {
          type: "element",
          tagName: "ol",
          properties: {},
          children: e.wrap(o, !0)
        },
        { type: "text", value: `
` }
      ]
    };
}
const si = (
  // Note: overloads in JSDoc can’t yet use different `@template`s.
  /**
   * @type {(
   *   (<Condition extends string>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & {type: Condition}) &
   *   (<Condition extends Props>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Condition) &
   *   (<Condition extends TestFunction>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Predicate<Condition, Node>) &
   *   ((test?: null | undefined) => (node?: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node) &
   *   ((test?: Test) => Check)
   * )}
   */
  /**
   * @param {Test} [test]
   * @returns {Check}
   */
  (function(e) {
    if (e == null)
      return tu;
    if (typeof e == "function")
      return Tt(e);
    if (typeof e == "object")
      return Array.isArray(e) ? Gs(e) : (
        // Cast because `ReadonlyArray` goes into the above but `isArray`
        // narrows to `Array`.
        Ks(
          /** @type {Props} */
          e
        )
      );
    if (typeof e == "string")
      return eu(e);
    throw new Error("Expected function, string, or object as test");
  })
);
function Gs(e) {
  const t = [];
  let n = -1;
  for (; ++n < e.length; )
    t[n] = si(e[n]);
  return Tt(r);
  function r(...i) {
    let l = -1;
    for (; ++l < t.length; )
      if (t[l].apply(this, i)) return !0;
    return !1;
  }
}
function Ks(e) {
  const t = (
    /** @type {Record<string, unknown>} */
    e
  );
  return Tt(n);
  function n(r) {
    const i = (
      /** @type {Record<string, unknown>} */
      /** @type {unknown} */
      r
    );
    let l;
    for (l in e)
      if (i[l] !== t[l]) return !1;
    return !0;
  }
}
function eu(e) {
  return Tt(t);
  function t(n) {
    return n && n.type === e;
  }
}
function Tt(e) {
  return t;
  function t(n, r, i) {
    return !!(nu(n) && e.call(
      this,
      n,
      typeof r == "number" ? r : void 0,
      i || void 0
    ));
  }
}
function tu() {
  return !0;
}
function nu(e) {
  return e !== null && typeof e == "object" && "type" in e;
}
const ui = [], ru = !0, dr = !1, iu = "skip";
function lu(e, t, n, r) {
  let i;
  typeof t == "function" && typeof n != "function" ? (r = n, n = t) : i = t;
  const l = si(i), a = r ? -1 : 1;
  o(e, void 0, [])();
  function o(c, s, u) {
    const h = (
      /** @type {Record<string, unknown>} */
      c && typeof c == "object" ? c : {}
    );
    if (typeof h.type == "string") {
      const f = (
        // `hast`
        typeof h.tagName == "string" ? h.tagName : (
          // `xast`
          typeof h.name == "string" ? h.name : void 0
        )
      );
      Object.defineProperty(p, "name", {
        value: "node (" + (c.type + (f ? "<" + f + ">" : "")) + ")"
      });
    }
    return p;
    function p() {
      let f = ui, w, k, A;
      if ((!t || l(c, s, u[u.length - 1] || void 0)) && (f = au(n(c, u)), f[0] === dr))
        return f;
      if ("children" in c && c.children) {
        const b = (
          /** @type {UnistParent} */
          c
        );
        if (b.children && f[0] !== iu)
          for (k = (r ? b.children.length : -1) + a, A = u.concat(b); k > -1 && k < b.children.length; ) {
            const T = b.children[k];
            if (w = o(T, k, A)(), w[0] === dr)
              return w;
            k = typeof w[1] == "number" ? w[1] : k + a;
          }
      }
      return f;
    }
  }
}
function au(e) {
  return Array.isArray(e) ? e : typeof e == "number" ? [ru, e] : e == null ? ui : [e];
}
function ci(e, t, n, r) {
  let i, l, a;
  typeof t == "function" && typeof n != "function" ? (l = void 0, a = t, i = n) : (l = t, a = n, i = r), lu(e, l, o, i);
  function o(c, s) {
    const u = s[s.length - 1], h = u ? u.children.indexOf(c) : void 0;
    return a(c, h, u);
  }
}
const an = {}.hasOwnProperty, ou = {};
function su(e, t) {
  const n = t || ou, r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), a = { ...Us, ...n.handlers }, o = {
    all: s,
    applyData: cu,
    definitionById: r,
    footnoteById: i,
    footnoteCounts: l,
    footnoteOrder: [],
    handlers: a,
    one: c,
    options: n,
    patch: uu,
    wrap: fu
  };
  return ci(e, function(u) {
    if (u.type === "definition" || u.type === "footnoteDefinition") {
      const h = u.type === "definition" ? r : i, p = String(u.identifier).toUpperCase();
      h.has(p) || h.set(p, u);
    }
  }), o;
  function c(u, h) {
    const p = u.type, f = o.handlers[p];
    if (an.call(o.handlers, p) && f)
      return f(o, u, h);
    if (o.options.passThrough && o.options.passThrough.includes(p)) {
      if ("children" in u) {
        const { children: k, ...A } = u, b = St(A);
        return b.children = o.all(u), b;
      }
      return St(u);
    }
    return (o.options.unknownHandler || hu)(o, u, h);
  }
  function s(u) {
    const h = [];
    if ("children" in u) {
      const p = u.children;
      let f = -1;
      for (; ++f < p.length; ) {
        const w = o.one(p[f], u);
        if (w) {
          if (f && p[f - 1].type === "break" && (!Array.isArray(w) && w.type === "text" && (w.value = mr(w.value)), !Array.isArray(w) && w.type === "element")) {
            const k = w.children[0];
            k && k.type === "text" && (k.value = mr(k.value));
          }
          Array.isArray(w) ? h.push(...w) : h.push(w);
        }
      }
    }
    return h;
  }
}
function uu(e, t) {
  e.position && (t.position = $l(e));
}
function cu(e, t) {
  let n = t;
  if (e && e.data) {
    const r = e.data.hName, i = e.data.hChildren, l = e.data.hProperties;
    if (typeof r == "string")
      if (n.type === "element")
        n.tagName = r;
      else {
        const a = "children" in n ? n.children : [n];
        n = { type: "element", tagName: r, properties: {}, children: a };
      }
    n.type === "element" && l && Object.assign(n.properties, St(l)), "children" in n && n.children && i !== null && i !== void 0 && (n.children = i);
  }
  return n;
}
function hu(e, t) {
  const n = t.data || {}, r = "value" in t && !(an.call(n, "hProperties") || an.call(n, "hChildren")) ? { type: "text", value: t.value } : {
    type: "element",
    tagName: "div",
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, r), e.applyData(t, r);
}
function fu(e, t) {
  const n = [];
  let r = -1;
  for (t && n.push({ type: "text", value: `
` }); ++r < e.length; )
    r && n.push({ type: "text", value: `
` }), n.push(e[r]);
  return t && e.length > 0 && n.push({ type: "text", value: `
` }), n;
}
function mr(e) {
  let t = 0, n = e.charCodeAt(t);
  for (; n === 9 || n === 32; )
    t++, n = e.charCodeAt(t);
  return e.slice(t);
}
function gr(e, t) {
  const n = su(e, t), r = n.one(e, void 0), i = Qs(n), l = Array.isArray(r) ? { type: "root", children: r } : r || { type: "root", children: [] };
  return i && l.children.push({ type: "text", value: `
` }, i), l;
}
function pu(e, t) {
  return e && "run" in e ? async function(n, r) {
    const i = (
      /** @type {HastRoot} */
      gr(n, { file: r, ...t })
    );
    await e.run(i, r);
  } : function(n, r) {
    return (
      /** @type {HastRoot} */
      gr(n, { file: r, ...e || t })
    );
  };
}
function yr(e) {
  if (e)
    throw e;
}
var jt, xr;
function du() {
  if (xr) return jt;
  xr = 1;
  var e = Object.prototype.hasOwnProperty, t = Object.prototype.toString, n = Object.defineProperty, r = Object.getOwnPropertyDescriptor, i = function(s) {
    return typeof Array.isArray == "function" ? Array.isArray(s) : t.call(s) === "[object Array]";
  }, l = function(s) {
    if (!s || t.call(s) !== "[object Object]")
      return !1;
    var u = e.call(s, "constructor"), h = s.constructor && s.constructor.prototype && e.call(s.constructor.prototype, "isPrototypeOf");
    if (s.constructor && !u && !h)
      return !1;
    var p;
    for (p in s)
      ;
    return typeof p > "u" || e.call(s, p);
  }, a = function(s, u) {
    n && u.name === "__proto__" ? n(s, u.name, {
      enumerable: !0,
      configurable: !0,
      value: u.newValue,
      writable: !0
    }) : s[u.name] = u.newValue;
  }, o = function(s, u) {
    if (u === "__proto__")
      if (e.call(s, u)) {
        if (r)
          return r(s, u).value;
      } else return;
    return s[u];
  };
  return jt = function c() {
    var s, u, h, p, f, w, k = arguments[0], A = 1, b = arguments.length, T = !1;
    for (typeof k == "boolean" && (T = k, k = arguments[1] || {}, A = 2), (k == null || typeof k != "object" && typeof k != "function") && (k = {}); A < b; ++A)
      if (s = arguments[A], s != null)
        for (u in s)
          h = o(k, u), p = o(s, u), k !== p && (T && p && (l(p) || (f = i(p))) ? (f ? (f = !1, w = h && i(h) ? h : []) : w = h && l(h) ? h : {}, a(k, { name: u, newValue: c(T, w, p) })) : typeof p < "u" && a(k, { name: u, newValue: p }));
    return k;
  }, jt;
}
var mu = du();
const Zt = /* @__PURE__ */ Br(mu);
function on(e) {
  if (typeof e != "object" || e === null)
    return !1;
  const t = Object.getPrototypeOf(e);
  return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Symbol.toStringTag in e) && !(Symbol.iterator in e);
}
function gu() {
  const e = [], t = { run: n, use: r };
  return t;
  function n(...i) {
    let l = -1;
    const a = i.pop();
    if (typeof a != "function")
      throw new TypeError("Expected function as last argument, not " + a);
    o(null, ...i);
    function o(c, ...s) {
      const u = e[++l];
      let h = -1;
      if (c) {
        a(c);
        return;
      }
      for (; ++h < i.length; )
        (s[h] === null || s[h] === void 0) && (s[h] = i[h]);
      i = s, u ? yu(u, o)(...s) : a(null, ...s);
    }
  }
  function r(i) {
    if (typeof i != "function")
      throw new TypeError(
        "Expected `middelware` to be a function, not " + i
      );
    return e.push(i), t;
  }
}
function yu(e, t) {
  let n;
  return r;
  function r(...a) {
    const o = e.length > a.length;
    let c;
    o && a.push(i);
    try {
      c = e.apply(this, a);
    } catch (s) {
      const u = (
        /** @type {Error} */
        s
      );
      if (o && n)
        throw u;
      return i(u);
    }
    o || (c && c.then && typeof c.then == "function" ? c.then(l, i) : c instanceof Error ? i(c) : l(c));
  }
  function i(a, ...o) {
    n || (n = !0, t(a, ...o));
  }
  function l(a) {
    i(null, a);
  }
}
const Ie = { basename: xu, dirname: bu, extname: wu, join: ku, sep: "/" };
function xu(e, t) {
  if (t !== void 0 && typeof t != "string")
    throw new TypeError('"ext" argument must be a string');
  ct(e);
  let n = 0, r = -1, i = e.length, l;
  if (t === void 0 || t.length === 0 || t.length > e.length) {
    for (; i--; )
      if (e.codePointAt(i) === 47) {
        if (l) {
          n = i + 1;
          break;
        }
      } else r < 0 && (l = !0, r = i + 1);
    return r < 0 ? "" : e.slice(n, r);
  }
  if (t === e)
    return "";
  let a = -1, o = t.length - 1;
  for (; i--; )
    if (e.codePointAt(i) === 47) {
      if (l) {
        n = i + 1;
        break;
      }
    } else
      a < 0 && (l = !0, a = i + 1), o > -1 && (e.codePointAt(i) === t.codePointAt(o--) ? o < 0 && (r = i) : (o = -1, r = a));
  return n === r ? r = a : r < 0 && (r = e.length), e.slice(n, r);
}
function bu(e) {
  if (ct(e), e.length === 0)
    return ".";
  let t = -1, n = e.length, r;
  for (; --n; )
    if (e.codePointAt(n) === 47) {
      if (r) {
        t = n;
        break;
      }
    } else r || (r = !0);
  return t < 0 ? e.codePointAt(0) === 47 ? "/" : "." : t === 1 && e.codePointAt(0) === 47 ? "//" : e.slice(0, t);
}
function wu(e) {
  ct(e);
  let t = e.length, n = -1, r = 0, i = -1, l = 0, a;
  for (; t--; ) {
    const o = e.codePointAt(t);
    if (o === 47) {
      if (a) {
        r = t + 1;
        break;
      }
      continue;
    }
    n < 0 && (a = !0, n = t + 1), o === 46 ? i < 0 ? i = t : l !== 1 && (l = 1) : i > -1 && (l = -1);
  }
  return i < 0 || n < 0 || // We saw a non-dot character immediately before the dot.
  l === 0 || // The (right-most) trimmed path component is exactly `..`.
  l === 1 && i === n - 1 && i === r + 1 ? "" : e.slice(i, n);
}
function ku(...e) {
  let t = -1, n;
  for (; ++t < e.length; )
    ct(e[t]), e[t] && (n = n === void 0 ? e[t] : n + "/" + e[t]);
  return n === void 0 ? "." : Cu(n);
}
function Cu(e) {
  ct(e);
  const t = e.codePointAt(0) === 47;
  let n = vu(e, !t);
  return n.length === 0 && !t && (n = "."), n.length > 0 && e.codePointAt(e.length - 1) === 47 && (n += "/"), t ? "/" + n : n;
}
function vu(e, t) {
  let n = "", r = 0, i = -1, l = 0, a = -1, o, c;
  for (; ++a <= e.length; ) {
    if (a < e.length)
      o = e.codePointAt(a);
    else {
      if (o === 47)
        break;
      o = 47;
    }
    if (o === 47) {
      if (!(i === a - 1 || l === 1)) if (i !== a - 1 && l === 2) {
        if (n.length < 2 || r !== 2 || n.codePointAt(n.length - 1) !== 46 || n.codePointAt(n.length - 2) !== 46) {
          if (n.length > 2) {
            if (c = n.lastIndexOf("/"), c !== n.length - 1) {
              c < 0 ? (n = "", r = 0) : (n = n.slice(0, c), r = n.length - 1 - n.lastIndexOf("/")), i = a, l = 0;
              continue;
            }
          } else if (n.length > 0) {
            n = "", r = 0, i = a, l = 0;
            continue;
          }
        }
        t && (n = n.length > 0 ? n + "/.." : "..", r = 2);
      } else
        n.length > 0 ? n += "/" + e.slice(i + 1, a) : n = e.slice(i + 1, a), r = a - i - 1;
      i = a, l = 0;
    } else o === 46 && l > -1 ? l++ : l = -1;
  }
  return n;
}
function ct(e) {
  if (typeof e != "string")
    throw new TypeError(
      "Path must be a string. Received " + JSON.stringify(e)
    );
}
const Eu = { cwd: Su };
function Su() {
  return "/";
}
function sn(e) {
  return !!(e !== null && typeof e == "object" && "href" in e && e.href && "protocol" in e && e.protocol && // @ts-expect-error: indexing is fine.
  e.auth === void 0);
}
function Au(e) {
  if (typeof e == "string")
    e = new URL(e);
  else if (!sn(e)) {
    const t = new TypeError(
      'The "path" argument must be of type string or an instance of URL. Received `' + e + "`"
    );
    throw t.code = "ERR_INVALID_ARG_TYPE", t;
  }
  if (e.protocol !== "file:") {
    const t = new TypeError("The URL must be of scheme file");
    throw t.code = "ERR_INVALID_URL_SCHEME", t;
  }
  return Iu(e);
}
function Iu(e) {
  if (e.hostname !== "") {
    const r = new TypeError(
      'File URL host must be "localhost" or empty on darwin'
    );
    throw r.code = "ERR_INVALID_FILE_URL_HOST", r;
  }
  const t = e.pathname;
  let n = -1;
  for (; ++n < t.length; )
    if (t.codePointAt(n) === 37 && t.codePointAt(n + 1) === 50) {
      const r = t.codePointAt(n + 2);
      if (r === 70 || r === 102) {
        const i = new TypeError(
          "File URL path must not include encoded / characters"
        );
        throw i.code = "ERR_INVALID_FILE_URL_PATH", i;
      }
    }
  return decodeURIComponent(t);
}
const Ut = (
  /** @type {const} */
  [
    "history",
    "path",
    "basename",
    "stem",
    "extname",
    "dirname"
  ]
);
class hi {
  /**
   * Create a new virtual file.
   *
   * `options` is treated as:
   *
   * *   `string` or `Uint8Array` — `{value: options}`
   * *   `URL` — `{path: options}`
   * *   `VFile` — shallow copies its data over to the new file
   * *   `object` — all fields are shallow copied over to the new file
   *
   * Path related fields are set in the following order (least specific to
   * most specific): `history`, `path`, `basename`, `stem`, `extname`,
   * `dirname`.
   *
   * You cannot set `dirname` or `extname` without setting either `history`,
   * `path`, `basename`, or `stem` too.
   *
   * @param {Compatible | null | undefined} [value]
   *   File value.
   * @returns
   *   New instance.
   */
  constructor(t) {
    let n;
    t ? sn(t) ? n = { path: t } : typeof t == "string" || Mu(t) ? n = { value: t } : n = t : n = {}, this.cwd = "cwd" in n ? "" : Eu.cwd(), this.data = {}, this.history = [], this.messages = [], this.value, this.map, this.result, this.stored;
    let r = -1;
    for (; ++r < Ut.length; ) {
      const l = Ut[r];
      l in n && n[l] !== void 0 && n[l] !== null && (this[l] = l === "history" ? [...n[l]] : n[l]);
    }
    let i;
    for (i in n)
      Ut.includes(i) || (this[i] = n[i]);
  }
  /**
   * Get the basename (including extname) (example: `'index.min.js'`).
   *
   * @returns {string | undefined}
   *   Basename.
   */
  get basename() {
    return typeof this.path == "string" ? Ie.basename(this.path) : void 0;
  }
  /**
   * Set basename (including extname) (`'index.min.js'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be nullified (use `file.path = file.dirname` instead).
   *
   * @param {string} basename
   *   Basename.
   * @returns {undefined}
   *   Nothing.
   */
  set basename(t) {
    qt(t, "basename"), $t(t, "basename"), this.path = Ie.join(this.dirname || "", t);
  }
  /**
   * Get the parent path (example: `'~'`).
   *
   * @returns {string | undefined}
   *   Dirname.
   */
  get dirname() {
    return typeof this.path == "string" ? Ie.dirname(this.path) : void 0;
  }
  /**
   * Set the parent path (example: `'~'`).
   *
   * Cannot be set if there’s no `path` yet.
   *
   * @param {string | undefined} dirname
   *   Dirname.
   * @returns {undefined}
   *   Nothing.
   */
  set dirname(t) {
    br(this.basename, "dirname"), this.path = Ie.join(t || "", this.basename);
  }
  /**
   * Get the extname (including dot) (example: `'.js'`).
   *
   * @returns {string | undefined}
   *   Extname.
   */
  get extname() {
    return typeof this.path == "string" ? Ie.extname(this.path) : void 0;
  }
  /**
   * Set the extname (including dot) (example: `'.js'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be set if there’s no `path` yet.
   *
   * @param {string | undefined} extname
   *   Extname.
   * @returns {undefined}
   *   Nothing.
   */
  set extname(t) {
    if ($t(t, "extname"), br(this.dirname, "extname"), t) {
      if (t.codePointAt(0) !== 46)
        throw new Error("`extname` must start with `.`");
      if (t.includes(".", 1))
        throw new Error("`extname` cannot contain multiple dots");
    }
    this.path = Ie.join(this.dirname, this.stem + (t || ""));
  }
  /**
   * Get the full path (example: `'~/index.min.js'`).
   *
   * @returns {string}
   *   Path.
   */
  get path() {
    return this.history[this.history.length - 1];
  }
  /**
   * Set the full path (example: `'~/index.min.js'`).
   *
   * Cannot be nullified.
   * You can set a file URL (a `URL` object with a `file:` protocol) which will
   * be turned into a path with `url.fileURLToPath`.
   *
   * @param {URL | string} path
   *   Path.
   * @returns {undefined}
   *   Nothing.
   */
  set path(t) {
    sn(t) && (t = Au(t)), qt(t, "path"), this.path !== t && this.history.push(t);
  }
  /**
   * Get the stem (basename w/o extname) (example: `'index.min'`).
   *
   * @returns {string | undefined}
   *   Stem.
   */
  get stem() {
    return typeof this.path == "string" ? Ie.basename(this.path, this.extname) : void 0;
  }
  /**
   * Set the stem (basename w/o extname) (example: `'index.min'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be nullified (use `file.path = file.dirname` instead).
   *
   * @param {string} stem
   *   Stem.
   * @returns {undefined}
   *   Nothing.
   */
  set stem(t) {
    qt(t, "stem"), $t(t, "stem"), this.path = Ie.join(this.dirname || "", t + (this.extname || ""));
  }
  // Normal prototypal methods.
  /**
   * Create a fatal message for `reason` associated with the file.
   *
   * The `fatal` field of the message is set to `true` (error; file not usable)
   * and the `file` field is set to the current file path.
   * The message is added to the `messages` field on `file`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {MessageOptions | null | undefined} [options]
   * @returns {never}
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {never}
   *   Never.
   * @throws {VFileMessage}
   *   Message.
   */
  fail(t, n, r) {
    const i = this.message(t, n, r);
    throw i.fatal = !0, i;
  }
  /**
   * Create an info message for `reason` associated with the file.
   *
   * The `fatal` field of the message is set to `undefined` (info; change
   * likely not needed) and the `file` field is set to the current file path.
   * The message is added to the `messages` field on `file`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {MessageOptions | null | undefined} [options]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {VFileMessage}
   *   Message.
   */
  info(t, n, r) {
    const i = this.message(t, n, r);
    return i.fatal = void 0, i;
  }
  /**
   * Create a message for `reason` associated with the file.
   *
   * The `fatal` field of the message is set to `false` (warning; change may be
   * needed) and the `file` field is set to the current file path.
   * The message is added to the `messages` field on `file`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {MessageOptions | null | undefined} [options]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {VFileMessage}
   *   Message.
   */
  message(t, n, r) {
    const i = new ue(
      // @ts-expect-error: the overloads are fine.
      t,
      n,
      r
    );
    return this.path && (i.name = this.path + ":" + i.name, i.file = this.path), i.fatal = !1, this.messages.push(i), i;
  }
  /**
   * Serialize the file.
   *
   * > **Note**: which encodings are supported depends on the engine.
   * > For info on Node.js, see:
   * > <https://nodejs.org/api/util.html#whatwg-supported-encodings>.
   *
   * @param {string | null | undefined} [encoding='utf8']
   *   Character encoding to understand `value` as when it’s a `Uint8Array`
   *   (default: `'utf-8'`).
   * @returns {string}
   *   Serialized file.
   */
  toString(t) {
    return this.value === void 0 ? "" : typeof this.value == "string" ? this.value : new TextDecoder(t || void 0).decode(this.value);
  }
}
function $t(e, t) {
  if (e && e.includes(Ie.sep))
    throw new Error(
      "`" + t + "` cannot be a path: did not expect `" + Ie.sep + "`"
    );
}
function qt(e, t) {
  if (!e)
    throw new Error("`" + t + "` cannot be empty");
}
function br(e, t) {
  if (!e)
    throw new Error("Setting `" + t + "` requires `path` to be set too");
}
function Mu(e) {
  return !!(e && typeof e == "object" && "byteLength" in e && "byteOffset" in e);
}
const Tu = (
  /**
   * @type {new <Parameters extends Array<unknown>, Result>(property: string | symbol) => (...parameters: Parameters) => Result}
   */
  /** @type {unknown} */
  /**
   * @this {Function}
   * @param {string | symbol} property
   * @returns {(...parameters: Array<unknown>) => unknown}
   */
  (function(e) {
    const r = (
      /** @type {Record<string | symbol, Function>} */
      // Prototypes do exist.
      // type-coverage:ignore-next-line
      this.constructor.prototype
    ), i = r[e], l = function() {
      return i.apply(l, arguments);
    };
    return Object.setPrototypeOf(l, r), l;
  })
), Lu = {}.hasOwnProperty;
class In extends Tu {
  /**
   * Create a processor.
   */
  constructor() {
    super("copy"), this.Compiler = void 0, this.Parser = void 0, this.attachers = [], this.compiler = void 0, this.freezeIndex = -1, this.frozen = void 0, this.namespace = {}, this.parser = void 0, this.transformers = gu();
  }
  /**
   * Copy a processor.
   *
   * @deprecated
   *   This is a private internal method and should not be used.
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *   New *unfrozen* processor ({@linkcode Processor}) that is
   *   configured to work the same as its ancestor.
   *   When the descendant processor is configured in the future it does not
   *   affect the ancestral processor.
   */
  copy() {
    const t = (
      /** @type {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>} */
      new In()
    );
    let n = -1;
    for (; ++n < this.attachers.length; ) {
      const r = this.attachers[n];
      t.use(...r);
    }
    return t.data(Zt(!0, {}, this.namespace)), t;
  }
  /**
   * Configure the processor with info available to all plugins.
   * Information is stored in an object.
   *
   * Typically, options can be given to a specific plugin, but sometimes it
   * makes sense to have information shared with several plugins.
   * For example, a list of HTML elements that are self-closing, which is
   * needed during all phases.
   *
   * > **Note**: setting information cannot occur on *frozen* processors.
   * > Call the processor first to create a new unfrozen processor.
   *
   * > **Note**: to register custom data in TypeScript, augment the
   * > {@linkcode Data} interface.
   *
   * @example
   *   This example show how to get and set info:
   *
   *   ```js
   *   import {unified} from 'unified'
   *
   *   const processor = unified().data('alpha', 'bravo')
   *
   *   processor.data('alpha') // => 'bravo'
   *
   *   processor.data() // => {alpha: 'bravo'}
   *
   *   processor.data({charlie: 'delta'})
   *
   *   processor.data() // => {charlie: 'delta'}
   *   ```
   *
   * @template {keyof Data} Key
   *
   * @overload
   * @returns {Data}
   *
   * @overload
   * @param {Data} dataset
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @overload
   * @param {Key} key
   * @returns {Data[Key]}
   *
   * @overload
   * @param {Key} key
   * @param {Data[Key]} value
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @param {Data | Key} [key]
   *   Key to get or set, or entire dataset to set, or nothing to get the
   *   entire dataset (optional).
   * @param {Data[Key]} [value]
   *   Value to set (optional).
   * @returns {unknown}
   *   The current processor when setting, the value at `key` when getting, or
   *   the entire dataset when getting without key.
   */
  data(t, n) {
    return typeof t == "string" ? arguments.length === 2 ? (Yt("data", this.frozen), this.namespace[t] = n, this) : Lu.call(this.namespace, t) && this.namespace[t] || void 0 : t ? (Yt("data", this.frozen), this.namespace = t, this) : this.namespace;
  }
  /**
   * Freeze a processor.
   *
   * Frozen processors are meant to be extended and not to be configured
   * directly.
   *
   * When a processor is frozen it cannot be unfrozen.
   * New processors working the same way can be created by calling the
   * processor.
   *
   * It’s possible to freeze processors explicitly by calling `.freeze()`.
   * Processors freeze automatically when `.parse()`, `.run()`, `.runSync()`,
   * `.stringify()`, `.process()`, or `.processSync()` are called.
   *
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *   The current processor.
   */
  freeze() {
    if (this.frozen)
      return this;
    const t = (
      /** @type {Processor} */
      /** @type {unknown} */
      this
    );
    for (; ++this.freezeIndex < this.attachers.length; ) {
      const [n, ...r] = this.attachers[this.freezeIndex];
      if (r[0] === !1)
        continue;
      r[0] === !0 && (r[0] = void 0);
      const i = n.call(t, ...r);
      typeof i == "function" && this.transformers.use(i);
    }
    return this.frozen = !0, this.freezeIndex = Number.POSITIVE_INFINITY, this;
  }
  /**
   * Parse text to a syntax tree.
   *
   * > **Note**: `parse` freezes the processor if not already *frozen*.
   *
   * > **Note**: `parse` performs the parse phase, not the run phase or other
   * > phases.
   *
   * @param {Compatible | undefined} [file]
   *   file to parse (optional); typically `string` or `VFile`; any value
   *   accepted as `x` in `new VFile(x)`.
   * @returns {ParseTree extends undefined ? Node : ParseTree}
   *   Syntax tree representing `file`.
   */
  parse(t) {
    this.freeze();
    const n = kt(t), r = this.parser || this.Parser;
    return Wt("parse", r), r(String(n), n);
  }
  /**
   * Process the given file as configured on the processor.
   *
   * > **Note**: `process` freezes the processor if not already *frozen*.
   *
   * > **Note**: `process` performs the parse, run, and stringify phases.
   *
   * @overload
   * @param {Compatible | undefined} file
   * @param {ProcessCallback<VFileWithOutput<CompileResult>>} done
   * @returns {undefined}
   *
   * @overload
   * @param {Compatible | undefined} [file]
   * @returns {Promise<VFileWithOutput<CompileResult>>}
   *
   * @param {Compatible | undefined} [file]
   *   File (optional); typically `string` or `VFile`]; any value accepted as
   *   `x` in `new VFile(x)`.
   * @param {ProcessCallback<VFileWithOutput<CompileResult>> | undefined} [done]
   *   Callback (optional).
   * @returns {Promise<VFile> | undefined}
   *   Nothing if `done` is given.
   *   Otherwise a promise, rejected with a fatal error or resolved with the
   *   processed file.
   *
   *   The parsed, transformed, and compiled value is available at
   *   `file.value` (see note).
   *
   *   > **Note**: unified typically compiles by serializing: most
   *   > compilers return `string` (or `Uint8Array`).
   *   > Some compilers, such as the one configured with
   *   > [`rehype-react`][rehype-react], return other values (in this case, a
   *   > React tree).
   *   > If you’re using a compiler that doesn’t serialize, expect different
   *   > result values.
   *   >
   *   > To register custom results in TypeScript, add them to
   *   > {@linkcode CompileResultMap}.
   *
   *   [rehype-react]: https://github.com/rehypejs/rehype-react
   */
  process(t, n) {
    const r = this;
    return this.freeze(), Wt("process", this.parser || this.Parser), Xt("process", this.compiler || this.Compiler), n ? i(void 0, n) : new Promise(i);
    function i(l, a) {
      const o = kt(t), c = (
        /** @type {HeadTree extends undefined ? Node : HeadTree} */
        /** @type {unknown} */
        r.parse(o)
      );
      r.run(c, o, function(u, h, p) {
        if (u || !h || !p)
          return s(u);
        const f = (
          /** @type {CompileTree extends undefined ? Node : CompileTree} */
          /** @type {unknown} */
          h
        ), w = r.stringify(f, p);
        zu(w) ? p.value = w : p.result = w, s(
          u,
          /** @type {VFileWithOutput<CompileResult>} */
          p
        );
      });
      function s(u, h) {
        u || !h ? a(u) : l ? l(h) : n(void 0, h);
      }
    }
  }
  /**
   * Process the given file as configured on the processor.
   *
   * An error is thrown if asynchronous transforms are configured.
   *
   * > **Note**: `processSync` freezes the processor if not already *frozen*.
   *
   * > **Note**: `processSync` performs the parse, run, and stringify phases.
   *
   * @param {Compatible | undefined} [file]
   *   File (optional); typically `string` or `VFile`; any value accepted as
   *   `x` in `new VFile(x)`.
   * @returns {VFileWithOutput<CompileResult>}
   *   The processed file.
   *
   *   The parsed, transformed, and compiled value is available at
   *   `file.value` (see note).
   *
   *   > **Note**: unified typically compiles by serializing: most
   *   > compilers return `string` (or `Uint8Array`).
   *   > Some compilers, such as the one configured with
   *   > [`rehype-react`][rehype-react], return other values (in this case, a
   *   > React tree).
   *   > If you’re using a compiler that doesn’t serialize, expect different
   *   > result values.
   *   >
   *   > To register custom results in TypeScript, add them to
   *   > {@linkcode CompileResultMap}.
   *
   *   [rehype-react]: https://github.com/rehypejs/rehype-react
   */
  processSync(t) {
    let n = !1, r;
    return this.freeze(), Wt("processSync", this.parser || this.Parser), Xt("processSync", this.compiler || this.Compiler), this.process(t, i), kr("processSync", "process", n), r;
    function i(l, a) {
      n = !0, yr(l), r = a;
    }
  }
  /**
   * Run *transformers* on a syntax tree.
   *
   * > **Note**: `run` freezes the processor if not already *frozen*.
   *
   * > **Note**: `run` performs the run phase, not other phases.
   *
   * @overload
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} done
   * @returns {undefined}
   *
   * @overload
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   * @param {Compatible | undefined} file
   * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} done
   * @returns {undefined}
   *
   * @overload
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   * @param {Compatible | undefined} [file]
   * @returns {Promise<TailTree extends undefined ? Node : TailTree>}
   *
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   *   Tree to transform and inspect.
   * @param {(
   *   RunCallback<TailTree extends undefined ? Node : TailTree> |
   *   Compatible
   * )} [file]
   *   File associated with `node` (optional); any value accepted as `x` in
   *   `new VFile(x)`.
   * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} [done]
   *   Callback (optional).
   * @returns {Promise<TailTree extends undefined ? Node : TailTree> | undefined}
   *   Nothing if `done` is given.
   *   Otherwise, a promise rejected with a fatal error or resolved with the
   *   transformed tree.
   */
  run(t, n, r) {
    wr(t), this.freeze();
    const i = this.transformers;
    return !r && typeof n == "function" && (r = n, n = void 0), r ? l(void 0, r) : new Promise(l);
    function l(a, o) {
      const c = kt(n);
      i.run(t, c, s);
      function s(u, h, p) {
        const f = (
          /** @type {TailTree extends undefined ? Node : TailTree} */
          h || t
        );
        u ? o(u) : a ? a(f) : r(void 0, f, p);
      }
    }
  }
  /**
   * Run *transformers* on a syntax tree.
   *
   * An error is thrown if asynchronous transforms are configured.
   *
   * > **Note**: `runSync` freezes the processor if not already *frozen*.
   *
   * > **Note**: `runSync` performs the run phase, not other phases.
   *
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   *   Tree to transform and inspect.
   * @param {Compatible | undefined} [file]
   *   File associated with `node` (optional); any value accepted as `x` in
   *   `new VFile(x)`.
   * @returns {TailTree extends undefined ? Node : TailTree}
   *   Transformed tree.
   */
  runSync(t, n) {
    let r = !1, i;
    return this.run(t, n, l), kr("runSync", "run", r), i;
    function l(a, o) {
      yr(a), i = o, r = !0;
    }
  }
  /**
   * Compile a syntax tree.
   *
   * > **Note**: `stringify` freezes the processor if not already *frozen*.
   *
   * > **Note**: `stringify` performs the stringify phase, not the run phase
   * > or other phases.
   *
   * @param {CompileTree extends undefined ? Node : CompileTree} tree
   *   Tree to compile.
   * @param {Compatible | undefined} [file]
   *   File associated with `node` (optional); any value accepted as `x` in
   *   `new VFile(x)`.
   * @returns {CompileResult extends undefined ? Value : CompileResult}
   *   Textual representation of the tree (see note).
   *
   *   > **Note**: unified typically compiles by serializing: most compilers
   *   > return `string` (or `Uint8Array`).
   *   > Some compilers, such as the one configured with
   *   > [`rehype-react`][rehype-react], return other values (in this case, a
   *   > React tree).
   *   > If you’re using a compiler that doesn’t serialize, expect different
   *   > result values.
   *   >
   *   > To register custom results in TypeScript, add them to
   *   > {@linkcode CompileResultMap}.
   *
   *   [rehype-react]: https://github.com/rehypejs/rehype-react
   */
  stringify(t, n) {
    this.freeze();
    const r = kt(n), i = this.compiler || this.Compiler;
    return Xt("stringify", i), wr(t), i(t, r);
  }
  /**
   * Configure the processor to use a plugin, a list of usable values, or a
   * preset.
   *
   * If the processor is already using a plugin, the previous plugin
   * configuration is changed based on the options that are passed in.
   * In other words, the plugin is not added a second time.
   *
   * > **Note**: `use` cannot be called on *frozen* processors.
   * > Call the processor first to create a new unfrozen processor.
   *
   * @example
   *   There are many ways to pass plugins to `.use()`.
   *   This example gives an overview:
   *
   *   ```js
   *   import {unified} from 'unified'
   *
   *   unified()
   *     // Plugin with options:
   *     .use(pluginA, {x: true, y: true})
   *     // Passing the same plugin again merges configuration (to `{x: true, y: false, z: true}`):
   *     .use(pluginA, {y: false, z: true})
   *     // Plugins:
   *     .use([pluginB, pluginC])
   *     // Two plugins, the second with options:
   *     .use([pluginD, [pluginE, {}]])
   *     // Preset with plugins and settings:
   *     .use({plugins: [pluginF, [pluginG, {}]], settings: {position: false}})
   *     // Settings only:
   *     .use({settings: {position: false}})
   *   ```
   *
   * @template {Array<unknown>} [Parameters=[]]
   * @template {Node | string | undefined} [Input=undefined]
   * @template [Output=Input]
   *
   * @overload
   * @param {Preset | null | undefined} [preset]
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @overload
   * @param {PluggableList} list
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @overload
   * @param {Plugin<Parameters, Input, Output>} plugin
   * @param {...(Parameters | [boolean])} parameters
   * @returns {UsePlugin<ParseTree, HeadTree, TailTree, CompileTree, CompileResult, Input, Output>}
   *
   * @param {PluggableList | Plugin | Preset | null | undefined} value
   *   Usable value.
   * @param {...unknown} parameters
   *   Parameters, when a plugin is given as a usable value.
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *   Current processor.
   */
  use(t, ...n) {
    const r = this.attachers, i = this.namespace;
    if (Yt("use", this.frozen), t != null) if (typeof t == "function")
      c(t, n);
    else if (typeof t == "object")
      Array.isArray(t) ? o(t) : a(t);
    else
      throw new TypeError("Expected usable value, not `" + t + "`");
    return this;
    function l(s) {
      if (typeof s == "function")
        c(s, []);
      else if (typeof s == "object")
        if (Array.isArray(s)) {
          const [u, ...h] = (
            /** @type {PluginTuple<Array<unknown>>} */
            s
          );
          c(u, h);
        } else
          a(s);
      else
        throw new TypeError("Expected usable value, not `" + s + "`");
    }
    function a(s) {
      if (!("plugins" in s) && !("settings" in s))
        throw new Error(
          "Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither"
        );
      o(s.plugins), s.settings && (i.settings = Zt(!0, i.settings, s.settings));
    }
    function o(s) {
      let u = -1;
      if (s != null) if (Array.isArray(s))
        for (; ++u < s.length; ) {
          const h = s[u];
          l(h);
        }
      else
        throw new TypeError("Expected a list of plugins, not `" + s + "`");
    }
    function c(s, u) {
      let h = -1, p = -1;
      for (; ++h < r.length; )
        if (r[h][0] === s) {
          p = h;
          break;
        }
      if (p === -1)
        r.push([s, ...u]);
      else if (u.length > 0) {
        let [f, ...w] = u;
        const k = r[p][1];
        on(k) && on(f) && (f = Zt(!0, k, f)), r[p] = [s, f, ...w];
      }
    }
  }
}
const Fu = new In().freeze();
function Wt(e, t) {
  if (typeof t != "function")
    throw new TypeError("Cannot `" + e + "` without `parser`");
}
function Xt(e, t) {
  if (typeof t != "function")
    throw new TypeError("Cannot `" + e + "` without `compiler`");
}
function Yt(e, t) {
  if (t)
    throw new Error(
      "Cannot call `" + e + "` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`."
    );
}
function wr(e) {
  if (!on(e) || typeof e.type != "string")
    throw new TypeError("Expected node, got `" + e + "`");
}
function kr(e, t, n) {
  if (!n)
    throw new Error(
      "`" + e + "` finished async. Use `" + t + "` instead"
    );
}
function kt(e) {
  return Pu(e) ? e : new hi(e);
}
function Pu(e) {
  return !!(e && typeof e == "object" && "message" in e && "messages" in e);
}
function zu(e) {
  return typeof e == "string" || Nu(e);
}
function Nu(e) {
  return !!(e && typeof e == "object" && "byteLength" in e && "byteOffset" in e);
}
const Du = "https://github.com/remarkjs/react-markdown/blob/main/changelog.md", Cr = [], vr = { allowDangerousHtml: !0 }, Vu = /^(https?|ircs?|mailto|xmpp)$/i, Bu = [
  { from: "astPlugins", id: "remove-buggy-html-in-markdown-parser" },
  { from: "allowDangerousHtml", id: "remove-buggy-html-in-markdown-parser" },
  {
    from: "allowNode",
    id: "replace-allownode-allowedtypes-and-disallowedtypes",
    to: "allowElement"
  },
  {
    from: "allowedTypes",
    id: "replace-allownode-allowedtypes-and-disallowedtypes",
    to: "allowedElements"
  },
  { from: "className", id: "remove-classname" },
  {
    from: "disallowedTypes",
    id: "replace-allownode-allowedtypes-and-disallowedtypes",
    to: "disallowedElements"
  },
  { from: "escapeHtml", id: "remove-buggy-html-in-markdown-parser" },
  { from: "includeElementIndex", id: "#remove-includeelementindex" },
  {
    from: "includeNodeIndex",
    id: "change-includenodeindex-to-includeelementindex"
  },
  { from: "linkTarget", id: "remove-linktarget" },
  { from: "plugins", id: "change-plugins-to-remarkplugins", to: "remarkPlugins" },
  { from: "rawSourcePos", id: "#remove-rawsourcepos" },
  { from: "renderers", id: "change-renderers-to-components", to: "components" },
  { from: "source", id: "change-source-to-children", to: "children" },
  { from: "sourcePos", id: "#remove-sourcepos" },
  { from: "transformImageUri", id: "#add-urltransform", to: "urlTransform" },
  { from: "transformLinkUri", id: "#add-urltransform", to: "urlTransform" }
];
function Ou(e) {
  const t = Ru(e), n = _u(e);
  return Hu(t.runSync(t.parse(n), n), e);
}
function Ru(e) {
  const t = e.rehypePlugins || Cr, n = e.remarkPlugins || Cr, r = e.remarkRehypeOptions ? { ...e.remarkRehypeOptions, ...vr } : vr;
  return Fu().use(xs).use(n).use(pu, r).use(t);
}
function _u(e) {
  const t = e.children || "", n = new hi();
  return typeof t == "string" && (n.value = t), n;
}
function Hu(e, t) {
  const n = t.allowedElements, r = t.allowElement, i = t.components, l = t.disallowedElements, a = t.skipHtml, o = t.unwrapDisallowed, c = t.urlTransform || ju;
  for (const u of Bu)
    Object.hasOwn(t, u.from) && ("" + u.from + (u.to ? "use `" + u.to + "` instead" : "remove it") + Du + u.id, void 0);
  return ci(e, s), Jl(e, {
    Fragment: it,
    components: i,
    ignoreInvalidStyle: !0,
    jsx: v,
    jsxs: ne,
    passKeys: !0,
    passNode: !0
  });
  function s(u, h, p) {
    if (u.type === "raw" && p && typeof h == "number")
      return a ? p.children.splice(h, 1) : p.children[h] = { type: "text", value: u.value }, h;
    if (u.type === "element") {
      let f;
      for (f in Rt)
        if (Object.hasOwn(Rt, f) && Object.hasOwn(u.properties, f)) {
          const w = u.properties[f], k = Rt[f];
          (k === null || k.includes(u.tagName)) && (u.properties[f] = c(String(w || ""), f, u));
        }
    }
    if (u.type === "element") {
      let f = n ? !n.includes(u.tagName) : l ? l.includes(u.tagName) : !1;
      if (!f && r && typeof h == "number" && (f = !r(u, h, p)), f && p && typeof h == "number")
        return o && u.children ? p.children.splice(h, 1, ...u.children) : p.children.splice(h, 1), h;
    }
  }
}
function ju(e) {
  const t = e.indexOf(":"), n = e.indexOf("?"), r = e.indexOf("#"), i = e.indexOf("/");
  return (
    // If there is no protocol, it’s relative.
    t === -1 || // If the first colon is after a `?`, `#`, or `/`, it’s not a protocol.
    i !== -1 && t > i || n !== -1 && t > n || r !== -1 && t > r || // It is a protocol, it should be allowed.
    Vu.test(e.slice(0, t)) ? e : ""
  );
}
const Zu = ({
  content: e,
  isLoading: t,
  role: n
}) => /* @__PURE__ */ ne("div", { className: "markdown-content", children: [
  /* @__PURE__ */ v(
    Ou,
    {
      components: {
        p: ({ children: r }) => /* @__PURE__ */ v("p", { className: "mb-3 last:mb-0", children: r }),
        ul: ({ children: r }) => /* @__PURE__ */ v("ul", { className: "list-disc list-inside mb-3 last:mb-0", children: r }),
        ol: ({ children: r }) => /* @__PURE__ */ v("ol", { className: "list-decimal list-inside mb-3 last:mb-0", children: r }),
        li: ({ children: r }) => /* @__PURE__ */ v("li", { className: "mb-0.5", children: r }),
        code: ({ children: r, ...i }) => !("inline" in i) || i.inline ? /* @__PURE__ */ v("code", { className: "px-1 py-0.5 rounded bg-black bg-opacity-10 text-sm", children: r }) : /* @__PURE__ */ v("pre", { className: "p-2 rounded bg-black bg-opacity-10 overflow-x-auto text-sm", children: /* @__PURE__ */ v("code", { children: r }) }),
        a: ({ children: r, href: i }) => /* @__PURE__ */ v(
          "a",
          {
            href: i,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "underline hover:opacity-80",
            children: r
          }
        ),
        strong: ({ children: r }) => /* @__PURE__ */ v("strong", { className: "font-semibold", children: r }),
        em: ({ children: r }) => /* @__PURE__ */ v("em", { className: "italic", children: r }),
        h1: ({ children: r }) => /* @__PURE__ */ v("h1", { className: "text-lg font-bold mb-1", children: r }),
        h2: ({ children: r }) => /* @__PURE__ */ v("h2", { className: "text-base font-bold mb-1", children: r }),
        h3: ({ children: r }) => /* @__PURE__ */ v("h3", { className: "text-sm font-bold mb-1", children: r }),
        blockquote: ({ children: r }) => /* @__PURE__ */ v("blockquote", { className: "border-l-2 pl-2 my-3 opacity-80", children: r })
      },
      children: e
    }
  ),
  t && n === "assistant" && /* @__PURE__ */ v("span", { className: "inline-block w-0.5 h-4 ml-0.5 bg-current animate-blink" })
] }), Uu = ({
  role: e,
  content: t,
  colors: n,
  styles: r,
  isLoading: i = !1
}) => /* @__PURE__ */ v("div", { className: `flex ${e === "user" ? "justify-end" : "justify-start"}`, children: /* @__PURE__ */ v(
  "div",
  {
    className: `max-w-xs px-3 py-2 ${sl[r.radius]} text-sm`,
    style: {
      backgroundColor: e === "user" ? n.accentColor : (r.theme === "dark", n.baseColor),
      color: e === "user" || r.theme === "dark" ? "#FFFFFF" : "#1F2937",
      ...e === "assistant" && {
        filter: r.theme === "dark" ? "brightness(1.5) contrast(0.9)" : "brightness(0.95) contrast(1.05)"
      }
    },
    children: /* @__PURE__ */ v(Zu, { content: t, isLoading: i, role: e })
  }
) }), Er = ({
  mode: e,
  isCallActive: t,
  theme: n,
  voiceEmptyMessage: r,
  voiceActiveEmptyMessage: i,
  chatEmptyMessage: l,
  hybridEmptyMessage: a
}) => /* @__PURE__ */ ne("div", { className: "text-center", children: [
  /* @__PURE__ */ v(
    "div",
    {
      className: `w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${n === "dark" ? "bg-gray-700" : "bg-gray-100"}`,
      children: e === "voice" ? /* @__PURE__ */ v(
        At,
        {
          size: 32,
          className: "text-gray-400"
        }
      ) : /* @__PURE__ */ v(
        Mr,
        {
          size: 32,
          className: "text-gray-400"
        }
      )
    }
  ),
  /* @__PURE__ */ v(
    "p",
    {
      className: `text-sm ${n === "dark" ? "text-gray-400" : "text-gray-500"}`,
      children: e === "voice" ? t ? i : r : e === "chat" ? l : a
    }
  )
] }), $u = ({
  isCallActive: e,
  connectionStatus: t,
  isAvailable: n,
  isMuted: r,
  onToggleCall: i,
  onToggleMute: l,
  startButtonText: a,
  endButtonText: o,
  colors: c
}) => /* @__PURE__ */ ne("div", { className: "flex items-center justify-center space-x-2", children: [
  e && t === "connected" && /* @__PURE__ */ v(
    "button",
    {
      onClick: l,
      className: "h-12 w-12 flex items-center justify-center rounded-full transition-all hover:opacity-90 active:scale-95",
      style: {
        backgroundColor: r ? "#ef4444" : c.accentColor,
        color: c.ctaButtonTextColor || "white"
      },
      title: r ? "Unmute microphone" : "Mute microphone",
      children: r ? /* @__PURE__ */ v(cn, { size: 20, weight: "fill" }) : /* @__PURE__ */ v(At, { size: 20, weight: "fill" })
    }
  ),
  /* @__PURE__ */ v(
    "button",
    {
      onClick: i,
      disabled: !n && !e,
      className: `px-6 py-3 rounded-full font-medium transition-all flex items-center space-x-2 ${!n && !e ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 active:scale-95"}`,
      style: {
        backgroundColor: e ? "#ef4444" : c.accentColor,
        color: c.ctaButtonTextColor || "white"
      },
      children: t === "connecting" ? /* @__PURE__ */ ne(it, { children: [
        /* @__PURE__ */ v("div", { className: "animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" }),
        /* @__PURE__ */ v("span", { children: "Connecting..." })
      ] }) : e ? /* @__PURE__ */ ne(it, { children: [
        /* @__PURE__ */ v(fn, { size: 16, weight: "fill" }),
        /* @__PURE__ */ v("span", { children: o })
      ] }) : /* @__PURE__ */ ne(it, { children: [
        /* @__PURE__ */ v(pn, { size: 16, weight: "bold" }),
        /* @__PURE__ */ v("span", { children: a })
      ] })
    }
  )
] }), qu = ({
  chatInput: e,
  isAvailable: t,
  onInputChange: n,
  onSendMessage: r,
  colors: i,
  styles: l,
  inputRef: a,
  placeholder: o = "Type your message..."
  // Default fallback
}) => /* @__PURE__ */ ne("div", { className: "flex items-center space-x-2", children: [
  /* @__PURE__ */ v(
    "input",
    {
      ref: a,
      type: "text",
      value: e,
      onChange: n,
      onKeyPress: (c) => c.key === "Enter" && t && r(),
      placeholder: o,
      className: `flex-1 px-3 py-2 rounded-lg border ${l.theme === "dark" ? "border-gray-600 text-white placeholder-gray-400" : "border-gray-300 text-gray-900 placeholder-gray-500"} focus:outline-none focus:ring-2`,
      style: {
        "--tw-ring-color": l.theme === "dark" ? `${i.accentColor}33` : `${i.accentColor}80`,
        // 50% opacity in light mode
        backgroundColor: i.baseColor,
        filter: l.theme === "dark" ? "brightness(1.8)" : "brightness(0.98)"
      }
    }
  ),
  /* @__PURE__ */ v(
    "button",
    {
      onClick: r,
      disabled: !e.trim() || !t,
      className: `h-10 w-10 flex items-center justify-center rounded-lg transition-all ${!e.trim() || !t ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 active:scale-95"}`,
      style: {
        backgroundColor: i.accentColor,
        color: i.ctaButtonTextColor || "white"
      },
      children: /* @__PURE__ */ v(hn, { size: 20, weight: "fill" })
    }
  )
] }), Wu = ({
  chatInput: e,
  isCallActive: t,
  connectionStatus: n,
  isChatAvailable: r,
  isVoiceAvailable: i,
  isMuted: l,
  onInputChange: a,
  onSendMessage: o,
  onToggleCall: c,
  onToggleMute: s,
  colors: u,
  styles: h,
  inputRef: p,
  placeholder: f = "Type your message..."
  // Default fallback
}) => /* @__PURE__ */ ne("div", { className: "flex items-center space-x-2", children: [
  /* @__PURE__ */ v(
    "input",
    {
      ref: p,
      type: "text",
      value: e,
      onChange: a,
      onKeyPress: (w) => w.key === "Enter" && r && !t && o(),
      placeholder: f,
      disabled: t,
      className: `flex-1 px-3 py-2 rounded-lg border ${h.theme === "dark" ? "border-gray-600 text-white placeholder-gray-400" : "border-gray-300 text-gray-900 placeholder-gray-500"} focus:outline-none focus:ring-2 ${t ? "opacity-50 cursor-not-allowed" : ""}`,
      style: {
        "--tw-ring-color": h.theme === "dark" ? `${u.accentColor}33` : `${u.accentColor}80`,
        // 50% opacity in light mode
        backgroundColor: u.baseColor,
        filter: h.theme === "dark" ? "brightness(1.8)" : "brightness(0.98)"
      }
    }
  ),
  /* @__PURE__ */ v(
    "button",
    {
      onClick: o,
      disabled: !e.trim() || !r || t,
      className: `h-10 w-10 flex items-center justify-center rounded-lg transition-all ${!e.trim() || !r || t ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 active:scale-95"}`,
      style: {
        backgroundColor: u.accentColor,
        color: u.ctaButtonTextColor || "white"
      },
      title: "Send message",
      children: /* @__PURE__ */ v(hn, { size: 20, weight: "fill" })
    }
  ),
  t && n === "connected" && /* @__PURE__ */ v(
    "button",
    {
      onClick: s,
      className: "h-10 w-10 flex items-center justify-center rounded-lg transition-all hover:opacity-90 active:scale-95",
      style: {
        backgroundColor: l ? "#ef4444" : u.accentColor,
        color: u.ctaButtonTextColor || "white"
      },
      title: l ? "Unmute microphone" : "Mute microphone",
      children: l ? /* @__PURE__ */ v(cn, { size: 20, weight: "fill" }) : /* @__PURE__ */ v(At, { size: 20, weight: "fill" })
    }
  ),
  /* @__PURE__ */ v(
    "button",
    {
      onClick: c,
      disabled: !i && !t,
      className: `h-10 w-10 flex items-center justify-center rounded-lg transition-all ${!i && !t ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 active:scale-95"}`,
      style: {
        backgroundColor: t ? "#ef4444" : u.accentColor,
        color: u.ctaButtonTextColor || "white"
      },
      title: n === "connecting" ? "Connecting..." : t ? "Stop voice call" : "Start voice call",
      children: n === "connecting" ? /* @__PURE__ */ v("div", { className: "animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" }) : t ? /* @__PURE__ */ v(fn, { size: 20, weight: "fill" }) : /* @__PURE__ */ v(pn, { size: 20, weight: "bold" })
    }
  )
] }), Gu = ({
  publicKey: e,
  assistantId: t,
  assistant: n,
  assistantOverrides: r,
  apiUrl: i,
  position: l = "bottom-right",
  size: a = "full",
  borderRadius: o,
  radius: c = "medium",
  // deprecated
  mode: s = "chat",
  theme: u = "light",
  // Colors
  baseBgColor: h,
  baseColor: p,
  // deprecated
  accentColor: f,
  ctaButtonColor: w,
  buttonBaseColor: k,
  // deprecated
  ctaButtonTextColor: A,
  buttonAccentColor: b,
  // deprecated
  // Text labels
  title: T,
  mainLabel: M,
  // deprecated
  startButtonText: R,
  endButtonText: _,
  ctaTitle: y,
  ctaSubtitle: z,
  // Empty messages
  voiceEmptyMessage: L,
  emptyVoiceMessage: B = "Click the start button to begin a conversation",
  // deprecated
  voiceActiveEmptyMessage: j,
  emptyVoiceActiveMessage: F = "Listening...",
  // deprecated
  chatEmptyMessage: P,
  emptyChatMessage: q = "Type a message to start chatting",
  // deprecated
  hybridEmptyMessage: S,
  emptyHybridMessage: E = "Use voice or text to communicate",
  // deprecated
  // Chat configuration
  chatFirstMessage: D,
  chatEndMessage: X,
  firstChatMessage: U,
  // deprecated
  chatPlaceholder: W,
  // Voice configuration
  voiceShowTranscript: m,
  showTranscript: N = !1,
  // deprecated
  voiceAutoReconnect: Y = !1,
  voiceReconnectStorage: d = "session",
  reconnectStorageKey: J = "vapi_widget_web_call",
  // Consent configuration
  consentRequired: ae,
  requireConsent: Q = !1,
  // deprecated
  consentTitle: ce,
  consentContent: ie,
  termsContent: ke = 'By clicking "Agree," and each time I interact with this AI agent, I consent to the recording, storage, and sharing of my communications with third-party service providers, and as otherwise described in our Terms of Service.',
  // deprecated
  consentStorageKey: xe,
  localStorageKey: ve = "vapi_widget_consent",
  // deprecated
  // Event handlers
  onVoiceStart: Oe,
  onCallStart: ht,
  // deprecated
  onVoiceEnd: Lt,
  onCallEnd: ft,
  // deprecated
  onMessage: pt,
  onError: dt
}) => {
  const Qe = "vapi_widget_expanded", [je, mt] = le(() => {
    try {
      return sessionStorage.getItem(Qe) === "true";
    } catch {
      return !1;
    }
  }), [Ft, Ge] = le(!1), [Ze, Re] = le(""), [Ue, x] = le(!1), I = Ve(null), O = Ve(null), $ = me(
    (oe) => {
      mt(oe);
      try {
        sessionStorage.setItem(Qe, oe.toString());
      } catch (Ae) {
        console.warn("Failed to save expanded state to localStorage:", Ae);
      }
    },
    [Qe]
  ), K = o ?? c, he = h ?? p, Fe = f ?? "#14B8A6", Ee = k ?? w ?? "#000000", _e = b ?? A ?? "#FFFFFF", Pe = T ?? M ?? "Talk with AI", fe = y ?? Pe, Ne = z, Se = R ?? "Start", fi = _ ?? "End Call", Mn = L ?? B, Tn = j ?? F, Ln = P ?? q, Fn = S ?? E, pi = D ?? U, Pt = m ?? N, zt = ae ?? Q, di = ce, mi = ie ?? ke, Nt = xe ?? ve, gi = Oe ?? ht, yi = Lt ?? ft, Pn = W ?? "Type your message...", xi = X ?? "This chat has ended. Thank you.", V = ll({
    mode: s,
    publicKey: e,
    assistantId: t,
    assistant: n,
    assistantOverrides: r,
    apiUrl: i,
    firstChatMessage: pi,
    voiceAutoReconnect: Y,
    voiceReconnectStorage: d,
    reconnectStorageKey: J,
    onCallStart: gi,
    onCallEnd: yi,
    onMessage: pt,
    onError: dt
  }), se = {
    baseColor: he ? u === "dark" && he === "#FFFFFF" ? "#000000" : he : u === "dark" ? "#000000" : "#FFFFFF",
    accentColor: Fe,
    ctaButtonColor: Ee,
    ctaButtonTextColor: _e
  }, pe = {
    size: s !== "voice" && a === "tiny" ? "compact" : a,
    radius: K,
    theme: u
  }, bi = je && !(s === "voice" && a === "tiny"), wi = () => ({
    ...Ar[a].expanded,
    ...al[c],
    backgroundColor: se.baseColor,
    border: `1px solid ${pe.theme === "dark" ? "#1F2937" : "#E5E7EB"}`,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: pe.theme === "dark" ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)" : "0 25px 50px -12px rgb(0 0 0 / 0.25)"
  }), ki = () => ({
    flex: "1 1 0%",
    padding: "1rem",
    overflowY: "auto",
    backgroundColor: se.baseColor,
    ...pe.theme === "dark" ? { filter: "brightness(1.1)" } : {}
  }), Ci = () => ({
    padding: "1rem",
    borderTop: `1px solid ${pe.theme === "dark" ? "#1F2937" : "#E5E7EB"}`,
    backgroundColor: se.baseColor,
    ...pe.theme === "dark" ? { filter: "brightness(1.05)" } : { filter: "brightness(0.97)" }
  }), vi = () => {
    const oe = V.conversation.length === 0, Ae = !Pt && V.voice.isCallActive && (s === "voice" || s === "hybrid"), Ke = s === "voice" && !V.voice.isCallActive;
    return oe || Ae || Ke ? {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    } : {
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem"
    };
  };
  Te(() => {
    if (zt) {
      const Ae = localStorage.getItem(Nt) === "true";
      Ge(Ae);
    } else
      Ge(!0);
  }, [zt, Nt]), Te(() => {
    I.current?.scrollIntoView({ behavior: "smooth" });
  }, [V.conversation, V.chat.isTyping]), Te(() => {
    je && (s === "chat" || s === "hybrid") && setTimeout(() => {
      O.current?.focus();
    }, 100);
  }, [je, s]);
  const Ei = () => {
    localStorage.setItem(Nt, "true"), Ge(!0);
  }, Si = () => {
    $(!1);
  }, Dt = async () => {
    await V.voice.toggleCall({ force: Y });
  }, zn = async () => {
    if (!Ze.trim()) return;
    const oe = Ze.trim();
    Re(""), await V.chat.sendMessage(oe), O.current?.focus();
  }, Nn = (oe) => {
    const Ae = oe.target.value;
    Re(Ae), V.chat.handleInput(Ae);
  }, Ai = () => {
    V.clearConversation(), x(!1), V.voice.isCallActive && V.voice.endCall({ force: Y }), Re(""), (s === "chat" || s === "hybrid") && setTimeout(() => {
      O.current?.focus();
    }, 100);
  }, Ii = async () => {
    try {
      await V.chat.sendMessage("Ending chat...", !0), x(!0);
    } finally {
      Re("");
    }
  }, Mi = () => {
    V.clearConversation(), x(!1), (s === "chat" || s === "hybrid") && setTimeout(() => {
      O.current?.focus();
    }, 100);
  }, Dn = () => {
    Ue && (V.clearConversation(), x(!1), Re("")), $(!1);
  }, Ti = () => {
    $(!0);
  }, gt = () => V.conversation.length === 0 ? /* @__PURE__ */ v(
    Er,
    {
      mode: s,
      isCallActive: V.voice.isCallActive,
      theme: pe.theme,
      voiceEmptyMessage: Mn,
      voiceActiveEmptyMessage: Tn,
      chatEmptyMessage: Ln,
      hybridEmptyMessage: Fn
    }
  ) : /* @__PURE__ */ ne(it, { children: [
    V.conversation.map((oe, Ae) => {
      try {
        const Ke = oe?.id || `${oe.role}-${Ae}`;
        return /* @__PURE__ */ v(
          Uu,
          {
            role: oe.role,
            content: oe.content || "",
            colors: se,
            styles: pe,
            isLoading: Ae === V.conversation.length - 1 && oe.role === "assistant" && V.chat.isTyping
          },
          Ke
        );
      } catch (Ke) {
        return console.error("Error rendering message:", Ke, oe), null;
      }
    }),
    /* @__PURE__ */ v("div", { ref: I })
  ] }), Li = () => Ue ? /* @__PURE__ */ ne(
    "div",
    {
      className: "flex flex-col items-center justify-center text-center gap-4",
      style: { width: "100%" },
      children: [
        /* @__PURE__ */ v(
          "div",
          {
            className: `text-base ${pe.theme === "dark" ? "text-gray-200" : "text-gray-800"}`,
            children: xi
          }
        ),
        /* @__PURE__ */ ne("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ v(
            "button",
            {
              onClick: Mi,
              className: "px-3 py-1.5 rounded-md",
              style: {
                backgroundColor: se.ctaButtonColor,
                color: se.ctaButtonTextColor
              },
              children: "Start new chat"
            }
          ),
          /* @__PURE__ */ v(
            "button",
            {
              onClick: Dn,
              className: `px-3 py-1.5 rounded-md ${pe.theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-800"}`,
              children: "Close"
            }
          )
        ] })
      ]
    }
  ) : s === "chat" ? gt() : s === "hybrid" ? V.voice.isCallActive ? Pt ? gt() : /* @__PURE__ */ v(
    vt,
    {
      size: 150,
      connectionStatus: V.voice.connectionStatus,
      isCallActive: V.voice.isCallActive,
      isSpeaking: V.voice.isSpeaking,
      isTyping: V.chat.isTyping,
      volumeLevel: V.voice.volumeLevel,
      baseColor: se.accentColor,
      colors: se.accentColor
    }
  ) : gt() : s === "voice" && V.voice.isCallActive ? Pt ? gt() : /* @__PURE__ */ v(
    vt,
    {
      size: 150,
      connectionStatus: V.voice.connectionStatus,
      isCallActive: V.voice.isCallActive,
      isSpeaking: V.voice.isSpeaking,
      isTyping: V.chat.isTyping,
      volumeLevel: V.voice.volumeLevel,
      baseColor: se.accentColor,
      colors: se.accentColor
    }
  ) : /* @__PURE__ */ v(
    Er,
    {
      mode: s,
      isCallActive: V.voice.isCallActive,
      theme: pe.theme,
      voiceEmptyMessage: Mn,
      voiceActiveEmptyMessage: Tn,
      chatEmptyMessage: Ln,
      hybridEmptyMessage: Fn
    }
  ), Fi = () => Ue ? null : s === "voice" ? /* @__PURE__ */ v(
    $u,
    {
      isCallActive: V.voice.isCallActive,
      connectionStatus: V.voice.connectionStatus,
      isAvailable: V.voice.isAvailable,
      isMuted: V.voice.isMuted,
      onToggleCall: Dt,
      onToggleMute: V.voice.toggleMute,
      startButtonText: Se,
      endButtonText: fi,
      colors: se
    }
  ) : s === "chat" ? /* @__PURE__ */ v(
    qu,
    {
      chatInput: Ze,
      isAvailable: V.chat.isAvailable,
      onInputChange: Nn,
      onSendMessage: zn,
      colors: se,
      styles: pe,
      inputRef: O,
      placeholder: Pn
    }
  ) : s === "hybrid" ? /* @__PURE__ */ v(
    Wu,
    {
      chatInput: Ze,
      isCallActive: V.voice.isCallActive,
      connectionStatus: V.voice.connectionStatus,
      isChatAvailable: V.chat.isAvailable,
      isVoiceAvailable: V.voice.isAvailable,
      isMuted: V.voice.isMuted,
      onInputChange: Nn,
      onSendMessage: zn,
      onToggleCall: Dt,
      onToggleMute: V.voice.toggleMute,
      colors: se,
      styles: pe,
      inputRef: O,
      placeholder: Pn
    }
  ) : null, Pi = () => zt && !Ft ? /* @__PURE__ */ v(
    cl,
    {
      consentTitle: di,
      consentContent: mi,
      onAccept: Ei,
      onCancel: Si,
      colors: se,
      styles: pe,
      radius: c
    }
  ) : /* @__PURE__ */ ne("div", { style: wi(), children: [
    /* @__PURE__ */ v(
      kl,
      {
        mode: s,
        connectionStatus: V.voice.connectionStatus,
        isCallActive: V.voice.isCallActive,
        isSpeaking: V.voice.isSpeaking,
        isTyping: V.chat.isTyping,
        hasActiveConversation: V.conversation.length > 0,
        mainLabel: Pe,
        onClose: Dn,
        onReset: Ai,
        onChatComplete: Ii,
        showEndChatButton: !Ue,
        colors: se,
        styles: pe
      }
    ),
    /* @__PURE__ */ v(
      "div",
      {
        className: "vapi-conversation-area",
        style: {
          ...ki(),
          ...vi()
        },
        children: Li()
      }
    ),
    /* @__PURE__ */ v("div", { style: Ci(), children: Fi() })
  ] });
  return /* @__PURE__ */ v("div", { className: "vapi-widget-wrapper", children: /* @__PURE__ */ v(
    "div",
    {
      style: {
        position: "fixed",
        zIndex: 9999,
        ...ul[l]
      },
      children: bi ? Pi() : /* @__PURE__ */ v(
        hl,
        {
          isCallActive: V.voice.isCallActive,
          connectionStatus: V.voice.connectionStatus,
          isSpeaking: V.voice.isSpeaking,
          isTyping: V.chat.isTyping,
          volumeLevel: V.voice.volumeLevel,
          onClick: Ti,
          onToggleCall: Dt,
          mainLabel: Pe,
          ctaTitle: fe,
          ctaSubtitle: Ne,
          colors: se,
          styles: pe,
          mode: s
        }
      )
    }
  ) });
};
export {
  Yi as VapiChatClient,
  Gu as VapiWidget,
  Oi as areCallOptionsEqual,
  xt as clearStoredCall,
  Ki as createAssistantMessage,
  Gi as createUserMessage,
  Ji as extractContentFromPath,
  Bi as getStoredCallData,
  nl as handleStreamChunk,
  rl as handleStreamComplete,
  tl as handleStreamError,
  el as preallocateAssistantMessage,
  Rn as resetAssistantMessageTracking,
  Vi as storeCallData,
  Ri as useVapiCall,
  il as useVapiChat,
  ll as useVapiWidget,
  Qi as validateChatInput
};

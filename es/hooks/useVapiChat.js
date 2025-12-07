import { useState as S, useRef as d, useEffect as V, useCallback as F } from "react";
import { extractContentFromPath as H, VapiChatClient as J } from "../utils/vapiChatClient.js";
const N = (t, e, r, n, c) => {
  if (!e || !t.trim())
    throw new Error("Chat is disabled or message is empty");
  if (!r || !n)
    throw new Error(
      "Missing required configuration: publicKey and assistantId"
    );
  if (!c)
    throw new Error("Chat client not initialized");
}, Q = (t) => ({
  role: "user",
  content: t.trim(),
  timestamp: /* @__PURE__ */ new Date()
}), U = (t) => ({
  role: "assistant",
  content: t,
  timestamp: /* @__PURE__ */ new Date()
}), k = (t, e) => {
  t.current = "", e.current = null;
}, W = (t, e) => {
  e((r) => {
    const n = [...r];
    return t.current = n.length, n.push({
      role: "assistant",
      content: "",
      // Start with empty content
      timestamp: /* @__PURE__ */ new Date()
    }), n;
  });
}, X = (t, e, r, n) => {
  console.error("Stream error:", t), e(!1), r.current = null, n?.(t);
}, Y = (t, e, r, n, c, g) => {
  t.sessionId && t.sessionId !== e && r(t.sessionId);
  const s = H(t);
  if (s && (n.current += s, c.current !== null)) {
    const i = c.current;
    g((p) => {
      const a = [...p];
      return i < a.length && (a[i] = {
        ...a[i],
        content: n.current
      }), a;
    });
  }
}, Z = (t, e, r, n) => {
  if (t(!1), e.current = null, r.current) {
    const c = U(
      r.current
    );
    n?.(c);
  }
}, O = ({
  enabled: t = !0,
  publicKey: e,
  assistantId: r,
  assistantOverrides: n,
  apiUrl: c,
  sessionId: g,
  firstChatMessage: s,
  onMessage: i,
  onError: p
}) => {
  const [a, w] = S(() => t && s ? [
    {
      role: "assistant",
      content: s,
      timestamp: /* @__PURE__ */ new Date()
    }
  ] : []), [q, m] = S(!1), [v, T] = S(!1), [D, y] = S(
    g
  ), R = d(null), A = d(null), I = d(""), u = d(null), E = d(!1);
  V(() => (e && t && (R.current = new J({ publicKey: e, apiUrl: c })), () => {
    A.current?.();
  }), [e, c, t]), V(() => {
    g && y(g);
  }, [g]);
  const L = F(
    (o) => {
      w((l) => [...l, o]), i?.(o);
    },
    [i]
  ), z = F(
    async (o, l = !1) => {
      try {
        if (l) {
          if (E.current)
            return;
          E.current = !0;
        }
        if (N(
          o,
          t,
          e,
          r,
          R.current
        ), T(!0), !l && o.trim()) {
          const f = Q(o);
          L(f);
        }
        if (!l)
          k(
            I,
            u
          ), W(u, w), m(!0);
        else {
          const f = o.trim() || "Ending chat...";
          w((G) => [
            ...G,
            {
              role: "assistant",
              content: f,
              timestamp: /* @__PURE__ */ new Date()
            }
          ]), m(!0);
        }
        const h = (f) => X(
          f,
          m,
          u,
          p
        ), P = (f) => Y(
          f,
          D,
          y,
          I,
          u,
          w
        ), j = l ? () => {
          m(!1), u.current = null;
        } : () => Z(
          m,
          u,
          I,
          i
        );
        let C;
        l ? C = o.trim() : s && s.trim() !== "" && a.length === 1 && a[0].role === "assistant" ? C = [
          {
            role: "assistant",
            content: s
          },
          {
            role: "user",
            content: o.trim()
          }
        ] : C = o.trim();
        const B = await R.current.streamChat(
          {
            input: C,
            assistantId: r,
            assistantOverrides: n,
            sessionId: D,
            stream: !0,
            sessionEnd: l
          },
          P,
          h,
          j
        );
        A.current = B;
      } catch (h) {
        throw console.error("Error sending message:", h), m(!1), u.current = null, p?.(h), h;
      } finally {
        T(!1), l && (E.current = !1);
      }
    },
    [
      t,
      e,
      r,
      n,
      D,
      L,
      p,
      i,
      s,
      a
    ]
  ), M = F(() => {
    w(t && s ? [
      {
        role: "assistant",
        content: s,
        timestamp: /* @__PURE__ */ new Date()
      }
    ] : []), A.current?.(), m(!1), T(!1), k(
      I,
      u
    ), y(void 0);
  }, [t, s]);
  return {
    // State
    messages: a,
    isTyping: q,
    isLoading: v,
    sessionId: D,
    isEnabled: t,
    // Handlers
    sendMessage: z,
    clearMessages: M
  };
};
export {
  U as createAssistantMessage,
  Q as createUserMessage,
  Y as handleStreamChunk,
  Z as handleStreamComplete,
  X as handleStreamError,
  W as preallocateAssistantMessage,
  k as resetAssistantMessageTracking,
  O as useVapiChat,
  N as validateChatInput
};
//# sourceMappingURL=useVapiChat.js.map

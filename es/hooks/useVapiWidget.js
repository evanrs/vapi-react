import { useState as h, useCallback as v } from "react";
import { useVapiCall as z } from "./useVapiCall.js";
import { useVapiChat as B } from "./useVapiChat.js";
const H = ({
  mode: a,
  publicKey: u,
  assistantId: o,
  assistant: C,
  assistantOverrides: g,
  apiUrl: b,
  firstChatMessage: A,
  voiceAutoReconnect: M = !1,
  voiceReconnectStorage: T = "session",
  reconnectStorageKey: V,
  onCallStart: w,
  onCallEnd: x,
  onMessage: p,
  onError: d
}) => {
  const [f, i] = h(null), [E, r] = h(!1), [y, l] = h([]), L = () => {
    if (C)
      return C;
    if (o)
      return g ? {
        assistantId: o,
        assistantOverrides: g
      } : o;
  }, m = a === "voice" || a === "hybrid", t = z({
    publicKey: u,
    callOptions: L(),
    apiUrl: b,
    enabled: m,
    voiceAutoReconnect: M,
    voiceReconnectStorage: T,
    reconnectStorageKey: V,
    onCallStart: () => {
      a === "hybrid" && (e.clearMessages(), l([])), i("voice"), r(!1), w?.();
    },
    onCallEnd: () => {
      i(null), x?.();
    },
    onMessage: p,
    onError: d,
    onTranscript: (s) => {
      const c = {
        role: s.role,
        content: s.text,
        timestamp: s.timestamp
      };
      l((q) => [...q, c]);
    }
  }), n = a === "chat" || a === "hybrid", e = B({
    enabled: n,
    publicKey: n ? u : void 0,
    assistantId: n ? o : void 0,
    assistantOverrides: n ? g : void 0,
    apiUrl: b,
    onMessage: p,
    // Keep the callback for external notifications
    onError: d,
    firstChatMessage: A
  }), S = a === "voice" ? y : a === "chat" ? e.messages : [...y, ...e.messages].sort(
    (s, c) => s.timestamp.getTime() - c.timestamp.getTime()
  ), k = v((s) => {
    r(s.length > 0);
  }, []), I = v(
    async (s, c = !1) => {
      a === "hybrid" && (t.isCallActive && await t.endCall({ force: !0 }), f !== "chat" && (l([]), e.clearMessages()), i("chat")), await e.sendMessage(s, c);
    },
    [a, e, t, f]
  ), O = v(
    async ({ force: s } = {}) => {
      a === "hybrid" && !t.isCallActive && (e.clearMessages(), l([]), i("voice"), r(!1)), await t.toggleCall({ force: s });
    },
    [a, t, e]
  ), U = v(() => {
    l([]), e.clearMessages(), i(null), r(!1);
  }, [e]), W = m && !t.isCallActive && !e.isLoading, j = n && !e.isLoading;
  return {
    // Current mode and state
    mode: a,
    activeMode: f,
    conversation: S,
    // Voice state and handlers
    voice: {
      ...t,
      isAvailable: W,
      toggleCall: O
    },
    // Chat state and handlers
    chat: {
      ...e,
      isAvailable: j,
      sendMessage: I,
      handleInput: k
    },
    // Combined handlers
    clearConversation: U,
    isUserTyping: E
  };
};
export {
  H as useVapiWidget
};
//# sourceMappingURL=useVapiWidget.js.map

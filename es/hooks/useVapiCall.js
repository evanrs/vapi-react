import { useState as d, useRef as J, useEffect as h, useCallback as f } from "react";
import Q from "@vapi-ai/web";
import { storeCallData as W, getStoredCallData as X, areCallOptionsEqual as Y, clearStoredCall as m } from "../utils/vapiCallStorage.js";
const S = ({
  publicKey: k,
  callOptions: o,
  apiUrl: $,
  enabled: i = !0,
  voiceAutoReconnect: c = !1,
  voiceReconnectStorage: r = "session",
  reconnectStorageKey: l = "vapi_widget_web_call",
  onCallStart: D,
  onCallEnd: V,
  onMessage: g,
  onError: I,
  onTranscript: U
}) => {
  const [t] = d(
    () => k ? new Q(k, $) : null
  ), [u, v] = d(!1), [j, C] = d(!1), [w, _] = d(!1), [z, b] = d(0), [B, a] = d("disconnected"), s = J({
    onCallStart: D,
    onCallEnd: V,
    onMessage: g,
    onError: I,
    onTranscript: U
  });
  h(() => {
    s.current = {
      onCallStart: D,
      onCallEnd: V,
      onMessage: g,
      onError: I,
      onTranscript: U
    };
  }), h(() => {
    if (!t)
      return;
    const n = () => {
      v(!0), a("connected"), s.current.onCallStart?.();
    }, p = () => {
      v(!1), a("disconnected"), b(0), C(!1), _(!1), m(
        l,
        r
      ), s.current.onCallEnd?.();
    }, x = () => {
      C(!0);
    }, P = () => {
      C(!1);
    }, q = (e) => {
      b(e);
    }, N = (e) => {
      e.type === "transcript" && e.transcriptType === "final" && (e.role === "user" || e.role === "assistant") && s.current.onTranscript?.({
        role: e.role,
        text: e.transcript,
        timestamp: /* @__PURE__ */ new Date()
      }), s.current.onMessage?.(e);
    }, T = (e) => {
      console.error("Vapi error:", e), a("disconnected"), v(!1), C(!1), s.current.onError?.(e);
    };
    return t.on("call-start", n), t.on("call-end", p), t.on("speech-start", x), t.on("speech-end", P), t.on("volume-level", q), t.on("message", N), t.on("error", T), () => {
      t.removeListener("call-start", n), t.removeListener("call-end", p), t.removeListener("speech-start", x), t.removeListener("speech-end", P), t.removeListener("volume-level", q), t.removeListener("message", N), t.removeListener("error", T);
    };
  }, [t, l, r]), h(() => () => {
    t && t.stop();
  }, [t]);
  const L = f(async () => {
    if (!t || !i) {
      console.error("Cannot start call: no vapi instance or not enabled");
      return;
    }
    try {
      console.log("Starting call with configuration:", o), console.log("Starting call with options:", {
        voiceAutoReconnect: c
      }), a("connecting");
      const n = await t.start(
        // assistant
        o,
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
          roomDeleteOnUserLeaveEnabled: !c
        }
      );
      n && c && W(
        l,
        n,
        o,
        r
      );
    } catch (n) {
      console.error("Error starting call:", n), a("disconnected"), s.current.onError?.(n);
    }
  }, [
    t,
    o,
    i,
    c,
    r,
    l
  ]), E = f(
    async ({ force: n = !1 } = {}) => {
      if (!t) {
        console.log("Cannot end call: no vapi instance");
        return;
      }
      console.log("Ending call with force:", n), n ? t.end() : t.stop();
    },
    [t]
  ), F = f(
    async ({ force: n = !1 } = {}) => {
      u ? await E({ force: n }) : await L();
    },
    [u, L, E]
  ), G = f(() => {
    if (!t || !u) {
      console.log("Cannot toggle mute: no vapi instance or call not active");
      return;
    }
    const n = !w;
    t.setMuted(n), _(n);
  }, [t, u, w]), M = f(async () => {
    if (!t || !i) {
      console.error("Cannot reconnect: no vapi instance or not enabled");
      return;
    }
    const n = X(
      l,
      r
    );
    if (!n) {
      console.warn("No stored call data found for reconnection");
      return;
    }
    if (!Y(n.callOptions, o)) {
      console.warn(
        "CallOptions have changed since last call, clearing stored data and skipping reconnection"
      ), m(
        l,
        r
      );
      return;
    }
    a("connecting");
    try {
      await t.reconnect({
        webCallUrl: n.webCallUrl,
        id: n.id,
        artifactPlan: n.artifactPlan,
        assistant: n.assistant
      }), console.log("Successfully reconnected to call");
    } catch (p) {
      a("disconnected"), console.error("Reconnection failed:", p), m(
        l,
        r
      ), s.current.onError?.(p);
    }
  }, [t, i, l, r, o]), H = f(() => {
    m(l, r);
  }, [l, r]);
  return h(() => {
    !t || !i || !c || M();
  }, [t, i, c, M, l]), {
    // State
    isCallActive: u,
    isSpeaking: j,
    volumeLevel: z,
    connectionStatus: B,
    isMuted: w,
    // Handlers
    startCall: L,
    endCall: E,
    toggleCall: F,
    toggleMute: G,
    reconnect: M,
    clearStoredCall: H
  };
};
export {
  S as useVapiCall
};
//# sourceMappingURL=useVapiCall.js.map

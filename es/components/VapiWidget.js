import { jsx as o, jsxs as h, Fragment as ut } from "react/jsx-runtime";
import { useState as p, useRef as z, useCallback as ht, useEffect as B } from "react";
import "@vapi-ai/web";
import "js-cookie";
import "@microsoft/fetch-event-source";
import { useVapiWidget as pt } from "../hooks/useVapiWidget.js";
import { positionStyles as Ct, radiusStyles as mt, sizeStyles as yt } from "./constants.js";
import St from "./widget/ConsentForm.js";
import bt from "./widget/FloatingButton.js";
import xt from "./widget/WidgetHeader.js";
import H from "./AnimatedStatusIcon.js";
import At from "./widget/conversation/Message.js";
import D from "./widget/conversation/EmptyState.js";
import Tt from "./widget/controls/VoiceControls.js";
import Et from "./widget/controls/ChatControls.js";
import kt from "./widget/controls/HybridControls.js";
/* empty css                       */
const qt = ({
  publicKey: K,
  assistantId: O,
  assistant: q,
  assistantOverrides: P,
  apiUrl: U,
  position: Y = "bottom-right",
  size: v = "full",
  borderRadius: G,
  radius: C = "medium",
  // deprecated
  mode: t = "chat",
  theme: m = "light",
  // Colors
  baseBgColor: J,
  baseColor: Q,
  // deprecated
  accentColor: X,
  ctaButtonColor: Z,
  buttonBaseColor: ee,
  // deprecated
  ctaButtonTextColor: te,
  buttonAccentColor: oe,
  // deprecated
  // Text labels
  title: ne,
  mainLabel: ie,
  // deprecated
  startButtonText: se,
  endButtonText: ae,
  ctaTitle: ce,
  ctaSubtitle: re,
  // Empty messages
  voiceEmptyMessage: le,
  emptyVoiceMessage: ve = "Click the start button to begin a conversation",
  // deprecated
  voiceActiveEmptyMessage: de,
  emptyVoiceActiveMessage: fe = "Listening...",
  // deprecated
  chatEmptyMessage: ge,
  emptyChatMessage: ue = "Type a message to start chatting",
  // deprecated
  hybridEmptyMessage: he,
  emptyHybridMessage: pe = "Use voice or text to communicate",
  // deprecated
  // Chat configuration
  chatFirstMessage: Ce,
  chatEndMessage: me,
  firstChatMessage: ye,
  // deprecated
  chatPlaceholder: Se,
  // Voice configuration
  voiceShowTranscript: be,
  showTranscript: xe = !1,
  // deprecated
  voiceAutoReconnect: y = !1,
  voiceReconnectStorage: Ae = "session",
  reconnectStorageKey: Te = "vapi_widget_web_call",
  // Consent configuration
  consentRequired: Ee,
  requireConsent: ke = !1,
  // deprecated
  consentTitle: Me,
  consentContent: we,
  termsContent: Fe = 'By clicking "Agree," and each time I interact with this AI agent, I consent to the recording, storage, and sharing of my communications with third-party service providers, and as otherwise described in our Terms of Service.',
  // deprecated
  consentStorageKey: Be,
  localStorageKey: Ie = "vapi_widget_consent",
  // deprecated
  // Event handlers
  onVoiceStart: Le,
  onCallStart: Ve,
  // deprecated
  onVoiceEnd: Ne,
  onCallEnd: We,
  // deprecated
  onMessage: _e,
  onError: $e
}) => {
  const S = "vapi_widget_expanded", [b, Re] = p(() => {
    try {
      return sessionStorage.getItem(S) === "true";
    } catch {
      return !1;
    }
  }), [je, x] = p(!1), [d, r] = p(""), [f, g] = p(!1), I = z(null), c = z(null), A = ht(
    (n) => {
      Re(n);
      try {
        sessionStorage.setItem(S, n.toString());
      } catch (a) {
        console.warn("Failed to save expanded state to localStorage:", a);
      }
    },
    [S]
  ), ze = G ?? C, T = J ?? Q, He = X ?? "#14B8A6", De = ee ?? Z ?? "#000000", Ke = oe ?? te ?? "#FFFFFF", E = ne ?? ie ?? "Talk with AI", Oe = ce ?? E, qe = re, Pe = se ?? "Start", Ue = ae ?? "End Call", L = le ?? ve, V = de ?? fe, N = ge ?? ue, W = he ?? pe, Ye = Ce ?? ye, k = be ?? xe, M = Ee ?? ke, Ge = Me, Je = we ?? Fe, w = Be ?? Ie, Qe = Le ?? Ve, Xe = Ne ?? We, _ = Se ?? "Type your message...", Ze = me ?? "This chat has ended. Thank you.", e = pt({
    mode: t,
    publicKey: K,
    assistantId: O,
    assistant: q,
    assistantOverrides: P,
    apiUrl: U,
    firstChatMessage: Ye,
    voiceAutoReconnect: y,
    voiceReconnectStorage: Ae,
    reconnectStorageKey: Te,
    onCallStart: Qe,
    onCallEnd: Xe,
    onMessage: _e,
    onError: $e
  }), i = {
    baseColor: T ? m === "dark" && T === "#FFFFFF" ? "#000000" : T : m === "dark" ? "#000000" : "#FFFFFF",
    accentColor: He,
    ctaButtonColor: De,
    ctaButtonTextColor: Ke
  }, s = {
    size: t !== "voice" && v === "tiny" ? "compact" : v,
    radius: ze,
    theme: m
  }, et = b && !(t === "voice" && v === "tiny"), tt = () => ({
    ...yt[v].expanded,
    ...mt[C],
    backgroundColor: i.baseColor,
    border: `1px solid ${s.theme === "dark" ? "#1F2937" : "#E5E7EB"}`,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: s.theme === "dark" ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)" : "0 25px 50px -12px rgb(0 0 0 / 0.25)"
  }), ot = () => ({
    flex: "1 1 0%",
    padding: "1rem",
    overflowY: "auto",
    backgroundColor: i.baseColor,
    ...s.theme === "dark" ? { filter: "brightness(1.1)" } : {}
  }), nt = () => ({
    padding: "1rem",
    borderTop: `1px solid ${s.theme === "dark" ? "#1F2937" : "#E5E7EB"}`,
    backgroundColor: i.baseColor,
    ...s.theme === "dark" ? { filter: "brightness(1.05)" } : { filter: "brightness(0.97)" }
  }), it = () => {
    const n = e.conversation.length === 0, a = !k && e.voice.isCallActive && (t === "voice" || t === "hybrid"), l = t === "voice" && !e.voice.isCallActive;
    return n || a || l ? {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    } : {
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem"
    };
  };
  B(() => {
    if (M) {
      const a = localStorage.getItem(w) === "true";
      x(a);
    } else
      x(!0);
  }, [M, w]), B(() => {
    I.current?.scrollIntoView({ behavior: "smooth" });
  }, [e.conversation, e.chat.isTyping]), B(() => {
    b && (t === "chat" || t === "hybrid") && setTimeout(() => {
      c.current?.focus();
    }, 100);
  }, [b, t]);
  const st = () => {
    localStorage.setItem(w, "true"), x(!0);
  }, at = () => {
    A(!1);
  }, F = async () => {
    await e.voice.toggleCall({ force: y });
  }, $ = async () => {
    if (!d.trim()) return;
    const n = d.trim();
    r(""), await e.chat.sendMessage(n), c.current?.focus();
  }, R = (n) => {
    const a = n.target.value;
    r(a), e.chat.handleInput(a);
  }, ct = () => {
    e.clearConversation(), g(!1), e.voice.isCallActive && e.voice.endCall({ force: y }), r(""), (t === "chat" || t === "hybrid") && setTimeout(() => {
      c.current?.focus();
    }, 100);
  }, rt = async () => {
    try {
      await e.chat.sendMessage("Ending chat...", !0), g(!0);
    } finally {
      r("");
    }
  }, lt = () => {
    e.clearConversation(), g(!1), (t === "chat" || t === "hybrid") && setTimeout(() => {
      c.current?.focus();
    }, 100);
  }, j = () => {
    f && (e.clearConversation(), g(!1), r("")), A(!1);
  }, vt = () => {
    A(!0);
  }, u = () => e.conversation.length === 0 ? /* @__PURE__ */ o(
    D,
    {
      mode: t,
      isCallActive: e.voice.isCallActive,
      theme: s.theme,
      voiceEmptyMessage: L,
      voiceActiveEmptyMessage: V,
      chatEmptyMessage: N,
      hybridEmptyMessage: W
    }
  ) : /* @__PURE__ */ h(ut, { children: [
    e.conversation.map((n, a) => {
      try {
        const l = n?.id || `${n.role}-${a}`;
        return /* @__PURE__ */ o(
          At,
          {
            role: n.role,
            content: n.content || "",
            colors: i,
            styles: s,
            isLoading: a === e.conversation.length - 1 && n.role === "assistant" && e.chat.isTyping
          },
          l
        );
      } catch (l) {
        return console.error("Error rendering message:", l, n), null;
      }
    }),
    /* @__PURE__ */ o("div", { ref: I })
  ] }), dt = () => f ? /* @__PURE__ */ h(
    "div",
    {
      className: "flex flex-col items-center justify-center text-center gap-4",
      style: { width: "100%" },
      children: [
        /* @__PURE__ */ o(
          "div",
          {
            className: `text-base ${s.theme === "dark" ? "text-gray-200" : "text-gray-800"}`,
            children: Ze
          }
        ),
        /* @__PURE__ */ h("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ o(
            "button",
            {
              onClick: lt,
              className: "px-3 py-1.5 rounded-md",
              style: {
                backgroundColor: i.ctaButtonColor,
                color: i.ctaButtonTextColor
              },
              children: "Start new chat"
            }
          ),
          /* @__PURE__ */ o(
            "button",
            {
              onClick: j,
              className: `px-3 py-1.5 rounded-md ${s.theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-800"}`,
              children: "Close"
            }
          )
        ] })
      ]
    }
  ) : t === "chat" ? u() : t === "hybrid" ? e.voice.isCallActive ? k ? u() : /* @__PURE__ */ o(
    H,
    {
      size: 150,
      connectionStatus: e.voice.connectionStatus,
      isCallActive: e.voice.isCallActive,
      isSpeaking: e.voice.isSpeaking,
      isTyping: e.chat.isTyping,
      volumeLevel: e.voice.volumeLevel,
      baseColor: i.accentColor,
      colors: i.accentColor
    }
  ) : u() : t === "voice" && e.voice.isCallActive ? k ? u() : /* @__PURE__ */ o(
    H,
    {
      size: 150,
      connectionStatus: e.voice.connectionStatus,
      isCallActive: e.voice.isCallActive,
      isSpeaking: e.voice.isSpeaking,
      isTyping: e.chat.isTyping,
      volumeLevel: e.voice.volumeLevel,
      baseColor: i.accentColor,
      colors: i.accentColor
    }
  ) : /* @__PURE__ */ o(
    D,
    {
      mode: t,
      isCallActive: e.voice.isCallActive,
      theme: s.theme,
      voiceEmptyMessage: L,
      voiceActiveEmptyMessage: V,
      chatEmptyMessage: N,
      hybridEmptyMessage: W
    }
  ), ft = () => f ? null : t === "voice" ? /* @__PURE__ */ o(
    Tt,
    {
      isCallActive: e.voice.isCallActive,
      connectionStatus: e.voice.connectionStatus,
      isAvailable: e.voice.isAvailable,
      isMuted: e.voice.isMuted,
      onToggleCall: F,
      onToggleMute: e.voice.toggleMute,
      startButtonText: Pe,
      endButtonText: Ue,
      colors: i
    }
  ) : t === "chat" ? /* @__PURE__ */ o(
    Et,
    {
      chatInput: d,
      isAvailable: e.chat.isAvailable,
      onInputChange: R,
      onSendMessage: $,
      colors: i,
      styles: s,
      inputRef: c,
      placeholder: _
    }
  ) : t === "hybrid" ? /* @__PURE__ */ o(
    kt,
    {
      chatInput: d,
      isCallActive: e.voice.isCallActive,
      connectionStatus: e.voice.connectionStatus,
      isChatAvailable: e.chat.isAvailable,
      isVoiceAvailable: e.voice.isAvailable,
      isMuted: e.voice.isMuted,
      onInputChange: R,
      onSendMessage: $,
      onToggleCall: F,
      onToggleMute: e.voice.toggleMute,
      colors: i,
      styles: s,
      inputRef: c,
      placeholder: _
    }
  ) : null, gt = () => M && !je ? /* @__PURE__ */ o(
    St,
    {
      consentTitle: Ge,
      consentContent: Je,
      onAccept: st,
      onCancel: at,
      colors: i,
      styles: s,
      radius: C
    }
  ) : /* @__PURE__ */ h("div", { style: tt(), children: [
    /* @__PURE__ */ o(
      xt,
      {
        mode: t,
        connectionStatus: e.voice.connectionStatus,
        isCallActive: e.voice.isCallActive,
        isSpeaking: e.voice.isSpeaking,
        isTyping: e.chat.isTyping,
        hasActiveConversation: e.conversation.length > 0,
        mainLabel: E,
        onClose: j,
        onReset: ct,
        onChatComplete: rt,
        showEndChatButton: !f,
        colors: i,
        styles: s
      }
    ),
    /* @__PURE__ */ o(
      "div",
      {
        className: "vapi-conversation-area",
        style: {
          ...ot(),
          ...it()
        },
        children: dt()
      }
    ),
    /* @__PURE__ */ o("div", { style: nt(), children: ft() })
  ] });
  return /* @__PURE__ */ o("div", { className: "vapi-widget-wrapper", children: /* @__PURE__ */ o(
    "div",
    {
      style: {
        position: "fixed",
        zIndex: 9999,
        ...Ct[Y]
      },
      children: et ? gt() : /* @__PURE__ */ o(
        bt,
        {
          isCallActive: e.voice.isCallActive,
          connectionStatus: e.voice.connectionStatus,
          isSpeaking: e.voice.isSpeaking,
          isTyping: e.chat.isTyping,
          volumeLevel: e.voice.volumeLevel,
          onClick: vt,
          onToggleCall: F,
          mainLabel: E,
          ctaTitle: Oe,
          ctaSubtitle: qe,
          colors: i,
          styles: s,
          mode: t
        }
      )
    }
  ) });
};
export {
  qt as default
};
//# sourceMappingURL=VapiWidget.js.map

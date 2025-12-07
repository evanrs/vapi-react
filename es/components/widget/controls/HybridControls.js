import { jsxs as f, jsx as o } from "react/jsx-runtime";
import { PaperPlaneTiltIcon as y, MicrophoneSlashIcon as b, MicrophoneIcon as w, StopIcon as x, WaveformIcon as k } from "@phosphor-icons/react";
const $ = ({
  chatInput: t,
  isCallActive: e,
  connectionStatus: n,
  isChatAvailable: c,
  isVoiceAvailable: i,
  isMuted: l,
  onInputChange: s,
  onSendMessage: d,
  onToggleCall: h,
  onToggleMute: g,
  colors: r,
  styles: a,
  inputRef: m,
  placeholder: u = "Type your message..."
  // Default fallback
}) => /* @__PURE__ */ f("div", { className: "flex items-center space-x-2", children: [
  /* @__PURE__ */ o(
    "input",
    {
      ref: m,
      type: "text",
      value: t,
      onChange: s,
      onKeyPress: (p) => p.key === "Enter" && c && !e && d(),
      placeholder: u,
      disabled: e,
      className: `flex-1 px-3 py-2 rounded-lg border ${a.theme === "dark" ? "border-gray-600 text-white placeholder-gray-400" : "border-gray-300 text-gray-900 placeholder-gray-500"} focus:outline-none focus:ring-2 ${e ? "opacity-50 cursor-not-allowed" : ""}`,
      style: {
        "--tw-ring-color": a.theme === "dark" ? `${r.accentColor}33` : `${r.accentColor}80`,
        // 50% opacity in light mode
        backgroundColor: r.baseColor,
        filter: a.theme === "dark" ? "brightness(1.8)" : "brightness(0.98)"
      }
    }
  ),
  /* @__PURE__ */ o(
    "button",
    {
      onClick: d,
      disabled: !t.trim() || !c || e,
      className: `h-10 w-10 flex items-center justify-center rounded-lg transition-all ${!t.trim() || !c || e ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 active:scale-95"}`,
      style: {
        backgroundColor: r.accentColor,
        color: r.ctaButtonTextColor || "white"
      },
      title: "Send message",
      children: /* @__PURE__ */ o(y, { size: 20, weight: "fill" })
    }
  ),
  e && n === "connected" && /* @__PURE__ */ o(
    "button",
    {
      onClick: g,
      className: "h-10 w-10 flex items-center justify-center rounded-lg transition-all hover:opacity-90 active:scale-95",
      style: {
        backgroundColor: l ? "#ef4444" : r.accentColor,
        color: r.ctaButtonTextColor || "white"
      },
      title: l ? "Unmute microphone" : "Mute microphone",
      children: l ? /* @__PURE__ */ o(b, { size: 20, weight: "fill" }) : /* @__PURE__ */ o(w, { size: 20, weight: "fill" })
    }
  ),
  /* @__PURE__ */ o(
    "button",
    {
      onClick: h,
      disabled: !i && !e,
      className: `h-10 w-10 flex items-center justify-center rounded-lg transition-all ${!i && !e ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 active:scale-95"}`,
      style: {
        backgroundColor: e ? "#ef4444" : r.accentColor,
        color: r.ctaButtonTextColor || "white"
      },
      title: n === "connecting" ? "Connecting..." : e ? "Stop voice call" : "Start voice call",
      children: n === "connecting" ? /* @__PURE__ */ o("div", { className: "animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" }) : e ? /* @__PURE__ */ o(x, { size: 20, weight: "fill" }) : /* @__PURE__ */ o(k, { size: 20, weight: "bold" })
    }
  )
] });
export {
  $ as default
};
//# sourceMappingURL=HybridControls.js.map

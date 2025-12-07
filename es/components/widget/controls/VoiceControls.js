import { jsxs as t, jsx as e, Fragment as c } from "react/jsx-runtime";
import { MicrophoneSlashIcon as p, MicrophoneIcon as m, StopIcon as f, WaveformIcon as u } from "@phosphor-icons/react";
const w = ({
  isCallActive: o,
  connectionStatus: i,
  isAvailable: l,
  isMuted: r,
  onToggleCall: a,
  onToggleMute: s,
  startButtonText: d,
  endButtonText: h,
  colors: n
}) => /* @__PURE__ */ t("div", { className: "flex items-center justify-center space-x-2", children: [
  o && i === "connected" && /* @__PURE__ */ e(
    "button",
    {
      onClick: s,
      className: "h-12 w-12 flex items-center justify-center rounded-full transition-all hover:opacity-90 active:scale-95",
      style: {
        backgroundColor: r ? "#ef4444" : n.accentColor,
        color: n.ctaButtonTextColor || "white"
      },
      title: r ? "Unmute microphone" : "Mute microphone",
      children: r ? /* @__PURE__ */ e(p, { size: 20, weight: "fill" }) : /* @__PURE__ */ e(m, { size: 20, weight: "fill" })
    }
  ),
  /* @__PURE__ */ e(
    "button",
    {
      onClick: a,
      disabled: !l && !o,
      className: `px-6 py-3 rounded-full font-medium transition-all flex items-center space-x-2 ${!l && !o ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 active:scale-95"}`,
      style: {
        backgroundColor: o ? "#ef4444" : n.accentColor,
        color: n.ctaButtonTextColor || "white"
      },
      children: i === "connecting" ? /* @__PURE__ */ t(c, { children: [
        /* @__PURE__ */ e("div", { className: "animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" }),
        /* @__PURE__ */ e("span", { children: "Connecting..." })
      ] }) : o ? /* @__PURE__ */ t(c, { children: [
        /* @__PURE__ */ e(f, { size: 16, weight: "fill" }),
        /* @__PURE__ */ e("span", { children: h })
      ] }) : /* @__PURE__ */ t(c, { children: [
        /* @__PURE__ */ e(u, { size: 16, weight: "bold" }),
        /* @__PURE__ */ e("span", { children: d })
      ] })
    }
  )
] });
export {
  w as default
};
//# sourceMappingURL=VoiceControls.js.map

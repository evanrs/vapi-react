import { jsxs as r, jsx as e } from "react/jsx-runtime";
import { ArrowsClockwiseIcon as b, XIcon as g } from "@phosphor-icons/react";
import C from "../AnimatedStatusIcon.js";
const w = ({
  mode: t,
  connectionStatus: i,
  isCallActive: s,
  isSpeaking: a,
  isTyping: o,
  hasActiveConversation: l,
  mainLabel: d,
  onClose: h,
  onReset: m,
  onChatComplete: u,
  showEndChatButton: f,
  colors: n,
  styles: c
}) => {
  const x = () => i === "connecting" ? "Connecting..." : s ? a ? "Assistant Speaking..." : "Listening..." : o ? "Assistant is typing..." : l ? t === "chat" ? "Chat active" : t === "hybrid" ? "Ready to assist" : "Connected" : t === "voice" ? "Click the microphone to start" : t === "chat" ? "Type a message below" : "Choose voice or text";
  return /* @__PURE__ */ r(
    "div",
    {
      className: `relative z-10 p-4 flex items-center justify-between border-b ${c.theme === "dark" ? "text-white border-gray-800 shadow-lg" : "text-gray-900 border-gray-200 shadow-sm"}`,
      style: { backgroundColor: n.baseColor },
      children: [
        /* @__PURE__ */ r("div", { className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ e(
            C,
            {
              size: 40,
              connectionStatus: i,
              isCallActive: s,
              isSpeaking: a,
              isTyping: o,
              baseColor: n.accentColor,
              colors: n.accentColor
            }
          ),
          /* @__PURE__ */ r("div", { children: [
            /* @__PURE__ */ e("div", { className: "font-medium", children: d }),
            /* @__PURE__ */ e(
              "div",
              {
                className: `text-sm ${c.theme === "dark" ? "text-gray-300" : "text-gray-600"}`,
                children: x()
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ r("div", { className: "flex items-center space-x-2", children: [
          f !== !1 && t === "chat" && /* @__PURE__ */ e(
            "button",
            {
              onClick: u,
              className: "text-red-600 text-sm font-medium px-2 py-1 border border-transparent hover:border-red-600 rounded-md transition-colors",
              title: "End Chat",
              children: "End Chat"
            }
          ),
          /* @__PURE__ */ e(
            "button",
            {
              onClick: m,
              className: "w-8 h-8 rounded-full flex items-center justify-center transition-all}",
              title: "Reset conversation",
              children: /* @__PURE__ */ e(b, { size: 16, weight: "bold" })
            }
          ),
          /* @__PURE__ */ e(
            "button",
            {
              onClick: h,
              className: "w-8 h-8 rounded-full flex items-center justify-center transition-all",
              children: /* @__PURE__ */ e(g, { size: 16, weight: "bold" })
            }
          )
        ] })
      ]
    }
  );
};
export {
  w as default
};
//# sourceMappingURL=WidgetHeader.js.map

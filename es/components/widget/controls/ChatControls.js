import { jsxs as d, jsx as a } from "react/jsx-runtime";
import { PaperPlaneTiltIcon as g } from "@phosphor-icons/react";
const y = ({
  chatInput: r,
  isAvailable: t,
  onInputChange: n,
  onSendMessage: l,
  colors: e,
  styles: o,
  inputRef: c,
  placeholder: i = "Type your message..."
  // Default fallback
}) => /* @__PURE__ */ d("div", { className: "flex items-center space-x-2", children: [
  /* @__PURE__ */ a(
    "input",
    {
      ref: c,
      type: "text",
      value: r,
      onChange: n,
      onKeyPress: (s) => s.key === "Enter" && t && l(),
      placeholder: i,
      className: `flex-1 px-3 py-2 rounded-lg border ${o.theme === "dark" ? "border-gray-600 text-white placeholder-gray-400" : "border-gray-300 text-gray-900 placeholder-gray-500"} focus:outline-none focus:ring-2`,
      style: {
        "--tw-ring-color": o.theme === "dark" ? `${e.accentColor}33` : `${e.accentColor}80`,
        // 50% opacity in light mode
        backgroundColor: e.baseColor,
        filter: o.theme === "dark" ? "brightness(1.8)" : "brightness(0.98)"
      }
    }
  ),
  /* @__PURE__ */ a(
    "button",
    {
      onClick: l,
      disabled: !r.trim() || !t,
      className: `h-10 w-10 flex items-center justify-center rounded-lg transition-all ${!r.trim() || !t ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 active:scale-95"}`,
      style: {
        backgroundColor: e.accentColor,
        color: e.ctaButtonTextColor || "white"
      },
      children: /* @__PURE__ */ a(g, { size: 20, weight: "fill" })
    }
  )
] });
export {
  y as default
};
//# sourceMappingURL=ChatControls.js.map

import { jsxs as s, jsx as e } from "react/jsx-runtime";
import { MicrophoneIcon as i } from "@phosphor-icons/react";
const o = ({
  volumeLevel: n,
  isCallActive: c,
  isSpeaking: t,
  theme: a
}) => /* @__PURE__ */ s("div", { className: "text-center space-y-4", children: [
  /* @__PURE__ */ e(
    "div",
    {
      className: `w-20 h-20 rounded-full flex items-center justify-center mx-auto ${a === "dark" ? "bg-gray-700" : "bg-gray-100"}`,
      children: /* @__PURE__ */ e(
        i,
        {
          size: 40,
          className: `${c ? t ? "text-red-400 animate-pulse" : "text-green-400" : "text-gray-400"}`
        }
      )
    }
  ),
  /* @__PURE__ */ s("div", { className: "space-y-2", children: [
    /* @__PURE__ */ e("div", { className: "flex items-center space-x-2 justify-center", children: [...Array(7)].map((l, r) => /* @__PURE__ */ e(
      "div",
      {
        className: `w-1.5 rounded-full transition-all duration-150 ${r < n * 7 ? "bg-green-400" : a === "dark" ? "bg-gray-600" : "bg-gray-300"}`,
        style: { height: `${12 + r * 3}px` }
      },
      r
    )) }),
    /* @__PURE__ */ e(
      "p",
      {
        className: `text-sm ${a === "dark" ? "text-gray-400" : "text-gray-500"}`,
        children: t ? "Assistant Speaking..." : "Listening..."
      }
    )
  ] })
] });
export {
  o as default
};
//# sourceMappingURL=VolumeIndicator.js.map

import { jsxs as l, jsx as t } from "react/jsx-runtime";
import { MicrophoneIcon as n, ChatCircleIcon as x } from "@phosphor-icons/react";
const y = ({
  mode: r,
  isCallActive: e,
  theme: a,
  voiceEmptyMessage: s,
  voiceActiveEmptyMessage: c,
  chatEmptyMessage: i,
  hybridEmptyMessage: o
}) => /* @__PURE__ */ l("div", { className: "text-center", children: [
  /* @__PURE__ */ t(
    "div",
    {
      className: `w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${a === "dark" ? "bg-gray-700" : "bg-gray-100"}`,
      children: r === "voice" ? /* @__PURE__ */ t(
        n,
        {
          size: 32,
          className: "text-gray-400"
        }
      ) : /* @__PURE__ */ t(
        x,
        {
          size: 32,
          className: "text-gray-400"
        }
      )
    }
  ),
  /* @__PURE__ */ t(
    "p",
    {
      className: `text-sm ${a === "dark" ? "text-gray-400" : "text-gray-500"}`,
      children: r === "voice" ? e ? c : s : r === "chat" ? i : o
    }
  )
] });
export {
  y as default
};
//# sourceMappingURL=EmptyState.js.map

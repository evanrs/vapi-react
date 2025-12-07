import { jsx as s, jsxs as o } from "react/jsx-runtime";
import i from "react-markdown";
import { messageRadiusClasses as m } from "../../constants.js";
const r = ({
  content: a,
  isLoading: n,
  role: l
}) => /* @__PURE__ */ o("div", { className: "markdown-content", children: [
  /* @__PURE__ */ s(
    i,
    {
      components: {
        p: ({ children: e }) => /* @__PURE__ */ s("p", { className: "mb-3 last:mb-0", children: e }),
        ul: ({ children: e }) => /* @__PURE__ */ s("ul", { className: "list-disc list-inside mb-3 last:mb-0", children: e }),
        ol: ({ children: e }) => /* @__PURE__ */ s("ol", { className: "list-decimal list-inside mb-3 last:mb-0", children: e }),
        li: ({ children: e }) => /* @__PURE__ */ s("li", { className: "mb-0.5", children: e }),
        code: ({ children: e, ...t }) => !("inline" in t) || t.inline ? /* @__PURE__ */ s("code", { className: "px-1 py-0.5 rounded bg-black bg-opacity-10 text-sm", children: e }) : /* @__PURE__ */ s("pre", { className: "p-2 rounded bg-black bg-opacity-10 overflow-x-auto text-sm", children: /* @__PURE__ */ s("code", { children: e }) }),
        a: ({ children: e, href: t }) => /* @__PURE__ */ s(
          "a",
          {
            href: t,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "underline hover:opacity-80",
            children: e
          }
        ),
        strong: ({ children: e }) => /* @__PURE__ */ s("strong", { className: "font-semibold", children: e }),
        em: ({ children: e }) => /* @__PURE__ */ s("em", { className: "italic", children: e }),
        h1: ({ children: e }) => /* @__PURE__ */ s("h1", { className: "text-lg font-bold mb-1", children: e }),
        h2: ({ children: e }) => /* @__PURE__ */ s("h2", { className: "text-base font-bold mb-1", children: e }),
        h3: ({ children: e }) => /* @__PURE__ */ s("h3", { className: "text-sm font-bold mb-1", children: e }),
        blockquote: ({ children: e }) => /* @__PURE__ */ s("blockquote", { className: "border-l-2 pl-2 my-3 opacity-80", children: e })
      },
      children: a
    }
  ),
  n && l === "assistant" && /* @__PURE__ */ s("span", { className: "inline-block w-0.5 h-4 ml-0.5 bg-current animate-blink" })
] }), p = ({
  role: a,
  content: n,
  colors: l,
  styles: e,
  isLoading: t = !1
}) => /* @__PURE__ */ s("div", { className: `flex ${a === "user" ? "justify-end" : "justify-start"}`, children: /* @__PURE__ */ s(
  "div",
  {
    className: `max-w-xs px-3 py-2 ${m[e.radius]} text-sm`,
    style: {
      backgroundColor: a === "user" ? l.accentColor : (e.theme === "dark", l.baseColor),
      color: a === "user" || e.theme === "dark" ? "#FFFFFF" : "#1F2937",
      ...a === "assistant" && {
        filter: e.theme === "dark" ? "brightness(1.5) contrast(0.9)" : "brightness(0.95) contrast(1.05)"
      }
    },
    children: /* @__PURE__ */ s(r, { content: n, isLoading: t, role: a })
  }
) });
export {
  p as default
};
//# sourceMappingURL=Message.js.map

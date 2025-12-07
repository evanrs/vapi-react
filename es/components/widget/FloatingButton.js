import { jsx as r, jsxs as c } from "react/jsx-runtime";
import y from "../AnimatedStatusIcon.js";
import { buttonRadiusStyles as b, sizeStyles as C } from "../constants.js";
const B = ({
  isCallActive: o,
  connectionStatus: s,
  isSpeaking: l,
  isTyping: m,
  volumeLevel: p,
  onClick: d,
  onToggleCall: a,
  mainLabel: f,
  ctaTitle: h,
  ctaSubtitle: n,
  colors: i,
  styles: e,
  mode: x
}) => {
  const t = x === "voice" && e.size === "tiny", u = () => {
    t && a ? a() : d();
  }, g = h || f, z = {
    ...t && o ? { width: "5rem", height: "5rem" } : C[e.size].button,
    ...b[e.radius],
    backgroundColor: o && t ? "#ef4444" : i.ctaButtonColor,
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    // shadow-lg
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    // transition-all duration-300
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    // Adjust height when subtitle is present
    ...n && (e.size === "compact" || e.size === "full") && !t ? { height: e.size === "compact" ? "4rem" : "4.5rem" } : {}
  };
  return /* @__PURE__ */ r(
    "div",
    {
      className: `hover:scale-105 hover:-translate-y-1 hover:shadow-xl ${t && o ? "animate-glow" : ""}`,
      style: z,
      onClick: u,
      children: /* @__PURE__ */ c(
        "div",
        {
          className: "flex items-center space-x-2",
          style: {
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
            // space-x-2
          },
          children: [
            /* @__PURE__ */ r(
              y,
              {
                size: t && o ? 48 : e.size === "tiny" ? 24 : 28,
                connectionStatus: s,
                isCallActive: o,
                isSpeaking: l,
                isTyping: m,
                baseColor: i.accentColor,
                colors: i.accentColor,
                volumeLevel: p
              }
            ),
            (e.size === "compact" || e.size === "full") && !t && /* @__PURE__ */ c(
              "div",
              {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "center"
                },
                children: [
                  /* @__PURE__ */ r(
                    "span",
                    {
                      style: {
                        color: i.ctaButtonTextColor,
                        fontSize: "0.875rem",
                        // text-sm
                        fontWeight: "500",
                        // font-medium
                        lineHeight: "1.2"
                      },
                      children: g
                    }
                  ),
                  n && /* @__PURE__ */ r(
                    "span",
                    {
                      style: {
                        color: i.ctaButtonTextColor,
                        fontSize: "0.75rem",
                        // text-xs
                        fontWeight: "400",
                        // font-normal
                        opacity: 0.8,
                        lineHeight: "1.2",
                        marginTop: "0.125rem"
                      },
                      children: n
                    }
                  )
                ]
              }
            )
          ]
        }
      )
    }
  );
};
export {
  B as default
};
//# sourceMappingURL=FloatingButton.js.map

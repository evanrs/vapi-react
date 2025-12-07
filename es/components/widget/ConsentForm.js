import { jsxs as s, jsx as e } from "react/jsx-runtime";
const r = {
  none: { borderRadius: "0" },
  small: { borderRadius: "0.5rem" },
  medium: { borderRadius: "1rem" },
  large: { borderRadius: "1.5rem" }
}, y = ({
  consentTitle: a = "Terms and conditions",
  consentContent: c,
  onAccept: l,
  onCancel: i,
  colors: o,
  styles: d,
  radius: n
}) => {
  const t = d.theme === "dark", m = t ? "#1F2937" : "#E5E7EB", b = t ? "#FFFFFF" : "#111827", p = t ? "#D1D5DB" : "#4B5563", u = {
    ...r[n],
    backgroundColor: o.baseColor,
    // Use configured base color
    border: `1px solid ${m}`,
    boxShadow: t ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)" : "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    padding: "1rem",
    maxWidth: "360px",
    minWidth: "300px"
  }, x = {
    color: b,
    fontSize: "1rem",
    fontWeight: "600",
    marginBottom: "0.75rem",
    margin: "0 0 0.75rem 0"
  }, g = {
    color: p,
    fontSize: "0.75rem",
    lineHeight: "1.5",
    marginBottom: "1rem",
    maxHeight: "120px",
    overflowY: "auto",
    // Custom scrollbar styling for dark mode
    scrollbarWidth: "thin",
    scrollbarColor: t ? "#4B5563 transparent" : "#CBD5E1 transparent"
  }, h = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "0.5rem"
  }, F = {
    ...r[n],
    backgroundColor: "transparent",
    border: t ? "none" : "1px solid #D1D5DB",
    // No border in dark mode
    color: t ? "#9CA3AF" : "#4B5563",
    padding: "0.5rem 1rem",
    fontSize: "0.75rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out"
  }, C = {
    ...r[n],
    // Invert colors based on theme - white bg in dark mode, use configured colors in light mode
    backgroundColor: t ? o.ctaButtonTextColor || "#FFFFFF" : o.ctaButtonColor || "#000000",
    color: t ? o.ctaButtonColor || "#000000" : o.ctaButtonTextColor || "#FFFFFF",
    border: "none",
    padding: "0.5rem 1rem",
    fontSize: "0.75rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out"
  };
  return /* @__PURE__ */ s("div", { style: u, children: [
    /* @__PURE__ */ e("style", { children: `
        /* Custom scrollbar styles for webkit browsers */
        .consent-terms-content::-webkit-scrollbar {
          width: 6px;
        }
        .consent-terms-content::-webkit-scrollbar-track {
          background: transparent;
        }
        .consent-terms-content::-webkit-scrollbar-thumb {
          background: ${t ? "#4B5563" : "#CBD5E1"};
          border-radius: 3px;
        }
        .consent-terms-content::-webkit-scrollbar-thumb:hover {
          background: ${t ? "#6B7280" : "#94A3B8"};
        }
        .consent-cancel-button:hover {
          background-color: ${t ? "#1F2937" : "#F9FAFB"} !important;
          ${t ? "" : "border-color: #9CA3AF !important;"}
        }
        .consent-accept-button:hover {
          opacity: 0.9;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }
      ` }),
    /* @__PURE__ */ e("h3", { style: x, children: a }),
    /* @__PURE__ */ e(
      "div",
      {
        className: "consent-terms-content",
        style: g,
        dangerouslySetInnerHTML: { __html: c }
      }
    ),
    /* @__PURE__ */ s("div", { style: h, children: [
      /* @__PURE__ */ e(
        "button",
        {
          className: "consent-cancel-button",
          onClick: i,
          style: F,
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ e(
        "button",
        {
          className: "consent-accept-button",
          onClick: l,
          style: C,
          children: "Accept"
        }
      )
    ] })
  ] });
};
export {
  y as default
};
//# sourceMappingURL=ConsentForm.js.map

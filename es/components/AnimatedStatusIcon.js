import { jsx as b, jsxs as J } from "react/jsx-runtime";
import { useState as K, useEffect as Q } from "react";
const nt = ({
  size: f = 40,
  connectionStatus: x,
  isCallActive: I,
  isSpeaking: C,
  isTyping: $,
  isError: D,
  volumeLevel: H = 0,
  baseColor: g = "#9CA3AF",
  animationType: j,
  animationSpeed: k,
  colors: E,
  barCount: L = 17,
  barWidthRatio: R = 0.08,
  barHeightRatio: W = 0.19,
  className: X = ""
}) => {
  const [d, Y] = K(0), h = I, r = h ? 5 : L, w = D ? {
    animationType: "pulse",
    colors: "#EF4444",
    // Red for errors
    animationSpeed: 300
  } : x === "connecting" ? {
    animationType: "spin",
    colors: "#FCD34D",
    // Yellow
    animationSpeed: 1e3
  } : I && C ? {
    animationType: "scale",
    colors: "#F87171",
    // Light red
    animationSpeed: 600
    // Match the SVG animation duration
  } : I ? {
    animationType: "none",
    colors: "#62F6B5",
    // Green
    animationSpeed: 1e3
  } : $ ? {
    animationType: "sequential",
    colors: "#60A5FA",
    // Blue
    animationSpeed: 1e3
  } : {
    animationType: "none",
    colors: g,
    animationSpeed: 3e3
  }, p = j ?? w.animationType, T = k ?? w.animationSpeed, M = E ?? w.colors;
  Q(() => {
    if (p !== "none") {
      const n = Date.now();
      let e;
      const o = () => {
        Y((Date.now() - n) / T), e = requestAnimationFrame(o);
      };
      return e = requestAnimationFrame(o), () => cancelAnimationFrame(e);
    }
  }, [p, T]);
  const m = h ? 24 : 253, _ = (() => {
    const n = m / 2, e = m / 2, o = m * 0.38;
    return Array.from({ length: r }, (t, i) => {
      const a = i / r * 2 * Math.PI - Math.PI / 2, s = n + o * Math.cos(a), l = e + o * Math.sin(a), c = a * 180 / Math.PI + 90;
      return { x: s, y: l, rotate: c };
    });
  })(), N = () => {
    const e = [0.5, 0.75, 1, 0.75, 0.5];
    return Array.from({ length: 5 }, (o, t) => {
      const s = e[t];
      return {
        x: 1 + t * 4.8,
        y: 6,
        width: 2.8,
        baseHeight: 16 * s,
        maxHeight: 22,
        delay: t === 2 ? 0 : Math.abs(t - 2) * 0.2,
        // Center bar starts first
        rotate: 0
      };
    });
  }, q = (n) => Array.isArray(M) ? M[n % M.length] : M, O = (n, e) => {
    const o = d % 1;
    switch (p) {
      case "rotate-fade": {
        const t = r, i = o * t % t, s = Math.min(
          Math.abs(n - i),
          Math.abs(n - i + t),
          Math.abs(n - i - t)
        ) / (t / 2);
        return { opacity: Math.max(0.14, 1 - s * 0.86), transform: "" };
      }
      case "scale": {
        if (h && "delay" in e) {
          const t = e, i = Math.max(0, Math.min(1, H)), a = [
            { sensitivity: 0.8, frequency: 1.2, baseActivity: 0.3 },
            // Bar 0 - Low freq, less sensitive
            { sensitivity: 1, frequency: 1.8, baseActivity: 0.4 },
            // Bar 1 - Mid-low freq
            { sensitivity: 1.2, frequency: 2.5, baseActivity: 0.5 },
            // Bar 2 - Center, most responsive
            { sensitivity: 1, frequency: 2, baseActivity: 0.4 },
            // Bar 3 - Mid-high freq
            { sensitivity: 0.9, frequency: 1.5, baseActivity: 0.35 }
            // Bar 4 - High freq
          ], s = a[n] || a[2], c = d % 1 * s.frequency % 1, y = Math.sin(c * 2 * Math.PI) * 0.3 + Math.sin(c * 6 * Math.PI) * 0.2 + Math.sin(c * 12 * Math.PI) * 0.1, u = i * s.sensitivity, B = Math.max(
            0,
            Math.min(
              1,
              s.baseActivity + u * 0.6 + y * i * 0.4
            )
          ), P = 0.7 + B * 1.1, v = t.baseHeight * P, F = 12 - v / 2;
          return {
            opacity: 0.4 + B * 0.6,
            height: v,
            y: F,
            transform: ""
          };
        }
        if (!h) {
          const t = Math.max(0, Math.min(1, H)), i = d % 1, a = n / r * 2 * Math.PI, s = Math.sin(i * 4 * Math.PI + a) * 0.3 + Math.sin(i * 8 * Math.PI + a * 2) * 0.2 + Math.sin(i * 16 * Math.PI + a * 3) * 0.1, l = 0.7 + 0.3 * Math.sin(a + Math.PI / 4), c = Math.max(
            0,
            Math.min(
              1,
              0.3 + t * l * 0.5 + s * t * 0.2
            )
          );
          return {
            opacity: 0.4 + c * 0.6,
            transform: c > 0.5 ? `scale(${1 + (c - 0.5) * 0.4})` : ""
          };
        }
        return { opacity: 1, transform: "" };
      }
      case "spin": {
        const t = o * 2 * Math.PI % (2 * Math.PI), i = n / r * 2 * Math.PI;
        return { opacity: 0.3 + 0.7 * (1 - Math.abs(
          (t - i + Math.PI) % (2 * Math.PI) - Math.PI
        ) / Math.PI), transform: "" };
      }
      case "pulse":
        return {
          opacity: 0.5 + 0.5 * Math.sin(o * 2 * Math.PI),
          transform: ""
        };
      case "sequential": {
        const t = Math.floor(o * r) % r;
        return {
          opacity: n === t || n === (t + 1) % r ? 1 : 0.3,
          transform: ""
        };
      }
      case "wave": {
        const t = o * 2 * Math.PI, i = n / r * 2 * Math.PI;
        return {
          opacity: 0.5 + 0.5 * Math.sin(t + i),
          transform: ""
        };
      }
      default:
        return { opacity: 1, transform: "" };
    }
  }, A = h ? 2.8 : m * R, S = h ? 12 : m * W, z = A / 2, G = h ? N() : _;
  return /* @__PURE__ */ b(
    "div",
    {
      className: `relative ${X}`,
      style: { width: f, height: f },
      children: /* @__PURE__ */ J(
        "svg",
        {
          width: f,
          height: f,
          viewBox: `0 0 ${m} ${h ? 24 : m + 1}`,
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
          children: [
            !h && /* @__PURE__ */ b(
              "circle",
              {
                cx: m / 2,
                cy: m / 2,
                r: m * 0.38,
                fill: "none",
                stroke: g,
                strokeWidth: "1",
                opacity: "0.05"
              }
            ),
            G.map((n, e) => {
              const o = p !== "none", t = o ? O(e, n) : { opacity: 1 }, i = o ? q(e) : M === g ? g : q(e);
              if (h && "width" in n) {
                const a = n, s = t.y !== void 0 ? t.y : 12 - a.baseHeight / 2;
                return /* @__PURE__ */ b(
                  "rect",
                  {
                    x: a.x,
                    y: s,
                    width: a.width,
                    height: t.height !== void 0 ? t.height : a.baseHeight,
                    fill: i,
                    opacity: t.opacity,
                    rx: a.width / 2
                  },
                  e
                );
              } else {
                const a = n;
                let s = S;
                if (p === "rotate-fade") {
                  const y = r, u = d % 1 * y, P = Math.min(
                    Math.abs(e - u),
                    Math.abs(e - u + y),
                    Math.abs(e - u - y)
                  ) / (y / 2), v = 0.4 + 0.6 * (1 - P), F = Math.sin(P * Math.PI) * 0.2;
                  s = S * (v + F);
                } else {
                  const u = 0.7 + 0.3 * (1 - Math.min(e, r - e) / (r / 2));
                  s = S * u;
                }
                const l = a.x - A / 2, c = a.y - s / 2;
                return /* @__PURE__ */ b(
                  "rect",
                  {
                    x: l,
                    y: c,
                    width: A,
                    height: s,
                    rx: z,
                    fill: i,
                    opacity: t.opacity,
                    transform: a.rotate !== 0 ? `rotate(${a.rotate} ${a.x} ${a.y})` : void 0,
                    style: {
                      transition: p === "sequential" ? "opacity 0.1s ease-in-out" : void 0
                    }
                  },
                  e
                );
              }
            })
          ]
        }
      )
    }
  );
};
export {
  nt as default
};
//# sourceMappingURL=AnimatedStatusIcon.js.map

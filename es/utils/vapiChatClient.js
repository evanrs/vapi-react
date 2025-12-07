import { fetchEventSource as s } from "@microsoft/fetch-event-source";
class u extends Error {
}
class l extends Error {
}
class h {
  apiUrl;
  publicKey;
  abortController = null;
  constructor(o) {
    this.publicKey = o.publicKey, this.apiUrl = o.apiUrl || "https://api.vapi.ai";
  }
  async streamChat(o, n, e, i) {
    this.abort(), this.abortController = new AbortController();
    try {
      await s(`${this.apiUrl}/chat/web`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.publicKey}`,
          "Content-Type": "application/json",
          "X-Client-ID": "vapi-widget"
        },
        body: JSON.stringify({
          ...o,
          stream: !0
        }),
        signal: this.abortController.signal,
        // Event handlers
        async onopen(t) {
          if (!(t.ok && t.headers.get("content-type")?.includes("text/event-stream")))
            throw t.status >= 400 && t.status < 500 && t.status !== 429 ? new l(`HTTP error! status: ${t.status}`) : new u(`HTTP error! status: ${t.status}`);
        },
        onmessage(t) {
          if (t.data !== "[DONE]")
            try {
              const a = JSON.parse(t.data);
              (a.delta !== void 0 || a.output !== void 0 || a.path !== void 0) && n(a);
            } catch {
              console.warn(`Failed to parse SSE data: ${t.data}`);
            }
        },
        onclose() {
          i?.();
        },
        onerror(t) {
          if (t instanceof l)
            throw e?.(t), t;
          if (t instanceof Error && t.name === "AbortError")
            throw i?.(), t;
          console.warn("Retriable error occurred, retrying...", t);
        }
      });
    } catch (t) {
      t instanceof Error && t.name !== "AbortError" && e?.(t);
    }
    return () => this.abort();
  }
  abort() {
    this.abortController && (this.abortController.abort(), this.abortController = null);
  }
}
function b(r) {
  return r.delta && r.path === "chat.output[0].content" ? r.delta : r.output !== void 0 ? r.output : null;
}
export {
  h as VapiChatClient,
  b as extractContentFromPath
};
//# sourceMappingURL=vapiChatClient.js.map

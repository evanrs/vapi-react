/* empty css                   */
import { default as r } from "./components/VapiWidget.js";
import { useVapiCall as o } from "./hooks/useVapiCall.js";
import { createAssistantMessage as p, createUserMessage as i, handleStreamChunk as n, handleStreamComplete as m, handleStreamError as C, preallocateAssistantMessage as d, resetAssistantMessageTracking as g, useVapiChat as h, validateChatInput as f } from "./hooks/useVapiChat.js";
import { useVapiWidget as x } from "./hooks/useVapiWidget.js";
import { VapiChatClient as S, extractContentFromPath as V } from "./utils/vapiChatClient.js";
import { areCallOptionsEqual as A, clearStoredCall as k, getStoredCallData as D, storeCallData as E } from "./utils/vapiCallStorage.js";
export {
  S as VapiChatClient,
  r as VapiWidget,
  A as areCallOptionsEqual,
  k as clearStoredCall,
  p as createAssistantMessage,
  i as createUserMessage,
  V as extractContentFromPath,
  D as getStoredCallData,
  n as handleStreamChunk,
  m as handleStreamComplete,
  C as handleStreamError,
  d as preallocateAssistantMessage,
  g as resetAssistantMessageTracking,
  E as storeCallData,
  o as useVapiCall,
  h as useVapiChat,
  x as useVapiWidget,
  f as validateChatInput
};
//# sourceMappingURL=index.js.map

import atob from "atob";
import encodeUtils from "./encodeUtils.js";

export default {
  decode(bytes) {
    const escaped = escape(atob(bytes || ""));
    try {
      return decodeURIComponent(escaped);
    } catch {
      return unescape(escaped);
    }
  },

  isValidEncodedBase64(encodedStr) {
    const decodedStr = this.decode(encodedStr);
    return encodedStr === encodeUtils.encodeText(decodedStr);
  },
};

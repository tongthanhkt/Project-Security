export default {
  isNumberic(val) {
    if (typeof val === "number") return true;
    if (typeof val !== "string") return false;
    return !isNaN(val) && !isNaN(parseInt(val));
  },

  toNum(val) {
    if (typeof val === "number") return val;
    return parseInt(val.toString());
  },

  toFloat(val) {
    if (typeof val === "number") return val;
    return parseFloat(val.toString());
  },
};

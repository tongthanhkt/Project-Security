import btoa from "btoa";

async function encodeZipFile(zipObj) {
  return Promise.all([zipObj.generateAsync({ type: "nodebuffer" })]);
}

export default {
  async encodeZip(zipObj) {
    const bufferZip = await encodeZipFile(zipObj);
    const result = btoa(bufferZip[0]);
    return result;
  },

  encodeText(text) {
    return btoa(unescape(encodeURIComponent(text || "")));
  },
};

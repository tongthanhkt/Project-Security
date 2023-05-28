export default {
  getCurrentTs() {
    return Date.now();
  },

  async sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  },
};

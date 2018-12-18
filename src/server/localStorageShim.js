// @flow
global.localStorage = {
  data: {},
  setItem(id, val) {
    return (this.data[id] = String(val));
  },
  getItem(id) {
    return this.data.hasOwnProperty(id) ? this.data[id] : undefined;
  },
  removeItem(id) {
    return delete this.data[id];
  },
  clear() {
    return (this.data = {});
  },
};

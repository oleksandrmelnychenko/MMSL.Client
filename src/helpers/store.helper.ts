var store: any = undefined;

export default {
  init(configuredStore: any) {
    store = configuredStore;
  },
  getStore() {
    return store;
  }
};

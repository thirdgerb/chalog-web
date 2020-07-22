
export const LAYOUT_LOADING_TOGGLE = 'LAYOUT_LOADING_TOGGLE';
export const LAYOUT_DRAWER_TOGGLE = 'LAYOUT_DRAWER_TOGGLE';
export const LAYOUT_SNACK_BAR_TOGGLE = 'LAYOUT_SNACK_BAR_TOGGLE';

export const layout = {
  state: () => ({
    // 抽屉要在 app bar 操作.
    drawer :null,

    loading: false,

    error: '',
  }),

  mutations: {
    /**
     * 开关.
     * @param state
     * @param val
     */
    [LAYOUT_LOADING_TOGGLE] (state, val) {
      if (val === null) {
        state.loading = !state.loading;
      } else {
        state.loading = !!val;
      }
    },

    [LAYOUT_DRAWER_TOGGLE] (state, val) {
      if (val === null) {
        state.drawer = !state.drawer;
      } else {
        state.drawer = !!val;
      }
    },

    [LAYOUT_SNACK_BAR_TOGGLE] (state, error) {
      state.error = error;
    }
  }

};
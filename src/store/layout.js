
export const LAYOUT_LOADING_TOGGLE = 'LAYOUT_LOADING_TOGGLE';
export const LAYOUT_DRAWER_TOGGLE = 'LAYOUT_DRAWER_TOGGLE';
export const LAYOUT_SNACK_BAR_TOGGLE = 'LAYOUT_SNACK_BAR_TOGGLE';
export const LAYOUT_MENU_TOGGLE = 'LAYOUT_MENU_TOGGLE';

export const layout = {
  state: () => ({
    // 抽屉要在 app bar 操作.
    drawer :null,
    menu: false,

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
      state.drawer = val === null ? !state.drawer : !!val;
      if (state.drawer) {
        state.menu = false;
      }
    },

    [LAYOUT_MENU_TOGGLE] (state, val) {
      state.menu = val === null ? !state.menu : !!val;
      if (state.menu) {
        state.drawer = false;
      }
    },

    [LAYOUT_SNACK_BAR_TOGGLE] (state, error) {
      state.error = error;
    }
  }

};
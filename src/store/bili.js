
import {
  BILI_PLAY, BILI_RESET,
  BILI_TOGGLE,
  BILI_NEW, BILI_ADD,
} from "../constants";

const reset = () => ({
  play: false,
  autoPlay:true,
  hasNew: false,
  history: [],
  resource: "",
});

export const bili = {
  state: reset(),

  mutations: {
    [BILI_RESET] (state) {
      Object.assign(state, reset());
    },
    /**
     * 开关.
     * @param state
     * @param val
     */
    [BILI_TOGGLE] (state, val) {
      if (val === null) {
        state.play = !state.play;
      } else {
        state.play = !!val;
      }
    },

    /**
     * 播放 bili bili 的视频.
     * @param state
     * @param resource
     */
    [BILI_PLAY] (state, {resource}) {
      state.resource = resource;
      state.play = true;
      state.hasNew = false;
    },

    [BILI_NEW] (state) {
      state.hasNew = true;
    },

    /**
     * 添加一个 bili 视频.
     * @param state
     * @param resource
     */
    [BILI_ADD] (state, {resource}) {

      let idx = state.history.indexOf(resource);
      if (idx >= 0) {
        return;
      }
      state.history.push(resource);
      if (state.history >= 30) {
        state.history.pop();
      }
      state.hasNew = true;
    },
  },
};
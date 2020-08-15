
import {
  BILI_PLAY, BILI_RESET,
  BILI_TOGGLE,
  BILI_NEW,
} from "../constants";

const reset = () => ({
  play: false,
  hasNew: false,
  resource: "//player.bilibili.com/player.html?aid=59609396&bvid=BV1Rt411g7t8&cid=103844486&page=1",
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
    }
  },
};
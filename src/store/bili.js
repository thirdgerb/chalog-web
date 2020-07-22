
export const BILI_TOGGLE = 'BILI_TOGGLE';
export const BILI_PLAY = 'BILI_PLAY';

export const bili = {
  state: () => ({
    play: false,
    resource: "//player.bilibili.com/player.html?aid=59609396&bvid=BV1Rt411g7t8&cid=103844486&page=1",
  }),

  mutations: {
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
    }

  },
};
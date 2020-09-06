<template>
    <div class="play-maze" v-if="isPlaying">
        <v-card
            v-for="a in 5"
            :key="a"
            :class="`d-flex align-${a}`"
            color="grey lighten-2"
            flat
            height="30"
            outlined
            tile
        >
            <v-card
                v-for="n in 5"
                :key="n"
                class="maze-cell"
                outlined
                :dark="!isUserCell(n - 1, a - 1)"
                tile
                v-html="direction(n - 1, a - 1)"
            >
            </v-card>
        </v-card>
    </div>
</template>

<script>
  export default {
    name: "MazeView",
    props: ['alive'],
    data: () => ({
      context : {}
    }),
    computed: {
      commit() {
        return this.$store.state.chat.commit;
      },
      isPlaying() {
        let context = this.context;
        return context.name === 'commune.demo.maze.play';
      },

    },
    methods : {
      isUserCell(x, y){
        let data = this.context.data;
        return x === data.x && y === data.y;
      },
      direction(x, y) {
        let data = this.context.data;
        if (x === data.x && y === data.y) {
          switch (data.direction) {
            case 0 :
              return '↑';
            case 1 :
              return '→';
            case 2 :
              return '↓';
            default:
              return '←'

          }
        }

        return '';
      },
    },
    watch : {
      commit() {
        let $this = this;
        let chat = $this.$store.state.chat.connected[$this.alive];
        if (!chat) {
          $this.context = {}
        } else {
          $this.context = chat.context;
        }
      },
    }

  }
</script>

<style scoped>
    .play-maze {
        width:150px;
        height:150px;
        position: fixed;
        top: 90px;
        right: 60px;
        opacity: 0.45;
    }
    .maze-cell {
        text-align: center;
        height:30px;
        width:30px;
        line-height: 30px;
    }


</style>
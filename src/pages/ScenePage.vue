<template>
    <v-main app >
        <v-container
                class="fill-height commune-index"
                fluid
                @click="goAlive()"
        >
            <v-row
                    align="center"
                    justify="center"
            >
                <h3>[{{ scene }}]:{{ description }}</h3>
            </v-row>
        </v-container>
    </v-main>
</template>

<script>
  import {EMITTER_ACTION_QUERY_SCENE} from "../constants";
  import {intendTo, popNextRoute} from "../utils";

  export default {
    name: "ScenePage",
    data: () => ({
      description: '寻找会话...',
      querying: false,
    }),
    props: ['scene'],
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        vm.onRoute(to);
      });
    },
    sockets : {

      USER_CHATS() {
        let $this = this;
        $this.tryRedirectScene($this.scene);
      },
    },
    watch : {
      scene(scene) {
        this.onRoute({name:'scene', params: {scene}})
      }
    },
    methods : {
      onRoute({name, params}) {
        if (name !=='scene') {
          return;
        }

        let scene = params.scene;
        let vm = this;

        vm.tryRedirectScene(scene);
      },
      tryRedirectScene(scene) {
        let vm = this;
        if (vm.querying) {
          return;
        }

        vm.querying = true;
        setTimeout(function() {
          vm.querying = false;

          if (!vm.$store.getters.isUserLogin) {
            intendTo(vm, {name:'index'});
            return;
          }

          let chat = vm.$store.state.chat;

          for (let c of Object.values(chat.connected)) {
            if (c.scene === scene) {
              vm.redirectToSession(c.session);
              return;
            }
          }

          for (let c of Object.values(chat.incoming)) {
            if (c.scene === scene) {
              vm.redirectToSession(c.session);
              return;
            }
          }

          this.description = '未找到会话...';

          vm.$store.dispatch(EMITTER_ACTION_QUERY_SCENE, {scene});
        }, 1000);
      },
      goAlive() {
        let $this = this;
        let next = popNextRoute($this);
        if (next.name === 'scene' && next.params.scene === $this.scene) {
          next = popNextRoute($this);
        }
        $this.$router.replace(next);
      },
      redirectToSession(session) {
        let vm = this;
        vm.description = '跳转到会话...';
        setTimeout(function() {
          vm.$router.replace({name:'chat', params:{session}});
        }, 1000);
      }
    }
  }
</script>

<style scoped>

</style>
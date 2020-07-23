<template>
    <v-main app>
        <v-container
          class="fill-height commune-index"
          fluid
        >
            <v-row
                align="center"
                justify="center"
                no-gutters
            >
                <v-col
                    class="text-center"
                    cols="12"
                    md="7"
                    lg="7"
                    xl="7"
                   @click.stop="goAlive"
                   style="padding-bottom: 60px"
                >
                    <h1 class="display-1 font-weight-thin mb-4">{{ appName }}</h1>
                    <h4 class="subheading">{{ appSlogan }}</h4>
                </v-col>

                <transition name="slide-x">
                    <v-col
                        v-if="login"
                        cols="10"
                        md="4"
                        lg="4"
                        xl="4"
                    >
                        <login-panel></login-panel>
                    </v-col>
                </transition>
            </v-row>
        </v-container>
    </v-main>

</template>
<script>
  import LoginPanel from '../components/LoginPanel';

  export default {
    name: "Index",
    components: {
      LoginPanel
    },
    data: () => ({
      login: false,
    }),
    sockets : {

      // 服务端传来登录信息
      LOGIN() {
        let $this = this;
        $this.$router.push($this.$store.getters.currentSessionRoute);
      },
    },
    mounted() {
      let $this = this;

      // 稍微延迟一下再打开.
      setTimeout(function() {
        // 进入当前页面.
        if (!$this.$store.getters.isUserLogin) {
          $this.login = true;
        } else {
          $this.$router.push($this.$store.getters.currentSessionRoute);
        }
      }, 1000);
    },

    computed : {
      appSlogan() {
        return process.env.VUE_APP_SLOGAN;
      },
      appName() {
        return process.env.VUE_APP_NAME;
      }

    },
    methods : {
    },
  }
</script>

<style scoped>


.slide-x-enter-active {
    transition: all 0.5s ease;
}
.slide-fade-leave-active {
    transition: all 0.5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-x-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(200px);
    opacity:0;
}
</style>
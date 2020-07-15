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
                    <h1 class="display-1 font-weight-thin mb-4">Commune ChatLog</h1>
                    <h4 class="subheading">[聊客] 开源对话机器人开发框架</h4>
                </v-col>

                <transition name="slide-x">
                    <v-col
                        v-if="login"
                        cols="10"
                        md="4"
                        lg="4"
                        xl="4"
                    >
                        <login></login>
                    </v-col>
                </transition>
            </v-row>
        </v-container>
    </v-main>

</template>
<script>
  // import {DRAWER_SETTER} from "../constants";
  import Login from '../components/Login';

  export default {
    name: "Index",
    props : {
      login : {
        type : Boolean,
        default : false,
      },
    },
    components: {
      Login
    },
    mounted () {
      let $this = this;
      let name = $this.$route.name;
      // 作为首页, 判断要打开登录还是跳转到 chat
      if (name === 'index') {
        // 让屏幕先炫一下下.
        setTimeout(function() {
          $this.goAlive();
        }, 1000);
      }
    },
    methods : {
      goAlive() {
        let $this = this;
        let name = $this.$route.name;

        // 如果已经登录了.
        if ($this.$store.getters.isLogin) {
          $this.$router.push($this.$store.state.next)
        // 否则要求登录.
        } else if (name !== 'login') {
          $this.$router.replace({name:'login'})
        }
      },
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
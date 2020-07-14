<template>
    <v-main app>
        <v-container
          class="fill-height commune-index"
        >
            <v-row
                align="center"
                justify="center"
                no-gutters
            >
                <v-col
                    class="text-center"
                    cols="12"
                    sm="8"
                    md="6"
                    lg="6"
                    xl="6"



                   @click.stop="goAlive"
                   style="padding-bottom: 60px"
                >
                    <h1 class="display-1 font-weight-thin mb-4">Commune ChatLog</h1>
                    <h4 class="subheading">[聊客] 开源对话机器人开发框架</h4>
                </v-col>

                <login v-if="login"></login>
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
      }
    },
    components: {
      Login
    },
    mounted () {
      let $this = this;
      let name = $this.$route.params.name;

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
        if ($this.$store.getters.isLogin) {
          $this.$router.push({name:'alive'})
        } else if (name !== 'login') {
          $this.$router.push({name:'login'})
        }
      },
    }
  }
</script>

<style scoped>
.commune-index {
    padding-bottom: 100px;
    color:white;
    font-weight:400;
    background: linear-gradient(-45deg, #EE7752, #E73C7E, #23A6D5, #23D5AB);
    background-size: 400% 400%;
    -webkit-animation: Gradient 10s ease infinite;
    -moz-animation: Gradient 10s ease infinite;
    animation: Gradient 10s ease infinite;
}
@keyframes Gradient {
    0% {background-position: 0 50%}
    50% {background-position: 100% 50%}
    100% {background-position: 0 50%}
}
</style>
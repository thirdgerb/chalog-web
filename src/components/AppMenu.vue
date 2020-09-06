<template>
  <!-- navigation -->
  <v-navigation-drawer
      v-model="menu"
      fixed
      app
      right
  >
    <v-toolbar
     flat
     dense
     class="text-center"
    >
        功能导航
    </v-toolbar>
    <v-divider></v-divider>
    <!-- subscribe chats -->
    <v-list dense nav>
      <v-list-item-group transition="scroll-y-transition">
        <v-list-item outlined
         v-for="item in items"
         :key="item.id"
         @click.stop.prevent="run(item.method)"
        >
          <v-list-item-icon>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>


</template>

<script>
  import {LAYOUT_MENU_TOGGLE, USER_ACTION_LOGOUT, LAYOUT_SNACK_BAR_TOGGLE} from "../constants";

  export default {
      name: "appMenu",
      data: () => ({
        items: [
          {name:'github 仓库', icon:'mdi-github', method:'github'},
          {name:'Commune V0.1', icon:'mdi-home', method:'commune'},
          {name:'对话能力列表', icon:'mdi-menu',  method:'abilities'},
          {name:'退出登录', icon:'mdi-logout',  method:'logout'},
        ],
      }),
      computed : {
        menu: {
          get() {
            return this.$store.state.layout.menu;
          },
          set(val) {
            this.$store.commit(LAYOUT_MENU_TOGGLE, val);
          }
        },
      },
      methods : {
        run(method) {
          let $this = this;
          switch(method) {
            case 'logout':
              $this.logout();
              break;
            case 'github':
              window.location.href = 'https://github.com/thirdgerb/studio-hyperf';
              break;
            case 'commune':
              window.location.href = 'https://communechatbot.com';
              break;
            case 'abilities':
              $this.$store.commit(LAYOUT_SNACK_BAR_TOGGLE, "功能还未实装");
              break;
            default:
             return;
          }
        },
        logout() {
          let $this = this;
          $this.$store.dispatch(USER_ACTION_LOGOUT);
          $this.$router.replace({name:'index'});
        }
      },

  }
</script>

<style scoped>
</style>
<template>
    <v-card tile transition="slide-x-transition" class="chat-login">
        <v-tabs v-model="tab">
            <v-tab v-for="item in tabItems" :key="item.id">{{ item.name }}</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
            <v-tab-item key="guest">
                <v-form
                    ref="guest"
                    v-model="guest.valid"
                    @submit.prevent="createGuest"
                    dense
                >
                    <v-card-text>
                        <v-text-field
                        v-model="guest.name"
                        :counter="10"
                        :rules="nameRules"
                        label="请输入昵称"
                        required
                        ></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="success" type="submit">进入对话</v-btn>
                    </v-card-actions>
                </v-form>
            </v-tab-item>
            <v-tab-item key="login">
                <v-form
                    ref="login"
                    v-model="login.valid"
                >
                    <v-card-text>
                        <v-text-field
                            v-model="login.name"
                            :counter="10"
                            :rules="nameRules"
                            label="请输入昵称"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="login.password"
                            :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                            :rules="[rules.required, rules.min, rules.max]"
                            :type="showPass ? 'text' : 'password'"
                            label="请输入密码"
                            hint="最少 8 个字符"
                            counter
                            @click:append="showPass = !showPass"
                        ></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text type="submit" >提交</v-btn>
                    </v-card-actions>
                </v-form>
            </v-tab-item>
            <v-tab-item key="register">
                <v-form
                    ref="register"
                    v-model="register.valid"
                >
                    <v-card-text>

                        <v-text-field
                                v-model="register.name"
                                :counter="10"
                                :rules="nameRules"
                                label="请输入昵称"
                                required
                        ></v-text-field>
                        <v-text-field
                                v-model="register.password"
                                :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                                :rules="[rules.required, rules.min, rules.max]"
                                :type="showPass ? 'text' : 'password'"
                                label="请输入密码"
                                hint="最少 8 个字符"
                                counter
                                @click:append="showPass = !showPass"
                        ></v-text-field>
                        <v-text-field
                                v-model="register.confirm"
                                :rules="[rules.required, rules.min, rules.max]"
                                type="password"
                                label="确认密码"
                                hint="最少 8 个字符"
                                counter
                        ></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1"  >提交</v-btn>
                    </v-card-actions>
                </v-form>
            </v-tab-item>
        </v-tabs-items>
    </v-card>
</template>

<script>
  // import {v4} from 'uuid';
  // import User from "../protocals/User";
  import {
    // ACTION_LOGIN_USER,
    LOADING_SETTER,
    // USER_SETTER
  } from "../constants";
  import Request from "../socketio/Request";
  import Sign from "../socketio/Sign";

  export default {
    name: "Sign",
    props: {
      show : Boolean,
    },
    data: () => ({
      tab : null,
      tabItems : [
        {name: '访客', id : 'guest'},
        {name: '登录', id : 'login'},
        {name: '注册', id : 'register'},
      ],
      showPass : false,
      nameRules: [
        v => !!v || '昵称不能为空',
        v => (v && v.length <= 10) || '昵称请控制在10个字符内',
      ],
      rules: {
        required: value => !!value || '不能为空',
        min: v => v.length >= 8 || '最少 8 个字符',
        max: v => v.length < 28 || '最多 28 个字符',
      },
      guest: {
        name : '',
        valid : null,

      },
      login : {
        name : '',
        valid : null,
        password : '',

      },
      register : {
        name : '',
        password : '',
        confirm : '',
        valid : null,

      },
    }),
    computed : {
      isLogin() {
        return this.$store.getters.isLogin;
      }
    },
    watch: {
      isLogin() {
        this.$router.push({name: 'chat'})
      }
    },
    methods : {
      createGuest() {
        let $this = this;
        $this.$refs.guest.validate();

        if (!$this.guest.valid) {
          return;
        }

        let name = '访客-' + this.guest.name;

        // 打开 loading
        $this.$store.commit(
          LOADING_SETTER,
          true
        );

        // 提交.
        $this.$socket.emit(
          'sign',
          new Request({
            proto: new Sign({name: name})
          })
        );

        // 延时关闭 loading.
        setTimeout(function() {
          $this.$store.commit(
            LOADING_SETTER,
            false
          );
        }, 1500);
      }
    },
  }
</script>

<style scoped>
.chat-login {
    min-height:200px;
}
</style>
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
                    :readonly="disabled"
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
                        <v-btn
                        color="success"
                        type="submit"
                        :disabled="disabled"
                        >进入对话</v-btn>
                    </v-card-actions>
                </v-form>
            </v-tab-item>
            <v-tab-item key="login">
                <v-form
                    ref="login"
                    v-model="login.valid"
                    :readonly="disabled"
                    @submit.prevent="loginUser"
                    dense
                >
                    <v-card-text>
                        <v-text-field
                            v-model="login.name"
                            autocomplete="username"
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
                            autocomplete="current-password"
                            counter
                            @click:append="showPass = !showPass"
                        ></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                        color="success"
                        type="submit"
                        :disabled="disabled"
                        >登录</v-btn>
                    </v-card-actions>
                </v-form>
            </v-tab-item>
            <v-tab-item key="register">
                <v-form
                    ref="register"
                    v-model="register.valid"
                    :readonly="disabled"
                    @submit.prevent="registerUser"
                >
                    <v-card-text>

                        <v-text-field
                                v-model="register.name"
                                autocomplete="new-username"
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
                            autocomplete="new-password"
                            label="请输入密码"
                            hint="最少 8 个字符"
                            counter
                            @click:append="showPass = !showPass"
                        ></v-text-field>
                        <v-text-field
                            v-model="register.confirm"
                            :rules="[rules.required, rules.min, rules.max]"
                            type="password"
                            autocomplete="new-password"
                            label="确认密码"
                            :error-messages="confirmPassword"
                            counter
                        ></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                        color="success"
                        type="submit"
                        :disabled="disabled"
                        >注册</v-btn>
                    </v-card-actions>
                </v-form>
            </v-tab-item>
        </v-tabs-items>
    </v-card>
</template>

<script>
    import {EMITTER_ACTION_SIGN} from "../constants";

    export default {
    name: "LoginPanel",
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
        max: v => v.length < 16 || '最多 16 个字符',
      },
      disabled: false,
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
    sockets : {
    },
    methods : {
      disableForm() {
        let $this = this;
        $this.disabled = true;
        setTimeout(function() {
          $this.disabled = false;
        }, 2000);
      },
      loginUser() {
        let $this = this;

        $this.$refs.login.validate();
        if (!$this.login.valid) {
          return;
        }

        if ($this.disabled) {
          return;
        }
        $this.disableForm();

        let name = $this.login.name;
        let password = $this.login.password;

        $this.$store.dispatch(EMITTER_ACTION_SIGN, {name, password});
      },
      createGuest() {
        let $this = this;

        $this.$refs.guest.validate();
        if (!$this.guest.valid) {
          return;
        }

        if ($this.disabled) {
          return;
        }
        $this.disableForm();


        let date = new Date();
        let name = '访客-' + this.guest.name + date.getMinutes() + date.getSeconds();

        $this.$store.dispatch(EMITTER_ACTION_SIGN, {name, password:''});
      },
      registerUser() {
        let $this = this;

        $this.$refs.register.validate();
        if (!$this.register.valid) {
          return;
        }

        if ($this.disabled) {
          return;
        }
        $this.disableForm();

        let name = $this.register.name;
        let password = $this.register.password;

        $this.$store.dispatch(EMITTER_ACTION_SIGN, {name, password});
      }
    },
    computed : {
      confirmPassword() {
        let $this = this;
        if ($this.register.password !== $this.register.confirm) {
          return ['输入密码不一致'];
        }
        return [];
      }
    }
  }
</script>

<style scoped>
.chat-login {
    min-height:200px;
}
</style>
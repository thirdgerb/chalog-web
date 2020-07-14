<template>
    <v-col
        cols="10"
        sm="8"
        md="6"
        lg="6"
        xl="6"
    >
        <v-tabs
        v-model="tab"

        >
            <v-tab v-for="(t, index) in tabs" :key="index">{{ t }}</v-tab>
        </v-tabs>
        <v-card tile v-if="tab === 0" transition="fade-transition">
            <v-card-text>
                <v-form
                ref="guest"
                v-model="guest.valid"
                >
                    <v-text-field
                    v-model="guest.name"
                    :counter="10"
                    :rules="nameRules"
                    label="请输入昵称"
                    required
                    ></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text >提交</v-btn>
            </v-card-actions>
        </v-card>
        <v-card tile v-if="tab === 1" transition="fade-transition">
            <v-card-text>
                <v-form
                    ref="login"
                    v-model="login.valid"
                >
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
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text >提交</v-btn>
            </v-card-actions>
        </v-card>

        <v-card tile v-if="tab === 2" transition="fade-transition">
            <v-card-text>
                <v-form
                ref="register"
                v-model="register.valid"
                >
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
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text >提交</v-btn>
            </v-card-actions>
        </v-card>
    </v-col>
</template>

<script>
  export default {
    name: "Login",
    data: () => ({
      tab: 0,
      tabs : ['访客', '登录', '注册'],
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
  }
</script>

<style scoped>

</style>
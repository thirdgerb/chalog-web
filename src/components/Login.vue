<template>
    <v-dialog :value="dialog" max-width="600px" persistent>
        <v-card
            tile
        >
            <v-card-title>
                <span class="headline">请输入昵称</span>
            </v-card-title>

            <v-card-text>
                <v-container>
                    <v-row>
                        <v-text-field label="Legal first name*" required></v-text-field>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions
            >
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click.stop="dialog = !dialog">Close</v-btn>
                <v-btn color="blue darken-1" text >Save</v-btn>
            </v-card-actions>
        </v-card>

    </v-dialog>

</template>

<script>
  export default {
    name: "Login",
    data() {
      return {
        dialog: true
      }
    }
  }
</script>

<style scoped>

</style>
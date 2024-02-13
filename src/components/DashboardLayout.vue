<template>
  <div class="dashboard">
    <v-navigation-drawer
      color="#1A237E"
      v-model="drawer"
      class="fullheight"
      width="250"
      app
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title"> PENGADUAN </v-list-item-title>
          <v-list-item-subtitle class="white--text">
           Sistem Input Aduan
          </v-list-item-subtitle>
          <!-- <img id="logoLogin" src="../assets/jbr.png" width="50" height="150" alt="Kitten"> -->
        </v-list-item-content>
      </v-list-item>
      
      <v-divider></v-divider>
      <template>
        <v-card color="#1A237E" class="mx-auto" max-width="300" tile>
          <v-list dense>
            <v-list-item
              v-for="(item, i) in items"
              :key="i"
              link
              tag="router-link"
              :to="item.to"
            >
              <v-list-item-icon>
                <v-icon color="white" v-text="item.icon"> </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="white--text" v-text="item.text">
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </template>
    </v-navigation-drawer>
    <v-app-bar color="#1A237E" app fixed height="80px">
      <v-app-bar-nav-icon
        color="white"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-btn @click="logout" text router>
          <v-icon color="white">mdi-logout</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
    <div class="fullheight pa-5">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  name: "Dashboard",
  data() {
    return {
      drawer: true,
      error_message: "",
      snackbar: false,
      items: [
        { text: "Pengaduan", icon: "mdi-account-group", to: "/pengaduan" },
        //{ text: "Verifikasi", icon: "mdi-account-group", to: "/verifikasi" },
        { text: "Rekap Laporan", icon: "mdi-checkbook", to: "/laporan" },
      ],
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("token");

      this.$router.push({
        name: "Login",
      });
    },
  },
};
</script>

<style scoped>
.fullheight {
  min-height: 100vh !important;
}

.router {
  text-decoration: none;
  color: rgb(255, 255, 255);
}

.v-list-item__title {
  color: rgb(255, 190, 71);
  font-size: 30px;
}
</style>

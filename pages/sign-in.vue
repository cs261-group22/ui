<template>
  <div>
    <login v-if="showLogin" />
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import Login from '~/components/user/Login.vue';
import { UserMixin } from '~/mixins/user';

@Component({
  layout: 'landing',
  components: { Login },
})
export default class SignIn extends UserMixin {
  showLogin = false;

  created() {
    if (!this.isLoggedIn) {
      this.showLogin = true;
      return;
    }

    if (!this.$route.query.target) {
      this.showLogin = true;
      return;
    }

    if (this.isGuest) {
      this.showLogin = true;
      return;
    }

    if (this.$route.query.target === 'dashboard') {
      this.$router.push({ name: 'dashboard-events' });
    } else {
      this.$router.push({
        name: 'event-code',
        params: { code: this.$route.query.target as string },
      });
    }
  }
}
</script>

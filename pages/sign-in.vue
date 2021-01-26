<template>
  <div>
    <login></login>
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
  created() {
    if (!this.isLoggedIn) {
      return;
    }

    if (!this.$route.query.target) {
      return;
    }

    if (this.$route.query.target === 'dashboard') {
      this.$router.push({ name: 'dashboard' });
    } else {
      this.$router.push({
        name: 'event-code',
        params: { code: this.$route.query.target as string },
      });
    }
  }
}
</script>

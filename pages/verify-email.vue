<template>
  <div>
    <email-verification />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import EmailVerification from '~/components/user/EmailVerification.vue';

@Component({
  layout: 'landing',
  components: { EmailVerification },
})
export default class VerifyEmail extends Vue {}
</script>

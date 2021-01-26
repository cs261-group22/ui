<template>
  <p>todo</p>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { validationMixin } from 'vuelidate';

@Component({
  mixins: [validationMixin],
})
export default class PasswordRecover extends Vue {}
</script>

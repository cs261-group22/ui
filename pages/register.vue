<template>
  <div>
    <registration />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Registration from '~/components/user/Registration.vue';

@Component({
  layout: 'landing',
  components: { Registration },
})
export default class Register extends Vue {
  //
}
</script>

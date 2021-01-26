<template>
  <button
    class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-quinary"
    @click="propagateClick"
  >
    <svg v-show="loading" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 38" height="20px">
      <defs>
        <linearGradient id="a" x1="8.042%" y1="0%" x2="65.682%" y2="23.865%">
          <stop stop-color="#fff" stop-opacity="0" offset="0%" />
          <stop stop-color="#fff" stop-opacity=".631" offset="63.146%" />
          <stop stop-color="#fff" offset="100%" />
        </linearGradient>
      </defs>
      <g fill="none" fill-rule="evenodd">
        <g transform="translate(1 1)">
          <path id="Oval-2" d="M36 18c0-9.94-8.06-18-18-18" stroke="url(#a)" stroke-width="2">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 18 18"
              to="360 18 18"
              dur="0.9s"
              repeatCount="indefinite"
            />
          </path>
          <circle fill="#fff" cx="36" cy="18" r="1">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 18 18"
              to="360 18 18"
              dur="0.9s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </g>
    </svg>

    <span :class="{ transparent: loading }">
      <slot />
    </span>
  </button>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Loader extends Vue {
  @Prop({ type: Boolean, required: false, default: false })
  loading!: boolean;

  propagateClick() {
    this.$emit('click');
  }
}
</script>

<style lang="scss" scoped>
.transparent {
  color: transparent;
}

svg {
  position: absolute;
}
</style>

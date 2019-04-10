
<template>
  <!-- eslint-disable vue/require-component-is -->
  <!-- <component v-bind="linkProps(to)">
    <slot />
  </component> -->
  <div @click="linkTo(to)">
    <slot />
  </div>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  methods: {
    linkTo (url) {
      isExternal(url) ? window.open(url) : this.$router.push(url)
    },
    linkProps(url) {
      if (isExternal(url)) {
        return {
          is: 'a',
          href: url,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        is: 'router-link',
        to: url
      }
    }
  }
}
</script>

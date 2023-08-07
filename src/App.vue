<template>
  <base-app/>
</template>

<script>
import { defineComponent } from 'vue'
import BaseApp from 'module-frontend-base/src/components/BaseApp.vue'

export default defineComponent({
  name: 'App',
  components: {
    BaseApp
  },
})
</script>

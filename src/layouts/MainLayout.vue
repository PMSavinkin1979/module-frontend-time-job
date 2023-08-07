<template>
  <base-layout :links="links"/>
</template>

<script>
import { defineComponent, ref } from 'vue'
import {HOME} from "src/router/routes";

import BaseLayout from 'module-frontend-base/src/layouts/BaseLayout.vue'

const linksList = [
  {
    title: 'Работа',
    icon: 'mdi-home',
    exact: true,
    to: {name: HOME},
    //show: () => {return true}
  },
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    BaseLayout
  },
  data() {
    return {
      links: linksList,
    }
  },

})
</script>

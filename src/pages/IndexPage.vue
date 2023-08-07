<template>
  <div class="q-pa-md">
    <q-table
      flat bordered
      title="Планируемые работы"
      dense
      :rows="rows"
      :columns="columnsOnTheSide"
      row-key="id"
    />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

const columnsOnTheSide = [
  { name: 'id', align: 'center', label: 'id', field: 'id', sortable: true },
  { name: 'user_modules', align: 'center', label: 'user_modules', field: 'user_modules', sortable: true },
  { name: 'name', align: 'center', label: 'name', field: 'name', sortable: true },
  { name: 'email', align: 'center', label: 'email', field: 'email', sortable: true },
  { name: 'access_outside', align: 'center', label: 'access', field: 'access_outside', sortable: true },
]

export default defineComponent({
  name: 'IndexPage',
  setup() {
    let rows = ref([])

    return {
      columnsOnTheSide, rows,
    }
  }
})
</script>

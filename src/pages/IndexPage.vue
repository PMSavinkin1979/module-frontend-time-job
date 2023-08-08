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
import {useUserStore} from "module-frontend-base"
import {mapStores} from "pinia";
import {api} from "boot/axios";

const columnsOnTheSide = [
  { name: 'date_otk', align: 'center', label: 'Дата готовности', field: 'date_otk', sortable: true },
  { name: 'area_gird', align: 'center', label: 'Площадка ГИРД', field: 'area_gird', sortable: true },
  { name: 'area_on_the_side', align: 'center', label: 'Площадка доработчика', field: 'area_on_the_side', sortable: true },
  { name: 'note', align: 'center', label: 'Примечание', field: 'note', sortable: true },
  { name: 'type_work', align: 'center', label: 'Тип работ', field: 'type_work', sortable: true },
]

export default defineComponent({
  name: 'IndexPage',
  setup() {
    let rows = ref([])
    let who = ref('')

    function getAllDataReworker(who) {
      api.post('getAllDataReworker', {data: who}).then(respond => {

      })
    }

    return {
      columnsOnTheSide, rows, getAllDataReworker, who,
    }
  },
  computed: {
    ...mapStores(useUserStore)
  },
  created() {
    this.who = this.userStore.user//hasPermission('order.act')
    this.getAllDataReworker(this.who)
    //this.getAllDataReworker
    //console.log(this.who)
  },
})
</script>

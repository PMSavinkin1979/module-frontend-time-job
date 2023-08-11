<template>

  <div class="row q-pa-md">
    <div class="col-2">
      <q-toggle v-model="viewTable" :label="uploadStatusLabel" color="green"/>
    </div>
    <div class="col-2">
      <q-btn color="green-10" dense outline label="Выгрузить в Excel" size="0.8rem"></q-btn>
    </div>
  </div>

  <div class="q-pa-md">
    <q-table
      flat bordered
      title="Планируемые работы"
      dense
      :rows="rows"
      :columns="columnsOnTheSide"
      row-key="id"
    >
      <template #body-cell-area_gird="props">
        <q-td align="center">
          <q-icon v-if="props.row.area_gird" size="1.2rem" color="green" name="mdi-check-bold"/>
        </q-td>
      </template>

      <template #body-cell-view_icon="props">
        <q-td align="center">
          <q-icon v-if="props.row.done!==null" size="1.2rem" color="green" name="mdi-check-circle"/>
        </q-td>
      </template>

      <template #body-cell-area_on_the_side="props">
        <q-td align="center">
          <q-icon v-if="props.row.area_on_the_side" size="1.2rem" color="green" name="mdi-check-bold"/>
        </q-td>
      </template>

    </q-table>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import {useUserStore} from "module-frontend-base"
import {mapStores} from "pinia";
import {api} from "boot/axios";

const columnsOnTheSide = [
  { name: 'view_icon', align: 'center', label: '', field: 'view_icon', sortable: true },
  { name: 'reworker_name', align: 'center', label: 'Доработчик', field: 'reworker_name', sortable: true },
  { name: 'id', align: 'center', label: '№', field: 'id', sortable: true },
  { name: 'order_name', align: 'center', label: 'Приказ ГИРД', field: 'order_name', sortable: true },
  { name: 'date_otk', align: 'center', label: 'Дата сдачи ГИРД', field: 'date_otk', sortable: true },
  { name: 'on_the_side', align: 'center', label: 'В работе доработчика с', field: 'on_the_side', sortable: true },
  { name: 'done_on_the_side', align: 'center', label: 'Готовность доработки', field: 'done_on_the_side', sortable: true },
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
    let viewTable = ref(false)
    let uploadStatusLabel = ref('все заявки')

    function getAllDataReworker() {
      api.post('getAllDataReworker', {data: who.value, view_table: viewTable.value}).then(respond => {
        rows.value = respond.data
      })
    }

    return {
      columnsOnTheSide, rows, getAllDataReworker, who, viewTable, uploadStatusLabel,
    }
  },
  watch: {
    viewTable() {
      if (this.viewTable) {
        this.uploadStatusLabel = 'только заявки в работе'
      } else {
        this.uploadStatusLabel = 'все заявки'
      }
      this.getAllDataReworker()
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

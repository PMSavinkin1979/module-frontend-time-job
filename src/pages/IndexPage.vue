<template>

  <div class="row q-pa-md">
    <div class="col-2">
      <q-toggle v-model="viewTable" :label="uploadStatusLabel" color="green"/>
    </div>
    <div class="col-2">
      <q-btn color="green-10" dense outline size="0.8rem">
        <a style="font-size: x-small" :href="printOnTheSide()" target="_blank">Выгрузить в Excel</a>
      </q-btn>
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

      <template #body-cell-note="props">
        <q-td align="center">
<!--          <span>{{ props.row.note.substring(0,10) }}...</span>-->
          <span style="color: blue; cursor: pointer;" v-if="checkText(props.row.note) && props.row.note!==null" @click="viewText(props.row.note)">{{ props.row.note.substring(0,10) }}...</span>
          <span v-else>{{ props.row.note }}</span>
        </q-td>
      </template>

      <template #body-cell-type_work="props">
        <q-td align="center">
          <span style="color: blue; cursor: pointer;" v-if="checkText(props.row.type_work) && props.row.type_work!==null" @click="viewText(props.row.type_work)">{{ props.row.type_work.substring(0,10) }}...</span>
          <span v-else>{{ props.row.type_work }}</span>
        </q-td>
      </template>

    </q-table>

<!--    Диалоговое окно для просмотра большого текста-->
    <q-dialog v-model="dialogViewText">
      <q-card>
        <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <span>{{ viewTextInDialog }}</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
    let viewTable = ref(true)
    let uploadStatusLabel = ref('только заявки в работе')
    let dialogViewText = ref(false)
    let viewTextInDialog = ref('')

    function getAllDataReworker() {
      api.post('getAllDataReworker', {data: who.value, view_table: viewTable.value}).then(respond => {
        rows.value = respond.data
      })
    }

    function checkText(text) {
      if (text!==null) {
        if (text.length>10) {
          return true
        }
      }
    }

    function viewText(text) {
      viewTextInDialog.value = text
      dialogViewText.value = true
    }

    function printOnTheSide() {
      return '/printOnTheSide'
    }

    return {
      columnsOnTheSide, rows, getAllDataReworker, who, viewTable, uploadStatusLabel, checkText, viewText, dialogViewText, viewTextInDialog, printOnTheSide
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

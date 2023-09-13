<template>

  <div class="row q-pa-md">
    <div class="col-2">
      <q-toggle v-model="viewTable" :label="uploadStatusLabel" color="green"/>
    </div>
    <div class="col-2">
      <q-btn disable color="green-10" dense outline size="0.8rem">
        <a style="font-size: x-small" :href="printOnTheSide()" target="_blank">Выгрузить в Excel</a>
      </q-btn>
    </div>
  </div>

  <div class="q-pa-md">
    <q-table
      class="my-sticky-header-table"
      flat bordered
      title="Планируемые работы!!!"
      dense
      :rows="rows"
      :columns="columnsOnTheSide"
      row-key="id"
      hide-pagination
      :rows-per-page-options="[0]"
    >
      <template #body-cell-area_gird="props">
        <q-td align="center">
          <q-icon v-if="props.row.area_gird" size="1.2rem" color="green" name="mdi-check-bold"/>
        </q-td>
      </template>

      <template #body-cell-view_icon="props">
        <q-td align="center">
          <q-icon v-if="props.row.done!==null" size="1.2rem" color="green" name="mdi-check-circle"/>
          <!--          нет сообщения-->
          <q-icon class="plusIcon" v-if="commentStatus(props.row)===true" @click="openComment(props.row)" size="1.2rem" color="lime-6" name="mdi-comment-plus-outline"/>
          <!--          есть сообщения-->
          <q-icon class="plusIcon" v-if="commentStatus(props.row)===false" @click="openComment(props.row)" size="1.2rem" color="blue-6" name="mdi-comment-plus"/>
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
          <div class="text-h6"></div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <span>{{ viewTextInDialog }}</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

<!--    Диалоговое окно для соощений-->
    <q-dialog v-model="dialogMessage">
      <q-card style="min-width: 700px" >
        <q-card-section>
          <div class="row">
            <div class="col-10">
              <div class="text-h6">Сообщения</div>
            </div>
            <div class="col-1">

            </div>
            <div class="col-1">
              <div style="cursor: pointer" class="text-h6" @click="closeComment">Х</div>
            </div>
          </div>

        </q-card-section>

        <q-card-section style="max-height: 60vh; background: wheat" class="scroll">
          <div class="q-pa-md row justify-center">
            <div style="width: 100%; max-width: 600px;">
<!--              <q-chat-message label="Sunday, 19th"/>-->
              <div v-for="mes in messages" :key="mes['id']">
                <q-chat-message v-if="mes.whose_comment==='ГИРД'" :name="mes.whose_comment"
                                :text="[mes.comment]"
                                :stamp="timeMessage(mes.created_at)"
                                sent
                />
                <q-chat-message v-else :name="mes.whose_comment"
                                :text="[mes.comment]"
                                :stamp="timeMessage(mes.created_at)"
                />
              </div>
            </div>
          </div>
        </q-card-section>

<!--        <q-card-actions>-->
          <div class="row q-pa-md">
            <div class="col-9">
              <q-input filled autogrow dense outlined label="Соощение" v-model="newMessage"/>
            </div>
            <div class="col-1">
            </div>
            <div class="col-2">
              <q-btn dense flat label="Отправить" color="primary" @click="saveNewMessage(newMessage)"/>
            </div>
          </div>
<!--        </q-card-actions>-->
      </q-card>
    </q-dialog>
  </div>

</template>

<script>
import { defineComponent, ref } from 'vue'
import {useUserStore} from "module-frontend-base"
import {mapStores} from "pinia";
import {api} from "boot/axios";
import {QSpinnerClock, useQuasar} from "quasar";

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
    let dialogMessage = ref(false)
    let viewTextInDialog = ref('')
    const $q = useQuasar()
    let newMessage = ref('')
    let messages = ref([])
    let message = ref([])

    let options = {
      spinner: QSpinnerClock,
      spinnerColor: 'blue',
      spinnerSize: 70,
      /*backgroundColor: 'purple',*/
      message: 'Загрузка',
      messageColor: 'white'
    }

    function getAllDataReworker() {
      $q.loading.show(options)
      api.post('getAllDataReworker', {data: who.value, view_table: viewTable.value}).then(respond => {
        rows.value = respond.data
        $q.loading.hide()
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
      return '/printOnTheSide?reworker_id=' + who.value.id + '&view_table=' + viewTable.value
    }

    function openComment(row) {
      message.value = row
      api.post('loadComments',{on_the_side_id: row['id']}).then(respond => {
        messages.value = respond.data

        dialogMessage.value = true
      })
    }

    function closeComment() {
      dialogMessage.value = false
      getAllDataReworker()
    }

    function saveNewMessage(newMessage) {
      //console.log(message.value.id)
      api.post('saveNewMessage',{message: newMessage, on_the_side_id: message.value.id, who: who.value}).then(respond => {
        api.post('loadComments',{on_the_side_id: message.value.id}).then(respond => {
          messages.value = respond.data
          newMessage.value = ''
        })
      })
    }

    function timeMessage(dateTime) {
      let da = new Date(dateTime)
      let result = ''
      let month = da.getMonth()
      if (month<10) month = '0'+da.getMonth()
      result = da.getFullYear()+'-'+month+'-'+da.getDate()
      return result
    }

    function commentStatus(row) {
      let comments = row['comments_on_the_side']
      if (comments.length>0) {
        let result = comments.filter(com => com['status']===0 && com['whose_comment']==='ГИРД')
        if (result.length>0) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    }

    return {
      columnsOnTheSide, rows, getAllDataReworker, who, viewTable, uploadStatusLabel, checkText, viewText, dialogViewText, viewTextInDialog, printOnTheSide, openComment,
      commentStatus, dialogMessage, newMessage, messages, timeMessage, saveNewMessage, message, closeComment,
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

<style lang="sass">
.plusIcon
  cursor: pointer

.my-sticky-header-table
  /* height or max-height is important */
  height: calc(100vh - 170px)

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: papayawhip

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
</style>

<template lang="pug">
div
  EditDialog(:vis="editBrokerDialog" @close="closeEditDialog"  @refresh="refreshDataTable" :item="editItem")
  AddDialog(:vis="addBrokerDialog" @close="closeAddDialog" @refresh="refreshDataTable")
  DeleteDialog(:vis="deleteBrokerDialog" @close="closeDeleteDialog" :idItem="deleteSourceId" @refresh="refreshDataTable")
  table
    thead
      tr
        th Id
        th Title
        //- th Create At
        th Slug
        //- th Update At
        th.th_max_w Action
    tbody(v-if="lengthDataList")
      tr(v-for="item in PERMISSIONS_LIST" :key="item.id")
        td  {{item.id}}
        td  {{item.title}}
        //- td  {{item.created_at}}
        td  {{item.slug}}
        //- td  {{item.updated_at}}
        td 
          .btn_box_action
            button.btn_edit(@click="editSource(item)" )
              v-icon mdi-pencil
            button.btn_delete(@click="deleteSource(item.id)" )
              v-icon mdi-trash-can-outline
  .no_data(v-if="!lengthDataList")
    img(src="@/assets/icon/no_data.svg")
    span No data found for the selected filter
  .table-footer
    .tf-left(v-if="lengthPagination")
      .tf-select
        .tf-box(@click="showDrop()")
          | {{ listCountInTable }}
          v-icon(:class="{ rotate: showDropMenu }") mdi-chevron-down
        .tf-drop-menu(v-if="showDropMenu")
          input.drop-input(
            @keyup.enter="takeInputNumber()"
            v-model="imputNumber"
            type="text"
            placeholder="Enter page"
          )
          .drop-list(@click="pickDropButton(25)") 25
          .drop-list(@click="pickDropButton(50)") 50
          .drop-list(@click="pickDropButton(200)") 200
          .drop-list(@click="pickDropButton(PAGIN_PERMISSION.total)") All
      button.btn-arrow(@click="clickPaginationArrow('left')")
        v-icon mdi-chevron-left
      button(
        v-for="(btn, index) in paginationNumbers"
        :key="index"
        @click="takePagination(btn)"
        :class="dotButtonClass(btn)"
      ) {{ btn }}
      //- button(v-for='(btn, index) in paginationNumbers' :key='index' :class="{'btn-dots':btn=='...', 'active':btn == currentPage}" @click='takePagination(btn)') {{btn}}
      button.btn-arrow(@click="clickPaginationArrow('right')")
        v-icon mdi-chevron-right
    .tf-right
      .btn_add_new(@click="addBrokerDialog = true" ) Add Role
      .tfr-input-box
        input(v-model.trim="searchInput" @change="search()" type="text" placeholder="Search" )
        v-icon(color="#828282") mdi-magnify
</template>

<script>
import AddDialog from "./add_dialog"
import EditDialog from "./edit_dialog"
import DeleteDialog from "./delete_dialog"
import { mapGetters, mapActions, mapMutations } from "vuex";
import qs from "qs"
export default {
components: {
  AddDialog,
  DeleteDialog,
  EditDialog,
},

data() {
  return {
    editBrokerDialog: false,
    editItem: null,
    addBrokerDialog: false,
    deleteBrokerDialog: false,
    deleteSourceId: null,
    imputNumber: "",
    listCountInTable: 15,
    currentPage: 1,
    showDropMenu: false,
    opacity: false,
    searchInput: '',
  };
},
computed: {
  ...mapGetters([
    // "GET_COUNTRIES",
    // "GET_STATUSES",
    // "GET_BROKERS",
    // "GET_FUNNELS",
    // "GET_SOURCES",
    "PERMISSIONS_LIST",
    "PAGIN_PERMISSION",
  ]),
  lengthDataList() {
    if (this.PERMISSIONS_LIST){
      return true
    }else{
      return false
    }
  },
  lengthPagination() {
    if (this.PAGIN_PERMISSION) {
      if (this.PAGIN_PERMISSION.total == 0) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  },
  token() {
    if (localStorage["jwt"]) {
      return localStorage["jwt"];
    } else {
      return false;
    }
  },
  paginationNumbers() {
    let c = this.currentPage;
    let l = this.PAGIN_PERMISSION.lastPage;
    if (l < 9) {
      let minPageArr = [];
      for (let x = 1; x <= l; x++) {
        minPageArr.push(x);
      }
      return minPageArr;
    } else if (this.currentPage == 1) {
      return [1, 2, 3, 4, "...", l - 3, l - 2, l - 1, l];
    } else if (this.currentPage <= 3) {
      return [c - 1, c, c + 1, c + 2, "...", l - 3, l - 2, l - 1, l];
    } else if (this.currentPage == l) {
      return [1, 2, 3, 4, "...", l - 3, l - 2, l - 1, l];
    } else if (this.currentPage >= l - 2) {
      return [1, 2, 3, 4, "...", c - 2, c - 1, c, c + 1];
    } else {
      return [1, "...", c - 2, c - 1, c, c + 1, c + 2, "...", l];
    }
  },
},
methods: {
  ...mapActions(['GetPermission']),
  editSource(item){
    let x = JSON.parse(JSON.stringify(item))
    this.editBrokerDialog = true
    this.editItem = x
  },
  closeEditDialog(){
    this.editBrokerDialog = false
  },
  closeAddDialog(){
    this.addBrokerDialog = false
  },
  deleteSource(id){
    this.deleteBrokerDialog = true
    this.deleteSourceId = id
  },
  closeDeleteDialog(){
    this.deleteBrokerDialog = false
  },
  closeAddDialog(){
    this.addBrokerDialog = false
  },
  search() {
    let v = this;
    v.opacity = true;
    setTimeout(() => {
      this.currentPage = 1
      this.refreshDataTable()
    }, 1000);
  },
  refreshDataTable(){
    let x = {}
    x.search = this.searchInput
    // console.log(x.search);
    x.currentPage = this.currentPage
    x.perPage = this.listCountInTable
    this.GetPermission(x)
  },
  clickPaginationArrow(rl) {
    if (rl == "left" && this.currentPage > 1) {
      this.currentPage = this.currentPage - 1;
      this.refreshDataTable()
    } else if (
      rl == "right" &&
      this.currentPage < this.PAGIN_PERMISSION.lastPage
    ) {
      this.currentPage = this.currentPage + 1;
      this.refreshDataTable()
    }
  },
  takePagination(btn) {
    if (typeof btn == "number") {
      this.currentPage = btn;
      this.refreshDataTable()
    } else {
      console.log("dot");
    }
  },
  takeInputNumber() {
    let x = Number(this.imputNumber);
    if (x != NaN && x > 0) {
      if (x > this.PAGIN_PERMISSION.total) {
        this.listCountInTable = this.PAGIN_PERMISSION.total;
        this.refreshDataTable()
      } else {
        this.listCountInTable = x;
        this.refreshDataTable()
      }
    }
    this.currentPage = 1;
    this.showDrop();
    this.imputNumber = "";
  },

  showDrop() {
    this.showDropMenu = !this.showDropMenu;
  },
  pickDropButton(num) {
    this.listCountInTable = num;
    this.currentPage = 1;
    this.showDrop();
    this.refreshDataTable()
  },
  broker(broker_id) {
    if (this.GET_BROKERS.length > 0) {
      let broker = this.GET_BROKERS.find((x) => x.id == broker_id);
      return broker.title;
    } else {
      return "null";
    }
  },
  status(status_id) {
    if (this.GET_STATUSES.length > 0) {
      let status = this.GET_STATUSES.find((x) => x.id == status_id);
      return status.title;
    } else {
      return "null";
    }
  },
  dotButtonClass(btn) {
    if (btn == "...") {
      return "btn-dots";
    } else if (btn == this.currentPage) {
      return "active";
    } else {
      return null;
    }
  },
},
};
</script>


<style lang="scss" scoped>
@import 'src/scss/leads/_status_compressions_comp.scss';
.th_max_w{
  width: 150px;
}
.btn_box_action{
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 100px;
  justify-content: space-between;
  & button{
    outline: none;
    height: 30px;
    padding: 0 9px;
    border-radius: 5px;
    background: $yellow;
  }
  .btn_edit{
    display: flex;
    align-items: center;
  }
  .btn_delete{
    background: $yellow;
    display: flex;
    align-items: center;
    // .v-icon{
    //   color: $dark;
    // }
  }
}
.btn_add_new{
  color: $dark;
  cursor: pointer;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
  background: $yellow;
  height: 30px;
  padding: 0 9px;
} 
.type_br{
  color: white;
  background: #F64E60;
  padding: 2px 4px;
  border-radius: 4px;
  &.net{
    background: #8950FC;
  }
}
</style>
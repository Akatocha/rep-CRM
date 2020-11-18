<template lang="pug">
div
  AddDialog(:vis="dialogAddStatus" @close="closeAddDialog" @success="refreshDataTable")
  table
    thead
      tr
        th Id
        th Status
        th Description
        th Color
    tbody(v-if="lengthDataList")
      tr(v-for="(item, index) in ALL_STATUSES_LEADS_DATA" :key="item.id")
        td {{item.id}}
        td
          //- span(:class="statusClass(item.id)" v-model="item.title")
          TitleCell(:itemId="item.id" :itemTitle="item.title" :statusClass="item.class" @success="refreshDataTable")
        td 
          textarea.text_area(v-model="item.description" readonly  @blur="blurTextArea(item, index)" @dblclick="dblTextArea(item, index)" @change="changeDascription(item)")
        td 
          ColorBtn(:statusClass="item.class" :statusId="item.id" :statusTitle="item.title" @success="refreshDataTable")
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
          .drop-list(@click="pickDropButton(PAGIN_ALL_STATUSES_LEADS.total)") All
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
      .btn_add_status(@click="showAddDialog" ) Add Status
      .tfr-input-box
        input(
          v-model.trim="searchInput"
          @change="search()"
          type="text"
          placeholder="Search"
        )
        v-icon(color="#828282") mdi-magnify
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import AddDialog from "./add_dialog"
import ColorBtn from "./color_button"
import TitleCell from "./title_cell"
import qs from "qs"
export default {

components: {
  ColorBtn,
  TitleCell,
  AddDialog,
},
data() {
  return {
    dialogAddStatus: false,
    imputNumber: "",
    listCountInTable: 15,
    currentPage: 1,
    showDropMenu: false,
    opacity: false,
    searchInput: null,
  };
},
computed: {
  ...mapGetters([
    "GET_STATUSES",
    "ALL_STATUSES_LEADS_DATA",
    "PAGIN_ALL_STATUSES_LEADS",
  ]),
  lengthDataList() {
    if (this.ALL_STATUSES_LEADS_DATA){
      // if (this.ALL_STATUSES_LEADS_DATA.length > 5) {
      //   return true;
      // } else {
      //   return false;
      // }
      return true
    }else{
      return false
    }
  },
  lengthPagination() {
    if (this.PAGIN_ALL_STATUSES_LEADS) {
      if (this.PAGIN_ALL_STATUSES_LEADS.total == 0) {
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
    let l = this.PAGIN_ALL_STATUSES_LEADS.lastPage;
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
  ...mapActions(['getAllStatusesLeads', 'ShowAlert']),
  showAddDialog(){
    this.dialogAddStatus = true
  },
  closeAddDialog(){
    this.dialogAddStatus = false
  },
  dblTextArea(item, index){
    this.$nextTick(()=> {
      // this.$el.querySelectorAll('.text_area')[index].setAttribute("readonly", "true")
      this.$el.querySelectorAll('.text_area')[index].removeAttribute("readonly")
      this.$el.querySelectorAll('.text_area')[index].style.fontStyle = "italic"
    })
  },
  blurTextArea(item, index){
    this.$nextTick(()=> {
      this.$el.querySelectorAll('.text_area')[index].setAttribute("readonly", "true")
      this.$el.querySelectorAll('.text_area')[index].style.fontStyle = "normal"
      
    })
  },
 
  changeDascription(item){
    let token = localStorage['jwt']
    let data = qs.stringify({
        'title': item.title,
        'class': item.class,
        'description': item.description,
      });
    let config = {
        method: 'put',
        url: `https://back.horus.itdepartment.space/statuses/${item.id}`,
        headers: { 
          'Auth-Token': token, 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
      };
    this.axios(config)
        .then((response) => {
          if(response.data.status == 'success'){
            this.ShowAlert()
          }
          // console.log(response.data)
          this.refreshDataTable()
        })
        .catch((error) => {
          console.log(error);
        });

  },
  
  refreshDataTable(){
    let x = {}
    x.search = this.searchInput
    x.currentPage = this.currentPage
    x.perPage = this.listCountInTable
    this.getAllStatusesLeads(x)
  },
  search() {
    let v = this;
    v.opacity = true;
    setTimeout(() => {
      this.currentPage = 1
      this.refreshDataTable()
    }, 1000);
  },
  clickPaginationArrow(rl) {
    if (rl == "left" && this.currentPage > 1) {
      this.currentPage = this.currentPage - 1;
      this.refreshDataTable()
    } else if (
      rl == "right" &&
      this.currentPage < this.PAGIN_ALL_STATUSES_LEADS.lastPage
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
      if (x > this.PAGIN_ALL_STATUSES_LEADS.total) {
        this.listCountInTable = this.PAGIN_ALL_STATUSES_LEADS.total;
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

.text_area {
  // text-indent: .5em;
  outline: none;
  width: 100%;
  max-width: 400px;
  padding-bottom: 3px;
  // border-bottom: 1px solid $gray_5;
  font-size: 14px;
  line-height: 16px;
  &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-track {
      background-color: $white;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb {
      min-height: 20px;  
      border-radius: 10px;
      background-color: $gray_4;	
    }
}
.btn_add_status{
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
textarea { resize: none !important; }
</style>
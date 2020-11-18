<template lang="pug">
div
  table
    thead
      tr
        th Id
        th Broker
        th Broker Status
        th Our Status
    tbody(v-if="lengthDataList")
      tr(v-for="(item, index) in GET_STATUSES_COMPRESSIONS" :key="index")
        td {{item.id}}
        td {{broker(item.broker_id) }}
        td {{item.broker_status}}
        td
          StatusDropButton(:status_id="item.status_id" :row_id="item.id")
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
          .drop-list(@click="pickDropButton(PAGIN_STATUSES_COMPRESSIONS.total)") All
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
import StatusDropButton from "./status_drop_button"
import qs from "qs"
export default {
  components: {
    StatusDropButton,
  },

  data() {
    return {
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
      "GET_COUNTRIES",
      "GET_STATUSES",
      "GET_BROKERS",
      "GET_FUNNELS",
      "GET_SOURCES",
      "GET_STATUSES_COMPRESSIONS",
      "PAGIN_STATUSES_COMPRESSIONS",
    ]),
    lengthDataList() {
      if (this.GET_STATUSES_COMPRESSIONS){
        return true
      }else{
        return false
      }
    },
    lengthPagination() {
      if (this.PAGIN_STATUSES_COMPRESSIONS) {
        if (this.PAGIN_STATUSES_COMPRESSIONS.total == 0) {
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
      let l = this.PAGIN_STATUSES_COMPRESSIONS.lastPage;
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
    ...mapActions(['UpdateStatusesCompressions', 'ShiftRemoveCheckbox','ShiftAddCheckbox',"ChangeStatusLeads", "RemoveAllCheckbox", "AddAllCheckbox"]),
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
      this.UpdateStatusesCompressions(x)
    },
    clickPaginationArrow(rl) {
      if (rl == "left" && this.currentPage > 1) {
        this.currentPage = this.currentPage - 1;
        this.refreshDataTable()
      } else if (
        rl == "right" &&
        this.currentPage < this.PAGIN_STATUSES_COMPRESSIONS.lastPage
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
        if (x > this.PAGIN_STATUSES_COMPRESSIONS.total) {
          this.listCountInTable = this.PAGIN_STATUSES_COMPRESSIONS.total;
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

</style>
<template lang="pug">
div(:class="{ download: opacity }")
  vue-context(ref="menu", v-slot="{ data }")
    template(v-if="data")
      .context_cell(@click="openInfoDialog(data.user)")
        img(src="@/assets/icon/info.svg")
        span More Info
      .context_cell(@click="openEditDialog(data.user)")
        img(src="@/assets/icon/edit.svg")
        span Edit
      .context_cell(@click="clickDeleteLead(data.user)")
        img(src="@/assets/icon/remove.svg")
        span Remove
  InfoLeadDialog(:vis="showInfoDialog" @close="closeInfoDialog" :lead="editedLead" @success="TakeUpPageInterval")
  DeleteDialog(:vis='deleteDialogShow' :message="message" :mod="deleteDialogMod" :lead="deleteLeadObj" @sendDataMass="massDeleteLeads" @sendData="deleteLead" @close="deleteDialogShow = false")
  massResentDialog(:vis="resentDialog" @close="resentDialog = false")
  EditLeadDialog(:vis="showEditDialog" @close="closeEditDialog" :lead="editedLead" @success="TakeUpPageInterval")
  table
    thead
      tr
        th.th-menu
          .checkbox_container(@click='changeAllCheckbox')
            v-icon(size="16" v-if="!removeSatus") mdi-check
            v-icon(size="16" v-if="removeSatus") mdi-close
        th
        th(v-if="headTableSort('id')") ID
        th(v-if="headTableSort('first_name')") FirstName
        th(v-if="headTableSort('last_name')") Last Name
        th(v-if="headTableSort('phone')") Phone
        th(v-if="headTableSort('email')") Email
        th(v-if="headTableSort('source_id')") Source
        th(v-if="headTableSort('broker_id')") Broker
        th(v-if="headTableSort('country_id')") CC
        th(v-if="headTableSort('first_broker_status')") FBS
        th(v-if="headTableSort('status_id')") Status
        th(v-if="headTableSort('broker_status')") BS
        th(v-if="headTableSort('reg_time')") Reg Time
        th(v-if="headTableSort('send_time')") Send Time
        th(v-if="headTableSort('funnel_id')") Funnel
    tbody(v-if="lengthDataList")
      tr(
        @contextmenu.prevent="$refs.menu.open($event, { user })"
        v-for="(user, index) in RES_LEADS_TAB"
        :key="index"
      )
        td.td-menu
          .checkbox_container(@click.exact="checkLeads(index)" @click.shift.exact="shiftCheckbox(index)") 
            v-icon(size="16" v-if="user.status") mdi-check
        td
          v-icon(size="15" v-if="user.copy") mdi-checkbox-multiple-blank-outline
          span.redirect-circle-red(
            v-if="redirectIcon(user.rederict, user.copy)"
          )
        td(v-if="user.id") {{ user.id }}
        td(v-if="user.first_name") {{ user.first_name }}
        td(v-if="user.last_name") {{ user.last_name }}
        td(v-if="user.phone") {{ user.phone }}
        td(v-if="user.email") {{ user.email }}
        td(v-if="user.source_id") {{ source(user.source_id) }}
        td(v-if="user.broker_id") {{ broker(user.broker_id) }}
        td(v-if="user.country_id")
          .td-country
            img(
              v-if="countriesApiData.length > 0"
              :src="countryIsoCode(user.country_id)"
            )
            span.td-country-span(v-if="countriesApiData.length > 0") {{ countryIsoName(user.country_id) }}
        td(v-if="user.first_broker_status") {{ user.first_broker_status }}
        td(v-if="user.status_id" ) 
          span(:class="statusClass(user.status_id)") {{ status(user.status_id) }}
        td(v-if="user.broker_status") {{ user.broker_status }}
        td(v-if="user.reg_time") {{ user.reg_time }}
        td(v-if="user.send_time") {{ user.send_time }}
        td(v-if="user.funnel_id") {{ funnel(user.funnel_id) }}

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
          .drop-list(@click="pickDropButton(dataPagination.total)") All
      button.btn-arrow(@click="clickPaginationArrow('left')")
        v-icon mdi-chevron-left
      button(
        v-for="(btn, index) in paginationNumbers"
        :key="index"
        @click="takePagination(btn)"
        :class="dotButtonClass(btn)"
      ) {{ btn }}
      //- button(v-for='(btn, index) in paginationNumbers' :key='index' :class="{'btn-dots':btn=='...', 'active':btn == pageNumber}" @click='takePagination(btn)') {{btn}}
      button.btn-arrow(@click="clickPaginationArrow('right')")
        v-icon mdi-chevron-right
    .tf-right
      button.mass_delete(@click="massDeleteClick") MASS DELETE 
      button.mass_resent(@click="massResent") MASS RESEND
      button.xls(@click="xlsBtn") XLS
      .tfr-input-box
        input(
          v-model.trim="searchInput"
          @change="search()"
          type="text"
          placeholder="Search of Leads"
        )
        v-icon(color="#828282") mdi-magnify
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import EditLeadDialog from "./leads/edit_user_dialog"
import InfoLeadDialog from "./leads/info_dialog"
import DeleteDialog from "./leads/delete_dialog"
import massResentDialog from "./leads/mass_resent_dialog"
import VueContext from "vue-context";
import "vue-context/src/sass/vue-context.scss"; // Alternatively imp
import qs from "qs"
export default {
  components: {
    VueContext,
    DeleteDialog,
    massResentDialog,
    EditLeadDialog,
    InfoLeadDialog,
  },
  props: {
    dataPagination: {
      type: Object,
    },
    countriesApiData: {
      type: Array,
      default: [],
    },
    statusesApiData: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      headTable: {
        redirect: "",
        id: "ID",
        first_name: "First Name",
        last_name: "Last Name",
        phone: "Phone",
        email: "Email",
        source_id: "Source",
        broker_id: "Broker",
        country_id: "CC",
        first_broker_status: "FBS",
        status_id: "Status",
        broker_status: "BS",
        reg_time: "Reg Time",
        send_time: "Send Time",
        funnel_id: "Funnel",
      },
      linkedLead: 0,
      removeSatus: false,
      imputNumber: "",
      listCountInTable: 25,
      pageNumber: 1,
      showDropMenu: false,
      opacity: false,
      searchInput: null,
      deleteDialogShow: false,
      deleteDialogMod: '',
      deleteLeadObj: null,
      message: 'Do you want delete lead?',
      resentDialog: false,
      showEditDialog: false,
      showInfoDialog: false,
      editedLead: null,
    };
  },
  computed: {
    ...mapGetters([
      "SWITCH_LEADS_SHOW_FILTER",
      "GET_STATUSES",
      "GET_BROKERS",
      "GET_FUNNELS",
      "GET_SOURCES",
      "RES_LEADS_TAB",
      "SELECTED_LEADS",
    ]),
    lengthDataList() {
        if (this.RES_LEADS_TAB.length > 0) {
          return true;
        } else {
          return false;
        }
      
    },
    lengthPagination() {
      if (this.dataPagination) {
        if (this.dataPagination.total == 0) {
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
      let c = this.pageNumber;
      let l = this.dataPagination.lastPage;
      if (l < 9) {
        let minPageArr = [];
        for (let x = 1; x <= l; x++) {
          minPageArr.push(x);
        }
        return minPageArr;
      } else if (this.pageNumber == 1) {
        return [1, 2, 3, 4, "...", l - 3, l - 2, l - 1, l];
      } else if (this.pageNumber <= 3) {
        return [c - 1, c, c + 1, c + 2, "...", l - 3, l - 2, l - 1, l];
      } else if (this.pageNumber == l) {
        return [1, 2, 3, 4, "...", l - 3, l - 2, l - 1, l];
      } else if (this.pageNumber >= l - 2) {
        return [1, 2, 3, 4, "...", c - 2, c - 1, c, c + 1];
      } else {
        return [1, "...", c - 2, c - 1, c, c + 1, c + 2, "...", l];
      }
    },
  },
  methods: {
    ...mapActions(['ShiftRemoveCheckbox','ShiftAddCheckbox',"ChangeStatusLeads", "RemoveAllCheckbox", "AddAllCheckbox"]),
    closeInfoDialog(){
      this.showInfoDialog = false
    },
    closeEditDialog(){
      this.showEditDialog = false
    },
    openInfoDialog(lead){
      let token = localStorage['jwt']
      let config = {
          method: 'get',
          url: `https://back.horus.itdepartment.space/leads/edit/${lead.id}`,
          headers: { 
            'Auth-Token': token
          }
        }
        this.axios(config)
          .then((response) => {
            // console.log(response.data);
            this.editedLead = response.data
            this.showInfoDialog = true
          })
          .catch((error) => {
            console.log(error);
          });
      
      
    },
    openEditDialog(lead){
      let token = localStorage['jwt']
      let config = {
          method: 'get',
          url: `https://back.horus.itdepartment.space/leads/edit/${lead.id}`,
          headers: { 
            'Auth-Token': token
          }
        }
      this.axios(config)
          .then((response) => {
            // console.log(response.data);
            this.editedLead = response.data
            this.showEditDialog = true
          })
          .catch((error) => {
            console.log(error);
          });
      
    },
    massResent(){
      this.resentDialog = true
    },


    massDeleteClick(){
      this.message = 'Are you sure to remove this LEADS?'
      this.deleteDialogMod = 'mass'
      this.deleteDialogShow = true
    },
    massDeleteLeads(){
      // console.log(this.SELECTED_LEADS)
      let token = localStorage['jwt']
      let data = qs.stringify({
        'id': this.SELECTED_LEADS,
      });
      let config = {
        method: 'delete',
        url: 'https://back.horus.itdepartment.space/leads/mass-delete',
        headers: { 
          'Auth-Token': token, 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
      };
      this.axios(config)
      .then((response) => {
        // console.log(response.data);
        if (response.data.status !== 'success') {
          console.log(response.data);
        }
        this.TakeUpPageIntervalStartPage()
      })
      .catch((error) => {
        console.log(error);
      });
    },

    clickDeleteLead(lead){
      this.deleteDialogMod = 'lead'
      this.message = 'Are you sure to remove this LEAD?'
      this.deleteDialogShow = !this.deleteDialogShow
      this.deleteLeadObj = lead
    },
    deleteLead(lead){
      // console.log(lead.id);
      let token = localStorage['jwt']
      let config = {
        method: 'delete',
        url: `https://back.horus.itdepartment.space/leads/${lead.id}`,
        headers: { 
          'Auth-Token': token,
            }
          };
        this.axios(config)
        .then((response) => {
          // console.log(response.data);
          this.TakeUpPageIntervalStartPage()

        })
        .catch((error) => {
          console.log(error);
      });
    },
    xlsBtn(){
      this.$emit('xlsBtn')
    },
    shiftCheckbox(index){
      let payload = {
          start: null,
          end: null
        }
      if(index >= this.linkedLead){
        payload.start = this.linkedLead
        payload.end = index
      }else{
        payload.end = this.linkedLead
        payload.start = index
      }
      if(this.RES_LEADS_TAB[index].status){
       this.ShiftRemoveCheckbox(payload)
      }else{
        this.ShiftAddCheckbox(payload)
      }
    },
    changeAllCheckbox(){
      if(this.removeSatus){
        this.RemoveAllCheckbox()
        this.removeSatus = !this.removeSatus
      }else{
        this.AddAllCheckbox()
        this.removeSatus = !this.removeSatus
      }
    },
    checkLeads(index) {
      this.linkedLead = index
      this.ChangeStatusLeads(index);
      // console.log(this.linkedLead)
    },
    headTableSort(key) {
      if (this.RES_LEADS_TAB) {
        if (this.RES_LEADS_TAB.length > 0) {
          if (this.RES_LEADS_TAB[0][key]) {
            return true;
          }
        }
      } else {
        return false;
      }
    },
    search() {
      let v = this;
      v.opacity = true;
      setTimeout(() => {
        this.pageNumber = 1
        v.$emit("search", v.searchInput);
      }, 1000);
    },
    redirectIcon(num, copy) {
      if (num == 1 && copy == 0) {
        return "green";
      } else if (num == 0 && copy == 0) {
        return "red";
      } else {
        return false;
      }
    },
    opacityChange() {
      this.opacity = true;
    },
    TakeUpPageIntervalStartPage() {
      this.opacityChange();
      let start = 1
      let end = 25
      this.$emit("TakeUpPageInterval", start, end);
    },
    TakeUpPageInterval() {
      this.opacityChange();
      this.$emit("TakeUpPageInterval", this.pageNumber, this.listCountInTable);
    },
    clickPaginationArrow(rl) {
      if (rl == "left" && this.pageNumber > 1) {
        this.pageNumber = this.pageNumber - 1;
        this.TakeUpPageInterval();
      } else if (
        rl == "right" &&
        this.pageNumber < this.dataPagination.lastPage
      ) {
        this.pageNumber = this.pageNumber + 1;
        this.TakeUpPageInterval();
      }
    },
    takePagination(btn) {
      if (typeof btn == "number") {
        this.pageNumber = btn;
        this.TakeUpPageInterval();
      } else {
        console.log("dot");
      }
    },
    takeInputNumber() {
      let x = Number(this.imputNumber);
      if (x != NaN && x > 0) {
        if (x > this.dataPagination.total) {
          this.listCountInTable = this.dataPagination.total;
        } else {
          this.listCountInTable = x;
        }
      }
      this.pageNumber = 1;
      this.showDrop();
      this.TakeUpPageInterval();
      this.imputNumber = "";
    },

    showDrop() {
      this.showDropMenu = !this.showDropMenu;
    },
    pickDropButton(num) {
      this.listCountInTable = num;
      this.pageNumber = 1;
      this.showDrop();
      this.TakeUpPageInterval();
    },
    source(source_id) {
      if (this.GET_SOURCES.length > 0) {
        let source = this.GET_SOURCES.find((x) => x.id == source_id);
        return source.title;
      } else {
        return "null";
      }
    },
    broker(broker_id) {
      if (this.GET_BROKERS.length > 0) {
        let broker = this.GET_BROKERS.find((x) => x.id == broker_id);
        return broker.title;
      } else {
        return "null";
      }
    },
    funnel(funnel_id) {
      if (this.GET_FUNNELS.length > 0) {
        let funnel = this.GET_FUNNELS.find((x) => x.id == funnel_id);
        return funnel.url;
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
    statusClass(status_id) {
      if (this.GET_STATUSES.length > 0) {
        let status = this.GET_STATUSES.find((x) => x.id == status_id);
        return status.class;
      } else {
        return "null";
      }
    },
    showDetail(user) {
      this.$emit("showDetail", user);
    },
    countryIsoCode(country_id) {
      if (this.countriesApiData) {
        let iso_code = this.countriesApiData[country_id - 1].code;
        return `https://www.countryflags.io/${iso_code}/flat/24.png`;
      } else {
        return `https://www.countryflags.io/de/flat/24.png`;
      }
    },
    countryIsoName(country_id) {
      let iso_name = this.countriesApiData[country_id - 1].title;
      return iso_name;
    },
    dotButtonClass(btn) {
      if (btn == "...") {
        return "btn-dots";
      } else if (btn == this.pageNumber) {
        return "active";
      } else {
        return null;
      }
    },
  },
  watch: {
    RES_LEADS_TAB(newValue, oldValue) {
      this.opacity = false;
    },
    SWITCH_LEADS_SHOW_FILTER(newValue, oldValue) {
      let v = this;
      v.TakeUpPageIntervalStartPage();
      this.pageNumber = 1
      setTimeout(() => {
        v.opacity = false;
      }, 3000);
    },
  },
  created() {
    if (this.$route.query.page) {
      this.pageNumber = Number(this.$route.query.page);
    }
    if (this.$route.query.perPage) {
      this.listCountInTable = Number(this.$route.query.perPage);
    }
    if (this.$route.query.search) {
      this.searchInput = this.$route.query.search;
    }
  },
};
</script>


<style lang="scss" scoped>
@import 'src/scss/leads/_leads_table_comp.scss';
@import 'src/scss/_classVar.scss';
</style>
<template>
  <div class="table_main_box">
    <!-- <Preloader></Preloader> -->
    <!-- диалоговое окно -->
    <EditUserDialog></EditUserDialog>
    <div v-if="checkFillDialog" class="dialog-box">
      <div class="dialog-menu">
        <div class="dialog-title">
          <span>Info</span>
          <v-icon @click.stop="changeShowDialogState" size="20" color="#FBC558"
            >mdi-window-close</v-icon
          >
        </div>
        <div class="dialog-body">
          <div class="dialog-cell">
            <span class="title">Id</span>
            <span class="text">{{ showDetailsUser.id }}</span>
          </div>
          <div class="dialog-cell">
            <span class="title">Status</span>
            <span class="text">{{
              dialogUserStatus(showDetailsUser.status_id)
            }}</span>
          </div>
          <div class="dialog-cell">
            <span class="title">Phone Number</span>
            <span class="text">{{ showDetailsUser.phone_number }}</span>
          </div>
          <div class="dialog-cell">
            <span class="title">Phone Prefix</span>
            <span class="text">{{ showDetailsUser.phone_prefix }}</span>
          </div>
          <div class="dialog-cell">
            <span class="title">First Name</span>
            <span class="text">{{ showDetailsUser.first_name }}</span>
          </div>
          <div class="dialog-cell">
            <span class="title">Last Name</span>
            <span class="text">{{ showDetailsUser.last_name }}</span>
          </div>
          <div class="dialog-cell">
            <span class="title">Email</span>
            <span class="text">{{ showDetailsUser.email }}</span>
          </div>
          <div class="dialog-cell">
            <span class="title">Country</span>
            <span class="text">{{
              dialogUserCountry(showDetailsUser.country_id)
            }}</span>
          </div>
          <div class="dialog-cell">
            <span class="title">Reg Time</span>
            <span class="text">{{ showDetailsUser.reg_time }}</span>
          </div>
        </div>
      </div>
    </div>

    <LeadsTable
      @xlsBtn="xlsBtn"
      @TakeUpPageInterval="GetAxiosPageInterval"
      :dataPagination="dataPagination"
      :statusesApiData="GET_STATUSES"
      :countriesApiData="GET_COUNTRIES"
      @showDetail="showDetail"
      @search="search"
      :dataList="dataList"
    ></LeadsTable>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";

import LeadsTable from "../components/LeadsTableComponent";
import Preloader from "../components/Preloader";
import EditUserDialog from "../components/leads/editUserDialog";

import axios from "axios";

export default {
  props: {
    switcher_1: {
      type: Number
    },
    switcher_2: {
      type: Number
    },
  },
  components: {
    LeadsTable,
    EditUserDialog,
    Preloader,
  },
  data() {
    return {
      showDetailsUser: null,
      funnelsApiData: null,
      statusesApiData: null,
      countriesApiData: null,
      dataList: null,
      dataPagination: null,
      showDialog: false,
      showAccessError: false,
      buffer: {},
      clonSearchInpData: null,
      searchString: "",
    };
  },
  methods: {
    ...mapActions([
      "UpdateResponseLeadsTable",
      "UpdateLeadsTimeInterval",
      "RemoveAllCountryStatus",
      "RemoveAllStatusesStatus",
      "RemoveAllFunnelsStatus",
      "RemoveAllBrokerStatus",
      "RemoveAllSourceStatus",
    ]),
    xlsBtn(numPage, PerPage){
      numPage == null ? (numPage = 1) : "";
      PerPage == null ? (PerPage = 25) : "";
      let token = this.token;
      let timeStart = this.pastTime(180);
      let timeEnd = this.Today;
      if (this.$route.query.timeEnd) {
        timeEnd = this.$route.query.timeEnd;
      }
      if (this.$route.query.timeStart) {
        timeStart = this.$route.query.timeStart;
      }
      if (this.GET_LEADS_TIME_INTERVAL) {
        timeStart = this.GET_LEADS_TIME_INTERVAL.start;
        timeEnd = this.GET_LEADS_TIME_INTERVAL.end;
      }

      let brokerArrayStatus = this.GET_BROKERS_SELECT;
      let strFormatBroker = "";
      for (let i = 0; i < brokerArrayStatus.length; i++) {
        strFormatBroker = strFormatBroker + `&broker[]=${brokerArrayStatus[i]}`;
      }
      let sourceArrayStatus = this.GET_SOURCES_SELECT;
      let strFormatSource = "";
      for (let i = 0; i < sourceArrayStatus.length; i++) {
        strFormatSource = strFormatSource + `&source[]=${sourceArrayStatus[i]}`;
      }
      let funnelArrayStatus = this.GET_FUNNELS_SELECT;
      let strFormatFunnel = "";
      for (let i = 0; i < funnelArrayStatus.length; i++) {
        strFormatFunnel = strFormatFunnel + `&funnel[]=${funnelArrayStatus[i]}`;
      }
      let countryArrayStatus = this.GET_COUNTRIES_SELECT;
      let strFormatCountry = "";
      for (let i = 0; i < countryArrayStatus.length; i++) {
        strFormatCountry =
          strFormatCountry + `&country[]=${countryArrayStatus[i]}`;
      }
      let statusesArrayStatus = this.GET_STATUSES_SELECT;
      let strFormatStatuses = "";
      for (let i = 0; i < statusesArrayStatus.length; i++) {
        strFormatStatuses =
          strFormatStatuses + `&status[]=${statusesArrayStatus[i]}`;
      }
      let resended = ''
      if(this.switcher_1 !=0 ){
        resended = `&resended=${this.switcher_1}`
      }
      let copied = ''
      if(this.switcher_2 !=0 ){
        copied = `&copied=${this.switcher_2}`
      }

      let config = {
        method: "get",
        url: `https://back.horus.itdepartment.space/leads/spreadsheet/?page=${numPage}&perPage=${PerPage}${resended}${copied}${strFormatBroker}${strFormatSource}${strFormatFunnel}${strFormatCountry}${strFormatStatuses}&sortBy=id&sortDir=ASC&from_time=${timeStart} 00:00:00&to_time=${timeEnd} 23:59:59`,
        headers: { "Auth-Token": token },
        data: "",
      };
      if (this.searchString) {
        config.url = `https://back.horus.itdepartment.space/leads/spreadsheet/?page=${numPage}&perPage=${PerPage}${strFormatBroker}${strFormatSource}${strFormatFunnel}${strFormatCountry}${strFormatStatuses}&search=${this.searchString}&sortBy=id&sortDir=ASC&from_time=${timeStart} 00:00:00&to_time=${timeEnd} 23:59:59`;
      }
      this.axios(config)
        .then((response) => {
          console.log(response.data)
          if(response.data.status == 'success'){
            window.open(response.data.data.link)
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    search(str) {
      if (str != this.clonSearchInpData) {
        this.searchString = str;
        this.GetAxiosPageInterval(1, 25);
      }
      this.clonSearchInpData = str.repeat(1);
    },
    GetAxiosPageInterval(numPage, PerPage) {
      // console.log('zapros')
      numPage == null ? (numPage = 1) : "";
      PerPage == null ? (PerPage = 25) : "";
      // console.log(from)
      let token = this.token;
      let timeStart = this.pastTime(180);
      let timeEnd = this.Today;
      if (this.$route.query.timeEnd) {
        timeEnd = this.$route.query.timeEnd;
      }
      if (this.$route.query.timeStart) {
        timeStart = this.$route.query.timeStart;
      }
      if (this.GET_LEADS_TIME_INTERVAL) {
        timeStart = this.GET_LEADS_TIME_INTERVAL.start;
        timeEnd = this.GET_LEADS_TIME_INTERVAL.end;
      }

      let brokerArrayStatus = this.GET_BROKERS_SELECT;
      let strFormatBroker = "";
      for (let i = 0; i < brokerArrayStatus.length; i++) {
        strFormatBroker = strFormatBroker + `&broker[]=${brokerArrayStatus[i]}`;
      }
      let sourceArrayStatus = this.GET_SOURCES_SELECT;
      let strFormatSource = "";
      for (let i = 0; i < sourceArrayStatus.length; i++) {
        strFormatSource = strFormatSource + `&source[]=${sourceArrayStatus[i]}`;
      }
      let funnelArrayStatus = this.GET_FUNNELS_SELECT;
      let strFormatFunnel = "";
      for (let i = 0; i < funnelArrayStatus.length; i++) {
        strFormatFunnel = strFormatFunnel + `&funnel[]=${funnelArrayStatus[i]}`;
      }
      let countryArrayStatus = this.GET_COUNTRIES_SELECT;
      let strFormatCountry = "";
      for (let i = 0; i < countryArrayStatus.length; i++) {
        strFormatCountry =
          strFormatCountry + `&country[]=${countryArrayStatus[i]}`;
      }
      let statusesArrayStatus = this.GET_STATUSES_SELECT;
      let strFormatStatuses = "";
      for (let i = 0; i < statusesArrayStatus.length; i++) {
        strFormatStatuses =
          strFormatStatuses + `&status[]=${statusesArrayStatus[i]}`;
      }
      let resended = ''
      if(this.switcher_1 !=0 ){
        resended = `&resended=${this.switcher_1}`
      }
      let copied = ''
      if(this.switcher_2 !=0 ){
        copied = `&copied=${this.switcher_2}`
      }
      this.$router.push({
        query: {
          timeStart: timeStart,
          timeEnd: timeEnd,
          page: numPage,
          perPage: PerPage,
          country: countryArrayStatus,
          status: statusesArrayStatus,
        },
      });
      let config = {
        method: "get",
        url: `https://back.horus.itdepartment.space/leads/?page=${numPage}&perPage=${PerPage}${resended}${copied}${strFormatBroker}${strFormatSource}${strFormatFunnel}${strFormatCountry}${strFormatStatuses}&sortBy=id&sortDir=ASC&from_time=${timeStart} 00:00:00&to_time=${timeEnd} 23:59:59`,
        headers: { "Auth-Token": token },
        data: "",
      };
      if (this.searchString) {
        this.$router.push({
          query: {
            timeStart: timeStart,
            timeEnd: timeEnd,
            page: numPage,
            perPage: PerPage,
            country: countryArrayStatus,
            status: statusesArrayStatus,
            search: `${this.searchString}`,
          },
        });
        config.url = `https://back.horus.itdepartment.space/leads/?page=${numPage}&perPage=${PerPage}${resended}${copied}${strFormatBroker}${strFormatSource}${strFormatFunnel}${strFormatCountry}${strFormatStatuses}&search=${this.searchString}&sortBy=id&sortDir=ASC&from_time=${timeStart} 00:00:00&to_time=${timeEnd} 23:59:59`;
      }
      this.axios(config)
        .then((response) => {
          // console.log(response)
          this.dataList = response.data.list;
          let arr = response.data.list
          for (let i = 0; i< arr.length; i++){
              this.$set(arr[i],'status',false);
            // arr[i].status = false
          }
          this.UpdateResponseLeadsTable(arr)
          this.dataPagination = response.data.pagination;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    changeShowDialogState() {
      this.showDialog = !this.showDialog;
    },
    dialogUserStatus(id) {
      return this.GET_STATUSES[id - 1].title;
    },
    dialogUserCountry(id) {
      return this.GET_COUNTRIES[id - 1].iso_name;
    },
    showDetail(user) {
      let token = this.token;
      let show_detail = {
        method: "get",
        url: `https://back.horus.itdepartment.space/leads/${user.id}`,
        headers: { "Auth-Token": token },
        data: "",
      };

      this.axios(show_detail)
        .then((response) => {
          // console.log(response)
          this.showDetailsUser = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
      this.showDialog = true;
    },
    pastTime(pastDays) {
      let date = new Date();
      let dd = date.getDate();
      let mm = date.getMonth();
      let yy = date.getFullYear();
      let past7 = new Date(yy, mm, dd - pastDays);
      let past_dd = past7.getDate();
      past_dd < 10 ? (past_dd = `0${past_dd}`) : "";
      let past_mm = past7.getMonth() + 1;
      past_mm < 10 ? (past_mm = `0${past_mm}`) : "";
      let past_yy = past7.getFullYear();
      return `${past_yy}-${past_mm}-${past_dd}`;
    },
  },
  computed: {
    ...mapGetters([
      "GET_BROKERS_SELECT",
      "GET_SOURCES_SELECT",
      "GET_FUNNELS_SELECT",
      "SWITCH_LEADS_RESET_FILTER",
      "GET_TOKEN",
      "GET_COUNTRIES",
      "GET_STATUSES",
      "GET_LEADS_TIME_INTERVAL",
      "SWITCH_LEADS_SHOW_FILTER",
      "GET_COUNTRIES_SELECT",
      "GET_STATUSES_SELECT",
    ]),
    dataLoadet() {
      if (this.dataList && this.dataPagination) {
        return true;
      } else {
        return false;
      }
    },
    checkFillDialog() {
      if (this.showDetailsUser && this.showDialog) {
        return true;
      } else {
        return false;
      }
    },
    Today() {
      let date = new Date();
      let dd = date.getDate();
      if (dd < 10) {
        dd = `0${dd}`;
      }
      let mm = date.getMonth() + 1;
      if (mm < 10) {
        mm = `0${mm}`;
      }
      let yy = date.getFullYear();
      return `${yy}-${mm}-${dd}`;
    },

    token() {
      if (localStorage["jwt"]) {
        return localStorage["jwt"];
      } else {
        return false;
      }
    },
  },
  watch: {
    SWITCH_LEADS_SHOW_FILTER(newValue, oldValue) {
      if (this.dataList == null) this.GetAxiosPageInterval();
    },
    SWITCH_LEADS_RESET_FILTER(newValue, oldValue) {
      let interval = { start: this.pastTime(180), end: this.Today };
      this.UpdateLeadsTimeInterval(interval);
      this.RemoveAllCountryStatus();
      this.RemoveAllStatusesStatus();
      this.RemoveAllFunnelsStatus();
      this.RemoveAllBrokerStatus()
      this.RemoveAllSourceStatus()
      this.GetAxiosPageInterval();
    },
  },

  created() {
    let page = 1;
    let perPage = 25;
    if (this.$route.query.page) {
      page = Number(this.$route.query.page);
    }
    if (this.$route.query.perPage) {
      perPage = Number(this.$route.query.perPage);
    }

    let token = this.token;
    let timeEnd = this.Today;
    if (this.$route.query.timeEnd) {
      timeEnd = this.$route.query.timeEnd;
    }
    let timeStart = this.pastTime(180);
    if (this.$route.query.timeStart) {
      timeStart = this.$route.query.timeStart;
    }
    //  Пример внесения в ссылку дублируемых квери параметров

    let strFormatCountry = "";
    let countryArrayStatus;

    if (this.$route.query.country) {
      countryArrayStatus = this.$route.query.country;
      if (typeof this.$route.query.country === "object") {
        for (let i = 0; i < countryArrayStatus.length; i++) {
          strFormatCountry =
            strFormatCountry + `&country[]=${countryArrayStatus[i]}`;
        }
      } else {
        strFormatCountry = `&country[]=${this.$route.query.country}`;
      }
    }
    let statusesArrayStatus;
    let strFormatStatuses = "";
    if (this.$route.query.status) {
      statusesArrayStatus = this.$route.query.status;
      if (typeof this.$route.query.status === "object") {
        for (let i = 0; i < statusesArrayStatus.length; i++) {
          strFormatStatuses =
            strFormatStatuses + `&status[]=${statusesArrayStatus[i]}`;
        }
      } else {
        strFormatStatuses = `&status[]=${this.$route.query.status}`;
      }
    }

    let config = {
      method: "get",
      url: `https://back.horus.itdepartment.space/leads/?page=${page}&perPage=${perPage}${strFormatCountry}${strFormatStatuses}&sortBy=id&sortDir=ASC&from_time=${timeStart} 00:00:00&to_time=${timeEnd} 23:59:59`,
      headers: { "Auth-Token": token },
      data: "",
    };
    if (this.$route.query.search) {
      config.url = `https://back.horus.itdepartment.space/leads/?page=${page}&perPage=${perPage}${strFormatCountry}${strFormatStatuses}&search=${this.$route.query.search}&sortBy=id&sortDir=ASC&from_time=${timeStart} 00:00:00&to_time=${timeEnd} 23:59:59`;
    }
    this.axios(config)
      .then((response) => {
        // console.log(response.data)
        this.dataList = response.data.list;

        let arr = response.data.list
          for (let i = 0; i< arr.length; i++){
              this.$set(arr[i],'status',false);
            // arr[i].status = false
          }
          // console.log(arr)
        this.UpdateResponseLeadsTable(arr)
        this.dataPagination = response.data.pagination;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style lang="scss" scoped>
@import 'src/scss/leads/_leads_table.scss';
</style>
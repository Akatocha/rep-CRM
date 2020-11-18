<template lang='pug'>
div
  FilterSaver(@addFilter='addNewFilter' @showFilterSaver='showFilterSaver' :Visibiliti='filterSaverVis')
  RangeDatePicker(@acceptDate='acceptDate' @changeShowRangeDate='changeShowRangeDate' :showRangeDatePicker='showRangeDatePicker')
  Navbar
  .lead-box
    FirstTab(v-if="GET_MASS_RESEND" )
    .input-box
      DateInput(@updateSelectedDate='updateSelectedDate' :selectedDate='selectedDate' @changeShowRangeDate='changeShowRangeDate')
      CounteryInput
      StatusInput
      BrokerInput
      SourceInput
      FunnelInput
      .input-btn-box
        button.btn-show(@click='showFilter()') Show
        button.btn-reset(@click='SwitchPickResetFilter()') Reset
        .btn-icon-container(v-click-outside='hidenFilterDrop')
          button.btn-icon(@click='showFilterDrop()')
            v-icon(color='#BDBDBD')  mdi-content-save-cog 
          .b-icon-content(v-if='btnIconShow')
            .create(@click='showFilterSaver()') Create new
            .date_box(v-if='PRIVATE_ARRAY_FILTERS')
              .date(v-for='(filter, index) in PRIVATE_ARRAY_FILTERS' :key='index')
                .date_title_box(@click='activateFilter(filter)')
                  .date-title {{ filter.title }}
                  .date-number {{ formatTimeFilterArray(filter) }}
                img.trash(@click='deleteFilter(filter)' src='@/assets/trash.svg')
        .btn_left_side
          .switcher_box
            .switcher(:class='switcherClass(1)' @click='changeSwitch(1)')
              .togle
            span Resrnder
          .switcher_box
            .switcher(:class='switcherClass(2)' @click='changeSwitch(2)')
              .togle
            span Coped
    .table-box
      LeadsTable(:switcher_1='switcher_1' :switcher_2='switcher_2')
  Footer
</template>

<script>
  // Enable pusher logging - don't include this in production
  

 

</script>
<script>

import qs from "qs";

import { mapGetters, mapActions, mapMutations } from "vuex";

import RangeDatePicker from "../components/leads/dialogDateRange";
import Navbar from "../components/Navbar";
import DateInput from "../components/leads/dateInput";
import LeadsTable from "../views/LeadsTable";
import Footer from "../components/Footer";
import CounteryInput from "../components/leads/countryInput";
import BrokerInput from "../components/leads/broker_inp";
import SourceInput from "../components/leads/source_inp";
import StatusInput from "../components/leads/statusInput";
import FunnelInput from "../components/leads/funnelsInput";
import FilterSaver from "../components/leads/filterSaver";
import FirstTab from "../components/leads/tab_leads_first";
import Preloader from "../components/Preloader";

export default {
  components: {
    Navbar,
    DateInput,
    CounteryInput,
    BrokerInput,
    SourceInput,
    Footer,
    LeadsTable,
    RangeDatePicker,
    StatusInput,
    FunnelInput,
    FilterSaver,
    FirstTab,
    Preloader,
  },
  data() {
    return {
      showRangeDatePicker: false,
      btnIconShow: false,
      pickShowFilter: true,
      selectedDate: "",
      selectDateObj: null,
      filterSaverVis: false,
      permissionsUser: {},
      switcher_1: 0,
      switcher_2: 0
    };
  },
  computed: {
    ...mapGetters([
      "GET_MASS_RESEND",
      "PRIVATE_ARRAY_FILTERS",
      "SWITCH_LEADS_RESET_FILTER",
      "GET_LEADS_TIME_INTERVAL",
      "GET_COUNTRIES_SELECT",
      "GET_STATUSES_SELECT",
    ]),
    permissionCountry() {
      return this.permissionsUser[
        "controllers.pages.affiliateleadscontroller.get.country_id"
      ];
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
    permissionFunnel() {
      return this.permissionsUser[
        "controllers.pages.affiliateleadscontroller.get.funnel_url"
      ];
    },
    permissionStatus() {
      return this.permissionsUser[
        "controllers.pages.affiliateleadscontroller.get.status_id"
      ];
    },
  },
  methods: {
    ...mapActions([
      "UpdateMassResend",
      "GetSourcesAxios",
      "GetBrokersAxios",
      "UpdateLeadsTimeInterval",
      "RemoveAllStatusesStatus",
      "RemoveAllCountryStatus",
      "RemoveAllFunnelsStatus",
      "RemoveAllSourceStatus",
      "RemoveAllBrokerStatus",
      "SwitchStatusesStatus",
      "SwitchCountryStatus",
      "UpdatePrivatArrayFilter",
      "SwitchPickResetFilter",
      "UpdateLeadsTimeInterval",
      "GetCountriesAxios",
      "GetStatusesAxios",
      "GetFunellsAxios",
      "GetPermissionAxios",
      "SwitchPickShowFilter",
    ]),
    pusherLead(){
      const pusher = new Pusher('51a141751c53ceeac7a5', {
        cluster: 'eu'
      });
      let v = this
      let channel = pusher.subscribe('my-channel');
        channel.bind('my-event', (data) => {
        // console.log(data)
        this.UpdateMassResend()
      });
    },
    switcherClass(num){
     if(num == 1) {
       if(this.switcher_1 == 1){
         return "r"
       }else if(this.switcher_1 == -1){
         return "l"
       }else{return "c"}
     }else{
       if(this.switcher_2 == 1){
         return "r"
       }else if(this.switcher_2 == -1){
         return "l"
       }else{return "c"}
       }
    },
    changeSwitch(num){
      let x
      if(num == 1 ){
        switch (this.switcher_1) {
        case 0: 
          this.switcher_1 = 1
          break;
        case 1: 
          this.switcher_1 = -1
          break;
        case -1: 
          this.switcher_1 = 0
          break;
      }
      }else{
        switch (this.switcher_2) {
          case 0: 
            this.switcher_2 = 1
            break;
          case 1: 
            this.switcher_2 = -1
            break;
          case -1: 
            this.switcher_2 = 0
            break;
        }
      }
    },
    showFilterDrop() {
      this.btnIconShow = !this.btnIconShow;
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
    hidenFilterDrop() {
      this.btnIconShow = false;
    },
    showFilterSaver() {
      this.btnIconShow = false;
      this.filterSaverVis = !this.filterSaverVis;
    },
    activateFilter(filter) {
      let x = JSON.parse(filter.data);
      if (x.countries) {
        this.RemoveAllCountryStatus();
        x.countries.forEach((element) => {
          this.SwitchCountryStatus(element);
        });
      }
      if (x.statuses) {
        this.RemoveAllStatusesStatus();
        x.statuses.forEach((element) => {
          this.SwitchStatusesStatus(element);
        });
      }
      if (x.start && x.end) {
        this.selectDateObj = {
          start: x.start,
          end: x.end,
        };
        let interval = { start: x.start, end: x.end };
        this.UpdateLeadsTimeInterval(interval);
        let date = `${x.start} — ${x.end}`;
        this.selectedDate = date;
      } else {
        this.selectedDate = "";
        let interval = { start: this.pastTime(180), end: this.Today };
        this.UpdateLeadsTimeInterval(interval);
      }
      // console.log(x)
    },
    addNewFilter(name) {
      let dataFilter = {
        countries: this.GET_COUNTRIES_SELECT,
        statuses: this.GET_STATUSES_SELECT,
      };
      if (this.GET_LEADS_TIME_INTERVAL) {
        dataFilter.start = this.GET_LEADS_TIME_INTERVAL.start;
        dataFilter.end = this.GET_LEADS_TIME_INTERVAL.end;
      }

      let sendData = qs.stringify({
        title: name,
        data: JSON.stringify(dataFilter),
      });
      let token = localStorage["jwt"];
      let config = {
        method: "post",
        url: "https://back.horus.itdepartment.space/leads/filters",
        headers: { "Auth-Token": token },
        data: sendData,
      };
      this.axios(config)
        .then((response) => {
          this.UpdatePrivatArrayFilter();
          // console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    showFilter() {
      this.SwitchPickShowFilter();
    },
    formatTimeFilterArray(obj) {
      let day = obj.updated_at.slice(0, 10);
      let time = obj.updated_at.slice(11, 16);
      let date = `${day} ${time}`;
      return date;
    },
    deleteFilter(filter) {
      let token = localStorage["jwt"];
      let config_privat_filter = {
        method: "delete",
        url: `https://back.horus.itdepartment.space/leads/filters/${filter.id}`,
        headers: { "Auth-Token": token },
        data: "",
      };
      this.axios(config_privat_filter)
        .then((response) => {
          this.UpdatePrivatArrayFilter();
          // console.log(response.data)
        })
        .catch((error) => {
          console.log(error);
        });
    },
    updateSelectedDate(interval) {
      this.selectDateObj = {
        start: interval.start,
        end: interval.end,
      };
      let date = `${interval.start} — ${interval.end}`;
      this.selectedDate = date;
    },
    changeShowRangeDate() {
      this.showRangeDatePicker = !this.showRangeDatePicker;
    },
    acceptDate(dateArr) {
      // console.log(dateArr)
      let date = {};
      date.start = dateArr[0];
      date.end = dateArr[1];
      this.UpdateLeadsTimeInterval(date);
      let startDay = dateArr[0];
      let endDay = dateArr[1];
      this.selectDateObj = {
        start: startDay,
        end: endDay,
      };
      this.selectedDate = `${startDay} — ${endDay}`;
    },
  },
  watch: {
    SWITCH_LEADS_RESET_FILTER(newValue, oldValue) {
      this.selectedDate = "";
    },
  },
  mounted() {
    this.UpdateMassResend()
    this.pusherLead()
    this.GetSourcesAxios()
    this.GetBrokersAxios()
    this.UpdatePrivatArrayFilter();
    this.GetCountriesAxios();
    this.GetStatusesAxios();
    this.GetFunellsAxios();
    this.GetPermissionAxios();
  },
  created() {
    if (this.$route.query.timeStart && this.$route.query.timeEnd) {
      this.selectedDate = `${this.$route.query.timeStart} — ${this.$route.query.timeEnd}`;
    }
    let token = localStorage["jwt"];
    let config_countries = {
      method: "get",
      url: "https://back.horus.itdepartment.space/user-permissions",
      headers: { "Auth-Token": token },
      data: "",
    };
    this.axios(config_countries)
      .then((response) => {
        this.permissionsUser = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style lang="scss" scoped>
@import '../scss/colorVar';
$white-color: #ffffff;
$yellow-color: #fbc558;
$box-shadow: 0px 2px 25px rgba(161, 161, 161, 0.25);
$bg-body: #f5f8f9;

.lead-box {
  padding: 30px;
  background: $bg-body;
  .input-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    background: $white-color;
    box-shadow: $box-shadow;
    padding: 20px 64px 25px 64px;

    .input-btn-box {
      width: 100%;
      display: flex;
      margin-top: 25px;

      button {
        height: 35px;
        border-radius: 5px;
        border: solid 1px #bdbdbd;
        padding: 0 25px;
        margin-right: 15px;

        &:focus {
          outline: none;
        }
      }
      .btn-show {
        border: none;
        background: $yellow-color;
        font-size: 16px;
        line-height: 19px;
      }
      .btn-icon-container {
        display: flex;
        position: relative;
        .btn-icon {
          margin: 0;
          padding: 0 8px;
        }
        .b-icon-content {
          border-radius: 7px;
          background: white;
          z-index: 5;
          position: absolute;
          top: 0;
          left: 100%;
          box-shadow: 0px 4px 7px rgba(68, 68, 68, 0.25);
          .create {
            cursor: pointer;
            background: #fffad1;
            font-size: 16px;
            line-height: 19px;
            white-space: nowrap;
            padding: 8px 30px;
          }
          .date {
            cursor: pointer;
            padding: 8px;
            display: flex;
            font-size: 12px;
            line-height: 14px;
            border-bottom: 1px solid #bdbdbd;
            &:last-child {
              border-bottom: none;
            }
            .date-title {
              display: flex;
              align-items: flex-start;
            }
            .date-number {
              display: flex;
              align-items: flex-start;
            }
          }
        }
      }
    }
  }
  .input-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .my-label {
    margin-bottom: 5px;
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 19px;
    text-transform: capitalize;
    color: #000000;
  }
  .select {
    margin-bottom: 10px;
    width: 534px;
    height: 30px;
    background: #ffffff;
    border: 1px solid #e0e0e0;
    box-sizing: border-box;
    appearance: menulist-button;
    &:focus {
      outline: none;
    }
  }
}
.table-box {
  margin-top: 30px;
  border-radius: 2px;
  box-shadow: $box-shadow;
}
.date_title_box {
  display: flex;
  flex-direction: column;
  width: 90%;
}
.trash {
  align-self: flex-end;
  margin-bottom: 2px;
}
.btn_left_side{
  margin-left: auto;
  display: flex;
  // height: 100%;
}
.switcher_box{
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 20px;
  span{
      cursor: default;
      color: $gray_3;
      font-size: 12px;
      line-height: 14px;
    }
}
.switcher{
  cursor: pointer;
  display: flex;
  width: 54px;
  height: 20px;
  background: $yellow;
  align-items: center;
  padding: 0 3px;
  border-radius: 10px;
  justify-content: flex-start;
  transition: 0.3s;
  &.c{
    background: $gray_4;
    .togle{
      transform: translateX(100%);
    }
  }
  &.r{
    .togle{
      transform: translateX(200%);
    }
  }
  &.l{
    .togle{
      transform: translateX(0%);
    }
  }
}
.togle{
  transition: 0.5s;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #FFFFFF;
  box-shadow: 0px 2px 3px rgba(19, 19, 19, 0.35);
}

</style>
<template>
  <div>
    <RangeDatePicker
      @acceptDate="acceptDate"
      @changeShowRangeDate="castomRange"
      :showRangeDatePicker="showRangeDatePicker"
    ></RangeDatePicker>
    <Navbar></Navbar>
    <div class="time_picker_box">
      <div class="time_logo">
        <span>Dashboard</span>
        <span class="second_text">All info about system</span>
      </div>
      <div class="time_btn_box">
        <div
          @click="pickTimeBtn(1)"
          class="time_btn"
          :class="{ tb_active: timeRange == 1, cursor_loading: !allIsLoadet }"
        >
          Today
        </div>
        <div
          @click="pickTimeBtn(2)"
          class="time_btn"
          :class="{ tb_active: timeRange == 2, cursor_loading: !allIsLoadet }"
        >
          Yesterday
        </div>
        <div
          @click="pickTimeBtn(3)"
          class="time_btn"
          :class="{ tb_active: timeRange == 3, cursor_loading: !allIsLoadet }"
        >
          Last 7 days
        </div>
        <div
          @click="pickTimeBtn(4)"
          class="time_btn"
          :class="{ tb_active: timeRange == 4, cursor_loading: !allIsLoadet }"
        >
          This month
        </div>
        <div
          @click="pickTimeBtn(5)"
          class="time_btn"
          :class="{ tb_active: timeRange == 5, cursor_loading: !allIsLoadet }"
        >
          Last month
        </div>
        <button
          @click="castomRange()"
          class="time_castom_btn"
          :class="{ cursor_loading: !allIsLoadet }"
        >
          Custom range
        </button>
      </div>
    </div>
    <div v-if="GET_SIMPLE_STATISTICS" class="card_main">
      <div class="card_box">
        <div class="card_icon_box">
          <div class="icon_circle">
            <img src="@/assets/icon/user.svg" />
          </div>
        </div>
        <div class="card_text">
          <span>Leads</span>
          <span class="ct_second">{{
            GET_SIMPLE_STATISTICS.simpleStatistics.total
          }}</span>
        </div>
      </div>
      <div class="card_box">
        <div class="card_icon_box">
          <div class="icon_circle">
            <img src="@/assets/icon/dollar.svg" />
          </div>
        </div>
        <div class="card_text">
          <span>FTD`s</span>
          <span class="ct_second"
            >{{ GET_SIMPLE_STATISTICS.simpleStatistics.ftd.count }}
            <span
              >/ {{ GET_SIMPLE_STATISTICS.simpleStatistics.ftd.percent }}%</span
            ></span
          >
        </div>
      </div>
      <div class="card_box">
        <div class="card_icon_box">
          <div class="icon_circle">
            <img src="@/assets/icon/phone.png" />
          </div>
        </div>
        <div class="card_text">
          <span>Call backs</span>
          <span class="ct_second"
            >{{ GET_SIMPLE_STATISTICS.simpleStatistics.cb.count }}
            <span
              >/ {{ GET_SIMPLE_STATISTICS.simpleStatistics.cb.percent }}%</span
            ></span
          >
        </div>
      </div>
    </div>
    <TotalTab v-if="GET_TAB_TOTAL_DATA"></TotalTab>
    <div class="box_country_status">
      <CountryTab v-if="GET_PERCENTAGE_COUNTRY"></CountryTab>
      <DubleTab v-if="GET_SIMPLE_STATISTICS"></DubleTab>
    </div>
    <FunnelsTab v-if="GET_PERCENTAGE_FUNNELS"></FunnelsTab>
    <BrockersSchedule></BrockersSchedule>
    <!-- <div class="space"></div> -->
    <Footer></Footer>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TotalTab from "../components/dashboard/tab_total";
import DubleTab from "../components/dashboard/tab_duble";
import CountryTab from "../components/dashboard/tab_country";
import FunnelsTab from "../components/dashboard/tab_funnels";
// import BrockersSchedule from "../components/dashboard/brockers_schedule";
import RangeDatePicker from "../components/leads/dialogDateRange";

export default {
  components: {
    Navbar,
    TotalTab,
    Footer,
    DubleTab,
    CountryTab,
    FunnelsTab,
    BrockersSchedule: ()=> import('../components/dashboard/brockers_schedule.vue'),
    RangeDatePicker,
  },
  data() {
    return {
      timeRange: 1,
      showRangeDatePicker: false,
    };
  },
  computed: {
    ...mapGetters([
      "LOADET_SIMPLE_STATISTICS",
      "LOADET_TAB_TOTAL_DATA",
      "LOADET_PERCENTAGE_COUNTRY",
      "LOADET_PERCENTAGE_FUNNELS",
      "GET_SIMPLE_STATISTICS",
      "GET_TAB_TOTAL_DATA",
      "GET_PERCENTAGE_COUNTRY",
      "GET_PERCENTAGE_FUNNELS",
    ]),
    allIsLoadet() {
      if (
        this.LOADET_SIMPLE_STATISTICS &&
        this.LOADET_TAB_TOTAL_DATA &&
        this.LOADET_PERCENTAGE_COUNTRY &&
        this.LOADET_PERCENTAGE_FUNNELS
      ) {
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
  },
  methods: {
    ...mapActions([
      "GetBrokersAxios",
      "GetBrokersSchedulesAxios",
      "PickTimeIntervalDashboard",
      "GetCountriesAxios",
      "GetStatusesAxios",
      "GetFunellsAxios",
      "GetSimpleStatisticsAxios",
      "GetTabTotalDataAxios",
      "GetPercentageCountry",
      "GetPercentageFunnels",
    ]),
    pickTimeBtn(num) {
      if (this.allIsLoadet) {
        this.timeRange = num;
        switch (num) {
          case 1:
            this.formatTimeCreater(0);
            break;
          case 2:
            this.formatTimeCreater(1);
            break;
          case 3:
            this.formatTimeCreater(7);
            break;
          case 4:
            this.formatTimeCreater(30);
            break;
          case 5:
            this.formatTimeCreater(60);
            break;
        }
        this.refreshDataApi();
      }
    },
    formatTimeCreater(past) {
      let date = {};
      date.end = this.Today;
      date.start = this.pastTime(past);
      this.$router.push({
        query: { dateStart: date.start, dateEnd: date.end },
      });
      this.PickTimeIntervalDashboard(date);
    },
    refreshDataApi() {
      this.GetSimpleStatisticsAxios();
      this.GetTabTotalDataAxios();
      this.GetPercentageCountry();
      this.GetPercentageFunnels();
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
    castomRange() {
      if (this.allIsLoadet) {
        this.showRangeDatePicker = !this.showRangeDatePicker;
      }
    },
    acceptDate(dates) {
      let date = {};
      date.start = dates[0];
      date.end = dates[1];
      this.$router.push({
        query: { dateStart: date.start, dateEnd: date.end },
      });
      this.PickTimeIntervalDashboard(date);
      this.refreshDataApi();
    },
  },
  mounted() {
    if (this.$route.query.dateStart && this.$route.query.dateEnd) {
      this.timeRange = 0;
      let date = {};
      date.start = this.$route.query.dateStart;
      date.end = this.$route.query.dateEnd;
      this.PickTimeIntervalDashboard(date);
    } else {
      this.formatTimeCreater(0);
    }
    this.GetBrokersAxios()
    this.GetBrokersSchedulesAxios()
    this.GetCountriesAxios();
    this.GetStatusesAxios();
    this.GetFunellsAxios();
    this.GetSimpleStatisticsAxios();
    this.GetTabTotalDataAxios();
    this.GetPercentageCountry();
    this.GetPercentageFunnels();
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/colorVar";
@import "../scss/dashboard";
.box_country_status {
  margin: 0 auto;
  width: 1170px;
  display: flex;
}
.space {
  width: 100%;
  height: 100vh;
}
</style>
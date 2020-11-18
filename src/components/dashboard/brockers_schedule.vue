<template lang='pug'>
.main_content
  BrokerAddDialog( :visib="visBrokerAddDialog" @closeDialog='closeBrokerAddDialog')
  .main_box
    .title_box
      .span_box
        span Brokers Schedule
        span.second New time: 15.21.19
      button.outline_none.btn_plus(@click="closeBrokerAddDialog")
        img(src='@/assets/icon/plus.svg')
    CompBrokersSchedule(v-for="(brokers, index) in GET_BROKERS_SCHEDULES" :key='index' :index='index' :brokers='brokers')


   

</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import EditScheduleDialog from "../dashboard/edit_schedule_dialog";
import CompBrokersSchedule from "../dashboard/comp_brockers_schedule";
import BrokerAddDialog from "../dashboard/brocker_add_dialog";
import VueContext from 'vue-context';
import 'vue-context/src/sass/vue-context.scss';
  export default {
    components: {
      VueContext,
      EditScheduleDialog,
      CompBrokersSchedule,
      BrokerAddDialog,
    },
    data() {
      return {
        broker: null,
        visEditCountryDialog: false,
        visBrokerAddDialog: false,

      }
    },
    computed: {
      ...mapGetters(['GET_BROKERS_SCHEDULES','GET_COUNTRIES','GET_BROKERS']),
    },
    methods: {
      closeBrokerAddDialog(show){
        if(show == 'open'){
          this.visBrokerAddDialog = true
        }
        else if(show == 'close'){
          this.visBrokerAddDialog = false
        }else{this.visBrokerAddDialog = !this.visBrokerAddDialog}
      },
    },
  }
</script>

<style lang="scss" scoped>
@import 'src/scss/dashboard_components/_brockers_schedule.scss';

</style>
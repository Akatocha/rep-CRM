<template lang='pug'>
.main_container(v-if='visib')
  .dialog_box
    .dialog_header
      div Edit
      v-icon(@click='closeDialog') mdi-close
    .dialog_body
      .input_container
        .label Country
        .input.input_dis
          span.input_dis_text {{getCountry(broker.country_id).title}}
          v-icon mdi-chevron-down
      .time_range_box
        .time_cell
          .name_day Monday
          .input_time_row
            input(type='time' v-model='monday.start' step='2').outline_none.hours_input
            span —
            input(type='time' v-model='monday.end' step='2').outline_none.hours_input
        .time_cell
          .name_day Tuesday
          .input_time_row
            input(type='time' v-model='tuesday.start' step='2').outline_none.hours_input
            span —
            input(type='time' v-model='tuesday.end' step='2').outline_none.hours_input
        .time_cell
          .name_day Wednesday
          .input_time_row
            input(type='time' v-model='wednesday.start' step='2').outline_none.hours_input
            span —
            input(type='time' v-model='wednesday.end' step='2').outline_none.hours_input
        .time_cell
          .name_day Thursday
          .input_time_row
            input(type='time' v-model='thursday.start' step='2').outline_none.hours_input
            span —
            input(type='time' v-model='thursday.end' step='2').outline_none.hours_input
        .time_cell
          .name_day Friday
          .input_time_row
            input(type='time' v-model='friday.start' step='2').outline_none.hours_input
            span —
            input(type='time' v-model='friday.end' step='2').outline_none.hours_input
        .time_cell
          .name_day Saturday
          .input_time_row
            input(type='time' v-model='saturday.start' step='2').outline_none.hours_input
            span —
            input(type='time' v-model='saturday.end' step='2').outline_none.hours_input
        .time_cell
          .name_day Sunday
          .input_time_row
            input(type='time' v-model='sunday.start' step='2').outline_none.hours_input
            span —
            input(type='time' v-model='sunday.end' step='2').outline_none.hours_input
      button(@click='sendData()').outline_none.btn_save Save
    
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import qs from "qs";
  export default {
    props: {
      broker: {
        type: Object
      },
      visib: {
        type: Boolean
      },
    },
    data() {
      return {
        monday: {start: null, end: null},
        tuesday: {start: null, end: null},
        wednesday: {start: null, end: null},
        thursday: {start: null, end: null},
        friday: {start: null, end: null},
        saturday: {start: null, end: null},
        sunday: {start: null, end: null},

        timeStart: '00:00:00',
        timeEnd: '23:59:59'
      }
    },
    computed: {
      ...mapGetters(['GET_COUNTRIES','GET_BROKERS', 'GET_COUNTRIES_SELECT', 'GET_BROKERS_SELECT']),
    },
    methods: {
      ...mapActions(['GetBrokersSchedulesAxios']),
      getCountry(id) {
        let country = {}
        country = this.GET_COUNTRIES.find(x => x.id == id)
        return country
      },
      closeDialog(){
        this.$emit('closeDialog')
      },
      updateDates(){
        this.monday.start = this.broker.monday_start
        this.monday.end = this.broker.monday_end
        this.tuesday.start = this.broker.tuesday_start
        this.tuesday.end = this.broker.tuesday_end
        this.wednesday.start = this.broker.wednesday_start
        this.wednesday.end = this.broker.wednesday_end
        this.thursday.start = this.broker.thursday_start
        this.thursday.end = this.broker.thursday_end
        this.friday.start = this.broker.friday_start
        this.friday.end = this.broker.friday_end
        this.saturday.start = this.broker.saturday_start
        this.saturday.end = this.broker.saturday_end
        this.sunday.start = this.broker.sunday_start
        this.sunday.end = this.broker.sunday_end
      },
      sendData(){
        let token = localStorage['jwt']
        // console.log(token)
        let data = qs.stringify({
          'country_id': this.broker.country_id,
          'monday_start': this.monday.start,
          'monday_end': this.monday.end,
          'tuesday_start': this.tuesday.start,
          'tuesday_end': this.tuesday.end,
          'wednesday_start': this.wednesday.start,
          'wednesday_end': this.wednesday.end,
          'thursday_start': this.thursday.start,
          'thursday_end': this.thursday.end,
          'friday_start': this.friday.start,
          'friday_end': this.friday.end,
          'saturday_start': this.saturday.start,
          'saturday_end': this.saturday.end,
          'sunday_start': this.sunday.start,
          'sunday_end': this.sunday.end 
          }); 
        let config = {
            method: 'put',
            url: `https://back.horus.itdepartment.space/brokers/schedules/${this.broker.id}`,
            headers: { 
              'Auth-Token': token, 
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : data
          };
          this.axios(config)
          .then((response) => {
            if(response.data.status == 'success'){
              this.GetBrokersSchedulesAxios()
              this.closeDialog()
            }
            // console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });

      }
    },
    watch: {
      broker(newValue, oldValue) {
        this.updateDates()
      }
    },
  }
</script>

<style lang="scss" scoped>
@import 'src/scss/dashboard_components/_edit_schedule_dialog.scss';
</style>


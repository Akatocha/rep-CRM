<template lang='pug'>
.main_container(v-if='visib')
  .dialog_box
    .dialog_header
      div Add Country
      v-icon(@click='closeDialog') mdi-close
    .dialog_body
      .input_container(v-click-outside="closeDropMenu")
        .label Country
        .input
          .tag_area
            .tag(v-for="tag in abrArrayPositiv" @click='checkCountry(tag)' :key='tag.code')
              span {{tag.code}}
              v-icon(size='14') mdi-close
            input#shedule_country.outline_none.search(type='text' @click='dropMenu = !dropMenu'  @input='dropMenu = true' @keyup.enter="inputData = ''" v-model="inputData" autocomplete="off")
          v-icon(@click='showDropMenu()' :class="{ reverse: dropMenu }") mdi-chevron-down
        .drop_menu_box(v-if='dropMenu') 
          .drop_row(v-for="country in sortDataFromInput()" @click='checkCountry(country)' :key="country.code" :class="{ 'drop_row_active': country.status }")
            .check_box
              v-icon(size='16' v-if="country.status") mdi-check
            span {{country.title}} ({{country.code}})
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
      button.outline_none.btn_save(@click="sendData") Save
    
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import qs from "qs";


  export default {
     props: {
      brokers: {
        type: Array
      },
      visib: {
        type: Boolean
      },
    },
    data() {
      return {
        // timeStart: '00:00:00',
        // timeEnd: '23:59:59',
        monday: {start: '00:00:01', end: '23:59:59'},
        tuesday: {start: '00:00:01', end: '23:59:59'},
        wednesday: {start: '00:00:01', end: '23:59:59'},
        thursday: {start: '00:00:01', end: '23:59:59'},
        friday: {start: '00:00:01', end: '23:59:59'},
        saturday: {start: '00:00:01', end: '23:59:59'},
        sunday: {start: '00:00:01', end: '23:59:59'},
        dropMenu: false,
        inputData: '',

      }
    },
    methods: {
      ...mapActions(['GetBrokersSchedulesAxios','ChangeCountryStatus', 'RemoveAllCountryStatus', 'AddAllCountryStatus']),
      closeDropMenu(){
        this.dropMenu = false
      },
      closeDialog(){
        this.$emit('closeDialog')
      },
      checkCountry(country) {
        let x = this.GET_COUNTRIES.indexOf(country)
        // console.log(x)
        this.ChangeCountryStatus(x)
        this.inputData = ''
        let inp = document.getElementById('shedule_country')
        inp.focus()
      },
      sortDataFromInput(){
        if (this.inputData == ''){
          return this.GET_COUNTRIES
        }else{
          if(this.inputData.length <= 2){
            return this.GET_COUNTRIES.filter(c => c.code.includes(this.inputData.toUpperCase()))
          }else{
            return this.GET_COUNTRIES.filter(c => c.title.toUpperCase().includes(this.inputData.toUpperCase()))
          }
        }
      },
      showDropMenu(show){
        if(show == 'open'){
          this.dropMenu = true
        }
        else if(show == 'close'){
          this.dropMenu = false
        }else{this.dropMenu = !this.dropMenu}
      },
      validTime(time){
        if(time.length<6){
          return time+':00'
        }else{
          return time
        }
      },
      sendData(){
        let token = localStorage['jwt']
        let brok = []
        brok[0] = this.brokers[0].broker_id


        let data = qs.stringify({
        'broker_id': brok,
        'country_id': this.GET_COUNTRIES_SELECT,
        'monday_start': this.validTime(this.monday.start),
        'monday_end': this.validTime(this.monday.end),
        'tuesday_start': this.validTime(this.tuesday.start),
        'tuesday_end': this.validTime(this.tuesday.end),
        'wednesday_start': this.validTime(this.wednesday.start),
        'wednesday_end': this.validTime(this.wednesday.end),
        'thursday_start': this.validTime(this.thursday.start),
        'thursday_end': this.validTime(this.thursday.end),
        'friday_start': this.validTime(this.friday.start),
        'friday_end': this.validTime(this.friday.end),
        'saturday_start': this.validTime(this.saturday.start),
        'saturday_end': this.validTime(this.saturday.end),
        'sunday_start': this.validTime(this.sunday.start),
        'sunday_end': this.validTime(this.sunday.end) 
        });
        let config = {
          method: 'post',
          url: 'https://back.horus.itdepartment.space/brokers/schedules',
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
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
      },
    },
    computed: {
      ...mapGetters(['GET_COUNTRIES', 'GET_COUNTRIES_SELECT']),
      abrArrayPositiv() {
        let arr = this.GET_COUNTRIES.filter(c => c.status === true)
        return arr
      },
    },
  }
</script>

<style lang="scss" scoped>
@import 'src/scss/dashboard_components/_edit_schedule_dialog.scss';
.reverse{
  transform: rotate(180deg);
}
</style>


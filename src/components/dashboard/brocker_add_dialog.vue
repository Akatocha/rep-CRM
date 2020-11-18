<template lang='pug'>
.main_container(v-if='visib')
  .dialog_box
    .dialog_header
      div Add Broker
      v-icon(@click='closeDialog') mdi-close
    .dialog_body
      .input_container(v-click-outside="closeDropBroker")
        .label Broker
        .input
          .tag_area
            .tag(v-for="tag in checkedBrokers" @click='checkBroker(tag)' :key='tag.code')
              span {{tag.title}}
              v-icon(size='14') mdi-close
            input#shedule_broker.outline_none.search(type='text' @click='dropMenuBroker = !dropMenuBroker'  @input='dropMenuBroker = true' @keyup.enter="inputDataBroker = ''" v-model="inputDataBroker" autocomplete="off")
          v-icon(@click='showDropBroker()' :class="{ reverse: dropMenuBroker }") mdi-chevron-down
        .drop_menu_box(v-if='dropMenuBroker') 
          .drop_row(v-for="broker in sortSearchBroker()" @click='checkBroker(broker)' :key="broker.id" :class="{ 'drop_row_active': broker.status }")
            .check_box
              v-icon(size='16' v-if="broker.status") mdi-check
            span {{broker.title}}
      .input_container(v-click-outside="closeDropCountry")
        .label Country
        .input
          .tag_area
            .tag(v-for="tag in checkedCountries" @click='checkCountry(tag)' :key='tag.code')
              span {{tag.code}}
              v-icon(size='14') mdi-close
            input#shedule_country.outline_none.search(type='text' @click='dropMenuCountry = !dropMenuCountry'  @input='dropMenuCountry = true' @keyup.enter="inputDataCountry = ''" v-model="inputDataCountry" autocomplete="off")
          v-icon(@click='showDropCountry()' :class="{ reverse: dropMenuCountry }") mdi-chevron-down
        .drop_menu_box(v-if='dropMenuCountry') 
          .drop_row(v-for="country in sortSearchCountry()" @click='checkCountry(country)' :key="country.code" :class="{ 'drop_row_active': country.status }")
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
        dropMenuCountry: false,
        dropMenuBroker: false,
        inputDataCountry: '',
        inputDataBroker: '',

      }
    },
    methods: {
      ...mapActions(['RemoveAllBrokerStatus', 'GetBrokersSchedulesAxios','ChangeBrokerStatus', 'ChangeCountryStatus', 'RemoveAllCountryStatus', 'AddAllCountryStatus']),
      closeDropBroker(){
        this.dropMenuBroker = false
      },
      closeDropCountry(){
        this.dropMenuCountry = false
      },
      closeDialog(){
        this.RemoveAllCountryStatus()
        this.RemoveAllBrokerStatus()
        this.$emit('closeDialog')
      },
      checkBroker(broker) {
        let x = this.GET_BROKERS.indexOf(broker)
        this.ChangeBrokerStatus(x)
        this.inputDataBroker = ''
        this.dropMenuBroker = false
        let inp = document.getElementById('shedule_broker')
        inp.focus()
      },
      checkCountry(country) {
        let x = this.GET_COUNTRIES.indexOf(country)
        this.ChangeCountryStatus(x)
        this.inputDataCountry = ''
        this.dropMenuCountry = false
        let inp = document.getElementById('shedule_country')
        inp.focus()
      },
      sortSearchBroker(){
        if (this.inputDataBroker == ''){
          return this.GET_BROKERS
        }else{
          return this.GET_BROKERS.filter(c => c.title.toUpperCase().includes(this.inputDataBroker.toUpperCase()))
        }
      },
      sortSearchCountry(){
        if (this.inputDataCountry == ''){
          return this.GET_COUNTRIES
        }else{
          if(this.inputDataCountry.length <= 2){
            return this.GET_COUNTRIES.filter(c => c.code.includes(this.inputDataCountry.toUpperCase()))
          }else{
            return this.GET_COUNTRIES.filter(c => c.title.toUpperCase().includes(this.inputDataCountry.toUpperCase()))
          }
        }
      },
      showDropBroker(show){
        if(show == 'open'){
          this.dropMenuBroker = true
        }
        else if(show == 'close'){
          this.dropMenuBroker = false
        }else{this.dropMenuBroker = !this.dropMenuBroker}
      },
      showDropCountry(show){
        if(show == 'open'){
          this.dropMenuCountry = true
        }
        else if(show == 'close'){
          this.dropMenuCountry = false
        }else{this.dropMenuCountry = !this.dropMenuCountry}
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
        
        


        let data = qs.stringify({
        'broker_id': this.GET_BROKERS_SELECT,
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
          this.GetBrokersSchedulesAxios() 
          this.closeDialog()
          // console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
      },
    },
    computed: {
      ...mapGetters(['GET_COUNTRIES', 'GET_COUNTRIES_SELECT', 'GET_BROKERS', 'GET_BROKERS_SELECT']),
      checkedBrokers() {
        let arr = this.GET_BROKERS.filter(c => c.status === true)
        return arr
      },
      checkedCountries() {
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


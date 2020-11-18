<template lang='pug'>
div.main_box
  DeleteDialog(:message="message" :vis="deleteBrokerDialog" :url="url" @closeDialog="showDeleteDialog" :from="from" )
  AddCountrySetting(:vis="addCountryDialog" @close="visAddCountrySetting")
  .title_box
    span Country Setting
    button.outline_none.btn_plus(@click="visAddCountrySetting") 
      img(src='@/assets/icon/plus.svg')
  .header_box
    div Country
    div Broker
    div Limit
  .country_box.tab_min(v-for="(country, key, index) in GET_COUNTRY_SETTING_ARR" :key="key" @click.self="dropRow(index)")
    //- input.supsup(type="checkbox")
    .country
      button.outline_none.btn_plus.btn_mini( @click="addCountry(key)")
        img(src='@/assets/icon/plus.svg')
      img(:src='getCountryFlag(key)')
      div.text_second {{getCountryName(key)}}
      v-icon(size='16' @click="deleteCountry(key)") mdi-close
    .broker_box( v-for="(broker,key) in country" :key="key")
      img.off_icon(src='@/assets/icon/on.svg' v-if="broker.active == 1" @click="editActive(broker.id, broker.limit, 0)")
      img.off_icon(src='@/assets/icon/off.svg' v-if="broker.active == 0" @click="editActive(broker.id, broker.limit, 1)")
      .broker_cell
        span {{getBrokerName(broker.broker_id)}}
        v-icon(size='16' @click="deleteBroker(broker.broker_id, broker.country_id)") mdi-close
      input.outline_none.input_limit(type='number' @focus="brokerIdEdited(broker.id, broker.active)" @change="event => editLimit(event)" :value='broker.limit')


     
  
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import AddCountrySetting from "../rules/add_country_setting";
import DeleteDialog from  '../rules/rules_delete_dialog.vue'
import qs from 'qs'



export default {
  components: {
    AddCountrySetting,
    DeleteDialog
  },
  data() {
    return {
      from: 'country',
      message: 'Do you want delete broker?',
      deleteBrokerDialog: false,
      deleteBrokerId: null,
      url: null,
      addCountryDialog: false,
      broketId: null,
      brokerActive: null,
    }
  },
  methods: {
    ...mapActions(['UpdateCountrySetting', 'SwitchCountryStatus']),
  addCountry(country_id){
    this.SwitchCountryStatus(country_id)
    this.addCountryDialog = true
  },
  dropRow(index){
    this.$nextTick(() => {
      if (this.$el.querySelectorAll('.country_box')[index].classList.contains('tab_min')){
        this.$el.querySelectorAll('.country_box')[index].classList.remove('tab_min')
      }else{this.$el.querySelectorAll('.country_box')[index].classList.add('tab_min')}
    })
  },
  showDeleteDialog(){
    this.deleteBrokerDialog = !this.deleteBrokerDialog 
  },
  deleteBroker(broker_id, country_id){
    this.url = `rules/countries/${country_id}/${broker_id}`
    this.message = 'Do you want delete broker?'
    this.showDeleteDialog()
  },
  deleteCountry(country_id){
    this.message = 'Do you want delete country?'
    this.url = `rules/countries/${country_id}`
    this.showDeleteDialog()
  },


  brokerIdEdited(id, active){
    this.broketId = id
    console.log(this.broketId);
    this.brokerActive = active
    // console.log(this.brokerActive)
  },
  editActive(id, limit, value){
      let token = localStorage['jwt']
      let data = qs.stringify({
        'status': '1',
        'active': value,
        'limit': limit
      });
      let config = {
        method: 'put',
        url: `https://back.horus.itdepartment.space/rules/countries/${id}`,
        headers: { 
          'Auth-Token': token, 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
      };
      this.axios(config)
      .then((response) => {
        // console.log(response.data);
        this.UpdateCountrySetting()
      })
      .catch((error) => {
        console.log(error);
      });
    }, 
    editLimit(event){
      let token = localStorage['jwt']
      let value = event.target.value
      let data = qs.stringify({
        'status': '1',
        'active': this.brokerActive,
        'limit': value 
      });
      let config = {
        method: 'put',
        url: `https://back.horus.itdepartment.space/rules/countries/${this.broketId}`,
        headers: { 
          'Auth-Token': token, 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
      };
      this.axios(config)
      .then((response) => {
        // console.log(response.data);
        this.UpdateCountrySetting()
      })
      .catch((error) => {
        console.log(error);
      });
    }, 



    visAddCountrySetting(){
    this.addCountryDialog = !this.addCountryDialog
    // console.log('dawdw')
  },
    getCountryName(id){
      if(this.GET_COUNTRIES.length>0){
        let country = this.GET_COUNTRIES.find(el => el.id == id)
        return country.title
      }else{ return 'null'}
    },
    getCountryFlag(id){
      if(this.GET_COUNTRIES.length>0){
        let country = this.GET_COUNTRIES.find(el => el.id == id)
        return `https://www.countryflags.io/${country.code}/flat/24.png`
      }else{ return 'https://www.countryflags.io/ua/flat/24.png'}
    },
    getBrokerName(id){
      if(this.GET_BROKERS.length>0){
        let broker = this.GET_BROKERS.find(el => el.id == id)
        return broker.title
      }else{ return 'null'}
    },
  },
  computed: {
    ...mapGetters(['GET_COUNTRY_SETTING_ARR', 'IS_LOADET_COUNTRY_SETTING', 'GET_COUNTRIES', 'GET_BROKERS']),
  },
}
</script>

<style lang="scss" scoped>
@import 'src/scss/rules/_country_setting.scss';
.tab_min{
  overflow: hidden;
  height: 50px;
  border-bottom: 1px solid $gray_5;
  & .broker_box{
    display: none;
  }
}
</style>
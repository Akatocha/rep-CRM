<template lang='pug'>
div.main_box
  DeleteDialog(:message="message" :vis="deleteBrokerDialog" :url="url" @closeDialog="showDeleteDialog" :from="from" )
  AddSourceSetting(:vis='addSourceDialog' @close="visAddSourceSetting")
  .title_box
    span Source Setting
    button.outline_none.btn_plus(@click="visAddSourceSetting") 
      img(src='@/assets/icon/plus.svg')
  .header_box
    div Source
    div Country
    div Broker
    div Limit
  .source_box.tab_min( v-for="(source, key, index) in GET_SOURCE_SETTING_ARR" :key="key" @click.self="dropRow(index)")
    //- input.source_scroll(type='checkbox')
    .source
      button.outline_none.btn_plus.btn_mini(@click="addSource(key)")
        img(src='@/assets/icon/plus.svg')
      div.text_second {{getSourceName(key)}}
      v-icon(size='16' @click="deleteSource(key)") mdi-close
    .country_box(v-for="(country, key_c) in source" :key="key_c")
      .country
        button.outline_none.btn_plus.btn_mini(@click="addCountry(key, key_c)")
          img(src='@/assets/icon/plus.svg')
        img(:src='getCountryFlag(key_c)')
        div.text_second {{getCountryName(key_c)}}
        v-icon(size='16' @click="deleteCountry(key_c, key)") mdi-close
      .broker_box(v-for="(broker, key) in country" :key="key")
        img.off_icon(src='@/assets/icon/on.svg' v-if="broker.active == 1" @click="editActive(broker.id, broker.limit, 0)")
        img.off_icon(src='@/assets/icon/off.svg' v-if="broker.active == 0" @click="editActive(broker.id, broker.limit, 1)")
        .broker_cell
          span {{getBrokerName(broker.broker_id)}}
          v-icon(size='16' @click="deleteBroker(broker.broker_id, broker.country_id, broker.source_id)") mdi-close
        input.outline_none.input_limit(type='number' @focus="brokerIdEdited(broker.id, broker.active)" @change="event => editLimit(event)" :value='broker.limit')

</template>

<script>
import DeleteDialog from  '../rules/rules_delete_dialog.vue'
import { mapGetters, mapActions, mapMutations } from "vuex";
import AddSourceSetting from "../rules/add_source_setting";
import qs from 'qs'


export default {
  components: {
    AddSourceSetting,
    DeleteDialog
  },
  data() {
    return {
      from: 'source',
      message: 'Do you want delete broker?',
      deleteBrokerDialog: false,
      deleteBrokerId: null,
      url: null,
      addSourceDialog: false,
      brokerId: null,
      brokerActive: null,
    }
  },
  methods: {
    ...mapActions(['UpdateSourceSetting', 'SwitchSourceStatus', 'SwitchCountryStatus']),
  

  addSource(source_id){
    this.SwitchSourceStatus(source_id)
    this.addSourceDialog = true
  },
  addCountry(source_id, country_id){
    this.SwitchSourceStatus(source_id)
    this.SwitchCountryStatus(country_id)
    this.addSourceDialog = true
  },
  dropRow(index){
    this.$nextTick(() => {
      if (this.$el.querySelectorAll('.source_box')[index].classList.contains('tab_min')){
        this.$el.querySelectorAll('.source_box')[index].classList.remove('tab_min')
      }else{this.$el.querySelectorAll('.source_box')[index].classList.add('tab_min')}
    })
  },
  showDeleteDialog(){
    this.deleteBrokerDialog = !this.deleteBrokerDialog 
  },
  deleteBroker(broker_id, country_id, source_id){
    this.url = `rules/sources/${source_id}/${country_id}/${broker_id}`
    this.message= 'Do you want delete broker?'
    this.showDeleteDialog()
  },
  deleteCountry(country_id, source_id){
    this.url = `rules/sources/${source_id}/${country_id}`
    this.message= 'Do you want delete country?'
    // console.log(this.url );
    this.showDeleteDialog()
  },
  deleteSource(source_id){
    this.url = `rules/sources/${source_id}`
    this.message= 'Do you want delete source?'
    // console.log(this.url );
    this.showDeleteDialog()
  },


  
  brokerIdEdited(id, active){
    this.brokerId = id
    // console.log(this.brokerId);
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
        url: `https://back.horus.itdepartment.space/rules/sources/${id}`,
        headers: { 
          'Auth-Token': token, 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
      };
      this.axios(config)
      .then((response) => {
        // console.log(response.data);
        this.UpdateSourceSetting()
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
        url: `https://back.horus.itdepartment.space/rules/sources/${this.brokerId}`,
        headers: { 
          'Auth-Token': token, 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
      };
      this.axios(config)
      .then((response) => {
        // console.log(response.data);
        this.UpdateSourceSetting()
      })
      .catch((error) => {
        console.log(error);
      });
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
  getSourceName(id){
    if(this.GET_SOURCES.length>0){
      let source = this.GET_SOURCES.find(el => el.id == id)
      return source.title
    }else{ return 'null'}
  },
  visAddSourceSetting(){
    this.addSourceDialog = !this.addSourceDialog
  },
},
computed: {
    ...mapGetters([
      'GET_SOURCE_SETTING_ARR',
      'IS_LOADET_SOURCE_SETTING',
      'GET_COUNTRIES',
      'GET_BROKERS',
      'GET_SOURCES',
      ]),
},
}
</script>

<style lang="scss" scoped>
@import 'src/scss/rules/_source_setting.scss';
// .source_scroll{
//   height: 0;
//   width: 0;
// }
.tab_min{
  overflow: hidden;
  height: 50px;
  border-bottom: 1px solid $gray_5;
  // background: $gray_6 ;
  & .country_box{
    display: none;
  }
}
</style>
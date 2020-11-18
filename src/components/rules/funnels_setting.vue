<template lang='pug'>
div.main_box
  DeleteDialog(:message="message" :vis="deleteBrokerDialog" :url="url" @closeDialog="showDeleteDialog" :from="from" )
  AddFunnelsSetting(:vis='addFunnelDialog' @close="visAddFunnelSetting")
  .title_box
    span Funnel Setting
    button.outline_none.btn_plus(@click="visAddFunnelSetting")  
      img(src='@/assets/icon/plus.svg')
  .header_box
    div Funnel
    div Source
    div Country
    div Broker
    div Limit
  .funnel_box.tab_min(v-for="(source,key_f,index) in GET_FUNNEL_SETTING_ARR" :key="source.id" @click.self="dropRow(index)")
    .funnel
      button.outline_none.btn_plus.btn_mini(@click="addFunnel(key_f)")
        img(src='@/assets/icon/plus.svg')
      div.text_second {{getFunnelName(key_f)}}
      v-icon(size='16' @click="deleteFunnel(key_f)") mdi-close
    .source_box(v-for="(source,key_s) in source" :key="key_s")
      .source
        button.outline_none.btn_plus.btn_mini(@click="addSource(key_f, key_s)")
          img(src='@/assets/icon/plus.svg')
        div.text_second {{getSourceName(key_s)}}
        v-icon(size='16' @click='deleteSource(key_f,key_s)') mdi-close
      .country_box(v-for="(country,key_c) in source" :key="key_c")
        .country
          button.outline_none.btn_plus.btn_mini(@click="addCountry(key_f, key_s, key_c)")
            img(src='@/assets/icon/plus.svg')
          img(:src='getCountryFlag(key_c)')
          div.text_second {{getCountryName(key_c)}}
          v-icon(size='16' @click="deleteCountry(key_f,key_s,key_c)") mdi-close
        .broker_box( v-for="broker in country" :key="broker.id")
          img.off_icon(src='@/assets/icon/on.svg' v-if="broker.active == 1" @click="editActive(broker.id, broker.limit, 0)")
          img.off_icon(src='@/assets/icon/off.svg' v-if="broker.active == 0" @click="editActive(broker.id, broker.limit, 1)")
          .broker_cell
            span {{getBrokerName(broker.broker_id)}}
            v-icon(size='16' @click="deleteBroker(broker.funnel_id,broker.source_id,broker.country_id,broker.broker_id)") mdi-close
          input.outline_none.input_limit(type='number' :value='broker.limit' @focus="brokerIdEdited(broker.id, broker.active)" @change="event => editLimit(event)")

</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import DeleteDialog from  '../rules/rules_delete_dialog.vue'
import AddFunnelsSetting from "../rules/add_funnel_setting";
import qs from 'qs'

export default {
  components: {
    AddFunnelsSetting,
    DeleteDialog
  },
  data() {
    return {
      from: 'funnel',
      message: 'Do you want delete broker?',
      deleteBrokerDialog: false,
      deleteBrokerId: null,
      url: null,
      addFunnelDialog: false,
      broketId: null,
      brokerActive: null,
    }
  },
  methods: {
    ...mapActions(['UpdateFunnelSetting', 'SwitchCountryStatus', 'SwitchSourceStatus', 'SwitchFunnelStatus']),
  
  addFunnel(funnel_id){
    this.SwitchFunnelStatus(funnel_id)
    this.addFunnelDialog = true
  },
  addSource(funnel_id, source_id){
    this.SwitchFunnelStatus(funnel_id) 
    this.SwitchSourceStatus(source_id)  
    this.addFunnelDialog = true
  },
  addCountry(funnel_id, source_id, country_id){
    this.SwitchFunnelStatus(funnel_id) 
    this.SwitchSourceStatus(source_id) 
    this.SwitchCountryStatus(country_id)
    this.addFunnelDialog = true
  },


  dropRow(index){
    this.$nextTick(() => {
      if (this.$el.querySelectorAll('.funnel_box')[index].classList.contains('tab_min')){
        this.$el.querySelectorAll('.funnel_box')[index].classList.remove('tab_min')
      }else{this.$el.querySelectorAll('.funnel_box')[index].classList.add('tab_min')}
    })
  },
    showDeleteDialog(){
    this.deleteBrokerDialog = !this.deleteBrokerDialog 
  },
  deleteBroker(funnel_id, source_id, country_id, broker_id){
    this.url = `rules/funnels/${funnel_id}/${source_id}/${country_id}/${broker_id}`
    this.message = 'Do you want delete broker?'
    this.showDeleteDialog()
  },
  deleteCountry(funnel_id, source_id, country_id){
    this.url = `rules/funnels/${funnel_id}/${source_id}/${country_id}`
    this.message = 'Do you want delete country?'
    // console.log(this.url);
    this.showDeleteDialog()
  },
  deleteSource(funnel_id, source_id){
    this.url = `rules/funnels/${funnel_id}/${source_id}`
    this.message = 'Do you want delete source?'
    // console.log(this.url);
    this.showDeleteDialog()
  },
  deleteFunnel(funnel_id){
    this.url = `rules/funnels/${funnel_id}`
    this.message = 'Do you want delete funnel?'
    // console.log(this.url);
    this.showDeleteDialog()
  },
  



    brokerIdEdited(id, active){
      this.broketId = id
      this.brokerActive = active
      console.log(this.broketId);
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
        url: `https://back.horus.itdepartment.space/rules/funnels/${id}`,
        headers: { 
          'Auth-Token': token, 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
      };
      this.axios(config)
      .then((response) => {
        // console.log(response.data);
        this.UpdateFunnelSetting()
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
        url: `https://back.horus.itdepartment.space/rules/funnels/${this.broketId}`,
        headers: { 
          'Auth-Token': token, 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
      };
      this.axios(config)
      .then((response) => {
        // console.log(response.data);
        this.UpdateFunnelSetting()
      })
      .catch((error) => {
        console.log(error);
      });
    },






    getBrokerName(id){
    if(this.GET_BROKERS.length>0){
      let broker = this.GET_BROKERS.find(el => el.id == id)
      return broker.title
    }else{ return 'null'}
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
    getSourceName(id){
    if(this.GET_SOURCES.length>0){
      let source = this.GET_SOURCES.find(el => el.id == id)
      return source.title
    }else{ return 'null'}
  },
    getFunnelName(id){
    if(this.GET_FUNNELS.length>0){
      let funnel = this.GET_FUNNELS.find(el => el.id == id)
      return funnel.url
    }else{ return 'null'}
  },
    visAddFunnelSetting(){
    this.addFunnelDialog = !this.addFunnelDialog
    },
  },
  computed: {
    ...mapGetters([
      'GET_FUNNEL_SETTING_ARR',
      'IS_LOADET_FUNNEL_SETTING',
      'GET_FUNNELS',
      'GET_COUNTRIES',
      'GET_BROKERS',
      'GET_SOURCES',
      ]),
  },
}
</script>

<style lang="scss" scoped>
@import 'src/scss/rules/_funnels_setting.scss';
.tab_min{
  overflow: hidden;
  height: 50px;
  border-bottom: 1px solid $gray_5;
  & .source_box{
    display: none;
  }
}
</style>
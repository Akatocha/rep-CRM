<template lang='pug'>
.main_container(v-if='vis')
  .dialog_box
    .dialog_header
      div Add Funnel Setting
      v-icon( @click="closeDialog()") mdi-close
    .dialog_body


      .input_container(v-click-outside='closeFunnel')
        .label Funnel
        .input
          .tag_area
            .tag(v-for="item in checkedFunnel" @click='checkFunnel(item)')
              span {{item.url}}
              v-icon(size='14') mdi-close
            input#inp_funnel_setting.outline_none.search(type='text' @click='showDropMenu(4)' @input='dropFunnel = true' @change='sortFunnelFromInput()' v-model="searchFunnel" @keyup.enter="searchFunnel = ''")
          v-icon(@click='showDropMenu(4)' :class="{ 'reverse_icon': dropFunnel }") mdi-chevron-down
        .drop_menu_box(v-if='dropFunnel') 
          .drop_row(v-for='item in sortFunnelFromInput()' @click='checkFunnel(item)' :key='item.id' :class="{'drop_row_active': item.status}")
            .check_box
              v-icon(size='16' v-if='item.status') mdi-check
            span {{item.url}} 



      .input_container(v-click-outside='closeSource')
        .label Source
        .input
          .tag_area
            .tag(v-for="item in checkedSource" @click='checkSource(item)')
              span {{item.title}}
              v-icon(size='14') mdi-close
            input#inp_source_setting.outline_none.search(type='text' @click='showDropMenu(1)' @input='dropSource = true' @change='sortSourceFromInput()' v-model="searchSource" @keyup.enter="searchSource = ''")
          v-icon(@click='showDropMenu(1)' :class="{ 'reverse_icon': dropSource }") mdi-chevron-down
        .drop_menu_box(v-if='dropSource') 
          .drop_row(v-for='item in sortSourceFromInput()' @click='checkSource(item)' :key='item.id' :class="{'drop_row_active': item.status}")
            .check_box
              v-icon(size='16' v-if='item.status') mdi-check
            span {{item.title}} 


      .input_container(v-click-outside='closeCountry')
        .label Country
        .input
          .tag_area
            .tag(v-for="item in checkedCountry" @click='checkCountry(item)')
              span {{item.code}}
              v-icon(size='14') mdi-close
            input#inp_country_setting.outline_none.search(type='text' @click='showDropMenu(2)' @input='dropCountry = true' @change='sortCountryFromInput()' v-model="searchCountry" @keyup.enter="searchCountry = ''")
          v-icon(@click='showDropMenu(2)' :class="{ 'reverse_icon': dropCountry}") mdi-chevron-down
        .drop_menu_box(v-if='dropCountry') 
          .drop_row(v-for='item in sortCountryFromInput()' @click='checkCountry(item)' :key='item.id' :class="{'drop_row_active': item.status}")
            .check_box
              v-icon(size='16' v-if='item.status') mdi-check
            span {{item.title}} ({{item.code}})



      .input_container(v-click-outside='closeBroker')
        .label Broker
        .input
          .tag_area
            .tag(v-for="item in checkedBroker" @click='checkBroker(item)')
              span {{item.title}}
              v-icon(size='14') mdi-close
            input#inp_broker_setting.outline_none.search(type='text' @click='showDropMenu(3)' @input='dropBroker = true' @change='sortBrokerFromInput()' v-model="searchBroker" @keyup.enter="searchBroker = ''")
          v-icon(@click='showDropMenu(3)' :class="{ 'reverse_icon': dropBroker}") mdi-chevron-down
        .drop_menu_box(v-if='dropBroker') 
          .drop_row(v-for='item in sortBrokerFromInput()' @click='checkBroker(item)' :key='item.id' :class="{'drop_row_active': item.status}")
            .check_box
              v-icon(size='16' v-if='item.status') mdi-check
            span {{item.title}}



      .input_container
        .label Limit
        input.outline_none.input_limit(type='number' v-model="limitInp")
      button.outline_none.btn_save(@click="sendData") Save

</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import qs from 'qs'
export default {
  props: {
    vis: {
      type: Boolean
    },
  },
  data() {
    return {
      dropFunnel:false,
      dropSource:false,
      dropCountry:false,
      dropBroker:false,
      searchFunnel: '',
      searchSource: '',
      searchCountry: '',
      searchBroker: '',
      limitInp: null
    }
  },
  methods: {
    ...mapActions([
      'ChangeFunnelsStatus',
      'ChangeCountryStatus',
      'ChangeSourceStatus',
      'ChangeBrokerStatus',
      'RemoveAllSourceStatus',
      'RemoveAllCountryStatus',
      'RemoveAllBrokerStatus',
      'RemoveAllFunnelsStatus',
      'UpdateFunnelSetting',
    ]),
    sendData(){
      if(this.limitInp){
        if(this.limitInp<0){
          this.limitInp = this.limitInp * -1
        }
        if(this.GET_COUNTRIES_SELECT.length>0 && this.GET_BROKERS_SELECT.length>0 && this.GET_SOURCES_SELECT.length>0 && this.GET_FUNNELS_SELECT.length>0){
          let token = localStorage['jwt']
          let data = qs.stringify({
            'funnel_id': this.GET_FUNNELS_SELECT,
            'source_id': this.GET_SOURCES_SELECT,
            'country_id': this.GET_COUNTRIES_SELECT,
            'broker_id': this.GET_BROKERS_SELECT,
            'status': '1',
            'active': '1',
            'limit': this.limitInp 
            });
          let config = {
              method: 'post',
              url: 'https://back.horus.itdepartment.space/rules/funnels',
              headers: { 
                'Auth-Token': token,
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              data : data
            };
          this.axios(config)
          .then((response) => {
            if(response.data.status == "success"){
              this.UpdateFunnelSetting()
              this.closeDialog()
            }
            // console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
        }
      }




      // console.log(this.GET_COUNTRIES_SELECT,
      // this.GET_BROKERS_SELECT,
      // this.GET_SOURCES_SELECT, this.limitInp)
    },
    closeDialog(){
      this.$emit('close')
      this.RemoveAllFunnelsStatus()
      this.RemoveAllSourceStatus()
      this.RemoveAllBrokerStatus()
      this.RemoveAllCountryStatus()
      this.limitInp = null
    },
    checkFunnel(item) {
        let x = this.GET_FUNNELS.indexOf(item)
        // console.log(x)
        this.ChangeFunnelsStatus(x)
        this.searchFunnel = ''
        let inp = document.getElementById('inp_funnel_setting')
        inp.focus()
      },
    checkSource(item) {
        let x = this.GET_SOURCES.indexOf(item)
        // console.log(x)
        this.ChangeSourceStatus(x)
        this.searchSource = ''
        let inp = document.getElementById('inp_source_setting')
        inp.focus()
      },
    checkCountry(item) {
        let x = this.GET_COUNTRIES.indexOf(item)
        // console.log(x)
        this.ChangeCountryStatus(x)
        this.searchCountry = ''
        let inp = document.getElementById('inp_country_setting')
        inp.focus()
      },
    checkBroker(item) {
        let x = this.GET_BROKERS.indexOf(item)
        // console.log(x)
        this.ChangeBrokerStatus(x)
        this.searchBroker = ''
        let inp = document.getElementById('inp_broker_setting')
        inp.focus()
      },


    sortFunnelFromInput(){
        if (this.searchFunnel == ''){
          return this.GET_FUNNELS
        }else{
          return this.GET_FUNNELS.filter(c => c.url.toUpperCase().includes(this.searchFunnel.toUpperCase()))
        }
      },
    sortSourceFromInput(){
        if (this.searchSource == ''){
          return this.GET_SOURCES
        }else{
          return this.GET_SOURCES.filter(c => c.title.toUpperCase().includes(this.searchSource.toUpperCase()))
        }
      },
    sortCountryFromInput(){
        if (this.searchCountry == ''){
          return this.GET_COUNTRIES
        }else{
          if(this.searchCountry.length <=2 ){
            return this.GET_COUNTRIES.filter(c => c.code.toUpperCase().includes(this.searchCountry.toUpperCase()))
          }else{
            return this.GET_COUNTRIES.filter(c => c.title.toUpperCase().includes(this.searchCountry.toUpperCase()))
          }
        }
      },
    sortBrokerFromInput(){
        if (this.searchBroker == ''){
          return this.GET_BROKERS
        }else{
          return this.GET_BROKERS.filter(c => c.title.toUpperCase().includes(this.searchBroker.toUpperCase()))
        }
      },


    closeFunnel(){
      this.dropFunnel = false
    },
    closeSource(){
      this.dropSource = false
    },
    closeCountry(){
      this.dropCountry = false
    },
    closeBroker(){
      this.dropBroker = false
    },

    showDropMenu(from){
      switch (from) {
        case 1:
          this.dropSource = !this.dropSource
          break;
        case 2:
          this.dropCountry = !this.dropCountry
          break;
        case 3:
          this.dropBroker = !this.dropBroker
          break;
        case 4:
          this.dropFunnel = !this.dropFunnel
          break;
      }
    }
  },
  computed: {
    ...mapGetters([
      'GET_FUNNELS',
      'GET_COUNTRIES',
      'GET_BROKERS',
      'GET_SOURCES',
      'GET_FUNNELS_SELECT',
      'GET_COUNTRIES_SELECT',
      'GET_BROKERS_SELECT',
      'GET_SOURCES_SELECT',
      ]),
    checkedFunnel() {
        let arr = this.GET_FUNNELS.filter(c => c.status === true)
        return arr
      },
    checkedCountry() {
        let arr = this.GET_COUNTRIES.filter(c => c.status === true)
        return arr
      },
    checkedBroker() {
        let arr = this.GET_BROKERS.filter(c => c.status === true)
        return arr
      },
    checkedSource() {
        let arr = this.GET_SOURCES.filter(c => c.status === true)
        return arr
      },
  },
}
</script>

<style lang="scss" scoped>
@import 'src/scss/rules/_add_country_setting.scss';
</style>
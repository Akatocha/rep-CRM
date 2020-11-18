<template lang='pug'>
.main_container(v-if='vis')
  .dialog_box
    .dialog_header
      div Add Country Setting
      v-icon( @click="closeDialog()") mdi-close
    .dialog_body


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
      dropCountry:false,
      dropBroker:false,
      searchCountry: '',
      searchBroker: '',
      limitInp: null
    }
  },
  methods: {
    ...mapActions([
      'ChangeCountryStatus',
      'ChangeBrokerStatus',
      'RemoveAllCountryStatus',
      'RemoveAllBrokerStatus',
      'UpdateCountrySetting',
    ]),
    
    sendData(){
      if(this.limitInp){
        if(this.limitInp<0){
          this.limitInp = this.limitInp * -1
        }
        if(this.GET_COUNTRIES_SELECT.length>0 && this.GET_BROKERS_SELECT.length>0){
          let token = localStorage['jwt']
          let data = qs.stringify({
            'country_id': this.GET_COUNTRIES_SELECT,
            'broker_id': this.GET_BROKERS_SELECT,
            'status': '1',
            'active': '1',
            'limit': this.limitInp 
            });
          let config = {
              method: 'post',
              url: 'https://back.horus.itdepartment.space/rules/countries',
              headers: { 
                'Auth-Token': token,
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              data : data
            };
          this.axios(config)
          .then((response) => {
            if(response.data.status == "success"){
              this.UpdateCountrySetting()
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
      this.RemoveAllBrokerStatus()
      this.RemoveAllCountryStatus()
      this.limitInp = null
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

    closeCountry(){
      this.dropCountry = false
    },
    closeBroker(){
      this.dropBroker = false
    },
    showDropMenu(from){
      switch (from) {
        case 2:
          this.dropCountry = !this.dropCountry
          break;
        case 3:
          this.dropBroker = !this.dropBroker
          break;
      }
    }
  },
  computed: {
    ...mapGetters([
      'GET_COUNTRIES',
      'GET_BROKERS',
      'GET_SOURCES',
      'GET_COUNTRIES_SELECT',
      'GET_BROKERS_SELECT',
      'GET_SOURCES_SELECT',
      ]),
    checkedCountry() {
        let arr = this.GET_COUNTRIES.filter(c => c.status === true)
        return arr
      },
    checkedBroker() {
        let arr = this.GET_BROKERS.filter(c => c.status === true)
        return arr
      },

  },
}
</script>

<style lang="scss" scoped>
@import 'src/scss/rules/_add_country_setting.scss';
</style>
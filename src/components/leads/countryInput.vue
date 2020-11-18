<template lang='pug'>
.input_container(v-click-outside='onClickOutside')
  .label Country
  .input(@click.self='showDropdownMenu = !showDropdownMenu')
    .tag_area
      .tag(v-for='country in abrArrayReal' @click='checkCountry(country)' :key='country.code' :class="{'tag_inverse': reverseMode}")
        span {{country.code}}
        v-icon(size='14') mdi-close
      input#country_input.outline_none.search(@click='showDropdownMenu = !showDropdownMenu' @input='showDropdownMenu = true' @change='sortDataFromInput()' @keyup.enter="inputData = ''" v-model='inputData' type='text' autocomplete="off")
    v-icon(@click.self='showDropdownMenu = !showDropdownMenu' :class="{'reverse_icon':showDropdownMenu}") mdi-chevron-down
  .drop_menu_box(@click='showDropdownMenu = true' v-if='showDropdownMenu')
    .drop_reverse_mode
      .check_box
        v-icon(v-if='!reverseMode' @click.self='clearAll' size='16') mdi-close
        v-icon.reverse_icon_green(v-if='reverseMode' @click.self='clearAll' size='16') mdi-check
      span(@click='switchModeReverse') Reverse Mode
    .drop_row(v-for='country in sortDataFromInput()' @click='checkCountry(country)' :key='country.code' :class="{'drop_row_active': country.status}")
      .check_box
        v-icon(size='16' v-if='country.status') mdi-check
      span {{country.title}}
      span ({{country.code}})

</template>

<script>
import {mapGetters, mapActions, mapMutations} from 'vuex'

  export default {
    data() {
      return {
        showDropdownMenu: false,
        inputData: '',
        reverseMode: false,
      }
    },
    computed: {
      ...mapGetters(['GET_COUNTRIES']),
      abrArrayPositiv() {
        let arr = this.GET_COUNTRIES.filter(c => c.status === true)
        return arr
      },
      abrArrayNegativ() {
        let arr = this.GET_COUNTRIES.filter(c => c.status === false)
        return arr
      },
      abrArrayReal(){
        if(this.reverseMode){
          return this.abrArrayNegativ
        }else{return this.abrArrayPositiv}
      }
    },
    methods: {
      ...mapActions(['ChangeCountryStatus', 'RemoveAllCountryStatus', 'AddAllCountryStatus']),
      onClickOutside(){
        this.showDropdownMenu = false
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
      clearAll(){
        if (!this.reverseMode){
          this.RemoveAllCountryStatus()
        }else{
          this.AddAllCountryStatus()
        }
      },
      switchModeReverse(){
        if (!this.reverseMode){
          this.AddAllCountryStatus()
          this.reverseMode = !this.reverseMode
        }else{
          this.RemoveAllCountryStatus()
          this.reverseMode = !this.reverseMode
        }
      },
      checkCountry(country) {
        let x = this.GET_COUNTRIES.indexOf(country)
        // console.log(x)
        this.ChangeCountryStatus(x)
        this.inputData = ''
        let inp = document.getElementById('country_input')
        inp.focus()
      },
    },
    created () {
          // console.log(typeof(this.$route.query.country))
      setTimeout(()=>{
        if(typeof(this.$route.query.country)  == 'string' && this.GET_COUNTRIES.length>0){
          let element = this.$route.query.country
          let country = this.GET_COUNTRIES.find(item => item.id == element)
            let x = this.GET_COUNTRIES.indexOf(country)
            // console.log(x)
            this.ChangeCountryStatus(x)
        }
        if(typeof(this.$route.query.country)  == 'object' && this.GET_COUNTRIES.length>0){
        this.$route.query.country.forEach(element => {
            let country = this.GET_COUNTRIES.find(item => item.id == element)
            let x = this.GET_COUNTRIES.indexOf(country)
            // console.log(x)
            this.ChangeCountryStatus(x)
          });
        }
      }, 1500)
    },
    
  }
</script>

<style lang="scss" scoped>
@import 'src/scss/rules/_input_drop.scss';
.input_container{
  margin-top: 0;
  width: 534px;
  margin-bottom: 10px;
}
.tag_area{
  padding: 0 0 3px 9px;
}
.drop_reverse_mode{
  height: 48px;
  display: flex;
  align-items: center;
  padding-left: 15px;
  border-bottom: 1px solid $gray_5;
  span{
    cursor: pointer;
    font-size: 12px;
    line-height: 14px;
    color: $gray_1;
  }
  .check_box{
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 18px;
    width: 18px;
    border: 1px solid $gray_3;
    border-radius: 3px;
    margin-right: 15px;
    .v-icon{
      color: $gray_3;
      background: $yellow;
    }
  }
} 
.tag_inverse{
  background: $red !important;
  color: white;
  border-radius: 3px;
}

</style>
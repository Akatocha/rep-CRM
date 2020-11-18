<template lang='pug'>
.input_container(v-click-outside='onClickOutside')
  .label Funnel
  .input(@click.self='showDropdownMenu = !showDropdownMenu')
    .tag_area
      .tag(v-for='funnel in abrArrayReal' @click='checkFunnels(funnel)' :key='funnel.id' :class="{'funnels_inverse': reverseMode}")
        span {{funnel.url}}
        v-icon(size='14') mdi-close
      input#funnels_input.outline_none.search(@click='showDropdownMenu = !showDropdownMenu' @input='showDropdownMenu = true' @change='sortDataFromInput()' @keyup.enter="inputData = ''" v-model='inputData' type='text')
    v-icon(@click.self='showDropdownMenu = !showDropdownMenu' :class="{'reverse_icon':showDropdownMenu}") mdi-chevron-down
  .drop_menu_box(v-if='showDropdownMenu')
    .drop_reverse_mode
      .check_box
        v-icon(v-if='!reverseMode' @click.self='clearAll' size='16') mdi-close
        v-icon.reverse_icon_green(v-if='reverseMode' @click.self='clearAll' size='16') mdi-check
      span(@click='switchModeReverse') Reverse Mode
    .drop_row(v-for='funnel in sortDataFromInput()' @click='checkFunnels(funnel)' :key='funnel.id' :class="{'drop_row_active': funnel.status}")
      .check_box
        v-icon(size='16' v-if='funnel.status') mdi-check
      span {{funnel.url}}

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
      ...mapGetters(['GET_FUNNELS']),

      abrArrayPositiv() {
        let arr = this.GET_FUNNELS.filter(c => c.status === true)
        return arr
      },
      abrArrayNegativ() {
        let arr = this.GET_FUNNELS.filter(c => c.status === false)
        return arr
      },
      abrArrayReal(){
        if(this.reverseMode){
          return this.abrArrayNegativ
        }else{return this.abrArrayPositiv}
      }
    },
    methods: {
      ...mapActions(['ChangeFunnelsStatus', 'RemoveAllFunnelsStatus', 'AddAllFunnelsStatus']),
      onClickOutside(){
        this.showDropdownMenu = false
      },
      sortDataFromInput(){
        if (this.inputData == ''){
          return this.GET_FUNNELS
        }else{
          return this.GET_FUNNELS.filter(c => c.url.toUpperCase().includes(this.inputData.toUpperCase()))
        }
      },
      clearAll(){
        if (!this.reverseMode){
          this.RemoveAllFunnelsStatus()
        }else{
          this.AddAllFunnelsStatus()
        }
      },
      switchModeReverse(){
        if (!this.reverseMode){
          this.AddAllFunnelsStatus()
          this.reverseMode = !this.reverseMode
        }else{
          this.RemoveAllFunnelsStatus()
          this.reverseMode = !this.reverseMode
        }
      },
      checkFunnels(funnel) {
        let x = this.GET_FUNNELS.indexOf(funnel)
        this.ChangeFunnelsStatus(x)
        this.inputData = ''
        let inp = document.getElementById('funnels_input')
        inp.focus()
      },
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
</style>
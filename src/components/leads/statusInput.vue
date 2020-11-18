<template lang='pug'>
.input_container(v-click-outside='onClickOutside')
  .label Status
  .input(@click.self='showDropdownMenu = !showDropdownMenu')
    .tag_area
      .tag(v-for='status in abrArrayReal' @click='checkStatus(status)' :key='status.id' :class="{'statuses_inverse': reverseMode}")
        span {{status.title}}
        v-icon(size='14') mdi-close
      input#status_input.outline_none.search(@click='showDropdownMenu = !showDropdownMenu' @input='showDropdownMenu = true' @change='sortDataFromInput()' @keyup.enter="inputData = ''" v-model='inputData' type='text')
    v-icon(@click.self='showDropdownMenu = !showDropdownMenu' :class="{'reverse_icon':showDropdownMenu}") mdi-chevron-down
  .drop_menu_box(v-if='showDropdownMenu')
    .drop_reverse_mode
      .check_box
        v-icon(v-if='!reverseMode' @click.self='clearAll' size='16') mdi-close
        v-icon.reverse_icon_green(v-if='reverseMode' @click.self='clearAll' size='16') mdi-check
      span(@click='switchModeReverse') Reverse Mode
    .drop_row(v-for='status in sortDataFromInput()' @click='checkStatus(status)' :key='status.id' :class="{'drop_row_active': status.status}")
      .check_box
        v-icon(size='16' v-if='status.status') mdi-check
      span {{status.title}}

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
      ...mapGetters(['GET_STATUSES']),
      abrArrayPositiv() {
        let arr = this.GET_STATUSES.filter(c => c.status === true)
        return arr
      },
      abrArrayNegativ() {
        let arr = this.GET_STATUSES.filter(c => c.status === false)
        return arr
      },
      abrArrayReal(){
        if(this.reverseMode){
          return this.abrArrayNegativ
        }else{return this.abrArrayPositiv}
      }
    },
    methods: {
      ...mapActions(['ChangeStatusesStatus', 'RemoveAllStatusesStatus', 'AddAllStatusesStatus']),
      onClickOutside(){
        this.showDropdownMenu = false
      },
      sortDataFromInput(){
        if (this.inputData == ''){
          return this.GET_STATUSES
        }else{
          return this.GET_STATUSES.filter(c => c.title.toUpperCase().includes(this.inputData.toUpperCase()))
        }
      },
      clearAll(){
        if (!this.reverseMode){
          this.RemoveAllStatusesStatus()
        }else{
          this.AddAllStatusesStatus()
        }
      },
      switchModeReverse(){
        if (!this.reverseMode){
          this.AddAllStatusesStatus()
          this.reverseMode = !this.reverseMode
        }else{
          this.RemoveAllStatusesStatus()
          this.reverseMode = !this.reverseMode
        }
      },
      checkStatus(status) {
         let x = this.GET_STATUSES.indexOf(status)
        this.ChangeStatusesStatus(x)
        this.inputData = ''
        let inp = document.getElementById('status_input')
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
<template>
  <div v-click-outside="onClickOutside" >
    <div class="input-container">
      <label class="my-label" for="i-date">Date</label>
      <div @click.self="changeShowDropMenu" class="select-input" id="i-date">
        <div class="select-date">{{selectedDate}}</div>
        <v-icon @click="changeShowDropMenu"
         :class="{'reverse-icon':showDate}">
          mdi-chevron-down
        </v-icon>
      </div>
      <div v-if="showDate" class="drdw-content">
        <div
        @click="changeShowRangeDate"
         class="content-btn hover">
         <v-icon>
           mdi-calendar-month-outline
         </v-icon>
          <span>Custom Range</span>
        </div>
        <div @click="pickFromDrop(0)" class="content-time hover">
          <span>Today</span>
          <span>{{Today}} — {{Today}}</span>
        </div>
        <div @click="pickFromDrop(1)" class="content-time hover">
          <span>Yesterday</span>
          <span>{{Today}} — {{pastTime(1)}}</span>
        </div>
        <div @click="pickFromDrop(7)" class="content-time hover">
          <span>Last 7 days</span>
          <span>{{Today}} — {{pastTime(7)}}</span>
        </div>
        <div @click="pickFromDrop(30)" class="content-time hover">
          <span>Last 30 days</span>
          <span>{{Today}} — {{pastTime(30)}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from 'vuex'

  export default {
    props: {
      selectedDate: {
        type: String,
      },
    },
    data() {
      return {
        showDate: false
      }
    },
    computed: {
      Today() {
        let date = new Date
        let dd = date.getDate()
        if(dd < 10){
          dd = `0${dd}`
        }
        let mm = date.getMonth()+1
        if(mm < 10){
          mm = `0${mm}`
        }
        let yy = date.getFullYear()
        return `${yy}-${mm}-${dd}`
      },
    },
    methods: {
      ...mapActions([ 'UpdateLeadsTimeInterval']),
      onClickOutside(){
        this.showDate = false
      },
      changeShowDropMenu(){
        this.showDate = !this.showDate
      },
      changeShowRangeDate() {
        this.changeShowDropMenu()
        this.$emit('changeShowRangeDate')
      },
      pickFromDrop(pastDay){
        let date = `${this.pastTime(pastDay)} — ${this.Today}`
        let interval = {start: this.pastTime(pastDay), end: this.Today}
        this.UpdateLeadsTimeInterval(interval)
        this.$emit('updateSelectedDate', interval)
        this.changeShowDropMenu()
      },
      pastTime(pastDays){
        let date = new Date()
        let dd = date.getDate()
        let mm = date.getMonth()
        let yy = date.getFullYear()
        let past7 = new Date(yy, mm, dd-pastDays)
        let past_dd = past7.getDate()
        past_dd < 10 ?  past_dd = `0${past_dd}` : ''
        let past_mm = past7.getMonth()+1
        past_mm < 10 ?  past_mm = `0${past_mm}` : ''
        let past_yy = past7.getFullYear()
        return `${past_yy}-${past_mm}-${past_dd}`
      }
    },
  }
</script>

<style lang="scss" scoped>
@import '../../scss/colorVar';



.input-container{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: relative;
  .my-label{
      margin-bottom: 5px;
      font-family: Roboto;
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 19px;
      text-transform: capitalize;
      color: $dark;
    }
    .select-input{
      padding-left: 15px;
      margin-bottom: 10px;
      width: 534px;
      height: 30px;
      background: #FFFFFF;
      border: 1px solid #E0E0E0;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .select-date{
        padding: 2px;
        background: #FFFAD1;
        border-radius: 4px;
        font-size: 12px;
        line-height: 14px;
      }
      .v-icon{
        transition: 0.2s;
        color: $yellow;
      }
      .reverse-icon{
        transform: rotate(180deg);
      }
    }
    .drdw-content{
      color: $gray_1;
      display: flex;
      flex-direction: column;
      box-shadow: 0px 4px 7px rgba(68, 68, 68, 0.25);
      border-radius: 0 0 7px 7px;
      width: 100%;
      z-index: 7;
      background: white;
      position: absolute;
      top: calc(100% - 10px);
      left: 0;
      .hover:hover{
        background: #FFFAD1;
        cursor: pointer;
      }
      .content-btn{
        padding-left: 15px;
        border-bottom:  1px solid #E0E0E0;
        border-right: 4px solid #BDBDBD;
        height: 48px;
        display: flex;
        align-items: center;

        .v-icon{
        height: 18px;
        margin-right: 15px;
        }
      }
      span{
        font-size: 12px;
        line-height: 14px;
      }
      .content-time{
        padding-left: 15px;
        padding-top: 8px;
        display: flex;
        flex-direction: column;
        height: 48px;
      }
      
    }
  }
</style>
<template>
  <div v-if="showRangeDatePicker"
  @click.self="changeShow"
  class="bg-dialog">
    <div class="date-picker-box">
      <v-date-picker 
      class="my-calendar"
      show-current 
      header-color="#FFFAD1" 
      color="#BDBDBD"  
      v-model="dates" 
      range
      :max="today">
      <div class="my-2 mx-2">
        <v-btn @click="clearArrayDates" depressed color="#FBC558">Cancel</v-btn>
      </div>
      <v-spacer></v-spacer>
      <div class="my-2 mx-2">
        <v-btn @click="acceptDate" :disabled='!validDateArr' depressed color="#FBC558">Aссept</v-btn>
      </div>
      </v-date-picker>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from 'vuex'

  export default {
    props: {
      showRangeDatePicker: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        dates: []
      }
    },
    methods: {
      ...mapActions([ 'UpdateLeadsTimeInterval']),

      changeShow() {
        this.$emit('changeShowRangeDate')  
      },
      clearArrayDates(){
        this.dates = []
        this.changeShow()
      },
      acceptDate(){
        if (this.sortDate){
          // console.log(this.dates)
          let interval = {start: this.dates[0], end: this.dates[1]}
          // this.UpdateLeadsTimeInterval(interval)
          this.$emit('acceptDate', this.dates) 
        }else{
          let temp = this.dates[0]
          this.dates[0] = this.dates[1]
          this.dates[1] = temp
          let interval = {start: this.dates[0], end: this.dates[1]}
          // this.UpdateLeadsTimeInterval(interval)
          this.$emit('acceptDate', this.dates)
        }
        this.changeShow()
      }
    },
    computed: {
      sortDate(){
        return this.dates[0]<this.dates[1]
      },
      today(){
        let d = new Date()
        let dd = d.getDate()
          dd < 10 ?  dd = `0${dd}` : ''
        let mm = d.getMonth()+1
          mm < 10 ?  mm = `0${mm}` : ''
        let yy = d.getFullYear()
        return `${yy}-${mm}-${dd}`
      },
      validDateArr() {
        if(this.dates.length == 2){
          return true
        }else{return false}
      }
    },
  }
</script>

<style lang="scss" scoped>
.bg-dialog{
  z-index: 500;
  background: #10101075;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
}
.date-picker-box{
  margin-top: 25vh;
}
</style>
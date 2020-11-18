<template>
  <div v-if="Visibiliti">
    <div v-if="showLoading" class="noData_main" :class="{'pading_plus': pb_plus}">
      <img src="@/assets/icon/no_data.svg">
      <span>No data found for the selected date</span>
    </div>
    <div v-else class="loading" :class="{'padding_minus': pb_minus}">
      Loading ...
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      Visibiliti: {
        type: Boolean,
        default: false
      },
      Loadet: {
        type: Boolean,
        default: false
      },
      pb_plus: {
        type: Boolean,
        default: false
      },
      pb_minus: {
        type: Boolean,
        default: false
      },
    },
    computed: {
      showLoading() {
        if(this.Loadet && this.Visibiliti){
          return true
        }else {return false}
      }
    },
  }
</script>

<style lang="scss" scoped>
.noData_main{
  background: white;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding:  30px 0 10px;
  align-items: center;
  span{
    margin-top: 20px;
    font-size: 12px;
    line-height: 14px;
  }
}
.pading_plus{
  padding: 30px 0 30px;
}
.loading{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 113px;
}
.padding_minus{
  height: 93px;
}
</style>
<template lang="pug">
.main_color(v-click-outside='closeColorDrop')
  .color_box(@click="dropColorMenu = true" :class="checkColor")
  .drop_color_box(v-if="dropColorMenu")
    .color_box(v-for="(color, index) in colorNames" :key="index" :class="color" @click="takeColor(color)" )
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import qs from "qs"
export default {
props: {
  statusClass: {
    type: String,
  },
  statusTitle: {
    type: String,
  },
  statusId: {
    type: Number,
  },
},
data() {
  return {
    dropColorMenu: false,
    activeClass: null,
    colorNames: [
      's_green',
      's_green_light',
      's_blue',
      's_blue_light',
      's_red',
      's_red_light',
      's_orange',
      's_black',
      's_grey',
      's_violet',
      's_purple',
      's_pink',
    ]
  }
}, // END data
computed: {
  checkColor() {
    if(this.activeClass){
      return this.activeClass
    }else{
      return this.statusClass
    }
  }
}, // END computed
methods: {
  ...mapActions(['ShowAlert']),
  closeColorDrop() {
      this.dropColorMenu = false
  },
  takeColor(color){
    let token = localStorage['jwt']
    this.activeClass = color

    let data = qs.stringify({
        'title': this.statusTitle,
        'class': this.activeClass,
        // 'dont_show': '0' 
      });
    let config = {
        method: 'put',
        url: `https://back.horus.itdepartment.space/statuses/${this.statusId}`,
        headers: { 
          'Auth-Token': token, 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
      };
    this.axios(config)
        .then((response) => {
          if(response.data.status == 'success'){
            this.ShowAlert()
          }
          // console.log(response.data)
          this.closeColorDrop()
          this.$emit('success')
          // this.getAllStatusesLeads()
        })
        .catch((error) => {
          console.log(error);
        });
    
  },
},// END methods
}
</script>

<style lang="scss" scoped>
.main_color{
  width: 100%;
  height: 100%;
  position: relative;
  // background: red;
}
.color_box{
  cursor: pointer;
  width: 34px;
  height: 34px;
  background: white;
  border-radius: 50%;
  transition: 0.2s;
  &:hover{
    border-radius: 10px;
  }

}
.drop_color_box{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-content: space-around;
  top: -58px;
  left: -63px;
  z-index: 2;
  position: absolute;
  height: 152px;
  width: 162px;
  background: white;
  box-shadow: 0px 2px 25px rgba(161, 161, 161, 0.25);
  border-radius: 8px;
}
.s_green{
  background: #1BC5BD;
}
.s_green_light{
  background: #C9F7F5;
}
.s_blue{
  background: #6993FF;
}
.s_blue_light{
  background: #E1E9FF;
}
.s_red{
  background: #F64E60;
}
.s_red_light{
  background: #FFE2E5;
}
.s_orange{
  background: #FFA800;
}
.s_black{
  background: #212121;
}
.s_grey{
  background: #D6D6E0;
}
.s_violet{
  background: #EEE5FF;
}
.s_purple{
  background: #8950FC;
}
.s_pink{
  background: #e850fc;
}

</style>
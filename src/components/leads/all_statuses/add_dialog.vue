<template lang="pug">
.main_container(v-if="vis" )
  .dialog_box
    .dialog_header
      div Add New Status
      v-icon(@click="close" ) mdi-close
    .dialog_body
      .input_container
        .label Status Name
        input.input_limit( v-model.trim="statusName")
      .btn_color_box
        .btn_color(v-for="(item, index) in colorNames" :key="index" :class="colorClass(index)" @click="saveColor(item, index)") 
      .input_container
        .label Description
        input.input_limit( v-model.trim="statusDescript")
      .btn_save_box
        .btn_save(@click="sendData") Save

</template>

<script>
import qs from "qs"
export default {
  props: {
    vis: {
      type: Boolean,
    },
  },
data() {
  return {
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
    ],
    colorChecked: '',
    statusName: '',
    statusDescript: '',
  }
},
methods: {
  saveColor(item, index){
    this.colorChecked = item
  },
  sendData(){
    let token = localStorage['jwt']
    if( this.statusName && this.colorChecked){
      let sendData = {}
      sendData.title = this.statusName
      sendData.class = this.colorChecked
      this.statusDescript ? sendData.description = this.statusDescript : ''

      
      let data = qs.stringify(sendData);
      // console.log(sendData);
      let config = {
        method: 'post',
        url: `https://back.horus.itdepartment.space/statuses/`,
        headers: { 
          'Auth-Token': token, 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
      };
      this.axios(config)
        .then((response) => {
          console.log(response.data)
          if(response.data.status == 'success'){
            this.$emit("success")
            this.close()
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },
  close(){
    this.colorChecked = ''
    this.statusName = ''
    this.statusDescript = ''
    this.$emit('close')
  },
  colorClass(index) {
    if(this.colorNames[index] == this.colorChecked){
      return `${this.colorNames[index]} btn_color_active`
    }else{
      return this.colorNames[index]
    }
  }
},
}
</script>

<style lang="scss" scoped>
@import 'src/scss/rules/_add_country_setting.scss';
.btn_color_box{
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;
  max-width: 300px;
}
.btn_color{
  cursor: pointer;
  margin: 5px 7px;
  width: 30px;
  height: 30px;
  background: red;
  border-radius: 50%;
  transition: 0.3s;
  &:hover{
    border-radius: 8px;
  }
}
.btn_color_active{
  border-radius: 8px;
  border: 2px solid $gray_1;
}
.btn_save_box{
  width: 300px;
  margin-top: 10px;
  display: flex;
  align-items: center;
}
.btn_save{
  margin-left: auto;
  padding: 5px 10px;
  background: $yellow;
  border-radius: 5px;
  cursor: pointer;
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
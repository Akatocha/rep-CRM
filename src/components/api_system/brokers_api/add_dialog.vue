<template lang="pug">
.main_container(v-if="vis" )
  .dialog_box
    .dialog_header
      div Add New Broker
      v-icon(@click="close" ) mdi-close
    .dialog_body
      .input_container
        .label Broker Name
        input.input_limit(v-model="brokerName")
      .input_container
        .label Description
        input.input_limit(v-model="brokerDescription")
      .input_container
        .label Broker Class
        input.input_limit(v-model="brokerClass")


      .input_container(v-click-outside='closeType')
        .label Type
        .input.check_one 
          .tag_area(@click.self="showDropType")
            span {{typeSelectName}}
          v-icon(@click="showDropType" :class="{ 'reverse_icon': dropType}") mdi-chevron-down
        .drop_menu_box(v-if='dropType') 
          .drop_row.title_select(v-for='item in brokerType'  :key='item.value' @click="takeType(item)")
            span {{item.name}}


      .input_container(v-click-outside='closeBroker')
        .label Copy
        .input.check_one 
          .tag_area(@click.self="showDropBroker")
            span {{broker}}
          v-icon(@click="showDropBroker" :class="{ 'reverse_icon': dropBroker}") mdi-chevron-down
        .drop_menu_box(v-if='dropBroker') 
          .drop_row.title_select(v-for='item in BROKERS_CATEGORIES'  :key='item.id' @click="takeBroker(item)")
            span {{item.title}}

            
      .btn_save_box
        .btn_save(@click="sendData" ) Save

</template>

<script>
import qs from "qs"
import AlertInput from './alert_inp'
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    AlertInput,
  },
props: {
  vis: {
    type: Boolean,
  },
},
data() {
  return {
    brokerType: [
      {name: "Broker", value: 0},
      {name: "Network", value: 1}
    ],
    dropType: false,
    typeSelectName: '',
    typeValue: '',
    broker: '',
    brokerId: null,
    dropBroker: false,
    brokerName: '',
    brokerDescription: '',
    brokerClass: '',
  }
},
computed: {
    ...mapGetters(['GET_BROKERS', 'BROKERS_CATEGORIES'])
},
methods: {
  ...mapActions(['ShowAlert']),
  sendData(){
    let token = localStorage['jwt']
    let sendData ={
      'title': this.brokerName,
      'description': this.brokerDescription,
      'type': this.typeValue,
      'class': this.brokerClass 
    }
    this.brokerId ? sendData.category_id = this.brokerId : ''
    // console.log(sendData);
    let data = qs.stringify(sendData);
    let config = {
        method: 'post',
        url: 'https://back.horus.itdepartment.space/brokers/',
        headers: { 
          'Auth-Token': token, 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
      };
    if(this.brokerName && this.typeValue !== null && this.brokerClass !== ''){
      this.axios(config)
          .then((response) => {
            // console.log(response.data)
            if(response.data.status == 'success'){
              this.$emit('refresh')
              this.ShowAlert()
              this.close()
            }
          })
          .catch((error) => {
            console.log(error);
          });
    }
  },
  showDropType(){
    this.dropType = !this.dropType
  },
  showDropBroker(){
    this.dropBroker = !this.dropBroker
  },
  closeType(){
    this.dropType = false
  },
  closeBroker(){
    this.dropBroker = false
  },
  takeType(item){
    this.typeSelectName = item.name
    this.typeValue = item.value
    this.dropType = false
  },
  takeBroker(item){
    this.broker = item.title
    this.brokerId = item.id
    this.dropBroker = false
  },
  close() {
    this.typeSelectName = '',
    this.typeValue = '',
    this.brokerId = null
    this.brokerName = ''
    this.brokerDescription = ''
    this.brokerClass = ''
    this.broker = ''
    this.$emit("close")
  }
},
}
</script>

<style lang="scss" scoped>
@import 'src/scss/rules/_add_country_setting.scss';
.dialog_box{
  margin-top: 100px;
}
.dialog_body{
  padding-top: 0;
}

.input_container{
  width: 400px;
  margin-top: 30px;
}
.drop_menu_box {
  .title_select {
    span{
      font-size: 16px !important;
    }
  }
}
.btn_save_box{
  width: 400px;
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
.input_container {
    .text_gray{
      overflow: hidden;
      color: $gray_4;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      span{
        margin-left: 4px;
      }
    }
    .check_one{
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex: none;
      .tag_area{
        min-height: 24px;
      }
    }
    
  }
</style>
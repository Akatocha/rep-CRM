<template lang="pug">
.main_container(v-if="vis" )
  .dialog_box
    .dialog_header
      div Edit Broker
      v-icon(@click="close" ) mdi-close
    .dialog_body
      .input_container
        .label Broker Name
        input.input_limit(v-model="brokerName")
      .input_container
        .label Description
        input.input_limit(v-model="brokerDescription")


      .input_container(v-click-outside='closeType')
        .label Type
        .input.check_one 
          .tag_area(@click.self="showDropType")
            span {{typeSelectName}}
          v-icon(@click="showDropType" :class="{ 'reverse_icon': dropType}") mdi-chevron-down
        .drop_menu_box(v-if='dropType') 
          .drop_row.title_select(v-for='item in brokerType'  :key='item.value' @click="takeType(item)")
            span {{item.name}}


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
  item: {
    type: Object,
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
    ...mapGetters(['GET_BROKERS'])
},
methods: {
  ...mapActions(['ShowAlert']),
  sendData(){
    let token = localStorage['jwt']
    let sendData ={
      'class': this.item.class,
      'title': this.brokerName,
      'description': this.brokerDescription,
      'type': this.typeValue,
    }
    let data = qs.stringify(sendData);
    let config = {
        method: 'put',
        url: `https://back.horus.itdepartment.space/brokers/${this.item.id}`,
        headers: { 
          'Auth-Token': token, 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
      };
      if(this.brokerName && this.brokerName !== null){
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
watch: {
  item(newValue, oldValue) {
    this.brokerName = this.item.title
    this.typeValue = this.item.type
    this.brokerDescription = this.item.description
    this.item.type == 1 ? this.typeSelectName = "Network" : this.typeSelectName = "Broker"
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
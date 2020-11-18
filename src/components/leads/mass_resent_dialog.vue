<template lang="pug">
.main_container.mass_resent(v-if='vis')
  .dialog_box
    .dialog_header
      div Mass Resend
      v-icon(@click="closeDialog") mdi-close
    .dialog_body
      .input_container
        .label Leads Id
        .input.text_gray
          span(v-for="item in SELECTED_LEADS" :key="item") {{item}}, 
      .input_container(v-click-outside='closeBroker')
        .label Broker
        .input.check_one 
          .tag_area(@click.self="showDrop")
            span {{broker}}
          v-icon(@click="showDrop" :class="{ 'reverse_icon': dropBroker}") mdi-chevron-down
        .drop_menu_box(v-if='dropBroker') 
          .drop_row.title_select(v-for='item in GET_BROKERS'  :key='item.id' @click="takeBroker(item)")
            span {{item.title}}
      .input_container
        .label Like live
        .check_box(@click="switchLive")
          v-icon(size='16' v-if="liveCheck" ) mdi-check
      .input_container(v-if="liveCheck")
        .label With autologin
        .check_box(@click="switchAutologin")
          v-icon(size='16' v-if="autologin" ) mdi-check
      .input_container.delay_container(v-if="liveCheck")
        .delay_box
          .label Delay MIN
          input.outline_none.input_limit(v-model="delayMin" type="number")
        .delay_box
          .label Delay MAX
          input.outline_none.input_limit(v-model="delayMax" type="number")
      button.outline_none.btn_save(@click="sendData") ACCEPT RESEND
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import qs from "qs"

  export default {
    props: {
      vis: {
        type: Boolean
      },
    },
    data() {
      return {
        broker: '',
        brokerId: null,
        dropBroker:false,
        liveCheck: 0,
        autologin: 0,
        delayMin: 0,
        delayMax: 0,
      }
    },
    computed: {
      ...mapGetters(['SELECTED_LEADS', 'GET_BROKERS']),
    },
    methods: {
      ...mapActions(['RemoveAllBrokerStatus']),
      sendData(){
        let token = localStorage['jwt']

        this.delayMin < 0 ? this.delayMin = this.delayMin*-1: ''
        this.delayMax < 0 ? this.delayMax = this.delayMax*-1: ''
        if(this.delayMin>this.delayMax){
          let x = this.delayMax
          this.delayMax = this.delayMin
          this.delayMin = x
        }
        if(this.delayMin==this.delayMax){
          this.delayMax = Number(this.delayMax)+1
        }

        if(this.liveCheck == 0){
          if(this.SELECTED_LEADS.length>0 && this.brokerId !== null){
            let data = qs.stringify({
              'lead_ids': this.SELECTED_LEADS,
              'broker_id': this.brokerId,
              'with_autologin': 0,
              'like_live': 0,
              });
            // console.log(data);
            let config = {
                method: 'post',
                url: 'https://back.horus.itdepartment.space/mass-resend',
                headers: { 
                  'Auth-Token': token, 
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                data : data
              }; 
            this.axios(config)
                .then((response) => {
                  // console.log(response.data);
                  this.brokerId = null
                  this.autologin = 0
                  this.liveCheck = 0
                  this.delayMin = 0
                  this.delayMax = 0
                  if(response.data.status !=='success'){
                    console.log(response);
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
          }
        }else{
          if(this.delayMin != 0 && this.delayMax != 0 && this.SELECTED_LEADS.length>0 && this.brokerId !== null){
            let data = qs.stringify({
              'lead_ids': this.SELECTED_LEADS,
              'broker_id': this.brokerId,
              'with_autologin': this.autologin,
              'like_live': this.liveCheck,
              'delay_min': this.delayMin,
              'delay_max': this.delayMax,
              });
            // console.log(data);
            let config = {
                method: 'post',
                url: 'https://back.horus.itdepartment.space/mass-resend',
                headers: { 
                  'Auth-Token': token, 
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                data : data
              }; 
            this.axios(config)
                .then((response) => {
                  // console.log(response.data);
                  this.brokerId = null
                  this.autologin = 0
                  this.liveCheck = 0
                  this.delayMin = 0
                  this.delayMax = 0
                  if(response.data.status !=='success'){
                    console.log(response.data);
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
          }
        }
      },
      switchLive(){
        if(this.liveCheck == 0){
          this.liveCheck = 1
        }else{this.liveCheck = 0}
      },
      switchAutologin(){
        if(this.autologin == 0){
          this.autologin = 1
        }else{this.autologin = 0}
      },
      takeBroker(item){
        this.broker = item.title
        this.brokerId = item.id
        this.dropBroker = false
      },
      closeDialog() {
        this.brokerId = 0
        this.broker = ''
        this.$emit("close")
      },
      showDrop(){
        this.dropBroker = !this.dropBroker
      },
      closeBroker(){
       this.dropBroker = false
      },
    },
  }
</script>

<style lang="scss" scoped>
@import 'src/scss/leads/_mass_resent_dialog.scss';
</style>
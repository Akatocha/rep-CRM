<template lang='pug'>
.main_container(v-if='vis')
  .dialog_box
    .dialog_header
      div Edit
      v-icon(@click="close") mdi-close
    .dialog_body
      //- .input_container
      //-   .label Id
      //-   input.outline_none.input_limit(type='number' :value="lead.id")
      .input_container(v-if="lead.first_name !== null")
        AlertForInp(v-if="errors.first_name"  :message="errors.first_name[0]")
        .label Name
        input.outline_none.input_limit(type='text'   v-model="lead.first_name")
      .input_container(v-if="lead.last_name !== null")
        AlertForInp(v-if="errors.last_name"  :message="errors.last_name[0]")
        .label Surname
        input.outline_none.input_limit(type='text'  v-model="lead.last_name")
      .input_container(v-if="lead.status_id !== null"  v-click-outside='closeDropStatus')
        AlertForInp(v-if="errors.status_id"  :message="errors.status_id[0]")
        .label Status
        div.outline_none.input_limit(type='text' @click="switchStatusDrop" ) {{getStatusName(lead.status_id)}}
        .drop_menu_box(v-if="statusDrop" )
          .drop_row(v-for="item in GET_STATUSES" :key="item.id" @click="takeDropStatus(item.id)")
            span {{item.title}}
      .input_container(v-if="lead.phone_number !== null")
        AlertForInp(v-if="errors.phone_number"  :message="errors.phone_number[0]")
        .label Phone Number
        input.outline_none.input_limit(type='text'  v-model="lead.phone_number")
      .input_container(v-if="lead.phone_prefix !== null")
        AlertForInp(v-if="errors.phone_prefix"  :message="errors.phone_prefix[0]")
        .label Phone Prefix
        input.outline_none.input_limit(type='text'  v-model="lead.phone_prefix")
      .input_container(v-if="lead.email !== null")
        AlertForInp(v-if="errors.email"  :message="errors.email[0]")
        .label Email
        input.outline_none.input_limit(type='email'   v-model="lead.email")
      .input_container(v-if="lead.source_id !== null"  v-click-outside='closeDropSource')
        AlertForInp(v-if="errors.source_id"  :message="errors.source_id[0]")
        .label Source
        div.outline_none.input_limit(type='text' @click="switchSourceDrop" ) {{getSourceName(lead.source_id)}}
        .drop_menu_box(v-if="sourceDrop" )
          .drop_row(v-for="item in GET_SOURCES" :key="item.id" @click="takeDropSource(item.id)")
            span {{item.title}}
      .input_container(v-if="lead.country_id !== null" v-click-outside='closeDropCountry')
        AlertForInp(v-if="errors.country_id"  :message="errors.country_id[0]")
        .label Country
        div.outline_none.input_limit(type='text'  @click="switchCountryDrop") {{getCountryName(lead.country_id)}}
        .drop_menu_box(v-if="countryDrop" )
          .drop_row(v-for="item in GET_COUNTRIES" :key="item.id" @click="takeDropCountry(item.id)"  ) 
            span {{item.title}}
      .input_container(v-if="lead.broker_id !== null")
        AlertForInp(v-if="errors.broker_id"  :message="errors.broker_id[0]")
        .label Broker
        input.outline_none.input_limit(type='text'  v-model="lead.broker_id")
      .input_container(v-if="lead.ip !== null")
        AlertForInp(v-if="errors.ip"  :message="errors.ip[0]")
        .label Ip
        input.outline_none.input_limit(type='text'  v-model="lead.ip")
      .input_container(v-if="lead.password !== null")
        AlertForInp(v-if="errors.password"  :message="errors.password[0]")
        .label Password
        input.outline_none.input_limit(type='text'  v-model="lead.password")
      .input_container(v-if="lead.phone_prefix !== null")
        AlertForInp(v-if="errors.phone_prefix"  :message="errors.phone_prefix[0]")
        .label Reg Time
        input.outline_none.input_limit(type='text'  v-model="lead.phone_prefix")
      .btn_box
        button.outline_none.btn_save(@click="sendData" ) Save

</template>

<script>
import qs from "qs"
import AlertForInp from "./alert_inp"
import { mapGetters } from 'vuex'

export default {
  components: {
    AlertForInp,
  },
  props: {
    vis: {
      type: Boolean,
    },
    lead: {
      type: Object,
    },
  },
  data() {
    return {
      lead_d: this.lead,
      errors: {},
      countryDrop: false,
      sourceDrop: false,
      statusDrop: false,
    }
  },
  computed: {
    ...mapGetters(['GET_STATUSES', 'GET_SOURCES', 'GET_COUNTRIES'])
  },
  methods: {

    closeDropCountry(){
      this.countryDrop = false
    },
    closeDropSource(){
      this.sourceDrop = false
    },
    closeDropStatus(){
      this.statusDrop = false
    },


    takeDropCountry(id){
      this.lead.country_id = id
    },
    takeDropSource(id){
      this.lead.source_id = id
    },
    takeDropStatus(id){
      this.lead.status_id = id
    },



    switchCountryDrop(){
      this.countryDrop =! this.countryDrop
    },
    switchSourceDrop(){
      this.sourceDrop =! this.sourceDrop
    },
    switchStatusDrop(){
      this.statusDrop =! this.statusDrop
    },



    getCountryName(id){
      let x = this.GET_COUNTRIES.find(el => el.id == id)
      return x.title
    },
    getStatusName(id){
      let x = this.GET_STATUSES.find(el => el.id == id)
      return x.title
    },
    getSourceName(id){
      let x = this.GET_SOURCES.find(el => el.id == id)
      return x.title
    },



    close() {
      this.errors = {}
      this.$emit('close')
    },
    sendData(){
      let token = localStorage['jwt']
      let keys  = Object.keys(this.lead) 
      let x ={}
      for( let i = 0; i<keys.length; i++){
        if(this.lead[keys[i]] !== null){
          x[keys[i]] = this.lead[keys[i]]
        }
      }
      let data = qs.stringify(x);
      let config = {
          method: 'put',
          url: `https://back.horus.itdepartment.space/leads/${this.lead.id}`,
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
              this.$emit('success')
              this.close()
            }else if(response.data.status == 'validation_error'){
              // console.log(response.data.message);
              this.errors = response.data.message
              console.log(this.errors);
            }
          })
          .catch((error) => {
            console.log(error);
          });


    },
  },
}
</script>

<style lang="scss" scoped>
@import 'src/scss/leads/_edit_user_dialog.scss';
</style>
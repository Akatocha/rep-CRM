<template lang="pug">
.main_container(v-if="vis" )
  .dialog_box
    .dialog_header
      div Add New Role
      v-icon(@click="close" ) mdi-close
    .dialog_body
      .input_container
        .label Role Name
        input.input_limit(v-model="roleName")
      .input_container
        .label Slug
        input.input_limit(v-model="slugName")
      .input_container
        .checkbox_row
          .check_box
            v-icon(size='16' v-if="massRevers" @click="massReverseCheck" ) mdi-plus
            v-icon(size='16' v-if="!massRevers" @click="massReverseCheck") mdi-minus
          | MASS RESSEND SYSTEM

      .input_container
        .checkbox_cell
          .label All
          .checkbox_row(v-for="item in ALL_PERMISSIONS" :key="item.id")
            .check_box(@click="switchStatus(item.id)" )
              v-icon(size='16' v-if="item.status" ) mdi-check
            | {{item.title}}

            
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
    massRevers: true,
    roleName: '',
    slugName: '',
  }
},
computed: {
    ...mapGetters(['PERMISSIONS_LIST', 'ALL_PERMISSIONS'])
},
methods: {
  ...mapActions(['ShowAlert', 'SwitchPermissionStatus', 'AddAllPermissionStatus', 'RemoveAllPermissionStatus']),
  massReverseCheck(){
    this.massRevers ? this.AddAllPermissionStatus() : this.RemoveAllPermissionStatus();
    this.massRevers =!this.massRevers
  },
  switchStatus(id){
    this.SwitchPermissionStatus(id)
  },
  sendData(){
    let token = localStorage['jwt']
    let sendData ={
      'title': this.roleName,
      'slug': this.slugName,
    }
    sendData.permissions = {}
    for (let i = 0; i < this.ALL_PERMISSIONS.length; i++) {
      let key = this.ALL_PERMISSIONS[i].title
      let value = this.ALL_PERMISSIONS[i].status
      sendData.permissions[key] = value
    }
    // console.log(sendData);
    let data = qs.stringify(sendData);
    let config = {
        method: 'post',
        url: 'https://back.horus.itdepartment.space/roles',
        headers: { 
          'Auth-Token': token, 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
      };
    if(this.roleName && this.slugName){
      this.axios(config)
          .then((response) => {
            // console.log(response.data)
            if(response.data.status == 'success'){
              this.$emit('refresh')
              this.ShowAlert()
              this.close()
            }
            if(response.data.status == 'validation_error'){
              let alert = {}
              let mess = response.data.message
              let key_1 = Object.keys(mess)
              alert.iconColor = "#EB5757"
              alert.iconName = "mdi-alert-octagon-outline"
              alert.message = mess[key_1][0]
              this.ShowAlert(alert)
            }
          })
          .catch((error) => {
            console.log(error);
          });
    }
  },


  close() {
    this.RemoveAllPermissionStatus()
    this.roleName = ''
    this.slugName = ''
    this.$emit("close")
  }
},
}
</script>

<style lang="scss" scoped>
@import 'src/scss/rules/_add_country_setting.scss';
.dialog_box{
  width: 600px;
  margin-top: 100px;
}
.dialog_body{
  padding-top: 0;
}

.input_container{
  width: 560px;
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
  width: 560px;
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
.check_box{
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 18px;
  width: 18px;
  border: 1px solid $gray_4;
  border-radius: 3px;
  margin-right: 15px;
  .v-icon{
    color: $yellow;
  }
}
.checkbox_cell{
  display: flex;
  flex-direction: column;
  max-height: 350px;
  overflow: scroll;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background-color: $white;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    min-height: 20px;  
    border-radius: 10px;
    background-color: $gray_4;	
  }
}
.checkbox_row{
  display: flex;
  margin: 5px 0 5px 5px;
}
</style>
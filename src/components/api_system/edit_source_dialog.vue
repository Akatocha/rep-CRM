<template lang="pug">
.main_container(v-if="vis" )
  .dialog_box
    .dialog_header
      div Edit Source
      v-icon(@click="close" ) mdi-close
    .dialog_body
      .input_container
        .label Source Name
        input.input_limit(v-model="sourceName")
      .input_container
        .label Generate Token
        .token_box
          input.input_limit(v-model="tokenFromBack" readonly)
          .btn_generate(@click="generateToken" )
            v-icon mdi-shield-key-outline
      .input_container
        .label White List Ip
        .white_list_box
          .white_list_row(v-for="item in IpArray" :key="item.id")
            AlertInput(v-if="!item.valid")
            input.input_limit(placeholder="Enter Ip" type="text"  v-model="item.value" @input="validIp(item.id)")
            .btn_generate.btn_close(@click="deleteIp(item.id)" )
              v-icon mdi-close
      .btn_save_box
        .btn_save.btn_add_ip(@click="addIp" ) Add Ip
      .btn_save_box
        .btn_save(@click="sendData" ) Save

</template>

<script>
import qs from "qs"
import AlertInput from './alert_inp'
export default {
  components: {
    AlertInput,
  },
props: {
  vis: {
    type: Boolean,
  },
  source: {
    type: Object,
  },
},
data() {
  return {
    IpArray: [
      {id: 0, value: '', valid: 'start'}
    ],
    sourceName: '',
    tokenFromBack: ''
  }
},
methods: {
    generateToken(){
      let token = localStorage['jwt']
      let config = {
      method: 'get',
      url: 'https://back.horus.itdepartment.space/sources/generate-token',
      headers: { 
        'Auth-Token': token
      }
    };
    this.axios(config)
        .then((response) => {
          // console.log(response.data);
          if(response.data.status == 'success'){
            this.tokenFromBack = response.data.data.token
          }
        })
        .catch((error) => {
          console.log(error);
        });
  },

  async sendData(){
    let token = localStorage['jwt']
    let arrIp = []
    for (let i = 0; i<this.IpArray.length; i++){
      if(this.IpArray[i].valid === true){
        arrIp.push(this.IpArray[i].value)
      }
    }
    if(this.tokenFromBack == ''){
      await this.generateToken()
    }
    if(this.sourceName && this.tokenFromBack && arrIp.length>0){
      // console.log('ed valid');
      let data = qs.stringify({
            'whitelist': arrIp,
            'title': this.sourceName,
            'token': this.tokenFromBack,
            'version_id': '1' 
          });
      let config = {
            method: 'put',
            url: `https://back.horus.itdepartment.space/sources/${this.source.id}`,
            headers: { 
              'Auth-Token': token, 
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : data
          };
      this.axios(config)
          .then((response) => {
            // console.log(response.data);
            if(response.data.status == 'success'){
              this.$emit('refresh')
              this.close()
            }
          })
          .catch((error) => {
            console.log(error);
          });      
    }
  },
  validIp(id){
    let x = this.IpArray.find(el => el.id == id)
    if(/^([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|(\d{1,3}\.){3}\d{1,3}$/.test(x.value)){
     x.valid = true
    //  console.log(x.valid);
    }else{
      x.valid = false
      x.value.length == 0 ? x.valid = "start" : ''
      // console.log(x.valid);
    }
  },
  deleteIp(id){
    if(this.IpArray.length > 1){
      let deleteIndex = this.IpArray.findIndex( el => el.id == id)
      if (deleteIndex !== -1) {
        this.IpArray.splice(deleteIndex, 1);
      }
    }else{
      this.IpArray[0].value = ''
      this.IpArray[0].valid = 'start'
    }
  },
  addIp(){
    let lastId = this.IpArray[this.IpArray.length-1].id
    let x = {}
    x.value = ''
    x.valid = 'start'
    x.id = lastId+1
    this.IpArray.push(x)
  },
  addFromWatch(){
    if(this.source){
      if (this.source.ips.length>0){
        let propArr = this.source.ips
        for(let i = 0; i<propArr.length; i++){
          if(i == 0){
            let y = this.IpArray[0]
            y.value = propArr[i].ip
            y.valid = true
          }else{
            let lastId = this.IpArray[this.IpArray.length-1].id
            let x = {}
            x.value = propArr[i].ip
            x.valid = true
            x.id = lastId+1
            this.IpArray.push(x)
          }
        }
      }
    }
  },
  close() {
    this.sourceName = ''
    this.tokenFromBack = ''
    this.IpArray = [{id: 0, value: '', valid: 'start'}]
    this.$emit("close")
  }
},
watch: {
  source(newValue, oldValue) {
    this.sourceName = this.source.title
    this.tokenFromBack = this.source.token
    this.addFromWatch()
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
.btn_add_ip{
  width: auto;
  height: auto;
  padding: 3px 6px;
  background: $gray_5;
  font-size: 14px;
}
.token_box{
  display: flex;
  // justify-content: center;
  align-items: flex-end;
}
.btn_generate{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 30px;
  border-radius: 4px;
  background: $yellow;
  cursor: pointer;
}
.white_list_box{
  padding-top: 20px;
  max-height: 176px;
  overflow: scroll;
  display: flex;
  flex-direction: column;
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
.white_list_row{
  position: relative;
  display: flex;
  margin-bottom: 22px;
  align-items: flex-end;
}

.btn_close{
  background: white;
}
</style>
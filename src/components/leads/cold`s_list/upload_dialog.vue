<template lang='pug'>
.main_container(v-if='vis')
  .dialog_box
    .dialog_header
      div Upload File
      v-icon(@click="closeDialog") mdi-close
    .dialog_body
      v-file-input(v-model="file" color="#030303")
      button.outline_none.delete_btn(@click="sendData") Send

</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";

  export default {
    props: {
      vis: {
        type: Boolean
      },
    },
    data() {
      return {
        file: []
      }
    },
    methods: {

      closeDialog(){
        this.$emit('close')
      },
      sendData(){
        let token = localStorage['jwt']
        let formData  = new FormData();
        formData.append('file', this.file)
        this.axios.post('/dawdw', 
        formData,
        {
          headers: {'Auth-Token': token},
        }).then(response => {
          console.log(response);
        }).catch(err =>{
          console.log(err);
        })
        // this.$emit('close')
      },
    },
  }
</script>

<style lang="scss" scoped>
@import 'src/scss/rules/_add_country_setting.scss';
.v-file-input{
  min-width: 80%;
}
.message{
  font-size: 16px;
  line-height: 19px;
  margin-top: 20px;
  color: $gray_1;
  margin-bottom: 40px;
}
.delete_btn{
  color: $dark;
  height: 35px;
  width: 90px;
  background: $yellow;
  border-radius: 5px;
  align-self: flex-end;
  margin-right: 25px;
}
.dialog_body{
  padding: 20px 0 25px;
}
</style>
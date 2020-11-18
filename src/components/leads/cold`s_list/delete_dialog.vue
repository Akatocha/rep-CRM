<template lang='pug'>
.main_container(v-if='vis')
  .dialog_box
    .dialog_header
      div Remove
      v-icon(@click="closeDialog") mdi-close
    .dialog_body
      .message {{message}}
      button.outline_none.delete_btn(@click="sendData") Delete

</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";

  export default {
    props: {
      message: {
        type: String,
        default: 'Do you want delete lead?'
      },
      vis: {
        type: Boolean
      },
      mod: {
        type: String
      },
      lead: {
        type: Object
      },
    },
    methods: {
      closeDialog(){
        this.$emit('close')
      },
      sendData(){
        if(this.mod == 'lead'){
          this.$emit('sendData', this.lead)
        }else{
          this.$emit('sendDataMass')
        }
        this.$emit('close')
      },
    },
  }
</script>

<style lang="scss" scoped>
@import 'src/scss/rules/_add_country_setting.scss';
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
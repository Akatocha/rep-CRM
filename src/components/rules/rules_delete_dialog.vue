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
        default: 'Do you want delete country?'
      },
      vis: {
        type: Boolean
      },
      from: {
        type: String
      },
      url: {
        type: String
      },
    },
    methods: {
      ...mapActions(['UpdateCountrySetting', 'UpdateSourceSetting', 'UpdateFunnelSetting']),
      closeDialog(){
        this.$emit('closeDialog', 'close')
      },
      sendData() {
        let token = localStorage['jwt']
        let config = {
              method: 'delete',
              url: `https://back.horus.itdepartment.space/${this.url}`,
              headers: { 
                'Auth-Token': token
              }
            };

        this.axios(config)
        .then((response) => {
          console.log(response.data);
          if(response.data.status == 'success'){
            switch (this.from) {
              case 'country':
                this.UpdateCountrySetting()
                break;
              case 'source':
                this.UpdateSourceSetting()
                break;
              case 'funnel':
                this.UpdateFunnelSetting()
                break;
            }
            
            this.closeDialog()
          }
        })
        .catch((error) => {
          console.log(error);
        });

        // console.log(this.broker)
      }
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
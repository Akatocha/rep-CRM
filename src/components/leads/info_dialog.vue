<template lang='pug'>
.main_container(v-if="vis")
  transition(mode='out-in' name='alert')
    .alert_box(v-if='alertConfig.showAlert')
      .alert
        v-icon(size='36' v-if='alertConfig.iconState' :color='alertConfig.iconColor') {{ alertConfig.iconName }}
        span.alert_text {{ alertConfig.message }}
  .dialog_box
    .dialog_header
      div More info
      v-icon(@click="close") mdi-close
    .dialog_body
      .toolbar_menu_box
        .toolbar
          .toolbar_cell(@click="dialogBody = 1" ) RESEND LEAD
          .toolbar_cell(@click="dialogBody = 2" ) BROKER LOGS
          .toolbar_cell(@click="dialogBody = 3" ) COPY LEADS
          .toolbar_cell(@click="dialogBody = 4" ) USER AGENT
          .toolbar_border( :class="clasFroUnderline()")
      .switch_box(v-if="dialogBody == 1" )
        .resend_lead
          .autocomplit_box
            .input_container(v-click-outside="closeDropBroker")
              .label Chose Broker
              .input(@click="switchBrokerDrop")
                .tag_area {{ brokerNameSel }}
                v-icon mdi-chevron-down
              .drop_menu_box(v-if="brokerDropMenu") 
                .drop_row(
                  v-for="item in GET_BROKERS",
                  :key="item.id",
                  @click="selectBroker(item)"
                )
                  span {{ item.title }}
            button.outline_none.btn_send(@click="resendLead") Send
        .resend_input_space
          .input_container(v-if="lead.id !== null")
            .label Id
            input.outline_none.input_limit(
              type="text",
              disabled,
              :value="lead.id"
            )
          .input_container(v-if="lead.status_id !== null")
            .label Status
            input.outline_none.input_limit(
              type="text",
              disabled,
              :value="getStatusName(lead.status_id)"
            )
          .input_container(v-if="lead.phone_number !== null")
            .label Phone Number
            input.outline_none.input_limit(
              type="text",
              disabled,
              :value="lead.phone_number"
            )
          .input_container(v-if="lead.first_name !== null")
            .label Name
            input.outline_none.input_limit(
              type="text",
              disabled,
              :value="lead.first_name"
            )
          .input_container(v-if="lead.source_id !== null")
            .label Source
            input.outline_none.input_limit(
              type="text",
              disabled,
              :value="getSourceName(lead.source_id)"
            )
          .input_container(v-if="lead.email !== null")
            .label Email
            input.outline_none.input_limit(
              type="text",
              disabled,
              :value="lead.email"
            )
          .input_container(v-if="lead.country_id !== null")
            .label Country
            input.outline_none.input_limit(
              type="text",
              disabled,
              :value="getCountryName(lead.country_id)"
            )
          .input_container(v-if="lead.ip !== null")
            .label Ip
            input.outline_none.input_limit(
              type="text",
              disabled,
              :value="lead.ip"
            )
          .input_container(v-if="lead.password !== null")
            .label Password
            input.outline_none.input_limit(
              type="text",
              disabled,
              :value="lead.password"
            )
          .input_container(v-if="lead.phone_prefix !== null")
            .label Phone Prefix
            input.outline_none.input_limit(
              type="text",
              disabled,
              :value="lead.phone_prefix"
            )
      .switch_box(v-if="dialogBody == 2" )
        .json_box 
          template
            JSONView(:data='testData')
      .switch_box(v-if="dialogBody == 3" )
        
        .copy_leads(v-if="copyLeads == null || copyLeads.length == 0")
          .no_data_box
            img(src="@/assets/icon/no_data.svg")
            span No data!
        .copy_leads(v-if="copyLeads.length>0")
          .cl_header
            .cl_header_col  Id
            .cl_header_col  Broker
            .cl_header_col  Status
          .cl_row(v-for="(item, index) in copyLeads" :key="index")
            .cl_row_col
              .id_box {{item.id}}
            .cl_row_col
              .broker_name {{item.broker_id}}
            .cl_row_col
              .status_name {{item.status_id}}
      .switch_box(v-if="dialogBody == 4" )
        .json_box 
          template
            JSONView(:data='testData')
    



    
</template>

<script>
import qs from "qs";
import { mapGetters } from "vuex";
import { JSONView } from 'vue-json-component';
export default {
  components: {
    JSONView,
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
      brokerDropMenu: false,
      brokerNameSel: null,
      brokerIdSel: null,
      dialogBody: 1,
      testData: null,
      alertConfig: {
        showAlert: false,
        iconName: "mdi-check",
        iconColor: "#74EF60",
        iconState: true,
        message: "Successfully!",
      },
      copyLeads: null,
    };
  },
  computed: {
    ...mapGetters([
      "GET_BROKERS",
      "GET_STATUSES",
      "GET_SOURCES",
      "GET_COUNTRIES",
    ]),
  },
  methods: {

    // https://jsonplaceholder.typicode.com/users

    getTest(){
      this.axios.get('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        this.testData = response.data
      })
    },
    getCopyLeads(){
      let token = localStorage["jwt"];
      let x_id
      if(this.lead){
        x_id = this.lead.id
      }else{
        x_id = 1
      }
      let config = {
          method: 'get',
          url: `https://back.horus.itdepartment.space/leads/copies/${x_id}`,
          headers: { 
            'Auth-Token': token
          }
        };
        this.axios(config)
            .then((response) => {
              // console.log(response)
              this.copyLeads = response.data
            })
            .catch((error) => {
              console.log(error);
            });
    },


   


    resendLead() {
      if (this.brokerIdSel !== null) {
        let token = localStorage["jwt"];
        let data = qs.stringify({
          lead_id: this.lead.id,
          broker_id: this.brokerIdSel,
        });
        let config = {
          method: "post",
          url: "https://back.horus.itdepartment.space/leads/resend",
          headers: {
            "Auth-Token": token,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: data,
        };
        this.axios(config)
          .then((response) => {
            console.log(response.data);
            if(response.data.status == "success"){
              this.showAlertTimer()
              this.brokerNameSel = null
              this.brokerIdSel = null
              // this.close()
            }
            if (response.data.status !== "success") {
              // console.log(response);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },

    getCountryName(id) {
      let x = this.GET_COUNTRIES.find((el) => el.id == id);
      return x.title;
    },
    getStatusName(id) {
      let x = this.GET_STATUSES.find((el) => el.id == id);
      return x.title;
    },
    getSourceName(id) {
      let x = this.GET_SOURCES.find((el) => el.id == id);
      return x.title;
    },
    closeDropBroker() {
      this.brokerDropMenu = false;
    },
    selectBroker(item) {
      this.brokerNameSel = item.title;
      this.brokerIdSel = item.id;
      this.brokerDropMenu = false;
    },
    switchBrokerDrop() {
      this.brokerDropMenu = !this.brokerDropMenu;
    },
    close() {
      this.dialogBody = 1
      this.$emit("close");
    },
    showAlertTimer(time) {
      this.alertConfig.showAlert = true;
      if (!time) {
        time = 1500;
      }
      let v = this;
      setTimeout(() => {
        this.alertConfig.showAlert = false;
      }, time);
    },
    clasFroUnderline(){
      switch (this.dialogBody) {
        case 1:
         return 'p_1' 
        break;
        case 2:
         return 'p_2' 
        break;
        case 3:
         return 'p_3' 
        break;
        case 4:
         return 'p_4' 
        break;
      }
    },
  },
  watch: {
    lead(newValue, oldValue) {
      this.getTest();
    this.getCopyLeads();
    }
  },
};
</script>

<style lang="scss" scoped>
@import "src/scss/leads/_info_dialog.scss";
.tag_area {
  padding-top: 4px !important;
}

.alert-enter-active, .alert-leave-active {
  transition: all .3s ease;
}
.alert-enter, .alert-leave-to{
  opacity: 0;
  transform: translateY(-20px);
}
</style>
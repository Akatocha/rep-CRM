<template lang='pug'>
.table_body_box
  vue-context(ref='menu' v-slot='{ data }')
    template(v-if='data')
      //- .context_cell
      //-   img(src='@/assets/icon/info.svg')
      //-   span More Info
      .context_cell(@click="editBrokerSchedule(data.item)")
        img(src='@/assets/icon/edit.svg')
        span Edit
      .context_cell(@click="deleteBrokerSchedule(data.item)")
        img(src='@/assets/icon/remove.svg')
        span Remove
  DeleteDialog(:visib="visDeleteDialog" :broker="broker" @closeDialog='showDeleteDialog') 
  AddScheduleDialog(:brokers='brokers' :visib="visAddCountryDialog" @closeDialog='closeAddCountryDialog')
  EditScheduleDialog(:broker='broker' :visib="visEditCountryDialog" @closeDialog='closeEditCountryDialog')
  .brocker_name {{getBroker(index) ? getBroker(index).title : 'null'}} 
  button.outline_none.btn_arrow(@click='dropArow' :class="{ 'rotate': !minTabComputed }" v-if='visArrow')
    img(src='@/assets/icon/short_up.svg')
  .tab_container( :class="{ 'tab_min': minTabComputed}" )
    .categories_box
      button.outline_none.btn_plus(@click='AddCountryInBroker(brokers)') 
        img(src='@/assets/icon/plus.svg')
      .categories_cell.first_cell Country
      .categories_cell.second_cell Monday
      .categories_cell.second_cell Tuesday
      .categories_cell.second_cell Wednesday
      .categories_cell.second_cell Thursday
      .categories_cell.second_cell Friday
      .categories_cell.second_cell Saturday
      .categories_cell.second_cell Sunday
    .tab_row(v-for="item in brokers" :key="item.id" @contextmenu.prevent="$refs.menu.open($event, {item})")
      .categories_cell.first_cell 
        img.flag(:src='getCountryCodeSrc(item.country_id)')
        span.land {{getCountry(item.country_id) ? getCountry(item.country_id).title : 'null'}}
      .categories_cell.second_cell {{item.monday_start}} - {{item.monday_end}}
      .categories_cell.second_cell {{item.tuesday_start}} - {{item.tuesday_end}}
      .categories_cell.second_cell {{item.wednesday_start}} - {{item.wednesday_end}}
      .categories_cell.second_cell {{item.thursday_start}} - {{item.thursday_end}}
      .categories_cell.second_cell {{item.friday_start}} - {{item.friday_end}}
      .categories_cell.second_cell {{item.saturday_start}} - {{item.saturday_end}}
      .categories_cell.second_cell {{item.sunday_start}} - {{item.sunday_end}}
            //- v-icon mdi-close

</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import EditScheduleDialog from "../dashboard/edit_schedule_dialog";
import AddScheduleDialog from "../dashboard/add_schedule_dialog";
import DeleteDialog from "../rules/delete_dialog";


import VueContext from 'vue-context';
import 'vue-context/src/sass/vue-context.scss';
  export default {
    components: {
      VueContext,
      EditScheduleDialog,
      AddScheduleDialog,
      DeleteDialog,
    },
    props: {
      brokers: {
        type: Array,
      },
      index: {
        type: String,
      },
    },
    data() {
      return {
        broker: null,
        visEditCountryDialog: false,
        visAddCountryDialog: false,
        visDeleteDialog: false,
        minTab: true,
      }
    },
    computed: {
      ...mapGetters(['GET_BROKERS_SCHEDULES','GET_COUNTRIES','GET_BROKERS']),
      visArrow(){
        if (this.brokers.length > 3){
          return true
        }else{return false}
      },
      minTabComputed(){
        if( this.minTab && this.visArrow ){
          return true
        }else{return false}
      },
    },
    methods: {
      AddCountryInBroker(item){
        this.visAddCountryDialog = true
      },
      dropArow(){
        this.minTab = !this.minTab
      },
      showDeleteDialog(mod){
        if(mod == 'open'){
          this.visDeleteDialog = true
        }else if(mod == 'close'){
          this.visDeleteDialog = false
        }else{this.visDeleteDialog = !this.visDeleteDialog }
      },
      
      editBrokerSchedule(item){
        this.broker = item
        this.closeEditCountryDialog('open')
      },
      deleteBrokerSchedule(item){
        this.broker = item
        this.visDeleteDialog = true
        
      },
      
      closeAddCountryDialog(status){
        if(status == 'open'){
          this.visAddCountryDialog = true
        }else{this.visAddCountryDialog = false}
      },
      closeEditCountryDialog(status){
        if(status == 'open'){
          this.visEditCountryDialog = true
        }else{this.visEditCountryDialog = false}
      },
      getBroker(id){
        let broker = {}
        broker = this.GET_BROKERS.find(x => x.id == id)
        return broker
      },
      getCountry(id) {
        let country = {}
        country = this.GET_COUNTRIES.find(x => x.id == id)
        return country
      },
      getCountryCodeSrc(id) {
        if (id == null){
          id = 81
        }
        let str
        if (this.GET_COUNTRIES.length>0){
          let country = this.GET_COUNTRIES.find(x => x.id == id)
          str = country.code
          return `https://www.countryflags.io/${str}/flat/24.png`
        }
        
      },
    },
  }
</script>

<style lang="scss" scoped>
@import 'src/scss/dashboard_components/_brockers_schedule.scss';
.v-context{
  padding: 0;
  background: #FFFFFF;
  box-shadow: 0px 4px 7px rgba(68, 68, 68, 0.25);
  color: $gray_1;
  font-size: 12px;
  line-height: 14px;

  .context_cell{
    cursor: pointer;
    height: 32px;
    display: flex;
    align-items: center;
    &:hover{
      background: $gray_6;
    }
    img{
      margin: 0 8px 0 10px;
    }
  }
}
.tab_container{
  &.tab_min{
    height: 200px;
    overflow: hidden;
  }
}
.rotate{
  transform: rotate(180deg);
}
</style>
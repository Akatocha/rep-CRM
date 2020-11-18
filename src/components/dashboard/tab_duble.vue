<template lang='pug'>
.tab_main
	.tab.tab_source
		.tab_name By status
		button.outline_none.btn_arrow(@click='switchDropMenu()' v-if='btnVis' :class="{'btn_arrow_reverse': !dropMenu}")
			img(src='@/assets/icon/short_up.svg')
		.contain(v-if='VisTabElement' :class="{'contain_short':dropMenuStatus}")
			.tab_row.tab_row_first
				span Status
				span Leads
			.tab_row.tab_row_second(v-for='(obj, key, index) in GET_SIMPLE_STATISTICS.statusTable' :key='index')
				span {{key}}
				span {{obj.count}}
		NoDataCell(:pb_minus='true' :Visibiliti='!VisTabElement' :Loadet='LOADET_SIMPLE_STATISTICS')


</template>

<script>
import NoDataCell from './noData'
import { mapGetters } from 'vuex'
  export default {
    components: {
      NoDataCell,
    },
    data() {
      return {
        dropMenu: true
      }
    },
    computed: {
      ...mapGetters(['GET_SIMPLE_STATISTICS', 'LOADET_SIMPLE_STATISTICS']),
      VisTabElement(){
        if (this.VisibNoDataCell && this.LOADET_SIMPLE_STATISTICS){
          return true
        }else{return false}
      },
      VisibNoDataCell(){
        if (Object.keys(this.GET_SIMPLE_STATISTICS.statusTable).length > 0){
          return true
        }else{return false}
      },
      shortArr(){
        if ( Object.keys(this.GET_SIMPLE_STATISTICS.statusTable).length  > 4 && this.LOADET_SIMPLE_STATISTICS){
          return true
        }else {return false}
      },
      dropMenuStatus(){
        if( this.shortArr && this.dropMenu){
          return true
        }else{ return false}
      },
      btnVis(){
        if(this.VisibNoDataCell && this.shortArr){
          return true
        }else{return false}
      }
    },
    methods: {
      switchDropMenu() {
        this.dropMenu = !this.dropMenu
      }
    },
    
  }
</script>

<style lang="scss" scoped>
@import '../../scss/dashboard_components/tab_duble';
</style>
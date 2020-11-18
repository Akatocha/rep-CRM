<template>
  <div>
    <div class="total_box">
      <button @click="switchDropMenu()" v-if="visBtnArrow" class="outline_none btn_arrow" :class="{'btn_arrow_reverse': !dropMenuStatus}">
        <img src="@/assets/icon/short_up.svg">
      </button>
      <div class="total_headet">
        <div class="header_title">Total</div>
        <!-- <div class="header_input_container">
          <div class="input_box">
            <label for="i_source">Source</label>
            <div @click.self="showDropMenu()" class="input" id="i_source">
              <v-icon>mdi-chevron-down</v-icon>
              <div  v-if="dropMenuInp" class="drop_box">
                <div v-for="(obj, inx) in dropObj" :key="inx" class="drop_row" :class="{'drop_row_active':obj.state}">
                  <div class="check_box">
                    <v-icon v-if="obj.state" size="16">
                      mdi-check
                    </v-icon>
                  </div>
                  <span>{{obj.text}} </span>
                </div>
              </div>
            </div>
          </div>
          <button>Show</button>
        </div> -->
      </div>
      <div class="total_table" :class="{'table_total_min': dropMenuStatus}">
        
        <table>
          <thead>
            <tr>
              <th v-for="head in tHeaeder" :key="head">
                {{head}}
              </th>
            </tr>
          </thead>
          <tbody v-if="VisTabElement">
            <tr v-for="(obj, id) in GET_TAB_TOTAL_DATA" :key="id">
              <td>
                <div class="td_country">
                  <img :src="`https://www.countryflags.io/${obj.iso_code}/flat/24.png`" >
                  <span>{{obj.iso_name}}</span>
                </div>
              </td>
              <td>
                {{obj.count}}
              </td>
              <td>
                {{obj.ftd}}
              </td>
              <td>
                {{obj.cr}}
              </td>
              <td>
                {{obj.na}}
              </td>
              <td>
                {{obj.na_rate}}
              </td>
              <td>
                {{obj.cb}}
              </td>
              <td>
                {{obj.cb_rate}}
              </td>
            </tr>
          </tbody>
        </table>
        <NoDataCell :Visibiliti="!VisTabElement" :Loadet='LOADET_TAB_TOTAL_DATA'></NoDataCell>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import NoDataCell from './noData'
  export default {
    components: {
      NoDataCell,
    },
    data() {
      return {
        dropMenuInp: false,
        dropMenu: true,

        dropObj: [
          {state: true, text: 'Ourcrm'},
          {state: false, text: 'Test'},
          {state: false, text: 'Text out'},
          ],
        tHeaeder: ['Country', 'Leads', 'FTD', 'CR', 'NA', 'NA%', 'CB','CB%'],
      }
    },
    computed: {
      ...mapGetters(['GET_TAB_TOTAL_DATA', 'LOADET_TAB_TOTAL_DATA']),
      VisTabElement(){
        if (this.VisibNoDataCell && this.LOADET_TAB_TOTAL_DATA){
          return true
        }else{return false}
      },
      VisibNoDataCell(){
        if (this.GET_TAB_TOTAL_DATA.length > 0){
          return true
        }else{return false}
      },
      dropMenuStatus(){
        if (this.dropMenu && this.visBtnArrow){
          return true
        }else{return false}
      },
      visBtnArrow(){
          if(this.rowInTable > 4 && this.LOADET_TAB_TOTAL_DATA){
            return true
          }else{return false}
      },
      rowInTable(){
        if(this.GET_TAB_TOTAL_DATA){
          return this.GET_TAB_TOTAL_DATA.length
        }
        return 0
      }
    },
      
    methods: {
      switchDropMenu(){
        this.dropMenu = !this.dropMenu
      },
      showDropMenu() {
        this.dropMenuInp = !this.dropMenuInp
      }
    },
  }
</script>

<style lang="scss" scoped>
@import '../../scss/dashboard_components/tab_total';
</style>
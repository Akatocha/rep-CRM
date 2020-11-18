<template lang='pug'>
div
  .total_box
    button.outline_none.btn_arrow(
      @click="switchDropMenu()",
      v-if="visBtnArrow",
      :class="{ btn_arrow_reverse: !dropMenuStatus }"
    )
      img(src="@/assets/icon/short_up.svg")
    .total_headet
      .header_title Total
      .input_space
        .input_container
          .label Brocker
          .input
            .tag_area
              .tag(v-for="item in 0")
                span DE
                v-icon(size='14') mdi-close
              input.outline_none.search(type='text')
            v-icon mdi-chevron-down
          .drop_menu_box(v-if='false') 
            .drop_row.drop_row_active
              .check_box
                v-icon(size='16') mdi-check
              span Germany (de)
            .drop_row
              .check_box
                v-icon(size='16') mdi-
              span Germany (de)
            .drop_row
              .check_box
                v-icon(size='16') mdi-
              span Germany (de)
        .input_container
          .label Source
          .input
            .tag_area
              .tag(v-for="item in 0")
                span DE
                v-icon(size='14') mdi-close
              input.outline_none.search(type='text')
            v-icon mdi-chevron-down
          .drop_menu_box(v-if='false') 
            .drop_row.drop_row_active
              .check_box
                v-icon(size='16') mdi-check
              span Germany (de)
            .drop_row
              .check_box
                v-icon(size='16') mdi-
              span Germany (de)
            .drop_row
              .check_box
                v-icon(size='16') mdi-
              span Germany (de)
        button.outline_none.btn_save Show
    .total_table(:class="{ table_total_min: dropMenuStatus }")
      table
        thead
          tr
            th(v-for="head in tHeaeder", :key="head")
              | {{ head }}
        tbody(v-if="VisTabElement")
          tr(v-for="(obj, id) in GET_TAB_TOTAL_DATA", :key="id")
            td
              .td_country
                img(
                  :src="`https://www.countryflags.io/${obj.iso_code}/flat/24.png`"
                )
                span {{ obj.iso_name }}
            td
              | {{ obj.count }} 
            td
              | {{ obj.ftd }}
            td
              | {{ obj.cr }}
            td
              | {{ obj.na }}
            td
              | {{ obj.na_rate }}
            td
              | {{ obj.cb }}
            td
              | {{ obj.cb_rate }}
      NoDataCell(:Visibiliti="!VisTabElement", :Loadet="LOADET_TAB_TOTAL_DATA")
</template>

<script>
import { mapGetters } from "vuex";
import NoDataCell from "./noData";
export default {
  components: {
    NoDataCell,
  },
  data() {
    return {
      dropMenuInp: false,
      dropMenu: true,

      dropObj: [
        { state: true, text: "Ourcrm" },
        { state: false, text: "Test" },
        { state: false, text: "Text out" },
      ],
      tHeaeder: ["Country", "Leads", "FTD", "CR", "NA", "NA%", "CB", "CB%"],
    };
  },
  computed: {
    ...mapGetters(["GET_TAB_TOTAL_DATA", "LOADET_TAB_TOTAL_DATA"]),
    VisTabElement() {
      if (this.VisibNoDataCell && this.LOADET_TAB_TOTAL_DATA) {
        return true;
      } else {
        return false;
      }
    },
    VisibNoDataCell() {
      if (this.GET_TAB_TOTAL_DATA.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    dropMenuStatus() {
      if (this.dropMenu && this.visBtnArrow) {
        return true;
      } else {
        return false;
      }
    },
    visBtnArrow() {
      if (this.rowInTable > 4 && this.LOADET_TAB_TOTAL_DATA) {
        return true;
      } else {
        return false;
      }
    },
    rowInTable() {
      if (this.GET_TAB_TOTAL_DATA) {
        return this.GET_TAB_TOTAL_DATA.length;
      }
      return 0;
    },
  },

  methods: {
    switchDropMenu() {
      this.dropMenu = !this.dropMenu;
    },
    showDropMenu() {
      this.dropMenuInp = !this.dropMenuInp;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../scss/dashboard_components/tab_total";
</style>
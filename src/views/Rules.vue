<template lang='pug'>
div
  BrockerAddDialog
  AddScheduleDialog
  Navbar
  .main_content
    CountrySetting
    SourceSetting
    FunnelsSetting
  .spacer
  Footer
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CountrySetting from "../components/rules/country_setting";
import AddScheduleDialog from "../components/dashboard/add_schedule_dialog";
import BrockerAddDialog from "../components/dashboard/brocker_add_dialog";
import SourceSetting from "../components/rules/source_setting";
import FunnelsSetting from "../components/rules/funnels_setting";

  export default {
    components: {
      BrockerAddDialog,
      AddScheduleDialog,
      Navbar,
      Footer,
      CountrySetting,
      SourceSetting,
      FunnelsSetting,
    },
    methods: {
      ...mapActions([
        'UpdateFunnelSetting',
        'UpdateCountrySetting',
        'UpdateSourceSetting',
        "GetBrokersAxios",
        "GetSourcesAxios",
        "GetCountriesAxios",
        "GetFunellsAxios",
        ])
    },
    created () {
      this.UpdateFunnelSetting()
      this.UpdateCountrySetting()
      this.UpdateSourceSetting()
      this.GetSourcesAxios()
      this.GetBrokersAxios()
      this.GetFunellsAxios()
      this.GetCountriesAxios()
    },
  }
</script>

<style lang="scss" scoped>
.main_content{
  width: 1170px;
  margin: 0 auto;
}
.spacer{
  width: 100%;
  height: 300vh;
}
</style>
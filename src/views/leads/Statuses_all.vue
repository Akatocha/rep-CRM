<template lang="pug">
div
  Navbar
  Footer
  .main
    .main_box
      AllStatusesLeads


</template>

<script>
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import AllStatusesLeads from "../../components/leads/all_statuses/all_statuses_comp"
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    Navbar,
    Footer,
    AllStatusesLeads,
  },
  methods: {
    ...mapActions(['getAllStatusesLeads', 'GetStatusesAxios'])
  },
  mounted () {
    this.getAllStatusesLeads()
    this.GetStatusesAxios()
  },
}
</script>

<style lang="scss" scoped>
.main{
  width: 100%;
  max-width: 1820px;
  margin: 95px auto 60px;
  

}
.main_box{
  box-shadow: 0px 2px 25px rgba(161, 161, 161, 0.25);
  margin: 0 20px;
}

</style>
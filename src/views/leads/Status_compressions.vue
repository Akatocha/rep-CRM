<template lang="pug">
div
  Navbar
  Footer
  .main
    .main_box
      StatusesCompressionsTab
</template>

<script>
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import StatusesCompressionsTab from "../../components/leads/statuses_compressions/statuses_compressions_comp"
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    Navbar,
    Footer,
    StatusesCompressionsTab,
  },
  data() {
    return {
      key: null
    }
  },
  computed: {
    ...mapGetters(['GET_STATUSES_COMPRESSIONS', 'PAGIN_STATUSES_COMPRESSIONS'])
  },
  methods: {
    ...mapActions(['UpdateStatusesCompressions', 'GetStatusesAxios', 'GetBrokersAxios'])
  },
  mounted () {
    this.GetBrokersAxios()
    this.GetStatusesAxios()
    this.UpdateStatusesCompressions()
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
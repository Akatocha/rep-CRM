<template lang="pug">
div 
  Navbar
  Footer
  .main
  .main_box
    BrokerTabComp
</template>

<script>
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import BrokerTabComp from "../../components/api_system/brokers_api/brokers_list"
import { mapActions } from 'vuex'
export default {
  components: {
    BrokerTabComp,
    Navbar,
    Footer,
  },
  methods: {
    ...mapActions(['GetBrokersListApi', 'GetBrokersAxios', 'GetBrokersCategories'])
  },
  mounted () {
    this.GetBrokersListApi();
    this.GetBrokersCategories();
    this.GetBrokersAxios();
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
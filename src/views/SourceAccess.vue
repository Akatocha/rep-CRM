<template lang="pug">
div 
  Navbar
  .main
    .main_box
      SourceAccessComp
  Footer
</template>

<script>
import { mapActions } from 'vuex';
import SourceAccessComp from '../components/api_system/source_access_comp'
import Footer from "../components/Footer";

import Navbar from "../components/Navbar";

  export default {
    components: {
      SourceAccessComp,
      Navbar,
      Footer,
    },
    methods: {
      ...mapActions(['getSourceAccess'])
    },
    mounted () {
      this.getSourceAccess();
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
<template lang="pug">
div
  Navbar
  Footer
  .main
    .main_box
      PermissionsComp

</template>

<script>
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import PermissionsComp from "@/components/api_system/permissions/permission_list"
import { mapActions } from 'vuex'

export default {
  components: {
    Navbar,
    Footer,
    PermissionsComp,
  },
  methods: {
    ...mapActions(['GetPermission', 'GetAllPermissions']),
  },
  mounted () {
    this.GetPermission()
    this.GetAllPermissions()
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
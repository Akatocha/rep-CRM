<template lang="pug">
div
  Navbar
  Footer
  .main
    .main_box
      UsersComp

</template>

<script>
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import UsersComp from "@/components/api_system/users/users_list"
import { mapActions } from 'vuex'

export default {
  components: {
    Navbar,
    Footer,
    UsersComp,
  },
  methods: {
    ...mapActions(['GetUsersApi', 'GetAllPermissions', 'GetPermission', 'GetSourcesAxios']),
  },
  mounted () {
    this.GetUsersApi()
    this.GetPermission()
    this.GetSourcesAxios()
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
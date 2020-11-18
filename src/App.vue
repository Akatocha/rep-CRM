<template>
  <v-app>
    <!-- <Preloader></Preloader> -->
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Preloader from './components/Preloader'
export default {
  name: 'App',
  components: {
    Preloader,
    
  },


  data: () => ({
    //
  }),
};
</script>

<style lang="scss">
.outline_none{
  &:focus{
    outline: none;
  }
}
.form-box{
  display: flex;
  justify-content: center;
}

    // стиль для календаря на Leads странице
.my-calendar{
  .v-picker__title{
    color: #FBC558 !important;
  }
}
.v-main{
  background: #F6F8F9;
}
</style>
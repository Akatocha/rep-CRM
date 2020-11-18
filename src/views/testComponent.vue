<template lang="pug">
div
  div test component
    div(v-for="(item,index) in dataApi" )
      span {{item.title}}
      img.imgg( :src="countryIsoCode(item.id, index)" alt="altText" @click="takeSrc" )
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
  export default {
    props: {
      dataApi: {
        type: Array
      },
    },
    methods: {
      getDubleId: async function(id) {
        return id*2
      },
      countryIsoCode(country_id, index) {
         let cc =  () => this.GET_COUNTRIES.find(el=> el.id == country_id).code
        //  .then(()=>{
        //    console.log('dawdwa')
        //  })
           return `https://www.countryflags.io/${cc()}/flat/24.png`;
         
        // this.$nextTick(()=>{
        //   this.$el.querySelectorAll('.imgg')[index].src = `https://www.countryflags.io/${cc.code}/flat/24.png`
        // })
    },
    takeSrc(){
    console.log(console.log(this.$el.querySelectorAll('.imgg')));
    },
    },
    computed: {
      ...mapGetters(['GET_COUNTRIES'])
    },
  }
</script>

<style lang="scss" scoped>

</style>
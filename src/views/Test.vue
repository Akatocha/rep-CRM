<template lang="pug">
 div
  button(@click="GetApi") add api
  hr
  testComponent(:dataApi="data")

</template>

<script>
import { mapActions } from 'vuex'
import testComponent from "./testComponent"
export default {
  components: {
    testComponent,
  },
  data() {
    return {
      data: null
    }
  },
  methods: {
    ...mapActions(['GetCountriesAxios']),
    GetApi() {
      this.axios.get('https://jsonplaceholder.typicode.com/posts')
      .then(response => {
        // console.log(response)
        this.data = response.data
      })
    }
  },
  mounted () {
    this.GetApi()
    this.GetCountriesAxios()
  },
}
</script>

<style lang="scss" scoped>
pre{font-size: 18px;}
</style>
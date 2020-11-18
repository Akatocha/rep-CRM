<template>
  <div class="main">
    <h1>404</h1>
    <h3>Error</h3>
    <hr>
    <h3>You will be redirected to login in {{num}} seconds</h3>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        num: 3
      }
    },
    created () {
      let v= this
      setTimeout(function () {
        v.$router.push("/");
      }, 3000);
      setInterval(function(){
        v.num = v.num-1
      }, 1000)

    },
  }
</script>

<style lang="scss" scoped>
.main{
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
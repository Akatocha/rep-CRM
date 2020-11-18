<template>
  <div>
    <div class="footer">
      <span>2020 © Royal Leads IT department</span>
      <div class="link-box">
        <router-link tag="span" to="#">Help</router-link>
        <router-link tag="span" to="#">Issues</router-link>
        <router-link tag="span" to="#">Contact</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style lang="scss" scoped>
.footer{
  position: absolute;
  width: 100%;
  bottom: 0;
  background: #101010;
  box-shadow: 0px 1px 2px rgba(255, 255, 255, 0.25);
  height: 55px;
  display: flex;
  justify-content: space-between;
  padding: 20px 30px;
  color: #828282;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;
}
.link-box{
  display: flex;

  span{
    margin-right: 35px;
    cursor: pointer;
  }
  
}
</style>
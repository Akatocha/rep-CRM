<template lang='pug'>
.cont
  .main_box
    span.message {{message}}
    .triangle
</template>

<script>
  export default {
    props: {
      message: {
        type: String,
        default: 'No message'
      },
    },
  }
</script>

<style lang="scss" scoped>
.cont{
  display: flex;
  width: 100%;
}
.main_box{
  // height: 50px;
  position: relative;
  display: flex;
  white-space: nowrap;
  justify-content: center;
  align-items: center;
  background: #101010;
  opacity: 0.8;
  box-shadow: 0px 4px 7px rgba(68, 68, 68, 0.25);
  border-radius: 7px;
  padding: 3px 8px;
  &:before {
    content: "";
    position: absolute;
    display: inline-block;
    top: 100%;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 5px 5px 0 5px;
    border-color: #101010 transparent transparent transparent;
}
}
.message{
  font-size: 12px;
line-height: 14px;
color: white;
}
</style>
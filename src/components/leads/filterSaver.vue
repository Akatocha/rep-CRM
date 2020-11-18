<template>
  <div v-if="Visibiliti">
    <div class="saver_main">
      <div class="saver_box">
        <label for="saver_input">Filter Name</label>
        <input @keyup.enter="addFilter()" v-model.trim="saverInput" id="saver_input" class="saver_input" type="text">
        <div class="btn_box">
          <button @click="showFilterSaver()" class="btn_cancel">Cancel</button>
          <button  @click="addFilter()" class="btn_add">Add</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    Visibiliti: {
      type: Boolean,
    }
  },
  data() {
    return {
      saverInput: ''
    }
  },
  methods: {
    showFilterSaver() {
      this.$emit('showFilterSaver')
      this.saverInput = ''
    },
    addFilter(){
      if(this.saverInput){
        this.$emit('addFilter', this.saverInput)
      }
      this.$emit('showFilterSaver')
      this.saverInput = ''
    }
    
  },
}
</script>

<style lang="scss" scoped>
@import '../../scss/colorVar';
*:focus{
  outline: none;
}
.saver_main{
  z-index: 500;
  background: #10101075;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.saver_box{
width: 400px;
min-height: 50px;
background: $white;
border-radius: 5px;
padding: 25px 35px 25px;
display: flex;
flex-direction: column;
}
.saver_input{
border: 1px solid $gray_5;
margin-bottom: 35px;
}
.btn_box{
display: flex;
}
.btn_add{
margin-left: auto;
padding: 4px 20px;
background: $yellow;
border-radius: 5px;
}
.btn_cancel{
padding: 4px 20px;
background: $yellow;
border-radius: 5px;
}
</style>
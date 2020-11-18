<template lang="pug">
.main
  .our_box(v-click-outside="closeDrop")
    .our_status( @click="dropMenu = true" :class="getStatusClass(status_id)" ) {{status(status_id)}}
    .drop_box_status(v-if="dropMenu" )
      .drop_row(v-for="item in GET_STATUSES" :key="item.id" @click="editNewStatus(item.id)" ) 
        span {{item.title}}
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  props: {
    status_id: {
      type: Number,
    },
    row_id: {
      type: Number,
    },
  },
  data() {
    return {
      dropMenu: false
    }
  },
  methods: {
    ...mapActions(['EditStatusesCompressions']),
    getStatusClass(status_id) {
    if (this.GET_STATUSES.length > 0) {
      let status = this.GET_STATUSES.find((x) => x.id == status_id);
      return status.class;
    } else {
      return "null";
    }
  },
    editNewStatus(status_id){
      let x ={}
      x.status_id = status_id
      x.id = this.row_id
      this.EditStatusesCompressions(x)
      this.closeDrop()
    },
    closeDrop(){
      this.dropMenu = false
    },  
    status(status_id) {
      if (this.GET_STATUSES.length > 0) {
        let status = this.GET_STATUSES.find((x) => x.id == status_id);
        return status.title;
      } else {
        return "null";
      }
    },
  },
  computed: {
    ...mapGetters(['GET_STATUSES']),
  },
}
</script>

<style lang="scss" scoped>
@import 'src/scss/_colorVar.scss';
.main{
  display: flex;
  align-items: center;
  justify-content: start;
}
.our_box{
  position: relative;
  display: flex;
  align-items: center;
}
// .our_status{
//   cursor: pointer;
//   padding: .15rem .75rem;
//   background: $yellow;
//   border-radius: 4px;
// }
.drop_box_status{
  display: flex;
  overflow: scroll;
  flex-direction: column;
  max-height: 300px;
  z-index: 3;
  position: absolute;
  top: 20px;
  left: 0;
  background: #FFFFFF;
  box-shadow: 0px 4px 7px rgba(68, 68, 68, 0.25);
  border-radius: 0 0 7px 7px;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background-color: $white;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    min-height: 20px;  
    border-radius: 10px;
    background-color: $gray_4;	
  }
}
.drop_row{
  display: flex;
  cursor: pointer;
  padding: 5px 0 5px 15px;
  // padding-left: 15px;
  width: 200px;
  display: flex;
  align-items: center;
  background: $white;
  &:hover{
    background: $gray_6;
  }
}
@import 'src/scss/_classVar.scss';

</style>
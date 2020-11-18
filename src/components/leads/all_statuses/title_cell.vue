<template lang="pug">
.main_box 
  span(:class="statusClass" @dblclick="dblTitle" v-if="!inputMenu" ) {{newStatusClass}}
  .dropMenu(v-if="inputMenu" v-click-outside='closeDropTitle')
    input.input_title(v-model="newStatusClass" @change="putTitle")
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import qs from "qs"

export default {
props: {
  itemId: {
    type: Number,
  },
  itemTitle: {
    type: String,
  },
  statusClass: {
    type: String,
  },
},
data() {
  return {
    newStatusClass: this.itemTitle,
    inputMenu: false
  }
},
methods: {
  ...mapActions(['getAllStatusesLeads', 'ShowAlert']),
  putTitle(){
    let token = localStorage['jwt']
    let data = qs.stringify({
        'title': this.newStatusClass,
        'class': this.statusClass,
      });
    let config = {
        method: 'put',
        url: `https://back.horus.itdepartment.space/statuses/${this.itemId}`,
        headers: { 
          'Auth-Token': token, 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
      };
    this.axios(config)
        .then((response) => {
          if(response.data.status == 'success'){
            this.ShowAlert()
          }
          // console.log(response.data)
          this.$emit("success")
          this.inputMenu = false
        })
        .catch((error) => {
          console.log(error);
        });
    
  },
  dblTitle(){
    this.inputMenu = true
  },
  closeDropTitle(){
    this.inputMenu = false
  },
  getStatusClass(status_id) {
    if (this.GET_STATUSES.length > 0) {
      let status = this.GET_STATUSES.find((x) => x.id == status_id);
      return status.class;
    } else {
      return "null";
    }
  },
},

computed: {
  ...mapGetters(['GET_STATUSES']),
},
watch: {
  itemId(newValue, oldValue) {
    this.newStatusClass = this.itemTitle
  },
  itemId(newValue, oldValue) {
    this.newStatusClass = this.itemTitle
  },

},
}
</script>

<style lang="scss" scoped>
@import 'src/scss/_colorVar.scss';

.main_box {
  position: relative;
  width: 100%;
  max-width: 150px;
  height: 100%;
  display: flex;
  align-items: center;
}
.dropMenu{
  background: white;
  height: 50px;
  width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  padding: 0 5px;
  border-radius: 5px;
}
.input_title{
  outline: none;
  width: 100%;
  max-width: 150px;
  padding-bottom: 3px;
  border-bottom: 1px solid $gray_5;
  font-size: 14px;
  line-height: 16px;
  &:focus {
    border-bottom: 1px solid $yellow;
  }
}
@import 'src/scss/_classVar.scss';

</style>
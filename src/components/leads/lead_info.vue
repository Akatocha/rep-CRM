<template>
  <div v-if="checkFillDialog" class="dialog-box">
      <div class="dialog-menu">
        <div class="dialog-title">
          <span>Info</span>
          <v-icon
          @click.stop="changeShowDialogState"
           size="20" 
           color="#FBC558">mdi-window-close</v-icon>
        </div>
        <div class="dialog-body">
          <div class="dialog-cell">
            <span class="title">Id</span>
            <span class="text">{{showDetailsUser.id}}</span>
          </div>
          <div class="dialog-cell">
            <span class="title">Status</span>
            <span class="text">{{dialogUserStatus(showDetailsUser.status_id) }}</span>
          </div>
          <div class="dialog-cell">
            <span class="title">Phone Number</span>
            <span class="text">{{showDetailsUser.phone_number}}</span>
          </div>
          <div class="dialog-cell">
            <span class="title">Phone Prefix</span>
            <span class="text">{{showDetailsUser.phone_prefix}}</span>
          </div>
          <div class="dialog-cell">
            <span class="title">First Name</span>
            <span class="text">{{showDetailsUser.first_name}}</span>
          </div>
          <div class="dialog-cell">
            <span class="title">Last Name</span>
            <span class="text">{{showDetailsUser.last_name}}</span>
          </div>
          <div class="dialog-cell">
            <span class="title">Email</span>
            <span class="text">{{showDetailsUser.email}}</span>
          </div>
          <div class="dialog-cell">
            <span class="title">Country</span>
            <span class="text">{{ dialogUserCountry(showDetailsUser.country_id) }}</span>
          </div>
          <div class="dialog-cell">
            <span class="title">Reg Time</span>
            <span class="text">{{showDetailsUser.reg_time}}</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    
  }
</script>

<style lang="scss" scoped>

</style>
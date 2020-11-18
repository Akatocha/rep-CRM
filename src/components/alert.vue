<template lang="pug">
div
  transition(mode='out-in' name='alert')
    .alert_box(v-if='ALERT_CONFIG.vis')
      .alert
        v-icon(size='36' v-if='ALERT_CONFIG.iconState' :color='ALERT_CONFIG.iconColor') {{ ALERT_CONFIG.iconName }}
        span.alert_text {{ ALERT_CONFIG.message }}
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['ALERT_CONFIG'])
  },
}
</script>

<style lang="scss" scoped>
@import 'src/scss/_colorVar.scss';
.alert_box{
  z-index: 1000;
  top: 80px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  position: absolute;
  .alert{
    padding: 0 22px;
    background: $dark;
    display: flex;
    align-items: center;
    height: 48px;
    opacity: 0.8;
    box-shadow: 0px 4px 7px rgba(68, 68, 68, 0.25);
    border-radius: 10px;
  }
  .v-icon{
    margin-right: 13px;
    // color: $green;
  }
  .alert_text{
    color: white;
    font-size: 14px;
    line-height: 16px;
  }
}

.alert-enter-active, .alert-leave-active {
  transition: all .3s ease;
}
.alert-enter, .alert-leave-to{
  opacity: 0;
  transform: translateY(-20px);
}

</style>
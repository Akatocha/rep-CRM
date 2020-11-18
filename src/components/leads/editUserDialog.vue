<template lang='pug'>
.main_container(v-if="visibility")
  .dialog_box
    .dialog_header
      div Edit
      v-icon mdi-close
    .dialog_body
      .input_cell
        .label Id
        input.outline_none.input_dialog(type="text" v-model="fakeValue[1]")
      .input_cell
        .label Status
        input.outline_none.input_dialog(type="text" v-model="fakeValue[2]")
      .input_cell
        .label Phone Number
        input.outline_none.input_dialog(type="text" v-model="fakeValue[3]")
      .input_cell
        .label Name
        input.outline_none.input_dialog(type="text" v-model="fakeValue[4]")
      .input_cell
        .label Other 1
        input.outline_none.input_dialog(type="text" v-model="fakeValue[5]")
      .input_cell
        .label Source
        input.outline_none.input_dialog(type="text" v-model="fakeValue[6]")
      .input_cell
        .label Email
        input.outline_none.input_dialog(type="text" v-model="fakeValue[7]")
      .input_cell
        .label Country
        input.outline_none.input_dialog(type="text" v-model="fakeValue[8]")
      .input_cell
        .label Ip
        input.outline_none.input_dialog(type="text" v-model="fakeValue[9]")
      .input_cell
        .label Passwprd
        input.outline_none.input_dialog(type="text" v-model="fakeValue[10]")
      .input_cell
        .label Phone Prefix
        input.outline_none.input_dialog(type="text" v-model="fakeValue[11]")
      .input_cell
        .label Reg Time
        input.outline_none.input_dialog(type="text" v-model="fakeValue[12]")
      .input_cell
        .label Broker
        input.outline_none.input_dialog(type="text" v-model="fakeValue[13]")
      button.outline_none.btn_dialog Save
</template>

<script>
export default {
  data() {
    return {
      visibility: false,
      fakeValue: {
        1: 325,
        2: "Brocker Error",
        3: "1701463156",
        4: "Martin Sellmann",
        5: "https://investetime.com/en/cha...",
        6: "OurUpload",
        7: "martinasellmann@googlemail.c...",
        8: "Germany",
        9: "87.247.143.114",
        10: "RHG6p9zxmP",
        11: "49",
        12: "2020-09-11 21:36:16",
        13: "Netgow",
      },
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/scss/leads/editUserDialog.scss";
</style>
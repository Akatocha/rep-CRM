<template lang='pug'>
div
  transition(mode='out-in' name='alert')
    .alert_box(v-if='showAlert')
      .alert
        v-icon(size='36' v-if='alertConfig.iconState' :color='alertConfig.iconColor') {{ alertConfig.iconName }}
        span.alert_text {{ alertConfig.message }}
  .main_box
    .login_box(:class="{login_to_right: configuration == 'reg',login_to_left: configuration == 'login',}")
      .login_logo_box
        transition(mode='out-in' name='opacity-logo')
          .logo_text.logo_login(key='logo' v-if='!passwordRecovery') Sign in to CRM
          .logo_text.logo_login(key='res' v-if='passwordRecovery') Send us your email
      .input_box(:class='{ login_email_box: passwordRecovery }')
        .alert_inp_box
          AlertInput(:message='alertInput.login.message_email' v-if='alertInput.login.status_email')
        input.email(autocomplete='on' @input="validateEmail('login')" v-model.trim='login.email' type='email' :class="{ input_invalid: login.validEmail == 'no' }" placeholder='Email')
        v-icon(:class="{ input_invalid: login.validEmail == 'no' }") mdi-email-outline
      .input_box(:class='{ login_password_box: passwordRecovery }')
        .alert_inp_box
          AlertInput(:message='alertInput.login.message_pass' v-if='alertInput.login.status_pass')
        input.password(@input="validatePassword('login')" :readonly='passwordRecovery' v-model.trim='login.password' :type='loginPasswordFileType' :class="{ input_invalid: login.validPass == 'no' }" placeholder='Password')
        v-icon(:class="{ input_invalid: login.validPass == 'no' }" @click='loginSwitchVisibilityPassword()') {{ eyeLoginPasswordStatus }}
      transition(mode='out-in' name='opacity')
        .second_text(key='1' v-if='!passwordRecovery' @click='switchPasswordRecovery()') Forgot your password?
        .second_text(key='2' v-if='passwordRecovery' @click='switchPasswordRecovery()') Return to Login
      button.btn-text.btn_logo(@click='sendFromLogin()')
        transition(mode='out-in' name='opacity-btn')
          div(key='3' v-if='!passwordRecovery') sing in
          div(key='4' v-if='passwordRecovery') send
    .quest_box(:class="{quest_to_left: configuration == 'reg',quest_to_right: configuration == 'login',}")
      .logo
        .img-box
          img(src='@/assets/crown_orig.svg' alt='')
        .q_logo_text
          span.t_1 Royal
          span.t_2 Leads
      transition(mode='out-in' :name='nameForTransitionLogoText')
        .logo_text.quest_logo_text(:key='configuration' v-if="configuration == 'login'") New User?
        .logo_text.quest_logo_text(:key='configuration' v-if="configuration == 'reg'") Welcome Back!
      span.second_quest_text To keep connected with us please login with your personal info
      .btn_quest_box
        button.btn-text.btn_quest(@click='switchConfigurationFormat()')
          transition(mode='out-in' tag='div' :name='nameForTransitionButton')
            div(:key='configuration' v-if="configuration == 'reg'") Sing in
            div(:key='configuration' v-if="configuration == 'login'") Sing up
    .register_box(v-if='confReg' :class="{    reg_to_right: configuration == 'reg',reg_to_left: configuration == 'login',}")
      span.logo_text.logo_register Create Account
      .register_name_box
        .input_box(:class="{ intut_z_index1: inputZindex == 'name' }")
          input(@input="validateName('name')" @blur='zIndexInp()' @focus="zIndexInp('name')" v-model.trim='register.first' type='text' :class="{ input_invalid: register.validName == 'no' }" placeholder='Name')
        .input_box(:class="{ intut_z_index2: inputZindex == 'surname' }")
          input(@input="validateName('surname')" @blur='zIndexInp()' @focus="zIndexInp('surname')" v-model.trim='register.last' type='text' :class="{ input_invalid: register.validSurname == 'no' }" placeholder='Surname')
          v-icon(:class="{ input_invalid: register.validSurname == 'no' }") mdi-account-outline
      .input_box
        input.email(@input="validateEmail('register')" v-model.trim='register.email' type='email' :class="{ input_invalid: register.validEmail == 'no' }" placeholder='Email')
        v-icon(:class="{ input_invalid: register.validEmail == 'no' }") mdi-email-outline
      .input_box.inp_reg_pass_box
        input.password(@input="validatePassword('register')" v-model.trim='register.password' :type='registerPasswordFileType' :class="{ input_invalid: register.validPass == 'no' }" placeholder='Password')
        v-icon(:class="{ input_invalid: register.validPass == 'no' }" @click='registerSwitchVisibilityPassword()') {{ eyeRegisterPasswordStatus }}
      button.btn-text.btn_register(@click='sendFormRegister()') sing up
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import AlertInput from '../components/alert_inp'
import qs from "qs";

export default {
  components: {
    AlertInput,
  },
  data() {
    return {
      alertInput:{
        login: {
          status_email: false,
          message_email: 'Email is incorrectly',
          status_pass: false,
          message_pass: 'Password is incorrectly'
        },
        register: {
          status_email: false,
          message_email: 'Email is incorrectly',
        }
      },
      login: {
        email: "",
        password: "",
        validEmail: "",
        validPass: "",
      },
      register: {
        first: "",
        last: "",
        email: "",
        password: "",
        validName: "",
        validSurname: "",
        validEmail: "",
        validPass: "",
      },
      alertConfig: {
        iconName: "mdi-check",
        iconColor: "#74EF60",
        iconState: true,
        message: "Registration completed successfully!",
      },
      inputZindex: null,
      showAlert: false,
      passwordRecovery: false,
      configuration: "login",
      confReg: false,
      loginPasswordFileType: "password",
      registerPasswordFileType: "password",
    };
  },
  computed: {
    // Validation

    // Validation
    nameForTransitionButton() {
      if (this.configuration == "login") {
        return "btn-text-login";
      } else {
        return "btn-text-reg";
      }
    },
    nameForTransitionLogoText() {
      if (this.configuration == "login") {
        return "text-login";
      } else {
        return "text-reg";
      }
    },
    eyeLoginPasswordStatus() {
      if (this.loginPasswordFileType === "password") {
        return "mdi-eye-outline";
      } else {
        return "mdi-eye-off-outline";
      }
    },
    eyeRegisterPasswordStatus() {
      if (this.registerPasswordFileType === "password") {
        return "mdi-eye-outline";
      } else {
        return "mdi-eye-off-outline";
      }
    },
    questTitleText() {
      if (this.configuration == "login") {
        return "New User?";
      } else {
        return "Welcome Back!";
      }
    },
  },
  methods: {
    ...mapActions(["Login", "UpdateUserData", "GetPermissionAxios"]),

    // Validation START
    validateEmail(from) {
      let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (from == "login") {
        if (reg.test(this.login.email)) {
          this.login.validEmail = "valid";
        } else {
          this.login.validEmail = "no";
        }
      } else if (from == "register") {
        if (reg.test(this.register.email)) {
          this.register.validEmail = "valid";
        } else {
          this.register.validEmail = "no";
        }
      }
    },
    validateName(from) {
      if (from == "name") {
        if (this.register.first != "") {
          this.register.validName = "valid";
        } else {
          this.register.validName = "no";
        }
      } else if (from == "surname") {
        if (this.register.last != "") {
          this.register.validSurname = "valid";
        } else {
          this.register.validSurname = "no";
        }
      }
    },
    validatePassword(from) {
      if (from == "login") {
        if (this.login.password.length > 7) {
          this.login.validPass = "valid";
        } else {
          this.login.validPass = "no";
        }
      } else if (from == "register") {
        if (this.register.password.length > 7) {
          this.register.validPass = "valid";
        } else {
          this.register.validPass = "no";
        }
      }
    },
    // Validation END

    sendFormRegister() {
      let sendData = qs.stringify({
        email: this.register.email,
        password: this.register.password,
        first_name: this.register.first,
        last_name: this.register.last,
      });
      let config = {
        method: "POST",
        url: "https://back.horus.itdepartment.space/auth/register",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        data: sendData,
      };
      if (
        this.register.validName == "valid" &&
        this.register.validSurname == "valid" &&
        this.register.validEmail == "valid" &&
        this.register.validPass == "valid"
      ) {
        this.axios(config)
          .then((response) => {
            // this.resetForm('register')
            this.getAlertMessage("register", response.data);
            // console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        let keys = Object.keys(this.register);
        let rem = keys.splice(4, 4);
        rem.forEach((key) => {
          if (this.register[key] == "") {
            this.register[key] = "no";
          }
        });
      }
    },
    sendFromLogin() {
      // console.log('log')
      let sendData = qs.stringify({
        email: this.login.email,
        password: this.login.password,
      });
      let config = {
        method: "POST",
        url: "https://back.horus.itdepartment.space/auth/login",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        data: sendData,
      };
      if (this.login.validEmail == "valid" && this.login.validPass == "valid") {
        this.axios(config)
          .then((response) => {
            // console.log(response)
            
            this.getAlertMessage("login", response.data);
            console.log(response.data);
            if(response.data.status == "validation_error"){
              this.alertInput.login.status_email = true
              this.alertInput.login.message_email = response.data.message.email[0]

            }
            if (response.data.status == "success") {
              this.resetForm("login");
              localStorage.setItem("jwt", response.data.data["jwt"]);
              this.Login(response.data.data["jwt"]);
              this.UpdateUserData(response.data.data.user);
              localStorage.setItem(
                "userData",
                JSON.stringify(response.data.data.user)
              );
              this.goToLeads();
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        let keys = Object.keys(this.login);
        let rem = keys.splice(2, 2);
        rem.forEach((key) => {
          if (this.login[key] == "") {
            this.login[key] = "no";
          }
        });
      }
    },
    resetForm(from) {
      let v = this[from];
      const keys = Object.keys(v);
      keys.forEach((key) => {
        v[key] = "";
      });
    },
    goToLeads() {
      let v = this;
      setTimeout(function () {
        v.$router.push("/dashboard");
      }, 1500);
    },
    getAlertMessage(from, res) {
      let a = this.alertConfig;
      if (from == "register") {
        if (res.status == "success") {
          a.iconState = true;
          a.iconColor = "#74EF60";
          a.iconName = "mdi-check";
          a.message = "Registration completed successfully!";
          this.showAlertTimer();
        } else if (res.status == "error") {
          a.iconState = true;
          a.iconColor = "#EB5757";
          a.iconName = "mdi-close";
          a.message = "This email is already taken.";
          this.showAlertTimer();
        }
      } else if (from == "login") {
        if (res.status == "success") {
          a.iconState = true;
          a.iconColor = "#74EF60";
          a.iconName = "mdi-check";
          a.message = "Login successful!";
          this.showAlertTimer();
        } else if (res.status == "error") {
          a.iconColor = "#EB5757";
          a.iconName = "mdi-close";
          a.message = "Login failed!";
          this.showAlertTimer();
        }
      }
    },
    showAlertTimer(time) {
      this.showAlert = true;
      if (!time) {
        time = 1500;
      }
      let v = this;
      setTimeout(() => {
        this.showAlert = false;
      }, time);
    },
    zIndexInp(ns) {
      if (ns == "name") {
        this.inputZindex = "name";
      } else if (ns == "surname") {
        this.inputZindex = "surname";
      } else {
        this.inputZindex = null;
      }
    },
    switchPasswordRecovery() {
      this.passwordRecovery = !this.passwordRecovery;
    },
    switchConfigurationFormat() {
      this.confReg = true;
      this.configuration = this.configuration === "login" ? "reg" : "login";
    },
    loginSwitchVisibilityPassword() {
      this.loginPasswordFileType =
        this.loginPasswordFileType === "password" ? "text" : "password";
    },
    registerSwitchVisibilityPassword() {
      this.registerPasswordFileType =
        this.registerPasswordFileType === "password" ? "text" : "password";
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/login";
@import "../scss/loginAnim";
</style>

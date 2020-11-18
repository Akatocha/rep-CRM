<template lang="pug">
div
  .navbar-box
    Alert
    .navbar-container
      .left-box(@click='goToDash()')
        .img-box
          img(src='@/assets/crown_orig.svg' alt='')
        .text-logo
          span.logo-span-1 Royal
          span.logo-span-2 Leads
      .links-box
        .dropdown-box
          router-link.link(tag='a' to='/dashboard') Dashboard
          .dropdown-content
        .dropdown-box
          router-link.link(tag='a' to='/leads') Leads
          .dropdown-content
            router-link.link(tag='a' to='/api/comparision') Status Comparision
            router-link.link(tag='a' to='/leads/statuses') All Statuses
            router-link.link(tag='a' to='/leads/cold') Cold`s List
        .dropdown-box
          router-link.link(tag='a' to='#') API`s
          .dropdown-content
            router-link.link(tag='a' to='/api/source_acces') Source Access
            router-link.link(tag='a' to='/api/brokers') Brokers
            router-link.link(tag='a' to='/rules') Rules
        .dropdown-box
          router-link.link(tag='a' to='#') Users
          .dropdown-content
            router-link.link(tag='a' to='/users') Users
            router-link.link(tag='a' to='/roles/permission') Roles & Permissions
      .right-box
        .bell_box( v-click-outside='closeMessageDrop' )
          v-icon.bell_icon(size="26" @click="switchMessageDrop" ) mdi-bell-ring-outline
          .message_number 2
          .drop_box_logout.db_bell(v-if="messageDrop"  )
            .bell_cell(v-for="item in 4" :key="item")
              .bell_icon
                v-icon mdi-bell-ring-outline
              .bell_text
                .bell_title Title message
                .bell_message This is a message...
                .bell_date 
                  v-icon(size="12")  mdi-clock-time-four-outline
                  |2020-10-10 18:36
        .text-acc(v-click-outside='switchDropMenu' @click="switchDropMenu('btn')")
          span.logo-span-1 {{GET_USER_DATA.role}} dawdsadwa
          span.logo-span-2 {{GET_USER_DATA.first_name}} {{GET_USER_DATA.last_name}} 
        .logo-acc {{AbbrUser}}
        .drop_box_logout(v-if='dropMenu' @click='Logout()')
          v-icon mdi-exit-to-app
          span Logout

</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import Alert from "./alert"

  export default {
    components: {
      Alert,
    },
    data() {
      return {
       dropMenu: false,
       messageDrop: false,
      }
    },
    methods: {
      ...mapActions(['UpdateUserData', 'ShowAlert']),
      closeMessageDrop(){
        this.messageDrop = false
      },
      switchMessageDrop(){
        this.messageDrop = !this.messageDrop
      },
      goToDash(){
        this.$router.push('/dashboard')
      },
      switchDropMenu(from){
        if (from == 'btn'){
          this.dropMenu = !this.dropMenu
        }else{
          this.dropMenu = false
        }
      },
      Logout(){
        // console.log('log')
        let config = {
          method: "POST",
          url: "https://back.horus.itdepartment.space/auth/logout",
          headers: { "Auth-Token": localStorage.getItem("jwt") },
          data: "",
        }
        this.axios(config)
        .then((response) => {
          console.log(response.data.status)
          if (response.data.status == "success") {
            localStorage.removeItem("jwt");
            localStorage.removeItem("userData");
            this.$router.push('/')
          }
        })
        .catch((error) => {
          console.log(error);
        });

      },
    },
    computed: {
      ...mapGetters(['GET_USER_DATA',]),
      
      AbbrUser() {
        let abbrName = this.GET_USER_DATA.first_name.slice(0,1)
        let abbrLastname = this.GET_USER_DATA.last_name.slice(0,1)
        let abbr = `${abbrName}${abbrLastname}`
        return abbr
      }
    },
    created () {
      // this.ShowAlert()
      this.UpdateUserData();
    },
    
  }
</script>

<style lang="scss" scoped>
@import '../scss/colorVar';
$black-color: #101010;
$white-color: #FFFFFF;

$width-container: 1170px;

.navbar-box{
  position: relative;
  width: 100%;
  height: 55px;
  background: $black-color;

  .navbar-container{
    margin: auto;
    height: 55px;
    width: $width-container;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .left-box{
    display: flex;
    align-items: center;
    cursor: pointer;
    .img-box{
      margin-right: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 35px;
      width: 35px;
      border: solid 1px #FBC558;
      border-radius: 5px;

      img{
        width: 22px;
      }
    }
    .text-logo{
      color: white;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      
    }
  }
  .right-box{
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;
    .bell_box{
      position: relative;
      height: 100%;
      margin-right: 20px;
      .message_number{
        position: absolute;
        top: -12px;
        left: -10px;
        color: $red;
      }
      .db_bell{
        right: -20px;
        height: auto;
        z-index: 10;
        display: flex;
        flex-direction: column;
        .bell_cell{
          border-bottom: 1px solid $gray_3;
          display: flex;
          padding:  10px 10px 10px 0;
          color: white;
          white-space: nowrap;
          display: flex;
          align-items: center;
          &:last-child{
            border-bottom: none;
          }
          .bell_text{
            margin-left: 10px;
          }
          .bell_message{
            font-size: 14px;
            color: $gray_4;
          }
          .bell_date{
            font-size: 12px;
            color: $gray_3;
            display: flex;
            align-items: center;
            .v-icon{
              color: $gray_3;
            }
          }
        }
      }
      .bell_icon{
        color: white;
      }
    }
    .drop_box_logout{
      position: absolute;
      top: 52px;
      display: flex;
      align-items: center;
      height: 48px;
      min-width: 50px;
      background: $dark;
      opacity: 0.8;
      box-shadow: 0px 4px 7px rgba(68, 68, 68, 0.25);
      border-radius: 10px;
      padding: 0 22px;
      .v-icon{
        color: white;
        margin-right: 10px;
      }
      span{
        font-size: 12px;
        line-height: 14px;
        color: white;
      }
    }

    .text-acc{
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .logo-acc{
      color: #FBC558;
      height: 35px;
      width: 35px;
      border-radius: 5px;
      border: 1px solid #FBC558;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      line-height: 23px;
      margin-left: 10px;
    }
  }
  .logo-span-1{
        font-size: 14px;
        line-height: 16px;
        color: #BDBDBD;
      }
  .logo-span-2{
    font-size: 16px;
    line-height: 19px;
    color: white;
  }
  .links-box{
    margin: auto;
    width: 623px;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .dropdown-box{
      position: relative;
      display: flex;
      align-items: center;
      height: 100%;

      .dropdown-content{
        background: $black-color;
        z-index: 10;
        opacity: 0.8;
        box-shadow: 0px 4px 7px rgba(68, 68, 68, 0.25);
        top: 100%;
        padding: 10px 0;
        border-radius: 0 0 10px 10px;
        position: absolute;
        display: none;
        flex-direction: column;
        overflow: hidden;
        a{
          padding: 7px 20px;
          font-family: Roboto;
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          line-height: 14px;
          color:#BDBDBD;
          text-decoration: none;
          white-space: nowrap;
          text-transform: capitalize;
          
          &:hover{
            background: #4F4F4F;
          }
        }
      }
      &:hover .dropdown-content{
        display: flex;
      }
    }

  }
  .link{
    text-decoration: none;
    cursor: pointer;
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 21px;
    color: $white-color;
  }


}
</style>
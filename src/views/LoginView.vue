<template>
  <form v-if="!isOtpStep" @submit.prevent>
    <h2>{{ title }}</h2>
    <h3 v-if="errorMessage !== ''">{{ errorMessage }}</h3>
    <table>
      <tr>
        <td><CustomInput v-model="userName" inputType="text" :label="userNameLabel" /></td>
      </tr>
      <tr>
        <td><CustomInput v-model="password" inputType="password" :label="passwordLabel" /></td>
      </tr>
      <tr>
        <td><button id="sign-in-button">Log in</button></td>
      </tr>
    </table>
  </form>
  <div v-if="isOtpStep">
    <table>
      <tr>
        <td><CustomInput v-model="otpCode" inputType="text" :invalidMsg="invalidOtpCode" :label="otpLabel" /></td>
      </tr>
      <tr>
        <td><button @click="confirmOtp">Verify</button></td>
      </tr>
    </table>
  </div>
</template>

<script>
import CustomInput from '@/components/CustomInput.vue'
import { RecaptchaVerifier } from 'firebase/auth'
import MasterView from './MasterView.vue'

export default {
  mixins: [MasterView],
  name: 'LoginView',
  data () {
    return {
      title: 'Login Form',
      userName: '+84965019428',
      password: 'Abc123456',
      userNameLabel: 'Username',
      passwordLabel: 'Password',
      twoFactorMethod: '',
      otpLabel: 'Otp Code',
      otpCode: '',
      invalidOtpCode: '',
      errorMessage: '',
      appVerifier: null,
      confirmationResult: null,
      isOtpStep: false
    }
  },
  methods: {
    confirmOtp () {
      this.confirmationResult.confirm(this.otpCode).then(response => {
        let loginPath = ''
        const user = {
          uid: null,
          email: null,
          otpCode: null
        }
        if (this.twoFactorMethod === 'PHONE') {
          user.uid = response.user.uid
          loginPath = 'auth/loginPhoneOtp'
        } else /* if (this.twoFactorMethod === 'EMAIL') */ {
          user.email = this.userName
          user.otpCode = this.otpCode
          loginPath = 'auth/loginEmailOtp'
        }
        this.$store.dispatch(loginPath, user).then(response => {
          this.$router.push('/')
        },
        error => this.handleError(error))
      }).catch(error => this.handleError(error))
    },
    handleError (error) {
      this.errorMessage = 'Internal Server Error'
      if (error.response && error.response.status === 400) {
        this.errorMessage = 'Bad Request'
      } else if ((error.response && error.response.status === 401) || (error.response && error.response.status === 403)) {
        this.errorMessage = error.response.data.message
      } else {
        if (error.constructor.name === 'FirebaseError') {
          this.invalidOtpCode = error.code
        }
        console.log(error)
      }
    },
    initReCaptcha () {
      const vm = this
      this.appVerifier = new RecaptchaVerifier('sign-in-button', {
        size: 'invisible',
        callback: function (response) {
          vm.$store.dispatch('auth/login', { userName: vm.userName, password: vm.password }).then((response) => {
            if (response.status === 202) {
              vm.twoFactorMethod = response.data.twoFactorMethod
              if (vm.twoFactorMethod === 'PHONE') {
                vm.$store.dispatch('firebase/signInWithPhone', { phoneNumber: vm.userName, appVerifier: vm.appVerifier }).then(response => {
                  vm.confirmationResult = response
                  vm.isOtpStep = true
                },
                error => vm.handleError(error))
              } else {
                vm.isOtpStep = true
              }
            } else {
              vm.$store.state.auth.user = response.data
              vm.$store.state.auth.loggedIn = true
              localStorage.setItem('user', JSON.stringify(response.data))
              vm.$router.push('/')
            }
          },
          (error) => vm.handleError(error))
        },
        'expired-callback': function () {
          window.grecaptcha.reset(this.widgetId)
        }
      }, vm.$store.state.firebase.auth)
      const renderCapcha = async () => {
        await this.appVerifier.render()
      }
      renderCapcha()
    }
  },
  components: {
    CustomInput
  },
  mounted () {
    this.initReCaptcha()
  }
}
</script>

<style scoped>
  h2 {
    margin-block-start: 0;
  }

  h3 {
    color: red;
  }

  table {
    display: initial;
  }

  td {
    text-align: left;
  }
</style>

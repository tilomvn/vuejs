<template>
  <form v-if="isFormStep" @submit.prevent>
    <h2>{{ title }}</h2>
    <h3 v-if="errorMessage !== ''">{{ errorMessage }}</h3>
    <br/>
    <table>
      <tr>
        <td><CustomInput v-model="userName" inputType="text" label="User Name" /></td>
      </tr>
      <tr>
        <td><CustomInput v-model="phoneNumber" inputType="text" label="Phone Number" /></td>
      </tr>
      <tr>
        <td><CustomInput v-model="email" inputType="text" label="Email" /></td>
      </tr>
      <tr>
        <td><CustomInput v-model="password" inputType="password" label="Password" /></td>
      </tr>
      <tr>
        <td><CustomInput v-model="referralCode" inputType="text" label="Referral Code" /></td>
      </tr>
      <tr>
        <td><button id="sign-in-button">Create Your Account</button></td>
      </tr>
    </table>
  </form>
  <label v-if="isPhoneNumberVerificationStep">Verify your phone number</label>
  <div v-if="isPhoneNumberVerificationStep">
    <table>
      <tr>
        <td><CustomInput v-model="otpCode" inputType="text" :invalidMsg="invalidOtpCode" label="Otp Code" /></td>
      </tr>
      <tr>
        <td><button @click="completeRegistration">Complete</button></td>
      </tr>
    </table>
  </div>
  <div v-if="isCompleted">
    <img alt="Vue logo" src="../assets/logo.png">
    <h2>Thank you for signing up !</h2>
    <button @click="gotoLogin">Log in</button>
  </div>
</template>

<script>
import CustomInput from '@/components/CustomInput.vue'
import { RecaptchaVerifier } from 'firebase/auth'
import MasterView from './MasterView.vue'

export default {
  mixins: [MasterView],
  name: 'RegistrationView',
  data () {
    return {
      title: 'Create your account now !',
      userName: 'Nick',
      phoneNumber: '+84965019428',
      email: 'hoka8x@gmail.com',
      password: 'Abc123456',
      referralCode: null,
      errorMessage: '',
      isFormStep: true,
      isPhoneNumberVerificationStep: false,
      otpCode: '',
      invalidOtpCode: '',
      appVerifier: null,
      confirmationResult: null,
      isCompleted: false
    }
  },
  methods: {
    handleError (error) {
      this.errorMessage = 'Internal Server Error'
      if (error.response && error.response.status === 400) {
        this.errorMessage = 'Bad Request'
      } else if (error.response && error.response.status === 401) {
        this.errorMessage = error.response.message
      } else {
        if (error.contructor.name === 'FirebaseError') {
          this.invalidOtpCode = error.code
        }
        console.log(error)
      }
    },
    completeRegistration () {
      this.confirmationResult.confirm(this.otpCode).then(response => {
        this.$store.dispatch('auth/register', {
          uid: response.user.uid
        }).then(response => {
          this.isCompleted = true
          this.isPhoneNumberVerificationStep = false
        },
        error => this.handleError(error))
      }).catch(error => this.handleError(error))
    },
    gotoLogin () {
      this.$router.push('/login')
    },
    initReCaptcha () {
      const vm = this
      this.appVerifier = new RecaptchaVerifier('sign-in-button', {
        size: 'invisible',
        callback: function (response) {
          vm.$store.dispatch('auth/registerDraft', {
            userFullName: vm.userName,
            phoneNumber: vm.phoneNumber,
            email: vm.email,
            password: vm.password,
            referralCode: vm.referralCode
          }).then(response => {
            vm.$store.dispatch('firebase/signInWithPhone', { phoneNumber: vm.phoneNumber, appVerifier: vm.appVerifier }).then(response => {
              vm.confirmationResult = response
              vm.isPhoneNumberVerificationStep = true
              vm.isFormStep = false
            },
            error => vm.handleError(error))
          },
          error => vm.handleError(error))
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

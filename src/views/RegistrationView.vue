<template>
    <form v-if="!isCompleted">
        <h2>{{ title }}</h2>
        <h3 v-if="errorMessage !== ''">{{ errorMessage }}</h3>
        <label v-if="isFormStep || isCompleted">{{ signIn }} <a @click="gotoLogin" href="#">Sign in</a></label>
        <label v-if="isPhoneNumberVerificationStep">Verify your phone number</label>
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
    <div v-if="isPhoneNumberVerificationStep">
      <CustomInput v-model="otpCode" inputType="text" label="Otp Code" />
      <button @click="completeRegistration">Complete</button>
    </div>
    <div v-if="isCompleted">
      <img alt="Vue logo" src="../assets/logo.png">
      Thank you for signing up !
    </div>
</template>

<script>
import CustomInput from '@/components/CustomInput.vue'
const { RecaptchaVerifier } = require('firebase/auth')

export default {
  name: 'RegistrationView',
  data () {
    return {
      title: 'Create your account now !',
      signIn: 'Already have CryptoSwap account ?',
      userName: 'Nick',
      phoneNumber: '+84965019428',
      email: 'hoka8x@gmail.com',
      password: 'Abc123456',
      referralCode: null,
      errorMessage: '',
      isFormStep: true,
      isPhoneNumberVerificationStep: false,
      otpCode: '',
      appVerifier: null,
      isCompleted: false
    }
  },
  methods: {
    handleSubmit () {
      this.$store.dispatch('auth/registerDraft', {
        userFullName: this.userName,
        phoneNumber: this.phoneNumber,
        email: this.email,
        password: this.password,
        referralCode: this.referralCode
      }).then(response => {
        this.$store.dispatch('firebase/signInWithToken', response.data.firebaseToken).then(response => {
          this.$store.dispatch('firebase/signInWithPhone', response.phoneNumber, this.appVerifier).then(response => {
            window.confirmationResult = response
            this.isPhoneNumberVerificationStep = true
            this.isFormStep = false
          },
          error => this.handleError(error))
          // this.$store.dispatch('auth/register', {
          //   firebaseIdToken: response.idToken,
          //   uid: response.uid
          // }).then(response => {
          //   this.isCompleted = true
          // },
          // error => this.handleError(error))
        },
        error => this.handleError(error))
      },
      (error) => this.handleError(error))
    },
    handleError (error) {
      console.log(error)
      this.errorMessage = 'Internal Server Error'
      if (error.response && error.response.status === 400) {
        this.errorMessage = 'Bad Request'
      }
    },
    completeRegistration () {
      console.log(this.otpCode)
    },
    gotoLogin () {
      this.$router.push('/login')
    }
  },
  components: {
    CustomInput
  },
  mounted () {
    window.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
      size: 'invisible',
      callback: (response) => {
        console.log(response)
        this.appVerifier = response
        this.handleSubmit()
      }
    }, this.$store.state.firebase.auth)
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

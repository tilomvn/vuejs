<template>
  <form v-if="isFormStep" @submit.prevent>
    <h2>{{ title }}</h2>
    <h3 v-if="errorMessage !== ''">{{ errorMessage }}</h3>
    <br/>
    <table>
      <tr>
        <td><CustomInput v-model="cryptoAsset" inputType="text" label="Crypto Asset"/></td>
      </tr>
      <tr>
        <td><CustomInput v-model="fiatAsset" inputType="text" label="Buy By FiatAsset"/></td>
      </tr>
      <tr>
        <td><CustomInput v-model="cryptoAmount" inputType="text" label="Crypto Amount"/></td>
      </tr>
      <tr>
        <td><CustomInput v-model="orderType" inputType="text" label="Order Type"/></td>
      </tr>
      <tr>
        <td><button id="buy-button">Buy</button></td>
      </tr>
    </table>
  </form>
  <label v-if="isPhoneNumberVerificationStep">Verify your trading</label>
  <div v-if="isPhoneNumberVerificationStep">
    <table>
      <tr>
        <td><CustomInput v-model="otpCode" inputType="text" :invalidMsg="invalidOtpCode" label="Otp Code" /></td>
      </tr>
      <tr>
        <td><button @click="completeBuy">Complete</button></td>
      </tr>
    </table>
  </div>
  <div v-if="isCompleted">
    <img alt="Vue logo" src="../assets/logo.png">
    <h2>Thank you for buying crypto !</h2>
  </div>
</template>

<script>
import CustomInput from '@/components/CustomInput.vue'
import { RecaptchaVerifier } from 'firebase/auth'
import MasterView from './MasterView.vue'

export default {
  mixins: [MasterView],
  name: 'BuyCryptoView',
  data () {
    return {
      title: 'Buy crypto',
      cryptoAsset: 'USDC',
      fiatAsset: 'TWD',
      cryptoAmount: '1.00',
      orderType: 'BUY_CRYPTO',

      isFormStep: true,
      isPhoneNumberVerificationStep: false,
      otpCode: '',
      errorMessage: '',
      emailOtpCode: '',
      invalidOtpCode: '',

      appVerifier: null,
      confirmationResult: null,
      isCompleted: false
    }
  },
  methods: {
    handleError (error) {
      console.log(error)
      this.errorMessage = 'Internal Server Error'
      if (error.response && error.response.status === 400) {
        this.errorMessage = 'Bad Request'
      } else if (error.response && error.response.status === 401) {
        this.errorMessage = error.response.data.message
      } else {
        if (error.contructor && error.contructor.name === 'FirebaseError') {
          this.invalidOtpCode = error.code
        }
      }
    },
    completeBuy () {
      this.confirmationResult.confirm(this.otpCode).then(response => {
        this.$store.dispatch('crypto/buyCrypto', {
          cryptoAsset: this.cryptoAsset,
          fiatAsset: this.fiatAsset,
          cryptoAmount: this.cryptoAmount,
          transactionType: this.orderType
        }).then(response => {
          this.isCompleted = true
          this.isPhoneNumberVerificationStep = false
        },
        error => this.handleError(error))
      }).catch(error => this.handleError(error))
    },
    initReCaptcha () {
      const vm = this
      this.appVerifier = new RecaptchaVerifier('buy-button', {
        size: 'invisible',
        callback: function (response) {
          vm.$store.dispatch('firebase/signInWithPhone', { phoneNumber: vm.$store.state.crypto.user.phoneNumber, appVerifier: vm.appVerifier }).then(response => {
            vm.confirmationResult = response
            vm.isPhoneNumberVerificationStep = true
            vm.isFormStep = false
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

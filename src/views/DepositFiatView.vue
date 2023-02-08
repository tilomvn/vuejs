<template>
  <form v-if="isFormStep" @submit.prevent>
    <h2>{{ title }}</h2>
    <h3 v-if="errorMessage !== ''">{{ errorMessage }}</h3>
    <br/>
    <table>
      <tr>
        <td><CustomInput v-model="fiatAsset" inputType="text" label="Buy By FiatAsset"/></td>
      </tr>
      <tr>
        <td><CustomInput v-model="depositAmount" inputType="text" label="Deposit Amount"/></td>
      </tr>
      <tr>
        <td><button id="deposit-button">Deposit</button></td>
      </tr>
    </table>
  </form>
  <label v-if="isCompleteDeposit">Complete Deposit Fiat</label>
  <div v-if="isCompleteDeposit">
    <table>
      <tr>
        <td><CustomInput v-model="otpCode" inputType="text" label="Otp Code" /></td>
      </tr>
      <tr>
        <td><CustomInput v-model="walletHistoryId" inputType="text" label="Transaction Id" /></td>
      </tr>
      <tr>
        <td><CustomInput v-model="bankTransactionRefNo" inputType="text" label="Bank Transaction Ref No" /></td>
      </tr>
      <tr>
        <td><CustomInput v-model="fiatAsset" inputType="text" label="Fiat Asset" /></td>
      </tr>
      <tr>
        <td><button @click="completeDepositFiat">Complete</button></td>
      </tr>
    </table>
  </div>
  <div v-if="isCompleted">
    <img alt="Vue logo" src="../assets/logo.png">
    <h2>Thank you for deposit fiat !</h2>
  </div>
</template>

<script>
import CustomInput from '@/components/CustomInput.vue'
import { RecaptchaVerifier } from 'firebase/auth'
import MasterView from './MasterView.vue'

export default {
  mixins: [MasterView],
  name: 'DepositFiat',
  data () {
    return {
      title: 'Deposit Crypto',
      fiatAsset: 'TWD',
      depositAmount: '1.00',
      walletHistoryId: '',
      bankTransactionRefNo: '',

      isFormStep: true,
      isCompleteDeposit: false,
      errorMessage: '',

      otpCode: '',
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
        this.errorMessage = error.response.data.message
      } else {
        if (error.contructor && error.contructor.name === 'FirebaseError') {
          this.invalidOtpCode = error.code
        }
        console.log(error)
      }
    },
    completeDepositFiat () {
      this.confirmationResult.confirm(this.otpCode).then(response => {
        this.$store.dispatch('crypto/completeDepositFiat', {
          walletHistoryId: this.walletHistoryId,
          fiatAsset: this.fiatAsset,
          bankTransactionRefNo: this.bankTransactionRefNo
        }).then(response => {
          this.isCompleteDeposit = false
          this.isFormStep = false
          this.isCompleted = true
        },
        error => this.handleError(error))
      }).catch(error => this.handleError(error))
    },
    initReCaptcha () {
      const vm = this
      this.appVerifier = new RecaptchaVerifier('deposit-button', {
        size: 'invisible',
        callback: function (response) {
          vm.$store.dispatch('crypto/depositFiat', { asset: vm.fiatAsset, amount: vm.depositAmount }).then(response => {
            vm.$store.dispatch('firebase/signInWithPhone', { phoneNumber: vm.$store.state.crypto.user.phoneNumber, appVerifier: vm.appVerifier }).then(response => {
              vm.confirmationResult = response
              vm.isCompleteDeposit = true
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

<template>
  <form v-if="isFormStep" @submit.prevent>
    <h2>{{ title }}</h2>
    <h3 v-if="errorMessage !== ''">{{ errorMessage }}</h3>
    <br/>
    <table>
      <tr>
        <td><CustomInput v-model="orderId" inputType="text" label="Order Id"/></td>
      </tr>
      <tr>
        <td><CustomInput v-model="cryptoAsset" inputType="text" label="Crypto Asset"/></td>
      </tr>
      <tr>
        <td><button id="close-button">Close</button></td>
      </tr>
    </table>
  </form>
  <div v-if="isCompleted">
    <img alt="Vue logo" src="../assets/logo.png">
    <h2>Thank you for closing order !</h2>
  </div>
</template>

<script>
import CustomInput from '@/components/CustomInput.vue'
import { RecaptchaVerifier } from 'firebase/auth'
import MasterView from './MasterView.vue'

export default {
  mixins: [MasterView],
  name: 'CloseOrderCryptoView',
  data () {
    return {
      title: 'Close Order Crypto',
      orderId: '',
      cryptoAsset: '',

      isFormStep: true,
      errorMessage: '',

      appVerifier: null,
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
    initReCaptcha () {
      const vm = this
      this.appVerifier = new RecaptchaVerifier('close-button', {
        size: 'invisible',
        callback: function (response) {
          vm.$store.dispatch('crypto/closeOrder', {
            orderId: vm.orderId,
            cryptoAsset: vm.cryptoAsset
          }).then(response => {
            vm.isFormStep = false
            vm.isCompleted = true
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

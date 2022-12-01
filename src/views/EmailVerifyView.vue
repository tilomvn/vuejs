<template>
  <table>
    <tr>
      <td><CustomInput v-model="email" :invalidMsg="errorMessage" inputType="text" label="Email" /></td>
    </tr>
    <tr>
      <td><button @click="sendEmail">Send Email</button></td>
    </tr>
  </table>
  <h4 v-if="isSentEmail">Check your email to activate !</h4>
</template>

<script>
import CustomInput from '@/components/CustomInput.vue'
import axios from 'axios'

export default {
  name: 'EmailVerify',
  data () {
    return {
      email: '',
      isSentEmail: false,
      errorMessage: ''
    }
  },
  components: {
    CustomInput
  },
  methods: {
    sendEmail () {
      return axios
        .post('radx-blockchain-ops-user/email/send', { email: this.email })
        .then(response => { this.isSentEmail = true })
        .catch(error => {
          this.errorMessage = 'Internal Server Error'
          console.log(error)
        })
    }
  }
}
</script>

<style scoped>
table {
    display: initial;
}

td {
    text-align: left;
}
</style>

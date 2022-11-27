<template>
    <form @submit.prevent="handleSubmit">
        <h2>{{ title }}</h2>
        <h3 v-if="isLoginFailed">{{ errorMessage }}</h3>
        <table>
          <tr>
            <td><CustomInput v-model="email" inputType="text" :label="emailLabel" /></td>
          </tr>
          <tr>
            <td><CustomInput v-model="password" inputType="password" :label="passwordLabel" /></td>
          </tr>
          <tr>
            <td><button>Log in</button></td>
          </tr>
        </table>
    </form>
</template>

<script>
import CustomInput from '@/components/CustomInput.vue'

export default {
  name: 'LoginView',
  data () {
    return {
      title: 'Login Form',
      email: '',
      password: '',
      emailLabel: 'Email',
      passwordLabel: 'Password',
      isLoginFailed: false,
      errorMessage: ''
    }
  },
  methods: {
    handleSubmit () {
      this.$store.dispatch('auth/login', { userName: this.email, password: this.password }).then((data) => {
        this.$router.push('/')
      },
      (error) => {
        this.isLoginFailed = true
        this.errorMessage = 'Internal Server Error'
        if (error.response.status === 400) {
          this.errorMessage = 'Bad Request'
        }
        console.log(error)
      })
    }
  },
  components: {
    CustomInput
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

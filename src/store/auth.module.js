import axios from 'axios'
const user = JSON.parse(localStorage.getItem('user'))

export const auth = {
  namespaced: true,
  state: user ? { loggedIn: true, user } : { loggedIn: false, user: null },
  actions: {
    login ({ commit }, user) {
      return axios
        .post('/radx-blockchain-ops-user/login', user)
        .then(response => {
          commit('loginSuccess', response.data)
          return Promise.resolve(response.data)
        })
    },
    loginPhoneOtp ({ commit }, user) {
      return axios
        .post('/radx-blockchain-ops-user/login/phone/otp', user)
        .then(response => {
          commit('loginPhoneOtpSuccess', response.data)
          return Promise.resolve(response.data)
        })
    },
    loginEmailOtp ({ commit }, user) {
      return axios
        .post('/radx-blockchain-ops-user/login/email/otp', user)
        .then(response => {
          commit('loginEmailOtpSuccess', response.data)
          return Promise.resolve(response.data)
        })
    },
    registerDraft ({ commit }, user) {
      return axios
        .post('/radx-blockchain-ops-user/register/draft', user)
        .then(response => {
          commit('registerDraftSuccess', response.data)
          return Promise.resolve(response.data)
        })
    },
    register ({ commit }, firebaseToken) {
      return axios
        .post('/radx-blockchain-ops-user/register', firebaseToken)
        .then(response => {
          commit('registerSuccess')
          return Promise.resolve(response.data)
        })
    },
    logout ({ commit }) {
      return axios
        .post('/radx-blockchain-ops-user/logout/' + this.state.auth.user.deviceId, null, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.state.auth.user.accessToken
          }
        })
        .then(response => {
          commit('logoutSuccess')
          return Promise.resolve(response.data)
        })
    }
  },
  mutations: {
    loginSuccess (state, user) {},
    loginPhoneOtpSuccess (state, user) {
      state.loggedIn = true
      state.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    loginEmailOtpSuccess (state, user) {
      state.loggedIn = true
      state.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    logoutSuccess (state) {
      state.loggedIn = false
      state.user = null
      localStorage.removeItem('user')
    },
    registerSuccess (state) {
      state.loggedIn = false
      state.user = null
    },
    registerDraftSuccess (state, data) {}
  }
}

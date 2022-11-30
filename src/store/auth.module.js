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
      commit('logoutSuccess')
    }
  },
  mutations: {
    loginSuccess (state, user) {},
    loginPhoneOtpSuccess (state, user) {
      state.loggedIn = true
      state.user = user
    },
    loginEmailOtpSuccess (state, user) {
      state.loggedIn = true
      state.user = user
    },
    logoutSuccess (state) {
      state.loggedIn = false
      state.user = null
    },
    registerSuccess (state) {
      state.loggedIn = false
    },
    registerDraftSuccess (state, data) {
      console.log(data)
    }
  }
}

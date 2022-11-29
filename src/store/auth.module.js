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
          // if (response.data.accessToken) {
          localStorage.setItem('user', JSON.stringify(response.data))
          // }
          commit('loginSuccess', response.data)
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
    loginSuccess (state, user) {
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

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
    logout ({ commit }) {
      commit('logout')
    }
  },
  mutations: {
    loginSuccess (state, user) {
      state.loggedIn = true
      state.user = user
    },
    loginFailure (state) {
      state.loggedIn = false
      state.user = null
    },
    logout (state) {
      state.loggedIn = false
      state.user = null
    },
    registerSuccess (state) {
      state.loggedIn = false
    },
    registerFailure (state) {
      state.loggedIn = false
    }
  }
}

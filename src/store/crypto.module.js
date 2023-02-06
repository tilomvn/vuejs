import axios from 'axios'
const user = JSON.parse(localStorage.getItem('user'))

export const crypto = {
  namespaced: true,
  state: user ? { loggedIn: true, user } : { loggedIn: false, user: null },
  actions: {
    buyCrypto ({ commit }, data) {
      return axios
        .post('/radx-blockchain-ops-trading/trading/crypto/place', data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.state.auth.user.accessToken
          }
        }).then(response => {
          commit('buyCrypto')
          return Promise.resolve(response.data)
        })
    },
    depositFiat ({ commit }, data) {
      return axios
        .post('/radx-blockchain-ops-payment/wallet/fiat/deposit', data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.state.auth.user.accessToken
          }
        }).then(response => {
          commit('depositFiat')
          return Promise.resolve(response.data)
        })
    },
    completeDepositFiat ({ commit }, data) {
      return axios
        .post('/radx-blockchain-ops-payment/admin/deposit/fiat/complete', data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.state.auth.user.accessToken
          }
        }).then(response => {
          commit('completeDepositFiat')
          return Promise.resolve(response.data)
        })
    }
  },
  mutations: {
    buyCrypto (state) {},
    depositFiat (state) {},
    completeDepositFiat (state) {}
  }
}

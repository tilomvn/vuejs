const { initializeApp } = require('firebase/app')
const { getAuth, signInWithCustomToken, signInWithPhoneNumber } = require('firebase/auth')
const firebaseConfig = {
  apiKey: 'AIzaSyClBRTKp0rzdw0-aPlR-KkOBEq8CovsELs',
  authDomain: 'crypto-swap-e608e.firebaseapp.com',
  projectId: 'crypto-swap-e608e',
  appId: 'crypto-swap-e608e'
}
initializeApp(firebaseConfig)
const auth = getAuth()

export const firebase = {
  namespaced: true,
  state: {
    auth: auth
  },
  actions: {
    signInWithToken ({ commit }, token) {
      return signInWithCustomToken(auth, token).then(userCredentials => {
        const user = userCredentials.user
        const userInfo = async () => {
          return {
            uid: user.uid,
            phoneNumber: user.phoneNumber,
            idToken: await auth.currentUser.getIdToken(true)
          }
        }
        commit('signInWithTokenSuccess')
        return Promise.resolve(userInfo())
      })
    },
    signInWithPhone ({ commit }, appInfo) {
      return signInWithPhoneNumber(auth, appInfo.phoneNumber, appInfo.appVerifier).then(confirmationResult => {
        commit('signInWithPhoneSuccess')
        return Promise.resolve(confirmationResult)
      })
    }
  },
  mutations: {
    signInWithTokenSuccess (state) {},
    signInWithPhoneSuccess (state) {}
  }
}

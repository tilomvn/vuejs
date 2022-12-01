const { initializeApp } = require('firebase/app')
const { getAuth, signInWithCustomToken, signInWithPhoneNumber } = require('firebase/auth')

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY
  // authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  // projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  // appId: process.env.VUE_APP_FIREBASE_APP_ID
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

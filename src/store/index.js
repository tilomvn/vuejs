import { createStore } from 'vuex'
import { auth } from './auth.module'
import { firebase } from './firebase.module'
import { crypto } from './crypto.module'

const store = createStore({
  modules: {
    auth: auth,
    firebase: firebase,
    crypto: crypto
  }
})

export default store

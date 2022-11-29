import { createStore } from 'vuex'
import { auth } from './auth.module'
import { firebase } from './firebase.module'

const store = createStore({
  modules: {
    auth: auth,
    firebase: firebase
  }
})

export default store

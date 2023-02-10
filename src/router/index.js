import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import RegistrationView from '../views/RegistrationView.vue'
import EmailVerifyView from '../views/EmailVerifyView.vue'
import BuyCryptoView from '../views/BuyCryptoView.vue'
import DepositFiatView from '../views/DepositFiatView.vue'
import CloseOrderCryptoView from '../views/CloseOrderCryptoView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    component: RegistrationView
  },
  {
    path: '/buy-crypto',
    name: 'buy-crypto',
    component: BuyCryptoView
  },
  {
    path: '/verify-email',
    name: 'verify-email',
    component: EmailVerifyView
  },
  {
    path: '/deposit-fiat',
    name: 'deposit-fiat',
    component: DepositFiatView
  },
  {
    path: '/close-order',
    name: 'close-order',
    component: CloseOrderCryptoView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

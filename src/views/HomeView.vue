<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld :sessionValidation="sessionValidation" msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import MasterView from './MasterView.vue'
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  mixins: [MasterView],
  name: 'HomeView',
  components: {
    HelloWorld
  }
}
</script>

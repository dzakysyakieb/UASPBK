<template>
  <div id="app">
    <Navbar v-if="isAuthenticated" />
    <main :class="{ 'with-navbar': isAuthenticated }">
      <router-view />
    </main>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useAuthStore } from './stores/auth'
import Navbar from './components/navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar
  },
  setup() {
    const authStore = useAuthStore()
    
    const isAuthenticated = computed(() => authStore.isAuthenticated)
    
    return {
      isAuthenticated
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

main {
  min-height: 100vh;
  padding: 20px;
}

main.with-navbar {
  margin-left: 250px;
  padding: 20px;
}

@media (max-width: 768px) {
  main.with-navbar {
    margin-left: 0;
    padding: 20px;
  }
}
</style>
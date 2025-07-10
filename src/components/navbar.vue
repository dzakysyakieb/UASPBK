<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <h2>Sistem Klinik</h2>
    </div>
    
    <ul class="navbar-menu">
      <li>
        <router-link to="/" class="nav-link">
          <i class="icon">🏠</i>
          Dashboard
        </router-link>
      </li>
      
      <li class="nav-group">
        <span class="nav-group-title">Manajemen</span>
        
        <ul class="nav-submenu">
          <li>
            <router-link to="/patients" class="nav-link">
              <i class="icon">👥</i>
              Pasien
            </router-link>
          </li>
          <li>
            <router-link to="/doctors" class="nav-link">
              <i class="icon">👨‍⚕️</i>
              Dokter
            </router-link>
          </li>
          <li>
            <router-link to="/appointments" class="nav-link">
              <i class="icon">📅</i>
              Appointment
            </router-link>
          </li>
        </ul>
      </li>
      
      <li>
        <router-link to="/medical-records" class="nav-link">
          <i class="icon">📋</i>
          Rekam Medis
        </router-link>
      </li>
      
      <li>
        <router-link to="/reports" class="nav-link">
          <i class="icon">📊</i>
          Laporan
        </router-link>
      </li>
    </ul>
    
    <div class="navbar-footer">
      <div class="user-info">
        <span>{{ user?.name || 'User' }}</span>
        <button @click="handleLogout" class="logout-btn">
          <i class="icon">🚪</i>
          Logout
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Navbar',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const user = computed(() => authStore.user)
    
    const handleLogout = () => {
      authStore.logout()
      router.push('/login')
    }
    
    return {
      user,
      handleLogout
    }
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 250px;
  background-color: #2c3e50;
  color: white;
  padding: 20px 0;
  overflow-y: auto;
  z-index: 1000;
}

.navbar-brand {
  padding: 0 20px 20px;
  border-bottom: 1px solid #34495e;
  margin-bottom: 20px;
}

.navbar-brand h2 {
  margin: 0;
  font-size: 1.5em;
  color: #ecf0f1;
}

.navbar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.navbar-menu li {
  margin-bottom: 5px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #bdc3c7;
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  background-color: #34495e;
  color: #ecf0f1;
}

.icon {
  margin-right: 10px;
  font-size: 1.2em;
}

.nav-group {
  margin-bottom: 15px;
}

.nav-group-title {
  display: block;
  padding: 8px 20px;
  font-size: 0.9em;
  color: #95a5a6;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-submenu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-submenu .nav-link {
  padding-left: 40px;
}

.navbar-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  border-top: 1px solid #34495e;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.3s ease;
}

.logout-btn:hover {
  background: #c0392b;
}

@media (max-width: 768px) {
  .navbar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .navbar.open {
    transform: translateX(0);
  }
}
</style>
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  
  const isAuthenticated = computed(() => !!token.value)
  
  const login = async (credentials) => {
    console.log('login called with credentials:', credentials)
    try {
      // Local admin login check
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        console.log('Admin login success')
        user.value = { username: 'admin', role: 'admin' }
        token.value = 'admin-token'
        
        localStorage.setItem('token', token.value)
        localStorage.setItem('user', JSON.stringify(user.value))
        
        return { success: true }
      }
      
      // Simulate API call - replace with actual API endpoint
      const response = await api.post('/auth/login', credentials)
      
      user.value = response.data.user
      token.value = response.data.token
      
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))
      
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      }
    }
  }
  
  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
  
  const initAuth = () => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    
    if (storedUser && storedToken) {
      user.value = JSON.parse(storedUser)
      token.value = storedToken
    }
  }
  
  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    initAuth
  }
})

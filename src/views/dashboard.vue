<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Dashboard</h1>
      <p>Selamat datang di Sistem Manajemen Klinik</p>
    </div>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <h3>{{ patientCount }}</h3>
          <p>Total Pasien</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">👨‍⚕️</div>
        <div class="stat-content">
          <h3>{{ doctorCount }}</h3>
          <p>Total Dokter</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-content">
          <h3>{{ appointmentCount }}</h3>
          <p>Appointment Hari Ini</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">📋</div>
        <div class="stat-content">
          <h3>{{ recordCount }}</h3>
          <p>Rekam Medis</p>
        </div>
      </div>
    </div>
    
    <div class="dashboard-content">
      <div class="recent-section">
        <h2>Appointment Terbaru</h2>
        <div class="appointment-list">
          <div v-if="loading" class="loading">Loading...</div>
          <div v-else-if="recentAppointments.length === 0" class="empty">
            Tidak ada appointment terbaru
          </div>
          <div v-else>
            <div
              v-for="appointment in recentAppointments"
              :key="appointment.id"
              class="appointment-item"
            >
              <div class="appointment-info">
                <h4>{{ appointment.patientName }}</h4>
                <p>{{ appointment.doctorName }}</p>
                <span class="appointment-time">{{ formatDateTime(appointment.date, appointment.time) }}</span>
              </div>
              <div class="appointment-status" :class="appointment.status">
                {{ getStatusLabel(appointment.status) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="quick-actions">
        <h2>Aksi Cepat</h2>
        <div class="action-buttons">
          <router-link to="/patients/add" class="action-btn">
            <i class="icon">➕</i>
            Tambah Pasien
          </router-link>
          <router-link to="/appointments/add" class="action-btn">
            <i class="icon">📅</i>
            Buat Appointment
          </router-link>
          <router-link to="/doctors/add" class="action-btn">
            <i class="icon">👨‍⚕️</i>
            Tambah Dokter
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { usePatientStore } from '../stores/patient'
import api from '../services/api'

export default {
  name: 'Dashboard',
  setup() {
    const patientStore = usePatientStore()
    
    const doctorCount = ref(0)
    const appointmentCount = ref(0)
    const recordCount = ref(0)
    const recentAppointments = ref([])
    const loading = ref(true)
    
    const patientCount = computed(() => patientStore.patientCount)
    
    const fetchDashboardData = async () => {
      loading.value = true
      try {
        // Fetch all data for dashboard
        const [doctorsRes, appointmentsRes, recordsRes] = await Promise.all([
          api.get('/doctors'),
          api.get('/appointments'),
          api.get('/medical_records')
        ])
        
        doctorCount.value = doctorsRes.data.length
        appointmentCount.value = appointmentsRes.data.filter(apt => 
          new Date(apt.date).toDateString() === new Date().toDateString()
        ).length
        recordCount.value = recordsRes.data.length
        
        // Get recent appointments with patient and doctor names
        const appointments = appointmentsRes.data.slice(0, 5)
        const [patientsRes] = await Promise.all([
          api.get('/patients')
        ])
        
        const patients = patientsRes.data
        const doctors = doctorsRes.data
        
        recentAppointments.value = appointments.map(apt => ({
          ...apt,
          patientName: patients.find(p => p.id === apt.patientId)?.name || 'Unknown',
          doctorName: doctors.find(d => d.id === apt.doctorId)?.name || 'Unknown'
        }))
        
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        loading.value = false
      }
    }
    
    const formatDateTime = (date, time) => {
      return `${new Date(date).toLocaleDateString('id-ID')} ${time}`
    }
    
    const getStatusLabel = (status) => {
      const labels = {
        'scheduled': 'Terjadwal',
        'completed': 'Selesai',
        'cancelled': 'Dibatalkan'
      }
      return labels[status] || status
    }
    
    onMounted(async () => {
      await patientStore.fetchPatients()
      await fetchDashboardData()
    })
    
    return {
      patientCount,
      doctorCount,
      appointmentCount,
      recordCount,
      recentAppointments,
      loading,
      formatDateTime,
      getStatusLabel
    }
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 30px;
}

.dashboard-header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.dashboard-header p {
  color: #7f8c8d;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  font-size: 2.5em;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 50%;
}

.stat-content h3 {
  font-size: 2em;
  margin: 0;
  color: #2c3e50;
}

.stat-content p {
  margin: 5px 0 0;
  color: #7f8c8d;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

.recent-section,
.quick-actions {
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.recent-section h2,
.quick-actions h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.5em;
}

.appointment-list {
  max-height: 400px;
  overflow-y: auto;
}

.appointment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #ecf0f1;
}

.appointment-item:last-child {
  border-bottom: none;
}

.appointment-info h4 {
  margin: 0 0 5px;
  color: #2c3e50;
}

.appointment-info p {
  margin: 0 0 5px;
  color: #7f8c8d;
}

.appointment-time {
  font-size: 0.9em;
  color: #95a5a6;
}

.appointment-status {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.9em;
  font-weight: 500;
}

.appointment-status.scheduled {
  background: #e3f2fd;
  color: #1976d2;
}

.appointment-status.completed {
  background: #e8f5e8;
  color: #2e7d32;
}

.appointment-status.cancelled {
  background: #ffebee;
  color: #c62828;
}

.loading,
.empty {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: #f8f9fa;
  color: #2c3e50;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.action-btn .icon {
  font-size: 1.2em;
}

@media (max-width: 768px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
<template>
  <div class="appointment-list">
    <div class="page-header">
      <h1>Daftar Appointment</h1>
      <router-link to="/appointments/add" class="btn btn-primary">
        <i class="icon">➕</i>
        Buat Appointment
      </router-link>
    </div>

    <div class="filters">
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari appointment..."
          class="search-input"
        />
      </div>
    </div>

    <div class="appointment-table-container">
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="filteredAppointments.length === 0" class="empty">
        Tidak ada data appointment
      </div>
      <table v-else class="appointment-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Pasien</th>
            <th>Dokter</th>
            <th>Tanggal</th>
            <th>Waktu</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(appointment, index) in filteredAppointments" :key="appointment.id">
            <td>{{ index + 1 }}</td>
            <td>{{ appointment.patientName }}</td>
            <td>{{ appointment.doctorName }}</td>
            <td>{{ formatDate(appointment.date) }}</td>
            <td>{{ appointment.time }}</td>
            <td>{{ getStatusLabel(appointment.status) }}</td>
            <td class="actions">
              <router-link
                :to="`/appointments/${appointment.id}/edit`"
                class="btn btn-sm btn-secondary"
              >
                Edit
              </router-link>
              <button
                @click="confirmComplete(appointment)"
                class="btn btn-sm btn-success"
                title="Selesai"
              >
                Selesai
              </button>
              <button
                @click="confirmDelete(appointment)"
                class="btn btn-sm btn-danger"
              >
                Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="cancelDelete">
      <div class="modal" @click.stop>
        <h3>Konfirmasi Hapus</h3>
        <p>Apakah Anda yakin ingin menghapus appointment pasien "{{ appointmentToDelete?.patientName }}"?</p>
        <div class="modal-actions">
          <button @click="cancelDelete" class="btn btn-secondary">Batal</button>
          <button @click="deleteAppointment" class="btn btn-danger">Hapus</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Complete Confirmation Modal -->
  <div v-if="showCompleteModal" class="modal-overlay" @click="cancelComplete">
    <div class="modal" @click.stop>
      <h3>Konfirmasi Selesai</h3>
      <p>Apakah Anda yakin ingin menandai appointment pasien "{{ appointmentToComplete?.patientName }}" sebagai selesai?</p>
      <div class="modal-actions">
        <button @click="cancelComplete" class="btn btn-secondary">Batal</button>
        <button @click="markComplete" class="btn btn-success">Selesai</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import api from '../../services/api'

export default {
  name: 'AppointmentList',
  setup() {
    const appointments = ref([])
    const loading = ref(false)
    const error = ref(null)
    const searchQuery = ref('')
    const showDeleteModal = ref(false)
    const appointmentToDelete = ref(null)
    const showCompleteModal = ref(false)
    const appointmentToComplete = ref(null)

    const fetchAppointments = async () => {
      loading.value = true
      error.value = null
      try {
        const response = await api.get('/appointments')
        const patientsRes = await api.get('/patients')
        const doctorsRes = await api.get('/doctors')

        const patients = patientsRes.data
        const doctors = doctorsRes.data

        appointments.value = response.data.map(apt => ({
          ...apt,
          patientName: patients.find(p => p.id === apt.patientId)?.namaLengkap || patients.find(p => p.id === apt.patientId)?.nama || 'Unknown',
          doctorName: doctors.find(d => d.id === apt.doctorId)?.name || 'Unknown'
        }))
      } catch (err) {
        error.value = err.response?.data?.message || 'Gagal mengambil data appointment'
      } finally {
        loading.value = false
      }
    }

    const filteredAppointments = computed(() => {
      if (!searchQuery.value) return appointments.value
      const query = searchQuery.value.toLowerCase()
      return appointments.value.filter(apt =>
        apt.patientName.toLowerCase().includes(query) ||
        apt.doctorName.toLowerCase().includes(query) ||
        apt.status.toLowerCase().includes(query)
      )
    })

    const formatDate = (dateString) => {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString('id-ID')
    }

    const getStatusLabel = (status) => {
      const labels = {
        scheduled: 'Terjadwal',
        completed: 'Selesai',
        cancelled: 'Dibatalkan'
      }
      return labels[status] || status
    }

    const confirmDelete = (appointment) => {
      appointmentToDelete.value = appointment
      showDeleteModal.value = true
    }

    const cancelDelete = () => {
      appointmentToDelete.value = null
      showDeleteModal.value = false
    }

    const deleteAppointment = async () => {
      if (!appointmentToDelete.value) return
      try {
        await api.delete(`/appointments/${appointmentToDelete.value.id}`)
        appointments.value = appointments.value.filter(apt => apt.id !== appointmentToDelete.value.id)
        cancelDelete()
      } catch (err) {
        alert(err.response?.data?.message || 'Gagal menghapus appointment')
      }
    }

    const confirmComplete = (appointment) => {
      appointmentToComplete.value = appointment
      showCompleteModal.value = true
    }

    const markComplete = async () => {
      if (!appointmentToComplete.value) return
      try {
        console.log('Starting markComplete for appointment:', appointmentToComplete.value.id)
        // Create medical record from appointment data
        const postRes = await api.post('/medical_records', {
          patientId: appointmentToComplete.value.patientId,
          doctorId: appointmentToComplete.value.doctorId,
          date: appointmentToComplete.value.date,
          time: appointmentToComplete.value.time,
          status: 'completed',
          notes: ''
        })
        console.log('Medical record created:', postRes.data)
        // Delete appointment
        const deleteRes = await api.delete(`/appointments/${appointmentToComplete.value.id}`)
        console.log('Appointment deleted:', deleteRes.status)
        // Update local state
        appointments.value = appointments.value.filter(apt => apt.id !== appointmentToComplete.value.id)
        console.log('Updated appointments list:', appointments.value)
        // Re-fetch appointments to sync state
        await fetchAppointments()
        cancelComplete()
      } catch (err) {
        console.error('Error completing appointment:', err)
        alert(err.response?.data?.message || 'Gagal menyelesaikan appointment')
      }
    }

    const cancelComplete = () => {
      appointmentToComplete.value = null
      showCompleteModal.value = false
    }

    onMounted(() => {
      fetchAppointments()
    })

    return {
      appointments,
      loading,
      error,
      searchQuery,
      filteredAppointments,
      formatDate,
      getStatusLabel,
      showDeleteModal,
      appointmentToDelete,
      confirmDelete,
      cancelDelete,
      deleteAppointment,
      showCompleteModal,
      appointmentToComplete,
      confirmComplete,
      markComplete,
      cancelComplete
    }
  }
}
</script>

<style scoped>
.appointment-list {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-header h1 {
  color: #2c3e50;
  margin: 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover {
  background: #2980b9;
}

.btn-secondary {
  background: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background: #7f8c8d;
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background: #c0392b;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.filters {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.search-box {
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #ecf0f1;
  border-radius: 6px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
}

.appointment-table-container {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.appointment-table {
  width: 100%;
  border-collapse: collapse;
}

.appointment-table th,
.appointment-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ecf0f1;
}

.appointment-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

.appointment-table tr:hover {
  background: #f8f9fa;
}

.actions {
  display: flex;
  gap: 10px;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 30px;
  border-radius: 10px;
  max-width: 400px;
  width: 90%;
}

.modal h3 {
  margin-top: 0;
  color: #2c3e50;
}

.modal p {
  color: #7f8c8d;
  margin: 20px 0;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }

  .actions {
    flex-direction: column;
  }
}
</style>

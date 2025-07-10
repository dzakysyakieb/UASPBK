<template>
  <div class="doctor-list">
    <div class="page-header">
      <h1>Daftar Dokter</h1>
      <router-link to="/doctors/add" class="btn btn-primary">
        <i class="icon">➕</i>
        Tambah Dokter
      </router-link>
    </div>

    <div class="filters">
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari dokter..."
          class="search-input"
        />
      </div>
    </div>

    <div class="doctor-table-container">
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="filteredDoctors.length === 0" class="empty">
        Tidak ada data dokter
      </div>
      <table v-else class="doctor-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Spesialisasi</th>
            <th>Email</th>
            <th>Telepon</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(doctor, index) in filteredDoctors" :key="doctor.id">
            <td>{{ index + 1 }}</td>
            <td>{{ doctor.name }}</td>
            <td>{{ doctor.specialization }}</td>
            <td>{{ doctor.email }}</td>
            <td>{{ doctor.phone }}</td>
            <td class="actions">
              <router-link
                :to="`/doctors/${doctor.id}/edit`"
                class="btn btn-sm btn-secondary"
              >
                Edit
              </router-link>
              <button
                @click="confirmDelete(doctor)"
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
        <p>Apakah Anda yakin ingin menghapus dokter "{{ doctorToDelete?.name }}"?</p>
        <div class="modal-actions">
          <button @click="cancelDelete" class="btn btn-secondary">Batal</button>
          <button @click="deleteDoctor" class="btn btn-danger">Hapus</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import api from '../../services/api'

export default {
  name: 'DoctorList',
  setup() {
    const doctors = ref([])
    const loading = ref(false)
    const error = ref(null)
    const searchQuery = ref('')
    const showDeleteModal = ref(false)
    const doctorToDelete = ref(null)

    const fetchDoctors = async () => {
      loading.value = true
      error.value = null
      try {
        const response = await api.get('/doctors')
        doctors.value = response.data
      } catch (err) {
        error.value = err.response?.data?.message || 'Gagal mengambil data dokter'
      } finally {
        loading.value = false
      }
    }

    const filteredDoctors = computed(() => {
      if (!searchQuery.value) return doctors.value
      const query = searchQuery.value.toLowerCase()
      return doctors.value.filter(doc =>
        doc.name.toLowerCase().includes(query) ||
        doc.specialization.toLowerCase().includes(query) ||
        doc.email.toLowerCase().includes(query) ||
        doc.phone.includes(query)
      )
    })

    const confirmDelete = (doctor) => {
      doctorToDelete.value = doctor
      showDeleteModal.value = true
    }

    const cancelDelete = () => {
      doctorToDelete.value = null
      showDeleteModal.value = false
    }

    const deleteDoctor = async () => {
      if (!doctorToDelete.value) return
      try {
        await api.delete(`/doctors/${doctorToDelete.value.id}`)
        doctors.value = doctors.value.filter(doc => doc.id !== doctorToDelete.value.id)
        cancelDelete()
      } catch (err) {
        alert(err.response?.data?.message || 'Gagal menghapus dokter')
      }
    }

    onMounted(() => {
      fetchDoctors()
    })

    return {
      doctors,
      loading,
      error,
      searchQuery,
      filteredDoctors,
      showDeleteModal,
      doctorToDelete,
      confirmDelete,
      cancelDelete,
      deleteDoctor
    }
  }
}
</script>

<style scoped>
.doctor-list {
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

.doctor-table-container {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.doctor-table {
  width: 100%;
  border-collapse: collapse;
}

.doctor-table th,
.doctor-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ecf0f1;
}

.doctor-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

.doctor-table tr:hover {
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
</style>

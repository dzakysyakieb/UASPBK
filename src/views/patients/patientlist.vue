<template>
  <div class="patient-list">
    <div class="page-header">
      <h1>Daftar Pasien</h1>
      <router-link to="/patients/add" class="btn btn-primary">
        <i class="icon">➕</i>
        Tambah Pasien
      </router-link>
    </div>
    
    <div class="filters">
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari pasien..."
          class="search-input"
        />
      </div>
    </div>
    
    <div class="patient-table-container">
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="filteredPatients.length === 0" class="empty">
        Tidak ada data pasien
      </div>
      <table v-else class="patient-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Lengkap</th>
            <th>No HP</th>
            <th>Jenis Kelamin</th>
            <th>Umur</th>
            <th>Keluhan</th>
            <th>Tanggal Mendaftar</th>
            <th>Alamat</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(patient, index) in filteredPatients" :key="patient.id">
            <td>{{ index + 1 }}</td>
            <td>{{ patient.namaLengkap || patient.nama || '-' }}</td>
            <td>{{ patient.noHp }}</td>
            <td>{{ patient.jenisKelamin }}</td>
            <td>{{ patient.umur }}</td>
            <td>{{ patient.keluhan }}</td>
            <td>{{ patient.tanggalMendaftar }}</td>
            <td>{{ patient.alamat }}</td>
            <td class="actions">
              <router-link
                :to="`/patients/${patient.id}/edit`"
                class="btn btn-sm btn-secondary"
              >
                Edit
              </router-link>
              <button
                @click="confirmDelete(patient)"
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
        <p>Apakah Anda yakin ingin menghapus pasien "{{ patientToDelete?.name }}"?</p>
        <div class="modal-actions">
          <button @click="cancelDelete" class="btn btn-secondary">Batal</button>
          <button @click="deletePatient" class="btn btn-danger">Hapus</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { usePatientStore } from '../../stores/patient'

export default {
  name: 'PatientList',
  setup() {
    const patientStore = usePatientStore()
    
    const searchQuery = ref('')
    const showDeleteModal = ref(false)
    const patientToDelete = ref(null)
    
    const loading = computed(() => patientStore.loading)
    const error = computed(() => patientStore.error)
    const patients = computed(() => patientStore.patients)
    
    const filteredPatients = computed(() => {
      if (!searchQuery.value) return patients.value
      
      const query = searchQuery.value.toLowerCase()
      return patients.value.filter(patient =>
        patient.nama?.toLowerCase().includes(query) ||
        patient.alamat?.toLowerCase().includes(query) ||
        patient.noHp?.includes(query)
      )
    })
    
    const formatDate = (dateString) => {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString('id-ID')
    }
    
    const confirmDelete = (patient) => {
      patientToDelete.value = patient
      showDeleteModal.value = true
    }
    
    const cancelDelete = () => {
      patientToDelete.value = null
      showDeleteModal.value = false
    }
    
    const deletePatient = async () => {
      if (!patientToDelete.value) return
      
      const result = await patientStore.deletePatient(patientToDelete.value.id)
      
      if (result.success) {
        // Patient deleted successfully
        cancelDelete()
      } else {
        // Handle error
        alert(result.message || 'Gagal menghapus pasien')
      }
    }
    
    onMounted(() => {
      patientStore.fetchPatients()
    })
    
    return {
      searchQuery,
      showDeleteModal,
      patientToDelete,
      loading,
      error,
      filteredPatients,
      formatDate,
      confirmDelete,
      cancelDelete,
      deletePatient
    }
  }
}
</script>

<style scoped>
.patient-list {
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

.patient-table-container {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  /* Removed overflow-x to disable horizontal scroll */
  overflow-x: visible;
}

.patient-table {
  width: 100%;
  border-collapse: collapse;
}

.patient-table th,
.patient-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ecf0f1;
}

.patient-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

.patient-table tr:hover {
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

.error {
  color: #e74c3c;
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

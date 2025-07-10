<template>
  <div class="patient-form">
    <div class="page-header">
      <h1>{{ isEdit ? 'Edit Pasien' : 'Tambah Pasien' }}</h1>
      <router-link to="/patients" class="btn btn-secondary">
        <i class="icon">←</i>
        Kembali
      </router-link>
    </div>
    
    <div class="form-container">
      <form @submit.prevent="handleSubmit" class="patient-form-content">
        <div class="form-row">
          <div class="form-group">
            <label for="namaLengkap">Nama Lengkap</label>
            <input
              id="namaLengkap"
              v-model="form.namaLengkap"
              type="text"
              required
              placeholder="Masukkan nama lengkap"
              :disabled="loading"
            />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="noHp">No HP</label>
            <input
              id="noHp"
              v-model="form.noHp"
              type="tel"
              required
              placeholder="Masukkan nomor HP"
              :disabled="loading"
            />
          </div>
          
          <div class="form-group">
            <label for="jenisKelamin">Jenis Kelamin</label>
            <select
              id="jenisKelamin"
              v-model="form.jenisKelamin"
              required
              :disabled="loading"
            >
              <option value="">Pilih jenis kelamin</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="umur">Umur</label>
            <input
              id="umur"
              v-model="form.umur"
              type="number"
              min="0"
              required
              placeholder="Masukkan umur"
              :disabled="loading"
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="keluhan">Keluhan</label>
          <textarea
            id="keluhan"
            v-model="form.keluhan"
            rows="4"
            required
            placeholder="Masukkan keluhan"
            :disabled="loading"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="alamat">Alamat</label>
          <textarea
            id="alamat"
            v-model="form.alamat"
            rows="3"
            required
            placeholder="Masukkan alamat lengkap"
            :disabled="loading"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label for="tanggalMendaftar">Tanggal Mendaftar</label>
          <input
            id="tanggalMendaftar"
            v-model="form.tanggalMendaftar"
            type="date"
            required
            :disabled="loading"
          />
        </div>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <div class="form-actions">
          <button
            type="button"
            @click="$router.push('/patients')"
            class="btn btn-secondary"
            :disabled="loading"
          >
            Batal
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="loading"
          >
            {{ loading ? 'Menyimpan...' : (isEdit ? 'Update' : 'Simpan') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePatientStore } from '../../stores/patient'

export default {
  name: 'PatientForm',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const patientStore = usePatientStore()
    
    const form = ref({
      namaLengkap: '',
      jenisKelamin: '',
      noHp: '',
      umur: '',
      keluhan: '',
      tanggalMendaftar: '',
      alamat: ''
    })
    
    const loading = ref(false)
    const error = ref('')
    
    const isEdit = computed(() => !!route.params.id)
    
    const loadPatient = async () => {
      if (!isEdit.value) return
      
      loading.value = true
      try {
        const patient = await patientStore.fetchPatient(route.params.id)
        if (patient) {
          form.value = {
            namaLengkap: patient.namaLengkap || '',
            jenisKelamin: patient.jenisKelamin || '',
            noHp: patient.noHp || '',
            umur: patient.umur || '',
            keluhan: patient.keluhan || '',
            tanggalMendaftar: patient.tanggalMendaftar || '',
            alamat: patient.alamat || ''
          }
        }
      } catch (err) {
        error.value = 'Gagal memuat data pasien'
      } finally {
        loading.value = false
      }
    }
    
    const handleSubmit = async () => {
      loading.value = true
      error.value = ''
      
      try {
        let result
        
        if (isEdit.value) {
          result = await patientStore.updatePatient(route.params.id, form.value)
        } else {
          result = await patientStore.createPatient(form.value)
        }
        
        if (result.success) {
          router.push('/patients')
        } else {
          error.value = result.message || 'Gagal menyimpan data pasien'
        }
      } catch (err) {
        error.value = 'Terjadi kesalahan saat menyimpan data'
      } finally {
        loading.value = false
      }
    }
    
    onMounted(() => {
      loadPatient()
    })
    
    return {
      form,
      loading,
      error,
      isEdit,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.patient-form {
  max-width: 800px;
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

.btn-primary:hover:not(:disabled) {
  background: #2980b9;
}

.btn-secondary {
  background: #95a5a6;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #7f8c8d;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-container {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.patient-form-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 12px;
  border: 2px solid #ecf0f1;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3498db;
}

.form-group input:disabled,
.form-group select:disabled,
.form-group textarea:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 6px;
  text-align: center;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ecf0f1;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>
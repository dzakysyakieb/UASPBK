<template>
  <div class="prescription-form">
    <div class="page-header">
      <h1>Resep Pasien</h1>
      <router-link to="/patients" class="btn btn-secondary">
        <i class="icon">←</i>
        Kembali ke Daftar Pasien
      </router-link>
    </div>

    <div class="form-container">
      <form @submit.prevent="handleSubmit" class="prescription-form-content">
        <div class="form-group">
          <label for="patientId">Nama Pasien *</label>
          <select
            id="patientId"
            v-model="form.patientId"
            required
            :disabled="loading"
          >
            <option value="" disabled>Pilih pasien</option>
            <option v-for="patient in patients" :key="patient.id" :value="patient.id">
              {{ patient.namaLengkap || patient.nama }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="medicineName">Nama Obat *</label>
          <input
            id="medicineName"
            v-model="form.medicineName"
            type="text"
            required
            placeholder="Masukkan nama obat"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="dosage">Dosis *</label>
          <input
            id="dosage"
            v-model="form.dosage"
            type="text"
            required
            placeholder="Masukkan dosis"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="duration">Durasi *</label>
          <input
            id="duration"
            v-model="form.duration"
            type="text"
            required
            placeholder="Masukkan durasi"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="notes">Catatan</label>
          <textarea
            id="notes"
            v-model="form.notes"
            rows="3"
            placeholder="Masukkan catatan tambahan"
            :disabled="loading"
          ></textarea>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="form-actions">
          <button
            type="button"
            @click="goBack"
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
            {{ loading ? 'Menyimpan...' : 'Simpan Resep' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../../services/api'

export default {
  name: 'PrescriptionForm',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const patients = ref([])
    const form = ref({
      patientId: '',
      medicineName: '',
      dosage: '',
      duration: '',
      notes: ''
    })

    const loading = ref(false)
    const error = ref('')

    const fetchPatients = async () => {
      try {
        const res = await api.get('/patients')
        patients.value = res.data
        // Pre-select patient if route param exists
        if (route.params.id) {
          form.value.patientId = route.params.id
        }
      } catch (err) {
        error.value = 'Gagal mengambil data pasien'
      }
    }

    const handleSubmit = async () => {
      loading.value = true
      error.value = ''

      try {
        // Call API to save the prescription
        const res = await api.post('/prescriptions', {
          patientId: form.value.patientId,
          medicineName: form.value.medicineName,
          dosage: form.value.dosage,
          duration: form.value.duration,
          notes: form.value.notes
        })
        alert('Resep berhasil disimpan')
        router.push('/patients')
      } catch (err) {
        error.value = 'Gagal menyimpan resep'
        alert(error.value)
      } finally {
        loading.value = false
      }
    }

    const goBack = () => {
      router.push('/patients')
    }

    onMounted(() => {
      fetchPatients()
    })

    return {
      patients,
      form,
      loading,
      error,
      handleSubmit,
      goBack
    }
  }
}
</script>

<style scoped>
.prescription-form {
  max-width: 600px;
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
  max-width: 800px;
  margin: 0 auto;
}

.prescription-form-content {
  display: flex;
  flex-direction: column;
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
.form-group textarea {
  padding: 12px;
  border: 2px solid #ecf0f1;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3498db;
}

.form-group input:disabled,
.form-group textarea:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
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
  
  .form-actions {
    flex-direction: column;
  }
}
</style>

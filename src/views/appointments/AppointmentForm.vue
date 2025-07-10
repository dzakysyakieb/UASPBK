<template>
  <div class="appointment-form">
    <h1>{{ isEdit ? 'Edit Appointment' : 'Buat Appointment' }}</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="patient">Pasien</label>
        <select v-model="form.patientId" id="patient" required>
          <option value="" disabled>Pilih Pasien</option>
          <option v-for="patient in patients" :key="patient.id" :value="patient.id">
            {{ patient.namaLengkap || patient.nama || '-' }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="doctor">Dokter</label>
        <select v-model="form.doctorId" id="doctor" required>
          <option value="" disabled>Pilih Dokter</option>
          <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">
            {{ doctor.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="date">Tanggal</label>
        <input type="date" v-model="form.date" id="date" required />
      </div>

      <div class="form-group">
        <label for="time">Waktu</label>
        <input type="time" v-model="form.time" id="time" required />
      </div>

      <div class="form-group">
        <label for="status">Status</label>
        <select v-model="form.status" id="status" required>
          <option value="scheduled">Terjadwal</option>
          <option value="completed">Selesai</option>
          <option value="cancelled">Dibatalkan</option>
        </select>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary">{{ isEdit ? 'Update' : 'Simpan' }}</button>
        <router-link to="/appointments" class="btn btn-secondary">Batal</router-link>
      </div>
    </form>

    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../services/api'

export default {
  name: 'AppointmentForm',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const isEdit = computed(() => !!route.params.id)

    const form = ref({
      patientId: '',
      doctorId: '',
      date: '',
      time: '',
      status: 'scheduled'
    })

    const patients = ref([])
    const doctors = ref([])
    const error = ref(null)
    const loading = ref(false)

    const fetchPatients = async () => {
      try {
        const res = await api.get('/patients')
        patients.value = res.data
      } catch {
        // handle error silently
      }
    }

    const fetchDoctors = async () => {
      try {
        const res = await api.get('/doctors')
        doctors.value = res.data
      } catch {
        // handle error silently
      }
    }

    const fetchAppointment = async (id) => {
      loading.value = true
      try {
        const res = await api.get(`/appointments/${id}`)
        form.value = {
          patientId: res.data.patientId,
          doctorId: res.data.doctorId,
          date: res.data.date,
          time: res.data.time,
          status: res.data.status
        }
      } catch (err) {
        error.value = err.response?.data?.message || 'Gagal mengambil data appointment'
      } finally {
        loading.value = false
      }
    }

    const handleSubmit = async () => {
      error.value = null
      try {
        if (isEdit.value) {
          await api.put(`/appointments/${route.params.id}`, form.value)
        } else {
          await api.post('/appointments', form.value)
        }
        router.push('/appointments')
      } catch (err) {
        error.value = err.response?.data?.message || 'Gagal menyimpan data appointment'
      }
    }

    onMounted(() => {
      fetchPatients()
      fetchDoctors()
      if (isEdit.value) {
        fetchAppointment(route.params.id)
      }
    })

    return {
      form,
      patients,
      doctors,
      error,
      isEdit,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.appointment-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}

input,
select {
  width: 100%;
  padding: 10px;
  border: 2px solid #ecf0f1;
  border-radius: 6px;
  font-size: 14px;
}

input:focus,
select:focus {
  outline: none;
  border-color: #3498db;
}

.form-actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: background-color 0.3s ease;
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
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-secondary:hover {
  background: #7f8c8d;
}

.error-message {
  margin-top: 20px;
  color: #e74c3c;
  font-weight: 600;
}
</style>

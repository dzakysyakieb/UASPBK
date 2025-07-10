<template>
  <div class="medical-records">
    <h1>Rekam Medis</h1>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="medicalRecords.length === 0" class="empty">
      Tidak ada data rekam medis
    </div>
    <table v-else class="medical-records-table">
      <thead>
        <tr>
          <th>No</th>
          <th>Pasien</th>
          <th>Dokter</th>
          <th>Tanggal</th>
          <th>Waktu</th>
          <th>Status</th>
          <th>Catatan</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(record, index) in medicalRecords" :key="record.id">
          <td>{{ index + 1 }}</td>
          <td>{{ getPatientName(record.patientId) }}</td>
          <td>{{ getDoctorName(record.doctorId) }}</td>
          <td>{{ formatDate(record.date) }}</td>
          <td>{{ record.time }}</td>
          <td>{{ getStatusLabel(record.status) }}</td>
          <td>{{ record.notes || '-' }}</td>
          <td class="actions">
            <router-link
              :to="`/patients/${record.patientId}/prescription`"
              class="btn btn-sm btn-primary"
            >
              Tambah Resep
            </router-link>
            <button
              @click="markComplete(record)"
              class="btn btn-sm btn-success"
              title="Selesai"
            >
              Selesai
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import api from '../services/api'

export default {
  name: 'MedicalRecords',
  setup() {
    const medicalRecords = ref([])
    const patients = ref([])
    const doctors = ref([])
    const loading = ref(false)
    const error = ref(null)

    const fetchMedicalRecords = async () => {
      loading.value = true
      error.value = null
      try {
        const res = await api.get('/medical_records')
        medicalRecords.value = res.data
        const patientsRes = await api.get('/patients')
        patients.value = patientsRes.data
        const doctorsRes = await api.get('/doctors')
        doctors.value = doctorsRes.data
      } catch (err) {
        error.value = err.response?.data?.message || 'Gagal mengambil data rekam medis'
      } finally {
        loading.value = false
      }
    }

    const getPatientName = (patientId) => {
      const patient = patients.value.find(p => p.id === patientId)
      return patient?.namaLengkap || patient?.nama || 'Unknown'
    }

    const getDoctorName = (doctorId) => {
      const doctor = doctors.value.find(d => d.id === doctorId)
      return doctor?.name || 'Unknown'
    }

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

    const markComplete = async (record) => {
      try {
        // Fetch patient data
        const patientRes = await api.get(`/patients/${record.patientId}`)
        const patient = patientRes.data

        // Fetch prescriptions for patient
        const prescriptionsRes = await api.get(`/prescriptions?patientId=${record.patientId}`)
        const prescriptions = prescriptionsRes.data

        // Combine data for report
        const reportData = {
          patientId: record.patientId,
          doctorId: record.doctorId,
          date: record.date,
          time: record.time,
          status: 'completed',
          notes: record.notes || '',
          keluhan: patient.keluhan || '',
          prescriptions: prescriptions.map(p => ({
            medicineName: p.medicineName,
            dosage: p.dosage,
            duration: p.duration,
            notes: p.notes
          }))
        }

        // Move record to reports
        await api.post('/reports', reportData)
        // Delete from medical records
        await api.delete(`/medical_records/${record.id}`)
        // Refresh list
        await fetchMedicalRecords()
        // Navigate to reports page
        window.location.href = '/reports'
      } catch (err) {
        alert(err.response?.data?.message || 'Gagal menyelesaikan rekam medis')
      }
    }

    onMounted(() => {
      fetchMedicalRecords()
    })

    return {
      medicalRecords,
      loading,
      error,
      getPatientName,
      getDoctorName,
      formatDate,
      getStatusLabel,
      markComplete
    }
  }
}
</script>

<style scoped>
.medical-records {
  max-width: 1200px;
  margin: 0 auto;
}

.medical-records-table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.medical-records-table th,
.medical-records-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ecf0f1;
}

.medical-records-table th {
  background: #3498db;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.medical-records-table tr:hover {
  background: #ecf0f1;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s ease;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover {
  background: #2980b9;
}

.btn-success {
  background: #27ae60;
  color: white;
}

.btn-success:hover {
  background: #1e8449;
}
</style>

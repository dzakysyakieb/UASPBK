  <template>
  <div class="reports">
    <h1>Laporan</h1>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="reports.length === 0" class="empty">
      Tidak ada data laporan
    </div>
    <table v-else class="reports-table">
      <thead>
        <tr>
          <th>No</th>
          <th>Pasien</th>
          <th>Dokter</th>
          <th>Tanggal</th>
          <th>Waktu</th>
          <th>Status</th>
          <th>Keluhan</th>
          <th>Nama Obat</th>
          <th>Dosis</th>
          <th>Durasi</th>
          <th>Catatan</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(report, index) in reports" :key="report.id">
          <td>{{ index + 1 }}</td>
          <td>{{ getPatientName(report.patientId) }}</td>
          <td>{{ getDoctorName(report.doctorId) }}</td>
          <td>{{ formatDate(report.date) }}</td>
          <td>{{ report.time }}</td>
          <td>{{ getStatusLabel(report.status) }}</td>
          <td>{{ report.keluhan || '-' }}</td>
          <td>
            <ul>
              <li v-for="(prescription, i) in report.prescriptions" :key="i">
                {{ prescription.medicineName }}
              </li>
            </ul>
          </td>
          <td>
            <ul>
              <li v-for="(prescription, i) in report.prescriptions" :key="i">
                {{ prescription.dosage }}
              </li>
            </ul>
          </td>
          <td>
            <ul>
              <li v-for="(prescription, i) in report.prescriptions" :key="i">
                {{ prescription.duration }}
              </li>
            </ul>
          </td>
          <td>{{ report.notes || '-' }}</td>
          <td>
            <button @click="confirmDelete(report)" class="btn btn-sm btn-danger" title="Hapus">Hapus</button>
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
  name: 'Reports',
  setup() {
    const reports = ref([])
    const patients = ref([])
    const doctors = ref([])
    const loading = ref(false)
    const error = ref(null)

    const fetchReports = async () => {
      loading.value = true
      error.value = null
      try {
        const res = await api.get('/reports')
        reports.value = res.data
        const patientsRes = await api.get('/patients')
        patients.value = patientsRes.data
        const doctorsRes = await api.get('/doctors')
        doctors.value = doctorsRes.data
      } catch (err) {
        error.value = err.response?.data?.message || 'Gagal mengambil data laporan'
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

    onMounted(() => {
      fetchReports()
    })

    const confirmDelete = (report) => {
      if (confirm(`Apakah Anda yakin ingin menghapus laporan pasien dengan ID ${report.id}?`)) {
        deleteReport(report)
      }
    }

    const deleteReport = async (report) => {
      try {
        await api.delete(`/reports/${report.id}`)
        await fetchReports()
      } catch (err) {
        alert(err.response?.data?.message || 'Gagal menghapus laporan')
      }
    }

    return {
      reports,
      loading,
      error,
      getPatientName,
      getDoctorName,
      formatDate,
      getStatusLabel,
      confirmDelete
    }
  }
}
</script>

<style scoped>
.reports {
  max-width: 1200px;
  margin: 0;
  padding-left: 10px;
}

.reports-table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.reports-table th,
.reports-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ecf0f1;
  vertical-align: top;
}

.reports-table th {
  background: #3498db;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.reports-table tr:hover {
  background: #ecf0f1;
  cursor: pointer;
  transition: background-color 0.3s ease;
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
</style>

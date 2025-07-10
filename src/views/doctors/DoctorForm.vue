<template>
  <div class="doctor-form">
    <h1>{{ isEdit ? 'Edit Dokter' : 'Tambah Dokter' }}</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">Nama</label>
        <input type="text" id="name" v-model="form.name" required />
      </div>

      <div class="form-group">
        <label for="jenisKelamin">Jenis Kelamin *</label>
        <select id="jenisKelamin" v-model="form.jenisKelamin" required>
          <option value="">Pilih jenis kelamin</option>
          <option value="Laki-laki">Laki-laki</option>
          <option value="Perempuan">Perempuan</option>
        </select>
      </div>

      <div class="form-group">
        <label for="specialization">Spesialisasi</label>
        <input type="text" id="specialization" v-model="form.specialization" required />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="form.email" required />
      </div>

      <div class="form-group">
        <label for="phone">Telepon</label>
        <input type="tel" id="phone" v-model="form.phone" required />
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary">{{ isEdit ? 'Update' : 'Simpan' }}</button>
        <router-link to="/doctors" class="btn btn-secondary">Batal</router-link>
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
  name: 'DoctorForm',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const isEdit = computed(() => !!route.params.id)

    const form = ref({
      name: '',
      jenisKelamin: '',
      specialization: '',
      email: '',
      phone: ''
    })

    const error = ref(null)
    const loading = ref(false)

    const fetchDoctor = async (id) => {
      loading.value = true
      try {
        const res = await api.get(`/doctors/${id}`)
        form.value = {
          name: res.data.name,
          specialization: res.data.specialization,
          email: res.data.email,
          phone: res.data.phone
        }
      } catch (err) {
        error.value = err.response?.data?.message || 'Gagal mengambil data dokter'
      } finally {
        loading.value = false
      }
    }

    const handleSubmit = async () => {
      error.value = null
      try {
        if (isEdit.value) {
          await api.put(`/doctors/${route.params.id}`, form.value)
        } else {
          await api.post('/doctors', form.value)
        }
        router.push('/doctors')
      } catch (err) {
        error.value = err.response?.data?.message || 'Gagal menyimpan data dokter'
      }
    }

    onMounted(() => {
      if (isEdit.value) {
        fetchDoctor(route.params.id)
      }
    })

    return {
      form,
      error,
      isEdit,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.doctor-form {
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

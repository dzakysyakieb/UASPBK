import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const usePatientStore = defineStore('patient', () => {
  const patients = ref([])
  const currentPatient = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  const patientCount = computed(() => patients.value.length)
  
  const fetchPatients = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/patients')
      // Map response data to use namaLengkap instead of nama
      patients.value = response.data.map(p => ({
        ...p,
        namaLengkap: p.namaLengkap || p.nama || ''
      }))
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch patients'
    } finally {
      loading.value = false
    }
  }
  
  const fetchPatient = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get(`/patients/${id}`)
      // Map response data to use namaLengkap instead of nama
      currentPatient.value = {
        ...response.data,
        namaLengkap: response.data.nama
      }
      return currentPatient.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch patient'
      return null
    } finally {
      loading.value = false
    }
  }
  
    const createPatient = async (patientData) => {
      loading.value = true
      error.value = null
      
      try {
        // Map form fields to API expected fields
        const payload = {
          nama: patientData.namaLengkap || patientData.nama,
          jenisKelamin: patientData.jenisKelamin,
          noHp: patientData.noHp,
          tanggalLahir: patientData.tanggalLahir,
          keluhan: patientData.keluhan,
          tanggalMendaftar: patientData.tanggalMendaftar,
          alamat: patientData.alamat
        }
        const response = await api.post('/patients', payload)
        patients.value.push({
          ...response.data,
          namaLengkap: response.data.nama
        })
        return { success: true, data: response.data }
      } catch (err) {
        error.value = err.response?.data?.message || 'Failed to create patient'
        return { success: false, message: error.value }
      } finally {
        loading.value = false
      }
    }
  
  const updatePatient = async (id, patientData) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.put(`/patients/${id}`, patientData)
      const index = patients.value.findIndex(p => p.id === id)
      if (index !== -1) {
        patients.value[index] = response.data
      }
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update patient'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }
  
  const deletePatient = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      await api.delete(`/patients/${id}`)
      patients.value = patients.value.filter(p => p.id !== id)
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete patient'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }
  
  return {
    patients,
    currentPatient,
    loading,
    error,
    patientCount,
    fetchPatients,
    fetchPatient,
    createPatient,
    updatePatient,
    deletePatient
  }
})

import { setActivePinia, createPinia } from 'pinia'
import { usePatientStore } from '../patient'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import api from '../../services/api'

vi.mock('../../services/api', () => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn()
}))

describe('Patient Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('fetchPatients sets patients on success', async () => {
    const store = usePatientStore()
    const mockPatients = [{ id: 1, name: 'John Doe' }]
    api.get.mockResolvedValue({ data: mockPatients })

    await store.fetchPatients()

    expect(store.patients).toEqual(mockPatients)
    expect(store.error).toBeNull()
    expect(store.loading).toBe(false)
  })

  it('fetchPatients sets error on failure', async () => {
    const store = usePatientStore()
    api.get.mockRejectedValue({ response: { data: { message: 'Error fetching' } } })

    await store.fetchPatients()

    expect(store.error).toBe('Error fetching')
    expect(store.loading).toBe(false)
  })

  it('createPatient adds a patient on success', async () => {
    const store = usePatientStore()
    const newPatient = { name: 'Jane Doe' }
    const createdPatient = { id: 2, ...newPatient }
    api.post.mockResolvedValue({ data: createdPatient })

    const result = await store.createPatient(newPatient)

    expect(result.success).toBe(true)
    expect(store.patients).toContainEqual(createdPatient)
  })

  it('createPatient returns error on failure', async () => {
    const store = usePatientStore()
    api.post.mockRejectedValue({ response: { data: { message: 'Create failed' } } })

    const result = await store.createPatient({ name: 'Fail' })

    expect(result.success).toBe(false)
    expect(result.message).toBe('Create failed')
  })
})

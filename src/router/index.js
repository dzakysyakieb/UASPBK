import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Import components
import Login from '../views/login.vue'
import Dashboard from '../views/dashboard.vue'
import PatientList from '../views/patients/PatientList.vue'
import PatientForm from '../views/patients/PatientForm.vue'
import DoctorList from '../views/doctors/DoctorList.vue'
import DoctorForm from '../views/doctors/DoctorForm.vue'
import AppointmentList from '../views/appointments/AppointmentList.vue'
import AppointmentForm from '../views/appointments/AppointmentForm.vue'
import MedicalRecords from '../views/MedicalRecords.vue'
import Reports from '../views/Reports.vue'
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/patients',
    name: 'PatientList',
    component: PatientList,
    meta: { requiresAuth: true }
  },
  {
    path: '/patients/add',
    name: 'AddPatient',
    component: PatientForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/patients/:id/edit',
    name: 'EditPatient',
    component: PatientForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/doctors',
    name: 'DoctorList',
    component: DoctorList,
    meta: { requiresAuth: true }
  },
  {
    path: '/doctors/add',
    name: 'AddDoctor',
    component: DoctorForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/doctors/:id/edit',
    name: 'EditDoctor',
    component: DoctorForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/appointments',
    name: 'AppointmentList',
    component: AppointmentList,
    meta: { requiresAuth: true }
  },
  {
    path: '/appointments/add',
    name: 'AddAppointment',
    component: AppointmentForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/appointments/:id/edit',
    name: 'EditAppointment',
    component: AppointmentForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/medical-records',
    name: 'MedicalRecords',
    component: MedicalRecords,
    meta: { requiresAuth: true }
  },
  {
    path: '/patients/:id/prescription',
    name: 'PrescriptionForm',
    component: () => import('../views/patients/PrescriptionForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: Reports,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router

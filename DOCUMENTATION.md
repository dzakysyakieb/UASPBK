# Sistem Klinik - Feature and Menu Analysis & Routing Structure

## 1. Feature and Menu Analysis

The Sistem Klinik application includes the following main features:

- **Authentication**
  - Login and user session management.
- **Patient Management**
  - View list of patients.
  - Add, edit, and delete patient records.
- **Doctor Management**
  - View list of doctors.
  - Add, edit, and delete doctor records.
- **Appointment Management**
  - View list of appointments.
  - Add, edit, and delete appointments.
- **Medical Records**
  - View medical records.
- **Reports**
  - View reports related to clinic operations.

### Menu Structure

- Dashboard
- Manajemen
  - Pasien
  - Dokter
  - Appointment
- Rekam Medis
- Laporan

## 2. Routing Structure

The routing is implemented using Vue Router in history mode with the following routes:

- `/login` - Login page (guest only)
- `/` - Dashboard (requires authentication)
- `/patients` - Patient list (requires authentication)
- `/patients/add` - Add patient form (requires authentication)
- `/patients/:id/edit` - Edit patient form (requires authentication)
- `/doctors` - Doctor list (requires authentication)
- `/doctors/add` - Add doctor form (requires authentication)
- `/doctors/:id/edit` - Edit doctor form (requires authentication)
- `/appointments` - Appointment list (requires authentication)
- `/appointments/add` - Add appointment form (requires authentication)
- `/appointments/:id/edit` - Edit appointment form (requires authentication)
- `/medical-records` - Medical records (requires authentication)
- `/reports` - Reports (requires authentication)

Navigation guards enforce authentication and guest access where appropriate.

## 3. API Consumption

- API calls are made using axios with a base URL pointing to `http://localhost:3001` (json-server).
- Authorization token is included in headers if available.
- API endpoints include `/patients`, `/doctors`, `/appointments`, `/medical_records`, and `/auth/login`.

## 4. State Management with Pinia

- `auth` store manages user authentication state, token, and user info.
- `patients` store manages patient data with actions to fetch, create, update, and delete patients.
- Stores use state, actions, and computed properties for reactive data management.

## 5. Unit Testing

- Vitest and @vue/test-utils are set up for unit testing.
- No existing tests currently present.
- Plan to add unit tests for Pinia stores or Vue components.

---

This documentation summarizes the current state of the Sistem Klinik project in relation to the task requirements.

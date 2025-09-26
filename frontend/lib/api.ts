const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = {
  // Auth endpoints
  login: (data: any) => 
    fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    }),

  register: (data: any) =>
    fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    }),

  logout: () =>
    fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    }),

  // Admin endpoints
  getAdminStats: () =>
    fetch(`${API_BASE_URL}/api/admin/stats`, {
      credentials: 'include',
    }),

  getUsers: () =>
    fetch(`${API_BASE_URL}/api/admin/users`, {
      credentials: 'include',
    }),

  toggleUserStatus: (data: any) =>
    fetch(`${API_BASE_URL}/api/admin/users/toggle-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    }),

  sendActivationEmail: (data: any) =>
    fetch(`${API_BASE_URL}/api/admin/send-activation-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    }),

  exportData: () =>
    fetch(`${API_BASE_URL}/api/admin/export`, {
      credentials: 'include',
    }),

  // Student endpoints
  getStudentProfile: () =>
    fetch(`${API_BASE_URL}/api/student/profile`, {
      credentials: 'include',
    }),

  updateStudentProfile: (data: any) =>
    fetch(`${API_BASE_URL}/api/student/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    }),

  // Teacher endpoints
  getTeacherProfile: () =>
    fetch(`${API_BASE_URL}/api/teacher/profile`, {
      credentials: 'include',
    }),

  getStudents: () =>
    fetch(`${API_BASE_URL}/api/teacher/students`, {
      credentials: 'include',
    }),

  // University endpoints
  getUniversityProfile: () =>
    fetch(`${API_BASE_URL}/api/university/profile`, {
      credentials: 'include',
    }),

  getUniversityOffers: () =>
    fetch(`${API_BASE_URL}/api/university/offers`, {
      credentials: 'include',
    }),

  createOffer: (data: any) =>
    fetch(`${API_BASE_URL}/api/university/offers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    }),

  // Offers endpoints
  getOffers: () =>
    fetch(`${API_BASE_URL}/api/offers`, {
      credentials: 'include',
    }),

  getOffer: (id: string) =>
    fetch(`${API_BASE_URL}/api/offers/${id}`, {
      credentials: 'include',
    }),

  // Applications endpoints
  submitApplication: (data: any) =>
    fetch(`${API_BASE_URL}/api/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    }),

  getApplications: () =>
    fetch(`${API_BASE_URL}/api/applications`, {
      credentials: 'include',
    }),

  // Recommendations endpoints
  createRecommendation: (data: any) =>
    fetch(`${API_BASE_URL}/api/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    }),

  getRecommendations: (studentId: string) =>
    fetch(`${API_BASE_URL}/api/recommendations/${studentId}`, {
      credentials: 'include',
    }),
};
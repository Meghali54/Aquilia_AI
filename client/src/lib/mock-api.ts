// Mock API responses for development
export const mockAPI = {
  auth: {
    login: (credentials: { email: string; password: string; rememberMe?: boolean }) => ({
      token: `mock-jwt-${credentials.email.split('@')[0]}`,
      role: credentials.email.includes('admin') ? 'admin' : 
            credentials.email.includes('policy') ? 'policy_user' :
            credentials.email.includes('guest') ? 'guest' : 'researcher',
      expiresIn: credentials.rememberMe ? 7 * 24 * 3600 : 3600,
      user: {
        id: `user-${credentials.email.split('@')[0]}`,
        email: credentials.email,
        name: credentials.email.includes('admin') ? 'Admin User' :
              credentials.email.includes('policy') ? 'Policy Analyst' :
              credentials.email.includes('guest') ? 'Guest User' : 'Dr. Sarah Chen',
        role: credentials.email.includes('admin') ? 'admin' : 
              credentials.email.includes('policy') ? 'policy_user' :
              credentials.email.includes('guest') ? 'guest' : 'researcher'
      }
    })
  },
  dashboard: {
    summary: () => ({
      datasets: 2847,
      sensors: 1294,
      ednaSamples: 8573,
      aiAnalyses: 12689,
      recentUploads: [
        { 
          id: '1',
          name: 'Pacific Kelp Survey 2024', 
          type: 'Ocean Data', 
          location: 'California Coast', 
          date: new Date(Date.now() - 2 * 60 * 60 * 1000), 
          status: 'processed' 
        },
        { 
          id: '2',
          name: 'Coral Reef eDNA Samples', 
          type: 'eDNA', 
          location: 'Great Barrier Reef', 
          date: new Date(Date.now() - 5 * 60 * 60 * 1000), 
          status: 'processing' 
        },
        { 
          id: '3',
          name: 'Salmon Migration Data', 
          type: 'Fish Data', 
          location: 'Alaska Peninsula', 
          date: new Date(Date.now() - 24 * 60 * 60 * 1000), 
          status: 'processed' 
        }
      ]
    })
  }
};

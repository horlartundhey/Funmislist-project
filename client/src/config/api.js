// API Configuration
// Priority order:
// 1. Manual environment variable override (VITE_API_BASE_URL)
// 2. Automatic environment detection (development vs production)
// 3. Manual override below (for debugging)

const manualOverride = import.meta.env.VITE_API_BASE_URL;
const isDevelopment = import.meta.env.MODE === 'development';

export const API_BASE_URL = manualOverride || (isDevelopment 
  ? 'http://localhost:5000/api'
  : 'https://funmislist-project.vercel.app/api');

// For temporary manual override during development - uncomment line below to force local server
// export const API_BASE_URL = 'http://localhost:5000/api';

console.log('API Configuration:');
console.log('- Environment:', import.meta.env.MODE);
console.log('- Manual Override:', manualOverride || 'None');
console.log('- Final API Base URL:', API_BASE_URL);

// Password validation utility
const validatePassword = (password) => {
  const errors = [];
  const minLength = 8;
  
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Email validation utility
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone number validation utility (Nigerian format)
const validatePhone = (phone) => {
  // Remove all non-digits
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check for Nigerian phone number formats
  // 11 digits starting with 0 (e.g., 08012345678)
  // 10 digits without leading 0 (e.g., 8012345678)
  // 13 digits with country code (e.g., 2348012345678)
  const nigerianFormats = [
    /^0[7-9]\d{9}$/, // 11 digits starting with 0
    /^[7-9]\d{9}$/, // 10 digits
    /^234[7-9]\d{9}$/ // 13 digits with country code
  ];
  
  return nigerianFormats.some(format => format.test(cleanPhone));
};

// Format phone number to standard format
const formatPhone = (phone) => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) {
    // Convert 08012345678 to +2348012345678
    return `+234${cleanPhone.substring(1)}`;
  } else if (cleanPhone.length === 10) {
    // Convert 8012345678 to +2348012345678
    return `+234${cleanPhone}`;
  } else if (cleanPhone.length === 13 && cleanPhone.startsWith('234')) {
    // Add + to 2348012345678
    return `+${cleanPhone}`;
  }
  
  return phone; // Return original if can't format
};

// Name validation utility
const validateName = (name) => {
  return name && name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name.trim());
};

export {
  validatePassword,
  validateEmail,
  validatePhone,
  formatPhone,
  validateName
};

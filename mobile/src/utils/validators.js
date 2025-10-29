// validators.js
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePhone = (phone) => {
  // Validation for Indian phone numbers: optional +91, followed by 10 digits starting with 6-9
  const re = /^(\+91[\s-]?)?[6-9]\d{9}$/;
  return re.test(phone);
};

export const validateName = (name) => {
  // Allows letters, spaces, hyphens, and apostrophes
  return name.trim().length >= 2 && /^[a-zA-Z\s\-']+$/.test(name);
};
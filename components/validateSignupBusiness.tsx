export interface SignupData {
  companyname: string;
  email: string;
  cemail: string;
  tinNumber: string;
  rcNumber: string;
  phone: string;
  password: string;
  confirmPassword: string;
  referral_code?: string;
}

export const validateSignupBusiness = (data: SignupData) => {
  const errors: Record<string, string> = {};

  // companyname
  if (!data.companyname.trim()) errors.companyname = 'Company name is required';

  // Tin Number
  if (!data.tinNumber.trim()) errors.tinNumber = 'Tin number is required';
    
  // RC Number
  if (!data.tinNumber.trim()) errors.lastname = 'RC number is required';

  // email
  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!data.cemail.trim()) {
    errors.cemail = 'Company Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.cemail)) {
    errors.cemail = 'Enter a valid company email address';
  }

  // Phone
  if (!data.phone.trim()) {
    errors.phone = 'Phone number is required';
  } else {
    const cleaned = data.phone.replace(/\D/g, ''); // remove non-digits

    if (!/^\d{10}$/.test(cleaned)) {
      errors.phone = 'Phone number must be exactly 10 digits without the starting 0';
    }
  }

  // Password
  if (!data.password.trim()) {
    errors.password = 'Password is required';
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(data.password)
  ) {
    errors.password =
      'Password must be at least 8 characters and include upper, lower, and a number';
  }

  // Confirm Password
  if (!data.confirmPassword.trim()) {
    errors.confirmPassword = 'Confirm your password';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  // Referral code (optional — no strict validation)
  if (data.referral_code && !/^[A-Za-z0-9]{4,20}$/.test(data.referral_code)) {
    errors.referral_code = 'Referral code must be alphanumeric (4–20 chars)';
  }

  return errors; // ✅ Return only the errors object
};

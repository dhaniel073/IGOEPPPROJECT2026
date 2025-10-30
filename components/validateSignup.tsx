export interface SignupData {
  firstname: string;
  lastname: string;
  email: string;
  gender: string;
  phone: string;
  password: string;
  confirmPassword: string;
  referral_code?: string;
}

export const validateSignup = (data: SignupData) => {
  const errors: Record<string, string> = {};

  // Firstname
  if (!data.firstname.trim()) errors.firstname = 'First name is required';

  // Lastname
  if (!data.lastname.trim()) errors.lastname = 'Last name is required';

  // Email
  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Enter a valid email address';
  }

  // Gender
  if (!data.gender.trim()) errors.gender = 'Gender is required';

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

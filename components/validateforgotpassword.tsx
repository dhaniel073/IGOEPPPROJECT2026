export interface SignupData {
  email: string;
}

export const validateforgotpassword = (data: SignupData) => {
  const errors: Record<string, string> = {};
  // Email
  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Enter a valid email address';
  }
  return errors; // ✅ Return only the errors object
};

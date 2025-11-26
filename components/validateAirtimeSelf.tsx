export interface RequestData {
  platform: string | null;
  amount: string | number;
  phone: string;
}

export const validateAirtimeSelf = (data: RequestData) => {
  const errors: Record<string, string> = {};

  // Validate platform
  if (!data.platform || data.platform.toString().trim() === "") {
    errors.platform = "Mobile network is required";
  }

  // Validate amount
  const amountNum = Number(data.amount);
  if (!amountNum || amountNum < 100) {
    errors.amount = "Amount must be at least ₦100";
  }

  // Validate phone numbers
  if (!data.phone || data.phone.trim().length < 10) {
    errors.phone = "Phone number is required";
  }


  return errors;
};

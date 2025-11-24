export interface RequestData {
  platform: any,
  bouquets: any,
  amount:any,
}

export const validateEducation = (data: RequestData) => {
  const errors: Record<string, string> = {};

  // Address
  if (!data.platform.trim()) errors.platform = 'Education option is required';
  
  // Country
  if (!data.bouquets.trim()) errors.bouquets = 'Bouquets id is required';

  //state
  if(!data.amount || Number(data.amount) < 100 ) errors.amount = 'Amount is required'

  return errors; // ✅ Return only the errors object
};

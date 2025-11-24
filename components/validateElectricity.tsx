export interface RequestData {
  platform: any,
  meternumber: any,
  amount:any,
}

export const validateElectricity = (data: RequestData) => {
  const errors: Record<string, string> = {};

  // Address
  if (!data.platform.trim()) errors.platform = 'Disco is required';
  
  // Country
  if (!data.meternumber.trim()) errors.meternumber = 'Meter number id is required';

  //state
  if(!data.amount || Number(data.amount) < 1000 ) errors.amount = 'Amount is required, and amount is from 1000 and above'

  return errors; // ✅ Return only the errors object
};

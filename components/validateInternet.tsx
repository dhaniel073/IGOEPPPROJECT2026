export interface RequestData {
  platform: any,
  bouquets: any,
  amount:any,
  smartcard:any,

}

export const validateInternet = (data: RequestData) => {
  const errors: Record<string, string> = {};

  // Address
  if (!data.platform.trim()) errors.platform = 'Internet option is required';
  
  // Country
  if (!data.bouquets.trim()) errors.bouquets = 'Bouquets id is required';

  //state
  if(!data.amount || Number(data.amount) < 100 ) errors.amount = 'Amount is required'

  if(!data.smartcard) errors.smartcard = 'Smart Card id/number is required'

  return errors; // ✅ Return only the errors object
};

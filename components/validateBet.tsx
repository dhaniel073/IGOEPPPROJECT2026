export interface RequestData {
  platform: any,
  betid: any,
  amount:any,
}

export const validateBet = (data: RequestData) => {
  const errors: Record<string, string> = {};

  // Address
  if (!data.platform.trim()) errors.platform = 'Betting platform is required';
  
  // Country
  if (!data.betid.trim()) errors.betid = 'Betting id is required';

  //state
  if(!data.amount || Number(data.amount) < 100 ) errors.amount = 'Amount is required'

  return errors; // ✅ Return only the errors object
};

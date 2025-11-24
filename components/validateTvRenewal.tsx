export interface RequestData {
  platform: any,
  smartcard:any,

}

export const validateTvRenewal = (data: RequestData) => {
  const errors: Record<string, string> = {};

  // platform
  if (!data.platform.trim()) errors.platform = 'Internet option is required';

  //smartcard
  if(!data.smartcard) errors.smartcard = 'Smart Card id/number is required'

  return errors; // ✅ Return only the errors object
};

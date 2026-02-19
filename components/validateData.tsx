export interface RequestData {
  platform: any,
  bouquets: any,
  bosquetsamount:any,
  thirdparty:any,
  mode:any,
  phone: any
}

export const validateData = (data: RequestData) => {
  const errors: Record<string, string> = {};

  // Address
  if (!data.platform.trim()) errors.platform = 'Mobile network option is required';
  
  // Country
  if (!data.bouquets.trim()) errors.bouquets = 'Bouquets id is required';

  //state
  if(!data.bosquetsamount || Number(data.bosquetsamount) < 100 ) errors.bosquetsamount = 'Amount is required'

  if(data.mode === "self"){
    if(!data.phone || Number(data.phone) < 10 ) errors.phone = 'Phone number is required'
  }else{
    if(!data.thirdparty || Number(data.thirdparty) < 10 ) errors.thirdparty = 'Thirdparty phone number is required'
  }

  return errors; // ✅ Return only the errors object
};

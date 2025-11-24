export interface RequestData {
  platform: any,
  amount:any,
  phone:any,
  thirdparty: any,
  mode:any

}

export const validateAirtime = (data: RequestData) => {
  const errors: Record<string, string> = {};

  // Address
  if (!data.platform.trim()) errors.platform = 'Mobile network is required';
  
  //state
  if(!data.amount || Number(data.amount) < 100 ) errors.rprice = 'Amount is required'


  if(data.mode === "self"){
    if(!data.phone || Number(data.phone) < 10 ) errors.phone = 'Phone number is required'
  }else{
    if(!data.thirdparty || Number(data.thirdparty) < 10 ) errors.thirdparty = 'Thirdparty phone number is required'
  }

  return errors; // ✅ Return only the errors object
};

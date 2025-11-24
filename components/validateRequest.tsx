export interface RequestData {
  addressfield: any,
  countryName: any,
  stateName:any,
  cityName: any,
  landmark: any,
  helpsize: any,
  description: any,
  helptime: any,
  helpdate: any,
  frequency: any,
  interest: any,
  vehiclerequest: any,
  uploadUrl?: any,
}

export const validateRequest = (data: RequestData) => {
  const errors: Record<string, string> = {};

  // Address
  if (!data.addressfield.trim()) errors.addressfield = 'Address is required';
  
  // Country
  if (!data.countryName.trim()) errors.countryName = 'Country is required';

  //state
  if(!data.stateName.trim()) errors.stateName = 'State is required'

  //lga or city
  if(!data.cityName.trim()) errors.cityName = 'Lga is required'

  //landmark
  if(!data.landmark.trim()) errors.landmark = 'Landmark is required'

  //help size
  if(!data.helpsize.trim()) errors.helpsize = 'Help size is required'

  //description
  if(!data.description.trim()) errors.description = 'Additional info is required '

  //helptime
  if(!data.helptime.trim()) errors.helptime = 'Time of help is required'

  //frequency
  if(!data.frequency.trim()) errors.frequency = 'Frequency is required'

  //lga or city
  if(!data.interest.trim()) errors.interest = 'Request period is required'

  // Referral code (optional — no strict validation)
  if (!data.vehiclerequest) errors.vehiclerequest = 'Vehicle request is required';
  
  if (data.uploadUrl === null) {}


  return errors; // ✅ Return only the errors object
};

export interface RequestData {
  address: "",
  countryName: "",
  stateName: "",
  cityName: "",
  landmark: "",
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
}



export const validateCheckout = (data: RequestData) => {
  const errors: Record<string, string> = {};

  //first name
  if(!data.first_name.trim()) errors.first_name = 'First name is required'

  //last name
  if(!data.last_name.trim()) errors.last_name = 'Last name is required'
  
  //email
  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Enter a valid email address';
  }

  // Address
  if (!data.address.trim()) errors.address = 'Address is required';
  
  // Country
  if (!data.countryName.trim()) errors.countryName = 'Country is required';

  //state
  if(!data.stateName.trim()) errors.stateName = 'State is required'

  //lga or city
  if(!data.cityName.trim()) errors.cityName = 'Lga is required'

  //landmark
  if(!data.landmark.trim()) errors.landmark = 'Landmark is required'

  // phone
  if (!data.phone) errors.phone = 'Phone number is required';

  return errors; // ✅ Return only the errors object
};

export interface RequestData {
  id: any,
  satisfy: any,
  reason: any,
}

export const validateSatisfyRequest = (data: RequestData) => {
  const errors: Record<string, string> = {};

  // Address
  if (!data.id) errors.addressfield = 'Id is required';
  
  // Country
  if (!data.satisfy) errors.countryName = 'Satisfied field is required';

  // ✅ Extra validation for ONE-OFF
  if (data.satisfy !== "Y") {
    if (!data.reason) errors.reason = "Your reason for not being satisfied is required";
  }


  return errors; // ✅ Return only the errors object
};

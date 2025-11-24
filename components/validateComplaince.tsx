export interface RequestData {
  idnum: any,
  idtype: any,
}

export const validateComplaince = (data: RequestData) => {
  const errors: Record<string, string> = {};

  // idtype
  if (!data.idtype.trim()) errors.idtype = 'Identification type is required';
  
  // Address
  if (!data.idnum) errors.idnum = 'Identification number  is required';
  

  return errors; // Return only the errors object
};

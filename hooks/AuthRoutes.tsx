import axios from "axios";

export const YOUR_API_BASE_URL = `https://phixotech.com/igoeppms/public/api/`;
export const PUBLIC_API_BASE_URL = `https://phixotech.com/igoeppms/public/`;

async function authenticateLogin(email: any, password: any) {
  const loginUrl = `${YOUR_API_BASE_URL}igoeppauth/logincustomer`

  const response = await axios.post(loginUrl, {
    'username': email,
    'password': password,
    'application': "mobileapp"
  })
  const data = response.data
  return data;
}

async function authenticateSignUp(email: any, password: any, gender: any, phone: any, firstname: any, lastname: any, referral_code: any) {

  let base = 'customer/store'
  const loginUrl = `${YOUR_API_BASE_URL}` + base

  const response = await axios.post(loginUrl, {
    'first_name': firstname,
    'last_name': lastname,
    'email': email,
    'sex': gender,
    'phone': phone,
    'password': password,
    "referal_code": referral_code,
    'application': "mobileapp"
  })
  const data = response.data;
  return data;
}

async function authenticateSignUpBusniessEntity(email: any, password: any, gender: any, phone: any, firstname: any, lastname: any, referral_code: any, businessid: any) {

  let base = 'customer/storebusinessentity'
  const loginUrl = `${YOUR_API_BASE_URL}` + base

  const response = await axios.post(loginUrl, {
    'first_name': firstname,
    'last_name': lastname,
    'email': email,
    'sex': gender,
    'phone': phone,
    'password': password,
    "referal_code": referral_code,
    "business_id": businessid,
    'application': "mobileapp"
  })
  const data = response.data;
  return data;
}

async function authenticateSignUpBusiness(email: any, cemail: any, password: any, tin_number: any, rc_number: any, company_name: any, phone: any, referral_code: any) {

  let base = 'customer/storebusiness'
  const loginUrl = `${YOUR_API_BASE_URL}` + base

  const response = await axios.post(loginUrl, {
    'company_name': company_name,
    'email': email,
    "company_email": cemail,
    'tin_number': tin_number,
    'rc_number': rc_number,
    'phone': phone,
    'password': password,
    "referal_code": referral_code,
    'application': "mobileapp"
  })
  const data = response.data;
  return data;
}

async function category() {
  const response = await axios.get(`${YOUR_API_BASE_URL}category`,)
  const data = response.data.data
  return data;
}

async function globalproductcategory(token: any) {
  const response = await axios.get(`${YOUR_API_BASE_URL}auth/globalproductcategory`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data.data
  return data;
}

async function categoriesbylga(lga: any, token: any) {
  const response = await axios.get(`${YOUR_API_BASE_URL}auth/categoriesbylga/${lga}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  }
  )
  const data = response.data
  return data;
}

async function marketplaceitemsget(token: any) {
  const response = await axios.get(`${YOUR_API_BASE_URL}auth/globalproductcategory`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data.data
  return data;
}

async function termsandconditons() {
  const url = `${YOUR_API_BASE_URL}termsandconditons`
  const response = await axios.get(url, {
    headers: {
      Accept: 'application/json',
    }
  })
  const data = response.data
  return data
}

async function getpaystackkey(token: any) {
  const url = `${YOUR_API_BASE_URL}auth/general/getPaystackKey`
  const response = await axios.get(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  const data = response.data
  return data
}

async function walletupdate(id: any, token: any, amount: any) {
  const response = await axios.post(
    `${YOUR_API_BASE_URL}auth/customer/walletupdate`,
    {
      'wallet_balance': amount,
      'customer_id': id
    }, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  }
  )
  const data = response.data.wallet_balance
  return data;
}

async function walletbal(customerId: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/customer/${customerId}/wallet`
  const response = await axios.get(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data;
}

async function customerinfocheck(customer_id: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/customer/${customer_id}`
  const response = await axios.get(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data.data
  return data
}

async function profileupdate(customerId: any, country: any, state: any, lga: any, address: any, dob: any, sex: any, phone: any, token: any) {
  const response = await axios.put(
    `${YOUR_API_BASE_URL}auth/customer/${customerId}/update`,
    {
      'dob': dob,
      'phone': phone,
      'sex': sex,
      'Country': country,
      'State': state,
      'lga': lga,
      'address': address,
    }, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  }
  )
  const data = response.data.data
  return data;
}

async function showpendingrequestbycustomerid(customerId: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/hrequest/showpendingrequestbycustomerid/${customerId}`
  const response = await axios.get(url,
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
  )
  const data = response.data
  return data;
}

async function fetchrequestbyid(requestid: any, token: any) {
  const response = await axios.get(
    `${YOUR_API_BASE_URL}auth/hrequest/showrequestbyrequestid/${requestid}`,
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
  )
  const data = response.data
  return data;
}

async function cancelrequests(id: any, token: any, reason: any) {
  const response = await axios.post(`${YOUR_API_BASE_URL}auth/hrequest/cancelrequest`,
    {
      'book_id': id,
      'cancel_reason': reason
    },
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
  )
  const data = response.data
  return response.data;
}

async function bidrequests(bid_id: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/hrequest/showbidrequestbyrequestid/${bid_id}`
  const response = await axios.get(url,
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
  )
  const data = response.data
  return data;
}

async function bidacceptdebitcard(Id: any, sessionId: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/hrequest/acceptbiddebitcard`

  const response = await axios.post(url,
    {
      "bidid": Id,
      "payment_type": "DC",
      "session_id": sessionId,
      "application": "mobileapp"
    },
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
  const data = response.data
  return data
}

async function bidacceptcash(Id: any, sessionId: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/hrequest/acceptbidcash`

  const response = await axios.post(url,
    {
      "bidid": Id,
      "payment_type": "C",
      "charge_payment_type": "W",
      "session_id": sessionId,
      "application": "mobileapp"
    },
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
  const data = response.data
  return data
}

async function getsession(email: any, token: any) {
  const sessionurl = `${YOUR_API_BASE_URL}auth/igoeppauth/sessioncheckcustomer`

  const response = await axios.post(sessionurl, {
    'username': email,
    'application': "mobileapp"
  }, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data;
}

async function bidaccepttransfer(Id: any, customerid: any, amount: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/vfd/acceptbidtransfer`

  const response = await axios.post(url,
    {
      "bidid": Id,
      "customer_id": customerid,
      "amount": amount
    },
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
  const data = response
  return data
}

async function getVFDVirtualAccountCustomerInvoiceApp(id: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/getVFDVirtualAccountCustomerInvoiceApp/${id}`
  const response = await axios.get(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data;
}

async function updateinvoice(id: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/updateinvoice/${id}`
  const response = await axios.get(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data;
}

async function bidnegotiate(Id: any, budget: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/hrequest/negotiate/${Id}`
  const response = await axios.put(url,
    {
      "budget": budget,
    },
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
  )
  const data = response.data
  return data
}

async function biddecline(id: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/hrequest/declinebidrequest/${id}`

  const response = await axios.get(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data
}

async function bidaccept(Id: any, sessionId: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/hrequest/acceptbid`

  const response = await axios.post(url, {
    "bidid": Id,
    "payment_type": "W",
    // "payment_mode" : paymentmethod1,
    "charge_payment_type": "W",
    "session_id": sessionId,
    "application": "mobileapp"
  },
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
  const data = response.data
  return data
}

async function bidacceptinvoice(Id: any, sessionId: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/hrequest/acceptbidinvoice`

  const response = await axios.post(url, {
    "bidid": Id,
    "payment_type": "I",
    "session_id": sessionId,
    "application": "mobileapp"
  },
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
  const data = response.data
  return data
}

async function getlatestinvoices(id: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/hrequest/getlatestinvoices/${id}`

  const response = await axios.get(url,
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
  const data = response.data
  return data
}

async function getpendinginvoices(id: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/hrequest/getpendinginvoices/${id}`

  const response = await axios.get(url,
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
  const data = response.data
  return data
}

async function vfdvirtualaccount(amount: any, id: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/getvfdvirtualaccountcustomer`
  const response = await axios.post(url, {
    "amount": amount,
    "customer_id": id
  }, {
    headers: {
      Accept: "application.json",
      Authorization: `Bearer ${token}`
    }
  })

  const data = response
  return data;
}

async function vfdvalidatetransaction(amount: any, transaction_ref: any, customer_id: any, email: any, account_number: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/validatevfdtransaction`
  const response = await axios.post(url, {
    "amount": amount,
    "transaction_ref": transaction_ref,
    "customer_id": customer_id,
    "email": email,
    "account_number": account_number,
    "customer_type": "C"
  }, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data
}

async function virtualaccount(amount: any, id: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/getvirtualaccountcustomer`
  const response = await axios.post(url, {
    "transaction_desc": id,
    "amount": amount,
    "customer_id": id
  }, {
    headers: {
      Accept: "application.json",
      Authorization: `Bearer ${token}`
    }
  })

  const data = response.data
  return data;
}

async function validatetransaction(amount: any, transaction_ref: any, customer_id: any, email: any, account_number: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/validatetransaction`
  const response = await axios.post(url, {
    "amount": amount,
    "transaction_ref": transaction_ref,
    "customer_id": customer_id,
    "email": email,
    "account_number": account_number,
    "customer_type": "A"
  }, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data
}

async function getbanks(token: any) {
  const url = `${YOUR_API_BASE_URL}auth/general/getBanks`
  const response = await axios.get(url,
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
  )

  const data = response.data
  return data
}

async function validatepin(id: any, pin: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/customer/validatepin`
  const response = await axios.post(url, {
    "pin": pin,
    "customer_id": id
  }, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  const data = response
  return data
}

async function setuppin(id: any, pin: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/customer/setuppin`
  const response = await axios.post(url, {
    "pin": pin,
    "customer_id": id,
  }, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  const data = response
  return data
}

async function updatepin(id: any, pin: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/customer/resetpin`
  const response = await axios.post(url, {
    "pin": pin,
    "customer_id": id
  }, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  const data = response
  return data
}

async function biometricsetup(id: any, fingerprinttoken: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/customer/setupbiometric`
  const response = await axios.post(url, {
    "finger_print": fingerprinttoken,
    "customer_id": id
  }, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  const data = response
  return data;
}

async function disablebiometric(id: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/customer/${id}/disablebiometric`
  const response = await axios.get(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  const data = response
  return data;
}

async function loginwithbiometric(fingerprinttoken: any) {
  const url = `${YOUR_API_BASE_URL}igoeppauth/logincustomerbiometric`
  const response = await axios.post(url, {
    "biometric": fingerprinttoken,
  })

  const data = response.data;
  return data
}

async function viewalertsetup(id: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/customer/${id}/custalertsetupview`
  const response = await axios.get(url, {
    headers: {
      Accept: `application/json`,
      Authorization: `Bearer ${token}`
    }
  })

  const data = response
  return data
}

async function enablealert(id: any, event_type: any, alert_type: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/customer/custalertsetups`
  const response = await axios.post(url,
    {
      "customer_id": id,
      "event_type": event_type,
      "alert_type": alert_type
    }, {
    headers: {
      Accept: `application/json`,
      Authorization: `Bearer ${token}`
    }
  })

  const data = response
  return data
}

async function disablealert(id: any, event_type: any, alert_type: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/customer/removecustalertsetups/${id}/${event_type}/${alert_type}`
  const response = await axios.get(url, {
    headers: {
      Accept: `application/json`,
      Authorization: `Bearer ${token}`
    }
  })
  const data = response
  return data
}

async function customerupdateid(customer_id: any, identification_type: any, identification_num: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/customer/updateiddetails`
  const response = await axios.post(url, {
    customer_id: customer_id,
    identification_type: identification_type,
    identification_num: identification_num
  }, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data
}

async function customeruploadAddressproof(picture: any, id: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/compliance/uploadcustomeraddressdoc`
  const response = await axios.post(url, {
    picture: picture,
    customerid: id,
  }, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  const data = response.data
  return data
}

async function customeruploadCAC(picture: any, id: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/compliance/uploadcustomercacdocs`
  const response = await axios.post(url, {
    picture: picture,
    customerid: id,
  }, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  const data = response.data
  return data
}

async function customeruploadIdcard(picture: any, id: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/compliance/uploadcustomeridcard`
  const response = await axios.post(url, {
    picture: picture,
    customerid: id,
  }, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
}

async function resettoken(id: string, token: string) {
  const url = `${YOUR_API_BASE_URL}auth/customer/customerchangepassword/${id}`
  const response = await axios.get(url, {
    headers: {
      Accept: 'appliction/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data
}

async function validatecustomerpasswordchangetoken(id: string, token1: string, token: string) {
  const url = `${YOUR_API_BASE_URL}auth/customer/validatecustomerpasswordchangetoken`
  const response = await axios.post(url, {
    id: id,
    token: token1,
  }, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  const data = response
  return data
}

async function customerresetpassword(email: any, password: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/customer/customerpasswordreset`
  const response = await axios.post(url, {
    "password": password,
    "email": email
  }, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  const data = response
  return data
}

//cart check endpoint
async function cartshow(Id: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/cart/${Id}`
  const response = await axios.get(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data.data
  return data;
}

async function cartitem(categoryId: any, token: any) {
  const response = await axios.get(`${YOUR_API_BASE_URL}auth/productbycatshow/${categoryId}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data;
}


//cart items store endpoint

async function cartitemstore(productId: any, quantity: any, customerId: any, supplierId: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/cart/store`
  const response = await axios.post(url, {

    'product_id': productId,
    'quantity': quantity,
    'customer_id': customerId,
    'supplier_id': supplierId,
    'mode': 'store'

  },
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
  const data = response.data
  return data;
}

async function cartitemupdate(productId: any, quantity: any, customerId: any, supplierId: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/cart/store`
  const response = await axios.post(url, {

    'product_id': productId,
    'quantity': quantity,
    'customer_id': customerId,
    'supplier_id': supplierId,
    'mode': 'decrease'
  },
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
  const data = response.data
  return data;
}

//cart item delete endpoint
async function deletefromcart(id: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/cart/${id}/delete`
  // const url = ''
  const response = await axios.delete(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data;
}

//cart history
async function cartpurchase(customerId: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/purchaseheaderbycustid/${customerId}`
  const response = await axios.get(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data;
}

//cart checkout endpoint
async function cartcheckout(first_name: any, last_name: any, address: any, landmark: any, phone: any, email: any, stateName: any, cityName: any, countryName: any, customerId: any, paymentmethod: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/checkout/store`

  const response = await axios.post(url, {
    'firstname': first_name,
    'lastname': last_name,
    'delivery_address': address,
    'delivery_landmark': landmark,
    'delivery_phone': phone,
    'delivery_email': email,
    'delivery_state': stateName,
    'delivery_lga': cityName,
    'delivery_country': countryName,
    'customer_id': customerId,
    'payment_mode': paymentmethod
  }, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  const data = response.data
  return data;
}

async function cartcheckoutcash(first_name: any, last_name: any, address: any, landmark: any, phone: any, email: any, stateName: any, cityName: any, countryName: any, customerId: any, paymentmethod: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/checkout/storecash`
  const response = await axios.post(url, {
    'firstname': first_name,
    'lastname': last_name,
    "delivery_address": address,
    'delivery_landmark': landmark,
    'delivery_phone': phone,
    'delivery_email': email,
    'delivery_state': stateName,
    'delivery_lga': cityName,
    "payment_mode": paymentmethod,
    'delivery_country': countryName,
    'customer_id': customerId,
    "charge_payment_mode": "W"
  }, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  const data = response.data
  return data;
}

async function showcompletedrequestbycustomerid(customerId: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/hrequest/showcompletedrequestbycustomerid/${customerId}`
  const response = await axios.get(url,
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
  )
  const data = response.data
  return data;
}

async function showrecurringrequestbycustomerid(customerId: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/hrequest/showrecurringrequestbycustomerid/${customerId}`
  const response = await axios.get(url,
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
  )
  const data = response.data
  return data;
}

async function cancelrecurringrequestbyid(id: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/hrequest/cancelrecurringrequestbyid/${id}`
  const response = await axios.get(url,
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
  )
  const data = response.data
  return data;
}

async function notification(Id: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/general/viewpushnotification/${Id}`
  const response = await axios.get(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data.data
  return data

}

async function notificationbyid(Id: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/general/viewpushnotificationbyid/${Id}`
  const response = await axios.get(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data.data
  return data

}

async function getmaterialdetailsbyrequestidmobile(id: string, token: string) {
  const url = `${YOUR_API_BASE_URL}auth/getmaterialdetailsbyrequestidmobile/${id}`
  const response = await axios.get(url, {
    headers: {
      Accept: 'appliction/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data
}

async function gettotalamountnmaterialrequestid(id: string, token: string) {
  const url = `${YOUR_API_BASE_URL}auth/gettotalamountnmaterialrequestid/${id}`
  const response = await axios.get(url, {
    headers: {
      Accept: 'appliction/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data
}

async function getVFDVirtualAccountCustomerMaterial(customerid: string, amount: any, requestid: string, token: string) {
  const url = `${YOUR_API_BASE_URL}auth/getVFDVirtualAccountCustomerMaterial`
  const response = await axios.post(url, {
    customer_id: customerid,
    requestid: requestid,
    amount: amount,
  }, {
    headers: {
      Accept: 'appliction/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data
}

async function materialpaymentbycustomer(customerid: string, requestid: string, payment_type: string, session_id: string, token: string) {
  const url = `${YOUR_API_BASE_URL}auth/materialpaymentbycustomer`
  const response = await axios.post(url, {
    customer_id: customerid,
    requestid: requestid,
    payment_type: payment_type,
    session_id: session_id
  }, {
    headers: {
      Accept: 'appliction/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data
}

async function sessionId(email: any, token: any) {
  const sessionurl = `${YOUR_API_BASE_URL}auth/igoeppauth/sessioncheckcustomer`

  const response = await axios.post(sessionurl, {
    'username': email,
    'application': "mobileapp"
  }, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data;
}

async function helperget(id: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/helperfew/${id}`
  const response = await axios.get(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response
  return data
}

async function csutomerwallet(id: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/customer/wallet/${id}`
  const response = await axios.get(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response
  return data;
}

async function customerwallethistory(id: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/customer/customerwallethistory/${id}`
  const response = await axios.get(url, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  const data = response
  return data
}

async function customerwallethistoryall(id: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/customer/customerwallethistoryall/${id}`
  const response = await axios.get(url, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  const data = response
  return data
}

async function subcategory(categoryId: any) {
  const response = await axios.get(`${YOUR_API_BASE_URL}showsubcategorybycatid/${categoryId}`)
  const data = response.data.data
  return data;
}

async function getsubcathelper(id: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/getsubcat/${id}`
  const response = await axios.get(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  const data = response.data
  return data
}

async function getbillsHistory(id: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/getbillsHistoryCustomer/${id}`
  const response = await axios.get(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  const data = response.data
  return data
}

async function billcategory(token: any) {
  const url = `${YOUR_API_BASE_URL}auth/billpayment/getBillCategory`
  const response = await axios.get(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  const data = response.data
  return data
}


async function getbillsHistoryById(customerid: any, id: any, billerid: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/getbillsHistoryCustomerbyid/${customerid}/${id}/${billerid}`
  const response = await axios.get(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  const data = response.data
  return data
}

async function deleteaccount(id: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/customer/deleteaccount`
  const response = await axios.post(url, {
    "customer_id": id,
  }, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  const data = response.data
  return data
}

async function showhelperrating(id: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/hrequest/showhelperrating/${id}`
  const response = await axios.get(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  const data = response.data
  return data
}


async function requestinfo(customerId: any, interest: any, no_of_helper: any, addressfield: any, countryName: any, stateName: any, cityName: any,
  landmark: any, helpsize: any, vehiclerequest: any, description: any, catId: any, subcatId: any, helptime: any, maindate: any,
  frequency: any, start_date: any, end_date: any, payment_frequency: any, preassessment: any, request_type: any, assigned_helper: any, help_sample: any, go_to_artisan_location: any, token: any) {

  const url = `${YOUR_API_BASE_URL}auth/hrequest/store`
  const response = await axios.post(url,
    {
      'customer_id': customerId,
      'assigned_helper': assigned_helper,
      "request_type": request_type,
      'help_interest': interest,
      'help_location': addressfield,
      'no_of_helper': no_of_helper,
      'preassessment_flg': preassessment,
      'help_country': countryName,
      'help_state': stateName,
      'help_lga': cityName,
      'help_landmark': landmark,
      'help_size': helpsize,
      'vehicle_req': vehiclerequest,
      'help_desc': description,
      'category_id': catId,
      'sub_category_id': subcatId,
      "help_time": helptime,
      'help_date': maindate,
      "help_frequency": frequency,
      "start_date": start_date,
      "end_date": end_date,
      "payment_frequency": payment_frequency,
      "help_sample": help_sample,
      "go_to_artisan_location": go_to_artisan_location
    }, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  const data = response.data
  return data
}

async function customerbillercommission(id: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/billpayment/getMyBillersByBillerID/${id}`
  const response = await axios.get(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data;
}

async function validatebetting(customerid: any, billerID: any, betnijaID: any, imagepath: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/billpayment/validateCustomerBet`
  const response = await axios.post(url, {
    "customerID": customerid,
    "billerID": billerID,
    "type": "C",
    "betnijaID": betnijaID,
    "imagepath": imagepath
  }, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response
  return data
}

// make payment for bet account endpoint
async function betpay(requestID: any, amount: any, token: any, commission: any) {
  const url = `${YOUR_API_BASE_URL}auth/billpayment/betBillPayment`
  const response = await axios.post(url, {
    "requestID": requestID,
    "amount": amount,
    "commission": commission
  }, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response
  return data
}

async function educationpay(customerid: any, billerID: any, bouquetCode: any, imagepath: any, amount: any, token: any, commission: any) {
  const url = `${YOUR_API_BASE_URL}auth/billpayment/purchaseWaecPin`
  const response = await axios.post(url, {
    "customerID": customerid,
    "billerID": billerID,
    "type": "C",
    "bouquetCode": bouquetCode,
    "amount": amount,
    "commission": commission,
    "imagepath": imagepath
  }, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response
  return data
}

async function validatedisco(customerid: any, billerID: any, meterID: any, meter_type: any, imagepath: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/billpayment/validateCustomerDisco`
  const response = await axios.post(url, {
    "customerID": customerid,
    "billerID": billerID,
    "type": "C",
    "meterID": meterID,
    "meter_type": meter_type,
    "imagepath": imagepath
  }, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  const data = response
  return data
}

async function discopayment(requestID: any, amount: any, token: any, commission: any) {
  const url = `${YOUR_API_BASE_URL}auth/billpayment/discoPayment`
  const response = await axios.post(url, {
    "requestID": requestID,
    "amount": amount,
    "commission": commission
  }, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  const data = response.data
  return data
}

async function validateinternets(id: any, billerId: any, smartCardID: any, imagepath: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/billpayment/validateCustomerInternet`
  const response = await axios.post(url, {
    "customerID": id,
    "billerID": billerId,
    "type": "C",
    "smartCardID": smartCardID.toString(),
    "imagepath": imagepath
  }, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response
  return data
}

//pay for internet endpoint
async function internetPayment(requestID: any, amount: any, bouquetCode: any, token: any, commission: any) {
  const url = `${YOUR_API_BASE_URL}auth/billpayment/internetPayment`
  const response = await axios.post(url, {
    "requestID": requestID,
    "amount": amount,
    "bouquetCode": bouquetCode,
    "commission": commission
  }, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response
  return data
}

async function validatetelevision(id: any, billerID: any, smartCardID: any, imagepath: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/billpayment/validateCustomerTv`
  const response = await axios.post(url, {
    "customerID": id,
    "billerID": billerID,
    "type": "C",
    "smartCardID": smartCardID,
    "imagepath": imagepath
  }, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  const data = response
  return data
}

//multichoice payment endpoint

async function tvpay(requestID: any, amount: any, bouquetCode: any, token: any, commission: any) {
  const url = `${YOUR_API_BASE_URL}auth/billpayment/tvPayment`
  const response = await axios.post(url, {
    "requestID": requestID,
    "amount": amount,
    "bouquetCode": bouquetCode,
    "commission": commission
  }, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  const data = response
  return data
}

//multichoice payment for renewal endpoint
async function tvrenewalpay(requestID: any, amount: any, token: any, commission: any) {
  const url = `${YOUR_API_BASE_URL}auth/billpayment/tvPaymentRenewal`
  const response = await axios.post(url, {
    "requestID": requestID,
    "amount": amount,
    "commission": commission
  }, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  const data = response
  return data
}

async function validatecustomerthirdparty(id: any, imagepath: any, phone: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/billpayment/validateCustomerPhoneThirdParty`
  const response = await axios.post(url, {
    "customerID": id,
    "imagepath": imagepath,
    "phoneNumber": phone,
    "type": "C"
  }, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  const data = response.data
  return data
}

async function validatecustomerself(id: any, imagepath: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/billpayment/validateCustomerPhone`
  const response = await axios.post(url, {
    "customerID": id,
    "type": "C",
    "imagepath": imagepath,
  }, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data
}

async function vtupayairtime(requestid: any, billerId: any, amount: any, token: any, commission: any) {
  const url = `${YOUR_API_BASE_URL}auth/billpayment/vtuPaymentAirtime`
  const response = await axios.post(url, {
    "requestID": requestid,
    "billerId": billerId,
    "amount": amount,
    "commission": commission
  }, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  const data = response.data
  return data
}

//buy data endpoint, 
async function vtupaydata(requestid: any, billerId: any, amount: any, bouquetCode: any, token: any, commission: any) {
  const url = `${YOUR_API_BASE_URL}auth/billpayment/vtuPaymentData`
  const response = await axios.post(url, {
    "requestID": requestid,
    "billerId": billerId,
    "amount": amount,
    "bouquetCode": bouquetCode,
    "commission": commission
  }, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data
}

async function uploadprofileimage(uploadUrl: any, id: any, token: any) {
  const response = await axios.post(`${YOUR_API_BASE_URL}auth/customer/uploadpicture`, {
    picture: uploadUrl,
    customerid: id
  }, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response
  return data
}

async function notificationunread(Id: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/general/viewpushnotificationcount/${Id}`
  const response = await axios.get(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data
}

async function updateExpoToken(id: any, expo_push_token: any, token: string) {
  const url = `${YOUR_API_BASE_URL}auth/updateExpoToken`
  const response = await axios.post(url, {
    user_id: id,
    user_type: 'C',
    expo_push_token: expo_push_token,
  }, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  const data = response
  return data
}


async function frequentlyusedartisans(token: string) {
  const url = `${YOUR_API_BASE_URL}auth/hrequest/frequentlyusedartisans`
  const response = await axios.get(url, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  const data = response.data
  return data
}

async function forgotpass(email: any) {
  const url = `${YOUR_API_BASE_URL}customer/forgetpassword`
  const response = await axios.post(url, {
    "email": email
  })
  const data = response.data
  return data
}

async function customersatisfied(bookId: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/hrequest/customersatisfy`
  const response = axios.post(url, {
    "book_id": bookId,
    "customer_statisfy": "Y",
  }, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response
  return data
}


//customer not satified endpoint
async function customernotsatisfied(bookId: any, reason: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/hrequest/customersatisfy`
  const response = axios.post(url, {
    "book_id": bookId,
    "customer_statisfy": "N",
    "customer_notstatisfy_reason": reason
  }, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response
  return data
}

async function disputelog(id: any, description: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/hrequest/dispute`
  const response = await axios.post(url, {
    book_id: id,
    description: description
  }, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data.message
  return data
}

async function customerRequestRating(id: any, rating: any, ratecomment: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/hrequest/customerrating`
  const response = axios.post(url, {
    "book_id": id,
    "rating": rating,
    "rating_comment": ratecomment
  }, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response
  return data
}

async function movecommissiontocustomerwallet(Id: any, amount: any, sessionId: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/hrequest/movecommissiontocustomerwallet`

  const response = await axios.post(url,
    {
      "customer_id": Id,
      "amount": amount,
      "sessionid": sessionId,
    },
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
  const data = response.data
  return data
}

async function sessioncheckcustomer(email: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/igoeppauth/sessioncheckcustomer`

  const response = await axios.post(url,
    {
      "username": email,
      "application": 'mobileapp',
    },
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
  const data = response.data
  return data
}

async function inquirehelperproofbyproofimageRequestID(id: any, token: any) {
  const url = `${YOUR_API_BASE_URL}auth/hrequest/inquirehelperproofbyproofimageRequestID/${id}`

  const response = await axios.get(url,
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
  const data = response.data
  return data
}




export {
  authenticateLogin, authenticateSignUp, authenticateSignUpBusiness, authenticateSignUpBusniessEntity, betpay, bidaccept, bidacceptcash, bidacceptdebitcard, bidacceptinvoice, bidaccepttransfer,
  biddecline, bidnegotiate, bidrequests, billcategory, biometricsetup, cancelrecurringrequestbyid, cancelrequests, cartcheckout, cartcheckoutcash, cartitem, cartitemstore, cartitemupdate, cartpurchase, cartshow, categoriesbylga,
  category, csutomerwallet, customerbillercommission, customerinfocheck, customernotsatisfied, customerRequestRating, customerresetpassword, customersatisfied, customerupdateid, customeruploadAddressproof, customeruploadCAC, customeruploadIdcard,
  customerwallethistory, customerwallethistoryall, deleteaccount, deletefromcart, disablealert, disablebiometric, discopayment, disputelog, educationpay, enablealert, fetchrequestbyid, forgotpass, frequentlyusedartisans,
  getbanks, getbillsHistory, getbillsHistoryById, getlatestinvoices, getmaterialdetailsbyrequestidmobile, getpaystackkey, getpendinginvoices, getsession, getsubcathelper, gettotalamountnmaterialrequestid, getVFDVirtualAccountCustomerInvoiceApp, getVFDVirtualAccountCustomerMaterial, globalproductcategory, helperget, inquirehelperproofbyproofimageRequestID, internetPayment, loginwithbiometric, marketplaceitemsget,
  materialpaymentbycustomer, movecommissiontocustomerwallet, notification, notificationbyid, notificationunread, profileupdate, requestinfo, resettoken, sessioncheckcustomer, sessionId, setuppin, showcompletedrequestbycustomerid, showhelperrating,
  showpendingrequestbycustomerid, showrecurringrequestbycustomerid, subcategory, termsandconditons, tvpay, tvrenewalpay, updateExpoToken, updateinvoice, updatepin, uploadprofileimage, validatebetting, validatecustomerpasswordchangetoken,
  validatecustomerself, validatecustomerthirdparty, validatedisco, validateinternets, validatepin, validatetelevision, validatetransaction, vfdvalidatetransaction, vfdvirtualaccount,
  viewalertsetup, virtualaccount, vtupayairtime, vtupaydata, walletbal, walletupdate
};


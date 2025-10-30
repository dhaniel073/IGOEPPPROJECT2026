import axios from "axios";

async function authenticateLogin(email: any, password: any){
  const loginUrl = 'https://phixotech.com/igoepp/public/api/igoeppauth/logincustomer'
  
  const response = await axios.post(loginUrl, {
    'username': email,
    'password': password,
    'application': "mobileapp"
  })
  const data = response.data
  return data;
}

async function authenticateSignUp(email: any, password: any, gender: any, phone: any, firstname: any, lastname: any,referral_code: any){

  let base = 'customer/store'
  const loginUrl = 'https://phixotech.com/igoepp/public/api/'+ base
  
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

async function category(){
  const response = await axios.get("https://phixotech.com/igoepp/public/api/category",)
  const data = response.data.data
  return data;
}

async function marketplaceitemsget(token: any){
  const response = await axios.get("https://phixotech.com/igoepp/public/api/auth/globalproductcategory", {
    headers:{
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data.data
  return data;
}

async function termsandconditons(){
  const url = `https://phixotech.com/igoepp/public/api/termsandconditons`
  const response = await axios.get(url,{
    headers: {
      Accept: 'application/json',
    }
  }) 
  const data = response.data
  return data
}

async function getpaystackkey(){
  const url = `https://phixotech.com/igoepp/public/api/general/getPaystackKey`
  const response = await axios.get(url,{
  })

  const data = response.data
  return data
}

async function walletupdate(id: any, token: any, amount: any){
  const response = await axios.post(
    `https://phixotech.com/igoepp/public/api/auth/customer/walletupdate`, 
    {
        'wallet_balance': amount,
        'customer_id': id
    },{
      headers:{
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
  )
  const data = response.data.wallet_balance
  return data;
}

async function customerinfocheck(customer_id: any, token: any){
  const url = `https://phixotech.com/igoepp/public/api/auth/customer/${customer_id}`
  const response = await axios.get(url, {
    headers:{
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data.data
  return data
}

async function profileupdate(customerId: any, country: any, state: any, lga: any, address: any, dob: any, sex: any, phone: any,  token: any){
  const response = await axios.put(
      `https://phixotech.com/igoepp/public/api/auth/customer/${customerId}/update`, 
    {
      'dob': dob,
      'phone': phone,
      'sex':sex,
      'Country': country,
      'State': state,
      'lga': lga,
      'address': address,
    },{
      headers:{
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
  )
  const data = response.data.data
  return data;
}

async function showpendingrequestbycustomerid(customerId: any, token: any){
  const url = `https://phixotech.com/igoepp/public/api/auth/hrequest/showpendingrequestbycustomerid/${customerId}`
    const response = await axios.get(url,
      {
        headers:{
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )
  const data = response.data
  return data;
}

async function fetchrequestbyid(requestid: any, token: any){
  const response = await axios.get(
    `https://phixotech.com/igoepp/public/api/auth/hrequest/showrequestbyrequestid/${requestid}`, 
    {
      headers:{
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
  )
  const data = response.data
  return data;
}

async function cancelrequests(id: any, token: any, reason: any){
  const response = await axios.post(`https://phixotech.com/igoepp/public/api/auth/hrequest/cancelrequest`, 
    {
      'book_id': id,
      'cancel_reason': reason
    },
    {
      headers:{
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
  )
  const data = response.data
  return response.data;
}

async function bidrequests(bid_id: any, token: any){
 const url =  `https://phixotech.com/igoepp/public/api/auth/hrequest/showbidrequestbyrequestid/${bid_id}`
  const response = await axios.get(url,
  {
    headers:{
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  }
  )
  const data = response.data
  return data;   
}

async function bidacceptdebitcard(Id: any,sessionId: any, token: any){
  const url = 'https://phixotech.com/igoepp/public/api/auth/hrequest/acceptbiddebitcard'

  const response = await axios.post(url, 
  {
    "bidid": Id,
    "payment_type": "DC",
    "session_id": sessionId,
    "application": "mobileapp"
  },
  {
    headers:{
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data 
}

async function bidacceptcash(Id: any,sessionId: any, token: any){
  const url = 'https://phixotech.com/igoepp/public/api/auth/hrequest/acceptbidcash'

  const response = await axios.post(url, 
  {
    "bidid": Id,
    "payment_type": "C",
    "charge_payment_type": "W",
    "session_id": sessionId,
    "application": "mobileapp"
  },
    {
      headers:{
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
  })
  const data = response.data
  return data 
}

async function getsession(email: any, token: any){
  const sessionurl = 'https://phixotech.com/igoepp/public/api/auth/igoeppauth/sessioncheckcustomer'

  const response = await axios.post(sessionurl, {
    'username': email,
    'application': "mobileapp"
  }, {
    headers:{
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data;
}

async function bidaccepttransfer(Id: any,customerid: any,amount: any,token: any){
  const url = 'https://phixotech.com/igoepp/public/api/auth/vfd/acceptbidtransfer'

  const response = await axios.post(url, 
  {
    "bidid": Id,
    "customer_id": customerid,
    "amount": amount
  },
  {
    headers:{
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response
  return data 
}

async function bidnegotiate(Id: any, budget: any, token: any){
  const url = `https://phixotech.com/igoepp/public/api/auth/hrequest/negotiate/${Id}`
  const response = await axios.put(url,
    {
      "budget": budget,
    },
    {
      headers:{
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
  ) 
  const data = response.data
  return data
}

async function biddecline(id: any, token: any){
  const url = `https://phixotech.com/igoepp/public/api/auth/hrequest/declinebidrequest/${id}`

  const response = await axios.get(url, {
    headers:{
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data
}

async function bidaccept(Id: any,sessionId: any, token: any){
  const url = 'https://phixotech.com/igoepp/public/api/auth/hrequest/acceptbid'

  const response = await axios.post(url, {
    "bidid": Id,
    "payment_type": "W",
    // "payment_mode" : paymentmethod1,
    "charge_payment_type": "W",
    "session_id": sessionId,
    "application": "mobileapp"
  },
  {
    headers:{
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data 
}

async function vfdvirtualaccount(amount:any, id:any, token:any){
  const url = `https://phixotech.com/igoepp/public/api/auth/getvfdvirtualaccountcustomer`
  const response = await axios.post(url, {
    "amount": amount,
    "customer_id": id
  }, {
    headers:{
      Accept: "application.json",
      Authorization: `Bearer ${token}`
    }
  })

  const data = response
  return data;
}

async function vfdvalidatetransaction(amount:any, transaction_ref:any, customer_id:any, email:any, account_number:any, token:any){
  const url = `https://phixotech.com/igoepp/public/api/auth/validatevfdtransaction`
  const response = await axios.post(url, {
    "amount": amount,
    "transaction_ref": transaction_ref,
    "customer_id": customer_id,
    "email": email,
    "account_number": account_number,
    "customer_type":"C"
  }, {
    headers:{
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data
}

async function virtualaccount(amount:any, id:any,token:any){
  const url = `https://phixotech.com/igoepp/public/api/auth/getvirtualaccountcustomer`
  const response = await axios.post(url, {
      "transaction_desc": id,
      "amount": amount,
      "customer_id": id
  }, {
      headers:{
          Accept: "application.json",
          Authorization: `Bearer ${token}`
      }
  })

  const data = response.data
  return data;
}

async function validatetransaction(amount:any, transaction_ref:any, customer_id:any, email:any, account_number:any, token:any){
  const url = `https://phixotech.com/igoepp/public/api/auth/validatetransaction`
  const response = await axios.post(url, {
    "amount": amount,
    "transaction_ref": transaction_ref,
    "customer_id": customer_id,
    "email": email,
    "account_number": account_number,
    "customer_type":"A"
  }, {
    headers:{
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data
}

async function getbanks(token:any){
  const url = `https://phixotech.com/igoepp/public/api/general/getBanks`
  const response = await axios.get(url, 
    {
      headers:{
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
  )
  
  const data = response.data
  return data
}

async function validatepin(id: any, pin: any, token: any){
  const url = `https://phixotech.com/igoepp/public/api/auth/customer/validatepin`
  const response = await axios.post(url, {
    "pin": pin,
    "customer_id": id
  }, {
    headers:{
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }) 
  const data = response
  return data
}

async function setuppin(id: any, pin: any, token: any){
  const url = `https://phixotech.com/igoepp/public/api/auth/customer/setuppin`
  const response = await axios.post(url, {
    "pin": pin,
    "customer_id": id,
  }, {
    headers:{
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }) 
  const data = response
  return data
}

async function updatepin(id: any, pin: any, token: any){
  const url = `https://phixotech.com/igoepp/public/api/auth/customer/resetpin`
  const response = await axios.post(url, {
    "pin": pin,
    "customer_id": id
  }, {
    headers:{
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }) 
  const data = response
  return data
}

async function biometricsetup(id: any, fingerprinttoken: any,  token: any){
  const url = `https://phixotech.com/igoepp/public/api/auth/customer/setupbiometric`
  const response = await axios.post(url, {
    "finger_print": fingerprinttoken,
    "customer_id": id
  }, {
    headers:{
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  const data = response
  return data;
}

async function disablebiometric(id: any, token: any){
  const url = `https://phixotech.com/igoepp/public/api/auth/customer/${id}/disablebiometric`
  const response = await axios.get(url, {
    headers:{
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  const data = response
  return data;
}

async function loginwithbiometric(fingerprinttoken: any){
  const url = `https://phixotech.com/igoepp/public/api/igoeppauth/logincustomerbiometric`
  const response = await axios.post(url, {
    "biometric": fingerprinttoken,
  }) 

  const data = response.data;
  return data
}

async function viewalertsetup(id: any,token: any){
  const url = `https://phixotech.com/igoepp/public/api/auth/customer/${id}/custalertsetupview`
  const response = axios.get(url, {
    headers:{
      Accept: `application/json`,
      Authorization: `Bearer ${token}`
    }
  })

  const data = response
  return data
}

async function enablealert(id: any, event_type: any, alert_type: any, token: any){
  const url = `https://phixotech.com/igoepp/public/api/auth/customer/custalertsetups`
  const response = axios.post(url,
    {
      "customer_id":id,
      "event_type":event_type,
      "alert_type":alert_type
    }, {
      headers:{
        Accept: `application/json`,
        Authorization: `Bearer ${token}`
      }
  })

  const data = response
  return data
}

async function disablealert(id: any, event_type: any, alert_type: any, token: any){
  const url = `https://phixotech.com/igoepp/public/api/auth/customer/removecustalertsetups/${id}/${event_type}/${alert_type}`
  const response = axios.get(url, {
    headers:{
      Accept:`application/json`,
      Authorization: `Bearer ${token}`
    }
  })
  const data = response
  return data
}


async function customeruploadAddressproof(picture: any,id: any,token: any){
  const url = `https://phixotech.com/igoepp/public/api/auth/compliance/uploadcustomeraddressdoc`
  const response = await axios.post(url, {
    picture: picture,
    customerid:id,
  }, {
    headers:{
      Accept:'application/json',
      Authorization:`Bearer ${token}`
    }
  })

  const data = response.data
  return data
}
//guarantors upload ID card image endpoint
async function customeruploadIdcard(picture: any,id: any,token: any){
  const url = `https://phixotech.com/igoepp/public/api/auth/compliance/uploadcustomeridcard`
  const response = await axios.post(url, {
    picture: picture,
    customerid:id,
  }, {
    headers:{
      Accept:'application/json',
      Authorization:`Bearer ${token}`
    }
  })
}

async function resettoken(id:string, token:string){
  const url = `https://phixotech.com/igoepp/public/api/auth/customer/customerchangepassword/${id}`
  const response = await axios.get(url, {
    headers:{
      Accept:'appliction/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data
}

async function validatecustomerpasswordchangetoken(id:string, token1:string, token:string){
  const url = `https://phixotech.com/igoepp/public/api/auth/customer/validatecustomerpasswordchangetoken`
  const response = axios.post(url,{
    id: id,
    token: token1,
  }, {
    headers:{
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }) 
  const data = response
  return data
}

async function customerresetpassword(email: any, password: any, token: any){
  const url = `https://phixotech.com/igoepp/public/api/auth/customer/customerpasswordreset`
  const response = axios.post(url, {
    "password": password,
    "email": email
  }, {
    headers:{
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }) 
  const data = response
  return data
}

//cart check endpoint
async function cartshow(Id: any, token: any){
  const url = `https://phixotech.com/igoepp/public/api/auth/cart/${Id}`
  const response = await axios.get(url, {
    headers:{
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data.data
  return data;
}

async function cartitem(categoryId: any, token: any){
  const response = await axios.get(`https://phixotech.com/igoepp/public/api/auth/productbycatshow/${categoryId}`, {
    headers:{
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data;
}


//cart items store endpoint

async function cartitemstore(productId: any,quantity: any,customerId: any,supplierId: any,token: any){
const url = 'https://phixotech.com/igoepp/public/api/auth/cart/store'
  const response = await  axios.post(url, {

    'product_id':productId,
    'quantity': quantity,
    'customer_id':customerId,
    'supplier_id': supplierId,
    'mode': 'store'

  },
  {
    headers:{
      Accept: 'application/json',
      Authorization : `Bearer ${token}`
    }
  })
  const data = response.data
  return data;
}

async function cartitemupdate(productId: any,quantity: any,customerId: any,supplierId: any,token: any){
const url = 'https://phixotech.com/igoepp/public/api/auth/cart/store'
  const response = await  axios.post(url, {

    'product_id':productId,
    'quantity': quantity,
    'customer_id':customerId,
    'supplier_id': supplierId,
    'mode': 'decrease'
  },
  {
    headers:{
      Accept: 'application/json',
      Authorization : `Bearer ${token}`
    }
  })
  const data = response.data
  return data;
}

//cart item delete endpoint
async function deletefromcart(id: any, token: any){
  const url  = `https://phixotech.com/igoepp/public/api/auth/cart/${id}/delete`
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

//cart checkout endpoint
async function cartcheckout(first_name: any,last_name: any, address: any,landmark: any,phone: any,email: any,stateName: any, cityName: any, countryName: any,  customerId: any,  paymentmethod: any, token: any){
  const url = 'https://phixotech.com/igoepp/public/api/auth/checkout/store'
  
  const response = await axios.post(url, {
    'firstname': first_name,
    'lastname': last_name,
    'delivery_address': address,
    'delivery_landmark': landmark,
    'delivery_phone': phone,
    'delivery_email': email,
    'delivery_state': stateName,
    'delivery_lga':cityName,
    'delivery_country': countryName,
    'customer_id': customerId,
    'payment_mode': paymentmethod
  }, {
    headers:{
      Accept: 'application/json',
      Authorization : `Bearer ${token}`
    }
  })

  const data = response.data
  return data;
}

async function cartcheckoutcash(first_name: any,last_name: any, address: any,landmark: any,phone: any,email: any,stateName: any, cityName: any, countryName: any,  customerId: any,  paymentmethod: any, token: any){
  const url = 'https://phixotech.com/igoepp/public/api/auth/checkout/storecash'
  const response = await axios.post(url, {
    'firstname': first_name,
    'lastname': last_name,
    "delivery_address": address,
    'delivery_landmark': landmark,
    'delivery_phone': phone,
    'delivery_email': email,
    'delivery_state': stateName,
    'delivery_lga':cityName,
    "payment_mode": paymentmethod,
    'delivery_country': countryName,
    'customer_id': customerId,
    "charge_payment_mode": "W"
  }, {
    headers:{
      Accept: 'application/json',
      Authorization : `Bearer ${token}`
    }
  })

  const data = response.data
  return data;
}

async function showcompletedrequestbycustomerid(customerId: any, token: any){
  const url = `https://phixotech.com/igoepp/public/api/auth/hrequest/showcompletedrequestbycustomerid/${customerId}`
  const response = await axios.get(url,
    {
      headers:{
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
  )
  const data = response.data
  return data;
}

async function notification(Id: any, token: any){
  const url = `https://phixotech.com/igoepp/public/api/auth/general/viewpushnotification/${Id}`
  const response = await axios.get(url, {
    headers:{
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data.data
  return data

}

async function notificationbyid(Id: any, token: any){
  const url = `https://phixotech.com/igoepp/public/api/auth/general/viewpushnotificationbyid/${Id}`
  const response = await axios.get(url, {
    headers:{
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data.data
  return data

}

async function getmaterialdetailsbyrequestidmobile(id:string, token:string){
  const url = `https://phixotech.com/igoepp/public/api/auth/getmaterialdetailsbyrequestidmobile/${id}`
  const response = await axios.get(url, {
    headers:{
    Accept:'appliction/json',
    Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data
}

async function gettotalamountnmaterialrequestid(id:string, token:string){
  const url = `https://phixotech.com/igoepp/public/api/auth/gettotalamountnmaterialrequestid/${id}`
  const response = await axios.get(url, {
    headers:{
    Accept:'appliction/json',
    Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data
}

async function getVFDVirtualAccountCustomerMaterial(customerid:string, amount:any, requestid:string, token:string){
  const url = `https://phixotech.com/igoepp/public/api/auth/getVFDVirtualAccountCustomerMaterial`
  const response = await axios.post(url, {
    customer_id: customerid,
    requestid: requestid,
    amount: amount,
  },{
    headers:{
    Accept:'appliction/json',
    Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data
}

async function materialpaymentbycustomer(customerid:string, requestid:string, payment_type:string, session_id: string, token:string){
  const url = `https://phixotech.com/igoepp/public/api/auth/materialpaymentbycustomer`
  const response = await axios.post(url, {
    customer_id: customerid,
    requestid: requestid,
    payment_type: payment_type,
    session_id: session_id
  },{
    headers:{
    Accept:'appliction/json',
    Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data
}

async function sessionId(email: any, token: any){
  const sessionurl = 'https://phixotech.com/igoepp/public/api/auth/igoeppauth/sessioncheckcustomer'

  const response = await axios.post(sessionurl, {
    'username': email,
    'application': "mobileapp"
  }, {
    headers:{
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data;
}

async function helperget(id:any, token:any){
  const url = `https://phixotech.com/igoepp/public/api/auth/helperfew/${id}`
  const response = axios.get(url, {
    headers:{
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data =  response
  return data
}

async function csutomerwallet(id:any, token:any){
  const url = `https://phixotech.com/igoepp/public/api/auth/customer/wallet/${id}`
  const response = axios.get(url, {
    headers:{
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response
  return data;
}

async function customerwallethistory(id:any, token:any){
  const url = `https://phixotech.com/igoepp/public/api/auth/customer/customerwallethistory/${id}`
  const response = axios.get(url,{
    headers:{
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }) 
  const data = response
  return data
}

async function customerwallethistoryall(id:any, token:any){
  const url = `https://phixotech.com/igoepp/public/api/auth/customer/customerwallethistoryall/${id}`
  const response = axios.get(url,{
    headers:{
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }) 
  const data = response
  return data
}

async function subcategory(categoryId:any){
  const response = await axios.get(`https://phixotech.com/igoepp/public/api/showsubcategorybycatid/${categoryId}`)
  const data = response.data.data
  return data;
}

async function getsubcathelper(id: any, token: any){
  const url = `https://phixotech.com/igoepp/public/api/auth/getsubcat/${id}`
  const response = await axios.get(url,{
    headers:{
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  const data = response.data
  return data
}


export {
  authenticateLogin, authenticateSignUp, bidaccept, bidacceptcash, bidacceptdebitcard, bidaccepttransfer, biddecline, bidnegotiate, bidrequests,
  biometricsetup, cancelrequests, cartcheckout, cartcheckoutcash, cartitem, cartitemstore, cartitemupdate, cartshow, category, csutomerwallet,
  customerinfocheck, customerresetpassword, customeruploadAddressproof, customeruploadIdcard, customerwallethistory, customerwallethistoryall,
  deletefromcart, disablealert, disablebiometric, enablealert, fetchrequestbyid, getbanks, getmaterialdetailsbyrequestidmobile, getpaystackkey,
  getsession, getsubcathelper, gettotalamountnmaterialrequestid, getVFDVirtualAccountCustomerMaterial, helperget, loginwithbiometric, marketplaceitemsget,
  materialpaymentbycustomer, notification, notificationbyid, profileupdate, resettoken, sessionId, setuppin, showcompletedrequestbycustomerid,
  showpendingrequestbycustomerid, subcategory, termsandconditons, updatepin, validatecustomerpasswordchangetoken, validatepin, validatetransaction,
  vfdvalidatetransaction, vfdvirtualaccount, viewalertsetup, virtualaccount, walletupdate
};


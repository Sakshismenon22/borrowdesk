const now='2026-11-12T12:00:00+05:30'

// Demo figures below mirror the attached BorrowDesk Trading screen.
export const demoAccount={
 availableCash:2500000,
 blockedCash:0,
 pledgedCash:0,
 pendingDeposits:0,
 cashBalance:2500000,
 positions:[
  {symbol:'INFY',quantity:2000,source:'Owned',marketValue:3265000},
  {symbol:'INFY',quantity:10000,source:'Settled borrowed',marketValue:16325000}
 ]
}
export const demoDashboard={
 loans:{active_loans:2,borrowed_market_value:5056995},
 fees:{unpaid_fees:42850},
 rebates:{rebates_receivable:12600},
 marginCalls:[{id:9101,loanId:7101,security:'RELIANCE',lender:'Apex Capital',requiredAmount:125000,fulfilledAmount:50000,outstandingAmount:75000,dueAt:'2026-11-12T14:00:00',status:'PARTIALLY_FULFILLED'}],
 recalls:[{id:6101,loanId:7101,security:'RELIANCE',quantity:500,dueAt:'2026-11-13',status:'OPEN'}],
 reservations:[{id:5101,locateId:2402,security:'INFY',lender:'Meridian Securities',reservedQuantity:1000,remainingQuantity:1000,status:'ACTIVE',expiresAt:'2026-11-12T16:00:00'}],
 recentActivity:[]
}
export const demoSecurities=[
{id:103,symbol:'INFY',name:'Infosys Limited',isin:'INE009A01021',exchange:'NSE',currency:'INR',price:1632.50,price_at:now,change:13.30,changePercent:.82,volume:2864120,borrowedAvailable:10000,open:1629.80,high:1634.20,low:1628.50},
{id:101,symbol:'RELIANCE',name:'Reliance Industries Limited',isin:'INE002A01018',exchange:'NSE',currency:'INR',price:2895.40,price_at:now,change:12.40,changePercent:.43,volume:1871006,borrowedAvailable:25000},
{id:104,symbol:'HDFCBANK',name:'HDFC Bank Limited',isin:'INE040A01034',exchange:'NSE',currency:'INR',price:1761.20,price_at:now,change:-6.37,changePercent:-.36,volume:3248901,borrowedAvailable:0},
{id:102,symbol:'TCS',name:'Tata Consultancy Services Limited',isin:'INE467B01029',exchange:'NSE',currency:'INR',price:4012.00,price_at:now,change:24.40,changePercent:.61,volume:952344,borrowedAvailable:8000},
{id:105,symbol:'ICICIBANK',name:'ICICI Bank Limited',isin:'INE090A01021',exchange:'NSE',currency:'INR',price:1450.00,price_at:now,change:3.90,changePercent:.27,volume:4109776,borrowedAvailable:20000},
{id:107,symbol:'SBIN',name:'State Bank of India',isin:'INE062A01020',exchange:'NSE',currency:'INR',price:885.00,price_at:now,change:-1.60,changePercent:-.18,volume:2104500,borrowedAvailable:12000},
{id:108,symbol:'LT',name:'Larsen & Toubro Limited',isin:'INE018A01030',exchange:'NSE',currency:'INR',price:3315.00,price_at:now,change:17.80,changePercent:.54,volume:1189000,borrowedAvailable:5000},
{id:106,symbol:'ITC',name:'ITC Limited',isin:'INE154A01025',exchange:'NSE',currency:'INR',price:425.60,price_at:now,change:-.94,changePercent:-.22,volume:1258700,borrowedAvailable:18000}
]
export const demoWatchlist=demoSecurities
const make=(id,security,counterparty,quantity,status,extra={})=>({id,security,counterparty,requestedQuantity:quantity,status,...extra})
export const demoRows={
'Locate requests':[
 make(2401,'RELIANCE','Apex Capital',2500,'PENDING',{agreement:'MSLA-2026-014',expiresAt:'2026-11-12T15:30:00'}),
 make(2402,'INFY','Meridian Securities',1200,'APPROVED',{approvedQuantity:1000,agreement:'MSLA-2026-008',expiresAt:'2026-11-12T16:00:00'}),
 make(2403,'HDFCBANK','Northstar Markets',3000,'REJECTED',{agreement:'MSLA-2026-014'})
],
'Reservations':[{id:5101,locateId:2402,security:'INFY',lender:'Meridian Securities',reservedQuantity:1000,remainingQuantity:1000,status:'ACTIVE',expiresAt:'2026-11-12T16:00:00'}],
'Active loans':[
 {id:7101,security:'RELIANCE',lender:'Apex Capital',quantity:2500,outstandingQuantity:2500,marketValue:3630875,status:'ACTIVE',agreement:'MSLA-2026-014'},
 {id:7102,security:'INFY',lender:'Meridian Securities',quantity:1000,outstandingQuantity:800,marketValue:1426120,status:'ACTIVE',agreement:'MSLA-2026-008'}
],
'Collateral':[
 {id:8101,loanId:7101,assetType:'CASH',cashAmount:1900000,marketValue:1900000,status:'PLEDGED'},
 {id:8102,loanId:7102,assetType:'SECURITY',security:'TCS',quantity:500,marketValue:1945250,status:'PLEDGED'}
],
'Margin calls':[{id:9101,loanId:7101,security:'RELIANCE',lender:'Apex Capital',requiredAmount:125000,fulfilledAmount:50000,outstandingAmount:75000,dueAt:'2026-11-12T14:00:00',status:'PARTIALLY_FULFILLED'}],
'Funding & account':[
 {id:301,transactionId:'TXN-2026-301',date:'2026-11-12',type:'DEPOSIT',reference:'FUND-REQ-109',credit:250000,debit:0,balance:15250000,status:'PENDING'},
 {id:302,transactionId:'TXN-2026-302',date:'2026-11-11',type:'WITHDRAWAL',reference:'WD-204',credit:0,debit:75000,balance:15325000,status:'SETTLED'}
],
'Fees & rebates':[
 {id:4101,loanId:7101,security:'RELIANCE',feeAmount:42850,periodEnd:'2026-11-11',status:'DUE',recordType:'FEE'},
 {id:4102,loanId:7102,security:'INFY',amount:12600,periodEnd:'2026-11-11',status:'ACCRUED',recordType:'REBATE'}
],
'Returns & recalls':[{id:6101,loanId:7101,security:'RELIANCE',quantity:500,dueAt:'2026-11-13',status:'OPEN'}],
'Agreements':[
 {id:1401,number:'MSLA-2026-014',lender:'Apex Capital',effectiveDate:'2026-01-01',expiryDate:'2026-12-31',creditLimit:25000000,feeRate:.035,rebateRate:.012,status:'ACTIVE'},
 {id:1402,number:'MSLA-2026-008',lender:'Meridian Securities',effectiveDate:'2026-04-01',expiryDate:'2027-03-31',creditLimit:18000000,feeRate:.03,rebateRate:.01,status:'ACTIVE'}
],
'Reports & audit':[
 {id:9901,type:'LOCATE_APPROVED',reference:'LOC-2402',createdAt:'2026-11-12T09:10:00',status:'SUCCESS'},
 {id:9902,type:'COLLATERAL_PLEDGED',reference:'COL-8102',createdAt:'2026-11-12T08:40:00',status:'SUCCESS'}
]
}
export function demoResource(page,tab){
 if(page==='Borrowing blotter')return demoRows['Active loans']
 if(page==='Funding & account')return tab==='Withdrawals'?demoRows['Funding & account'].filter(x=>x.type==='WITHDRAWAL'):tab==='Deposits'?demoRows['Funding & account'].filter(x=>x.type==='DEPOSIT'):demoRows['Funding & account']
 if(page==='Fees & rebates')return demoRows['Fees & rebates']
 if(page==='Collateral')return demoRows.Collateral
 if(page==='Reports & audit')return demoRows['Reports & audit']
 if(page==='Returns & recalls')return demoRows['Returns & recalls']
 return demoRows[page]||[]
}

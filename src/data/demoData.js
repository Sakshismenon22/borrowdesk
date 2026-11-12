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
'Reservations':[
 {id:5101,locateId:2402,mslaId:'MSLA-2026-0017',security:'INFY',lender:'Meridian Securities',reservedQuantity:10000,remainingQuantity:10000,status:'CONFIRMED',expiresAt:'2026-11-12T15:30:00'},
 {id:5102,locateId:2404,mslaId:'MSLA-2026-0017',security:'RELIANCE',lender:'Alpha Asset Mgmt',reservedQuantity:25000,remainingQuantity:25000,status:'CONFIRMED',expiresAt:'2026-11-12T16:00:00'},
 {id:5103,locateId:2405,mslaId:'MSLA-2026-0017',security:'ICICIBANK',lender:'Alpha Asset Mgmt',reservedQuantity:10000,remainingQuantity:10000,status:'REQUESTED',expiresAt:'2026-11-12T17:00:00'},
 {id:5104,locateId:2406,mslaId:'MSLA-2026-0008',security:'TCS',lender:'Meridian Securities',reservedQuantity:8000,remainingQuantity:4000,status:'PARTIALLY_USED',expiresAt:'2026-11-12T15:45:00'},
 {id:5105,locateId:2407,mslaId:'MSLA-2026-0014',security:'HDFCBANK',lender:'Northstar Markets',reservedQuantity:30000,remainingQuantity:30000,status:'CONFIRMED',expiresAt:'2026-11-13T11:00:00'},
 {id:5106,locateId:2408,mslaId:'MSLA-2026-0008',security:'SBIN',lender:'Meridian Securities',reservedQuantity:12000,remainingQuantity:12000,status:'EXPIRED',expiresAt:'2026-11-11T15:30:00'}
 ],
'Active loans':[
 {id:7101,security:'RELIANCE',lender:'Apex Capital',quantity:2500,outstandingQuantity:2500,marketValue:3630875,status:'ACTIVE',agreement:'MSLA-2026-014'},
 {id:7102,security:'INFY',lender:'Meridian Securities',quantity:1000,outstandingQuantity:800,marketValue:1426120,status:'ACTIVE',agreement:'MSLA-2026-008'}
],
'Collateral':[
 {id:8201,positionId:'CP-000248',loanId:'LN-000248',security:'INFY',lender:'Apex Capital',assetType:'SECURITY',quantity:10000,haircut:0,marketValue:1837500,recognizedValue:1837500,cashAmount:0,status:'POSTED',createdAt:'2026-11-12T08:45:00+05:30'},
 {id:8202,positionId:'CP-000249',loanId:'LN-000249',security:'TCS',lender:'Meridian Securities',assetType:'SECURITY',quantity:500,haircut:15,marketValue:536000,recognizedValue:455600,cashAmount:0,status:'PLEDGE_PENDING',createdAt:'2026-11-12T09:05:00+05:30'},
 {id:8203,positionId:'CP-000250',loanId:'LN-000250',security:'Cash',lender:'Apex Capital',assetType:'CASH',quantity:0,haircut:0,marketValue:2500000,recognizedValue:2500000,cashAmount:2500000,status:'POSTED',createdAt:'2026-11-12T09:15:00+05:30'},
 {id:8204,positionId:'CP-000251',loanId:'LN-000251',security:'RELIANCE',lender:'Northstar Markets',assetType:'SECURITY',quantity:800,haircut:20,marketValue:2670750,recognizedValue:2136600,cashAmount:0,status:'RELEASE_REQUESTED',createdAt:'2026-11-12T09:30:00+05:30'},
 {id:8205,positionId:'CP-000252',loanId:'LN-000252',security:'Cash',lender:'Meridian Securities',assetType:'CASH',quantity:0,haircut:0,marketValue:750000,recognizedValue:750000,cashAmount:750000,status:'POSTED',createdAt:'2026-11-12T10:10:00+05:30'},
 {id:8206,positionId:'CP-000253',loanId:'LN-000253',security:'SBIN',lender:'Apex Capital',assetType:'SECURITY',quantity:1000,haircut:12,marketValue:540000,recognizedValue:475200,cashAmount:0,status:'POSTED',createdAt:'2026-11-12T10:25:00+05:30'}
],
'Pledge requests':[
 {id:'PR-001982',positionId:'CP-000248',loanId:'LN-000248',security:'Cash',lender:'Apex Capital',assetType:'CASH',cashAmount:1837500,quantity:0,haircut:0,recognizedValue:1837500,status:'REQUESTED',createdAt:'2026-11-12T08:40:00+05:30'},
 {id:'PR-001983',positionId:'CP-000249',loanId:'LN-000249',security:'TCS',lender:'Meridian Securities',assetType:'SECURITY',cashAmount:0,quantity:500,haircut:15,recognizedValue:455600,status:'PLEDGE_PENDING',createdAt:'2026-11-12T09:05:00+05:30'},
 {id:'PR-001984',positionId:'CP-000253',loanId:'LN-000253',security:'SBIN',lender:'Apex Capital',assetType:'SECURITY',cashAmount:0,quantity:1000,haircut:12,recognizedValue:475200,status:'POSTED',createdAt:'2026-11-12T10:25:00+05:30'}
],
'Release requests':[
 {id:'RR-000431',positionId:'CP-000251',loanId:'LN-000251',security:'RELIANCE',lender:'Northstar Markets',assetType:'SECURITY',cashAmount:0,quantity:800,haircut:20,recognizedValue:2136600,status:'RELEASE_REQUESTED',createdAt:'2026-11-12T09:30:00+05:30'},
 {id:'RR-000432',positionId:'CP-000250',loanId:'LN-000250',security:'Cash',lender:'Apex Capital',assetType:'CASH',cashAmount:480000,quantity:0,haircut:0,recognizedValue:480000,status:'PENDING',createdAt:'2026-11-12T10:45:00+05:30'}
],
'Collateral movement history':[
 {id:'MV-009821',positionId:'CP-000248',loanId:'LN-000248',time:'2026-11-12T08:45:00+05:30',event:'Collateral posted',counterparty:'Apex Capital',assetType:'SECURITY',security:'INFY',quantity:10000,amount:0,status:'POSTED'},
 {id:'MV-009822',positionId:'CP-000249',loanId:'LN-000249',time:'2026-11-12T09:05:00+05:30',event:'Pledge requested',counterparty:'Meridian Securities',assetType:'SECURITY',security:'TCS',quantity:500,amount:0,status:'PLEDGE PENDING'},
 {id:'MV-009823',positionId:'CP-000250',loanId:'LN-000250',time:'2026-11-12T09:15:00+05:30',event:'Cash collateral posted',counterparty:'Apex Capital',assetType:'CASH',security:'Cash',quantity:0,amount:2500000,status:'POSTED'},
 {id:'MV-009824',positionId:'CP-000251',loanId:'LN-000251',time:'2026-11-12T09:30:00+05:30',event:'Release requested',counterparty:'Northstar Markets',assetType:'SECURITY',security:'RELIANCE',quantity:800,amount:0,status:'RELEASE REQUESTED'},
 {id:'MV-009825',positionId:'CP-000252',loanId:'LN-000252',time:'2026-11-12T10:10:00+05:30',event:'Cash collateral posted',counterparty:'Meridian Securities',assetType:'CASH',security:'Cash',quantity:0,amount:750000,status:'POSTED'},
 {id:'MV-009826',positionId:'CP-000253',loanId:'LN-000253',time:'2026-11-12T10:25:00+05:30',event:'Security pledge confirmed',counterparty:'Apex Capital',assetType:'SECURITY',security:'SBIN',quantity:1000,amount:0,status:'POSTED'}
],
'Margin calls':[
 {id:'MC-000043',loanId:'LN-000250',security:'HDFCBANK',lender:'Pioneer Securities',requiredAmount:375000,fulfilledAmount:150000,outstandingAmount:225000,dueAt:'2026-11-12T15:30:00+05:30',status:'PARTIALLY_FULFILLED',loanMarketValue:3500000,requiredRatio:110,requiredCollateral:3850000,recognizedCollateral:3475000,initialShortfall:375000,events:[{time:'2026-11-12T09:10:00+05:30',event:'Margin call issued',status:'OPEN'},{time:'2026-11-12T11:20:00+05:30',event:'Cash top-up received',status:'CONFIRMED'}],responses:[{time:'2026-11-12T11:20:00+05:30',assetType:'CASH',amount:150000,status:'CONFIRMED'}]},
 {id:'MC-000044',loanId:'LN-000249',security:'RELIANCE',lender:'Meridian Mutual Fund',requiredAmount:250000,fulfilledAmount:0,outstandingAmount:250000,dueAt:'2026-11-13T11:00:00+05:30',status:'OPEN',loanMarketValue:7200000,requiredRatio:110,requiredCollateral:7920000,recognizedCollateral:7670000,initialShortfall:250000,events:[{time:'2026-11-12T10:00:00+05:30',event:'Margin call issued',status:'OPEN'}],responses:[]},
 {id:'MC-000042',loanId:'LN-000251',security:'ICICIBANK',lender:'Alpha Asset Mgmt',requiredAmount:125000,fulfilledAmount:125000,outstandingAmount:0,dueAt:'2026-11-11T16:00:00+05:30',status:'FULFILLED',loanMarketValue:2641800,requiredRatio:110,requiredCollateral:2905980,recognizedCollateral:2905980,initialShortfall:125000,events:[{time:'2026-11-11T13:10:00+05:30',event:'Margin call issued',status:'OPEN'},{time:'2026-11-11T15:35:00+05:30',event:'Collateral top-up confirmed',status:'FULFILLED'}],responses:[{time:'2026-11-11T15:35:00+05:30',assetType:'CASH',amount:125000,status:'CONFIRMED'}]},
 {id:'MC-000041',loanId:'LN-000252',security:'TCS',lender:'Crest Capital',requiredAmount:210000,fulfilledAmount:210000,outstandingAmount:0,dueAt:'2026-11-10T14:00:00+05:30',status:'FULFILLED',loanMarketValue:3209600,requiredRatio:110,requiredCollateral:3530560,recognizedCollateral:3530560,initialShortfall:210000,events:[{time:'2026-11-10T10:00:00+05:30',event:'Margin call issued',status:'OPEN'},{time:'2026-11-10T13:45:00+05:30',event:'Collateral top-up confirmed',status:'FULFILLED'}],responses:[{time:'2026-11-10T13:45:00+05:30',assetType:'CASH',amount:210000,status:'CONFIRMED'}]},
 {id:'MC-000040',loanId:'LN-000248',security:'INFY',lender:'Alpha Asset Mgmt',requiredAmount:100000,fulfilledAmount:100000,outstandingAmount:0,dueAt:'2026-11-09T14:30:00+05:30',status:'FULFILLED',loanMarketValue:1632500,requiredRatio:110,requiredCollateral:1795750,recognizedCollateral:1795750,initialShortfall:100000,events:[{time:'2026-11-09T09:30:00+05:30',event:'Margin call issued',status:'OPEN'},{time:'2026-11-09T14:00:00+05:30',event:'Collateral top-up confirmed',status:'FULFILLED'}],responses:[{time:'2026-11-09T14:00:00+05:30',assetType:'CASH',amount:100000,status:'CONFIRMED'}]}
],
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
 if(page==='Collateral')return tab==='Pledge requests'?demoRows['Pledge requests']:tab==='Release requests'?demoRows['Release requests']:tab==='Movement history'?demoRows['Collateral movement history']:demoRows.Collateral
 if(page==='Reports & audit')return demoRows['Reports & audit']
 if(page==='Returns & recalls')return demoRows['Returns & recalls']
 return demoRows[page]||[]
}

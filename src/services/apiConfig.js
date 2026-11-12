export const API_BASES = {
  borrower: import.meta.env.VITE_BORROWER_API || 'http://localhost:8081',
  lender: import.meta.env.VITE_LENDER_API || 'http://localhost:8084',
  market: import.meta.env.VITE_MARKET_API || 'http://localhost:8080',
  organization: import.meta.env.VITE_ORG_ID || '1'
}

import {api} from './apiClient'
import {API_BASES} from './apiConfig'

// These paths mirror the controller mappings in market-data-service.
export const MARKET_DATA_ENDPOINTS = {
  securityMaster: '/api/v1/security-master/get-all-securities',
  currentPrices: '/api/v1/securities-current-price/get-all-securities-current-prices',
  historicalCandles: '/api/v1/security-data/history'
}

const baseUrl = base => base || API_BASES.market

export const getSecurityMaster = (base) =>
  api(baseUrl(base), MARKET_DATA_ENDPOINTS.securityMaster)

export const getCurrentPrices = (base) =>
  api(baseUrl(base), MARKET_DATA_ENDPOINTS.currentPrices)

export const getHistoricalCandles = (base, symbol, exchange) => {
  const params = new URLSearchParams({symbol, exchange})
  return api(baseUrl(base), MARKET_DATA_ENDPOINTS.historicalCandles + '?' + params.toString())
}

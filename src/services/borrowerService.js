import {api} from './apiClient'
import {API_BASES} from './apiConfig'

// Shared borrower-service request boundary used by workspace pages and workflows.
export const borrowerRequest = (base, path, method='GET', body, extraHeaders={}) =>
  api(base || API_BASES.borrower, path, method, body, extraHeaders)

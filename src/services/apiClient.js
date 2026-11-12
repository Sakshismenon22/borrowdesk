export async function api(base,path,method='GET',body,extraHeaders={}) {
  const response = await fetch(base + path, {
    method,
    headers: {'Content-Type':'application/json', ...extraHeaders},
    ...(body === undefined ? {} : {body: JSON.stringify(body)})
  })
  const text = await response.text()
  let result
  try { result = text ? JSON.parse(text) : null } catch { result = text }
  if (!response.ok) {
    throw Error(result?.detail || result?.message || result?.title || `HTTP ${response.status}`)
  }
  return result
}

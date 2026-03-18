const SESSION_KEY = 'auth_session'
export const SESSION_TTL_MS = 24 * 60 * 60 * 1000

export function saveSession({ name, email, loginAt = Date.now() }) {
  const payload = {
    name,
    email,
    loginAt,
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(payload))
  return payload
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export function isSessionExpired(loginAt, now = Date.now()) {
  if (!loginAt || Number.isNaN(Number(loginAt))) {
    return true
  }

  return now - Number(loginAt) >= SESSION_TTL_MS
}

export function loadSessionIfValid(now = Date.now()) {
  const raw = localStorage.getItem(SESSION_KEY)

  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw)
    const hasRequiredFields = parsed?.name && parsed?.email && parsed?.loginAt

    if (!hasRequiredFields || isSessionExpired(parsed.loginAt, now)) {
      clearSession()
      return null
    }

    return {
      name: parsed.name,
      email: parsed.email,
      loginAt: Number(parsed.loginAt),
    }
  } catch {
    clearSession()
    return null
  }
}
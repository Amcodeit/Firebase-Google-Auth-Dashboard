import { useCallback, useEffect, useMemo, useState } from 'react'
import { signInWithPopup, signOut } from 'firebase/auth'
import { auth, firebaseConfigError, googleProvider } from '../firebase'
import { AuthContext } from './auth-context'
import {
  clearSession,
  isSessionExpired,
  loadSessionIfValid,
  saveSession,
  SESSION_TTL_MS,
} from '../utils/sessionStorage'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadSessionIfValid())
  const isLoading = false

  const expireSession = useCallback(async () => {
    clearSession()
    setUser(null)

    try {
      if (auth) {
        await signOut(auth)
      }
    } catch {
      // ignore sign-out errors for local session expiry
    }
  }, [])

  useEffect(() => {
    if (!user) {
      return undefined
    }

    const remaining = SESSION_TTL_MS - (Date.now() - user.loginAt)

    if (remaining <= 0) {
      const timeoutId = setTimeout(() => {
        expireSession()
      }, 0)

      return () => clearTimeout(timeoutId)
    }

    const timeoutId = setTimeout(() => {
      expireSession()
    }, remaining)

    return () => clearTimeout(timeoutId)
  }, [user, expireSession])

  const loginWithGoogle = useCallback(async () => {
    if (!auth || !googleProvider) {
      throw new Error(firebaseConfigError || 'Firebase is not configured')
    }

    const result = await signInWithPopup(auth, googleProvider)
    const name = result.user.displayName ?? 'User'
    const email = result.user.email ?? ''
    const session = saveSession({ name, email })
    setUser(session)
    return session
  }, [])

  const logout = useCallback(async () => {
    clearSession()
    setUser(null)
    if (auth) {
      await signOut(auth)
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user && !isSessionExpired(user.loginAt)),
      loginWithGoogle,
      logout,
      firebaseConfigError,
    }),
    [user, isLoading, loginWithGoogle, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

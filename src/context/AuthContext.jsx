import { useCallback, useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, firebaseConfigError, googleProvider } from '../firebase'
import { AuthContext } from './auth-context'
import { clearSession } from '../utils/sessionStorage'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!auth) {
      setIsLoading(false)
      return undefined
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          name: firebaseUser.displayName ?? 'User',
          email: firebaseUser.email ?? '',
          uid: firebaseUser.uid,
          photoURL: firebaseUser.photoURL,
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const loginWithGoogle = useCallback(async () => {
    if (!auth || !googleProvider) {
      throw new Error(firebaseConfigError || 'Firebase is not configured')
    }

    try {
      await signInWithPopup(auth, googleProvider)
    } catch (err) {
      throw err
    }
  }, [])

  const logout = useCallback(async () => {
    clearSession() // keeping this just to clean up any legacy state
    if (auth) {
      try {
        await signOut(auth)
      } catch (err) {
        console.error("Logout error:", err)
      }
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      loginWithGoogle,
      logout,
      firebaseConfigError,
    }),
    [user, isLoading, loginWithGoogle, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

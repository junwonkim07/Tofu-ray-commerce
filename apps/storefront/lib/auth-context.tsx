'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { authAPI } from './api-client'

type AuthUser = {
  userId: string
  email: string
}

type LoginPayload = {
  token: string
  userId: string
  email: string
}

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (payload: LoginPayload) => void
  logout: () => void
  refreshAuth: () => Promise<void>
}

const AUTH_TOKEN_KEY = 'authToken'
const USER_ID_KEY = 'userId'
const USER_EMAIL_KEY = 'userEmail'
const LAST_LOGIN_AT_KEY = 'lastLoginAt'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function clearAuthStorage() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(USER_ID_KEY)
  localStorage.removeItem(USER_EMAIL_KEY)
}

function saveAuthStorage(payload: LoginPayload) {
  localStorage.setItem(AUTH_TOKEN_KEY, payload.token)
  localStorage.setItem(USER_ID_KEY, payload.userId)
  localStorage.setItem(USER_EMAIL_KEY, payload.email)
  localStorage.setItem(LAST_LOGIN_AT_KEY, new Date().toISOString())
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const logout = useCallback(() => {
    if (typeof window === 'undefined') {
      setUser(null)
      return
    }

    clearAuthStorage()
    setUser(null)
  }, [])

  const login = useCallback((payload: LoginPayload) => {
    if (typeof window !== 'undefined') {
      saveAuthStorage(payload)
    }

    setUser({
      userId: payload.userId,
      email: payload.email,
    })
  }, [])

  const refreshAuth = useCallback(async () => {
    if (typeof window === 'undefined') {
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    const userId = localStorage.getItem(USER_ID_KEY)
    const email = localStorage.getItem(USER_EMAIL_KEY)

    if (!token || !userId || !email) {
      setUser(null)
      setIsLoading(false)
      return
    }

    const verifyResult = await authAPI.verify()

    if (verifyResult.error || !verifyResult.data?.valid) {
      clearAuthStorage()
      setUser(null)
      setIsLoading(false)
      return
    }

    setUser({
      userId: verifyResult.data.userId,
      email: verifyResult.data.email,
    })
    setIsLoading(false)
  }, [])

  useEffect(() => {
    void refreshAuth()
  }, [refreshAuth])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
      refreshAuth,
    }),
    [user, isLoading, login, logout, refreshAuth]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}

import { useState, useEffect } from 'react'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('sb-access-token='))
        ?.split('=')[1]

      setIsAuthenticated(!!token)
      setLoading(false)
    }

    checkAuth()
  }, [])

  return { isAuthenticated, loading }
}

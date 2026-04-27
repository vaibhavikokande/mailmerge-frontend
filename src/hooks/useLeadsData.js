import { useState, useEffect, useCallback, useRef } from 'react'

// In production (Vercel), set VITE_API_URL to your Render backend URL.
// In development, falls back to localhost.
const BASE_URL     = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const POLL_INTERVAL = 5_000  // 5 seconds

export function useLeadsData() {
  const [leads,       setLeads]       = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [connected,   setConnected]   = useState(false)
  const [newRowIds,   setNewRowIds]   = useState(new Set())
  const prevCount = useRef(0)

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/leads`)

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `Server returned HTTP ${res.status}`)
      }

      const { leads: data, lastUpdated: ts } = await res.json()

      // Highlight rows that are new since last fetch
      if (prevCount.current > 0 && data.length > prevCount.current) {
        const ids = new Set()
        for (let i = prevCount.current; i < data.length; i++) ids.add(data[i].id)
        setNewRowIds(ids)
        setTimeout(() => setNewRowIds(new Set()), 3_000)
      }
      prevCount.current = data.length

      setLeads(data)
      setConnected(true)
      setError(null)
      setLastUpdated(ts ? new Date(ts) : new Date())
    } catch (err) {
      setError(err.message)
      setConnected(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLeads()
    const timer = setInterval(fetchLeads, POLL_INTERVAL)
    return () => clearInterval(timer)
  }, [fetchLeads])

  return { leads, loading, error, lastUpdated, connected, newRowIds, refetch: fetchLeads }
}
